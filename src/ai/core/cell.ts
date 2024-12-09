import { expr2xy, xy2expr } from './alphabet';
import { numberCalc } from './helper';

const infixExprToSuffixExpr = (src: string): (string | [string, number])[] => {
  const operatorStack: string[] = [];
  const stack: (string | [string, number])[] = [];
  let subStrs: string[] = [];
  let fnArgType: number = 0;
  let fnArgOperator: string = '';
  let fnArgsLen: number = 1;
  let oldc: string = '';

  for (let i: number = 0; i < src.length; i += 1) {
    const c: string = src.charAt(i);
    if (c !== ' ') {
      if (c >= 'a' && c <= 'z') {
        subStrs.push(c.toUpperCase());
      } else if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || c === '.') {
        subStrs.push(c);
      } else if (c === '"') {
        i += 1;
        while (src.charAt(i) !== '"') {
          subStrs.push(src.charAt(i));
          i += 1;
        }
        stack.push(`"${subStrs.join('')}`);
        subStrs = [];
      } else if (c === '-' && /[+\-*/,(]/.test(oldc)) {
        subStrs.push(c);
      } else {
        if (c !== '(' && subStrs.length > 0) {
          stack.push(subStrs.join(''));
        }
        if (c === ')') {
          let c1: string = operatorStack.pop()!;
          if (fnArgType === 2) {
            try {
              const [ex, ey] = expr2xy(stack.pop() as string);
              const [sx, sy] = expr2xy(stack.pop() as string);
              let rangelen: number = 0;
              for (let x: number = sx; x <= ex; x += 1) {
                for (let y: number = sy; y <= ey; y += 1) {
                  stack.push(xy2expr(x, y));
                  rangelen += 1;
                }
              }
              stack.push([c1, rangelen]);
            } catch (e) { }
          } else if (fnArgType === 1 || fnArgType === 3) {
            if (fnArgType === 3) stack.push(fnArgOperator);
            stack.push([c1, fnArgsLen]);
            fnArgsLen = 1;
          } else {
            while (c1 !== '(') {
              stack.push(c1);
              if (operatorStack.length <= 0) break;
              c1 = operatorStack.pop()!;
            }
          }
          fnArgType = 0;
        } else if (c === '=' || c === '>' || c === '<') {
          const nc: string = src.charAt(i + 1);
          fnArgOperator = c;
          if (nc === '=' || nc === '-') {
            fnArgOperator += nc;
            i += 1;
          }
          fnArgType = 3;
        } else if (c === ':') {
          fnArgType = 2;
        } else if (c === ',') {
          if (fnArgType === 3) {
            stack.push(fnArgOperator);
          }
          fnArgType = 1;
          fnArgsLen += 1;
        } else if (c === '(' && subStrs.length > 0) {
          operatorStack.push(subStrs.join(''));
        } else {
          if (operatorStack.length > 0 && (c === '+' || c === '-')) {
            let top: string = operatorStack[operatorStack.length - 1];
            if (top !== '(') stack.push(operatorStack.pop()!);
            if (top === '*' || top === '/') {
              while (operatorStack.length > 0) {
                top = operatorStack[operatorStack.length - 1];
                if (top !== '(') stack.push(operatorStack.pop()!);
                else break;
              }
            }
          } else if (operatorStack.length > 0) {
            const top: string = operatorStack[operatorStack.length - 1];
            if (top === '*' || top === '/') stack.push(operatorStack.pop()!);
          }
          operatorStack.push(c);
        }
        subStrs = [];
      }
      oldc = c;
    }
  }
  if (subStrs.length > 0) {
    stack.push(subStrs.join(''));
  }
  while (operatorStack.length > 0) {
    stack.push(operatorStack.pop()!);
  }
  return stack;
};

const evalSubExpr = (subExpr: string, cellRender: (x: number, y: number) => number): number => {
  const [fl] = subExpr;
  let expr: string = subExpr;
  if (fl === '"') {
    return parseInt(subExpr.substring(1));
  }
  let ret: number = 1;
  if (fl === '-') {
    expr = subExpr.substring(1);
    ret = -1;
  }
  if (expr[0] >= '0' && expr[0] <= '9') {
    return ret * Number(expr);
  }
  const [x, y] = expr2xy(expr);
  return ret * cellRender(x, y);
};

const evalSuffixExpr = (srcStack: (string | [string, number])[], formulaMap: { [key: string]: { render: (params: number[]) => number } }, cellRender: (x: number, y: number) => number, cellList: string[]): number => {
  const stack: number[] = [];

  for (let i: number = 0; i < srcStack.length; i += 1) {
    const expr: string | [string, number] = srcStack[i];
    const fc: string = Array.isArray(expr) ? expr[0] : expr;
    if (expr === '+') {
      const top: number = stack.pop()!;
      stack.push(numberCalc('+', stack.pop()!, top) as number);
    } else if (expr === '-') {
      if (stack.length === 1) {
        const top: number = stack.pop()!;
        stack.push(numberCalc('*', top, -1) as number);
      } else {
        const top: number = stack.pop()!;
        stack.push(numberCalc('-', stack.pop()!, top) as number);
      }
    } else if (expr === '*') {
      stack.push(numberCalc('*', stack.pop()!, stack.pop()!) as number);
    } else if (expr === '/') {
      const top: number = stack.pop()!;
      stack.push(numberCalc('/', stack.pop()!, top) as number);
    } else if (fc === '=' || fc === '>' || fc === '<') {
      let top: number = stack.pop()!;
      if (!Number.isNaN(top)) top = Number(top);
      let left: number = stack.pop()!;
      if (!Number.isNaN(left)) left = Number(left);
      let ret: boolean = false;
      if (fc === '=') {
        ret = (left === top);
      } else if (expr === '>') {
        ret = (left > top);
      } else if (expr === '>=') {
        ret = (left >= top);
      } else if (expr === '<') {
        ret = (left < top);
      } else if (expr === '<=') {
        ret = (left <= top);
      }
      stack.push(ret ? 1 : 0);
    } else if (Array.isArray(expr)) {
      const [formula, len] = expr;
      const params: number[] = [];
      for (let j: number = 0; j < len; j += 1) {
        params.push(stack.pop()!);
      }
      stack.push(formulaMap[formula].render(params.reverse()));
    } else {
      if (cellList.includes(expr)) {
        return 0;
      }
      if ((fc >= 'a' && fc <= 'z') || (fc >= 'A' && fc <= 'Z')) {
        cellList.push(expr);
      }
      stack.push(evalSubExpr(expr, cellRender));
      cellList.pop();
    }
  }
  return stack[0];
};

const cellRender = (
  src: string,
  formulaMap: { [key: string]: { render: (params: number[]) => number } },
  getCellText: (x: number, y: number) => string, cellList: string[] = []
): string | number => {

  if (src[0] === '=') {
    const stack: (string | [string, number])[] = infixExprToSuffixExpr(src.substring(1));
    if (stack.length <= 0) return src;
    return evalSuffixExpr(
      stack,
      formulaMap,
      (x: number, y: number) => cellRender(getCellText(x, y), formulaMap, getCellText, cellList) as number,
      cellList,
    );
  }
  return src;
};

export default {
  render: cellRender,
};
export {
  infixExprToSuffixExpr,
};
