
const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export function indexAt(str: string) {
  let ret = 0;
  for (let i = 0; i !== str.length; ++i) ret = 26 * ret + str.charCodeAt(i) - 64;
  return ret - 1;
}

export function expr2xy(src: string) {
  let x = '';
  let y = '';
  for (let i = 0; i < src.length; i += 1) {
    if (src.charAt(i) >= '0' && src.charAt(i) <= '9') {
      y += src.charAt(i);
    } else {
      x += src.charAt(i);
    }
  }
  return [indexAt(x), parseInt(y, 10) - 1];
}

export function stringAt(index: number) {
  let str = '';
  let cindex = index;
  while (cindex >= alphabets.length) {
    cindex /= alphabets.length;
    cindex -= 1;
    str += alphabets[cindex % alphabets.length];
  }
  const last = index % alphabets.length;
  str += alphabets[last];
  return str;
}

export function xy2expr(x: number, y: number) {
  return `${stringAt(x)}${y + 1}`;
}

export function expr2expr(src: string, xn: number, yn: number, condition = (x: number, y: number) => true) {
  if (xn === 0 && yn === 0) return src;
  const [x, y] = expr2xy(src);
  if (!condition(x, y)) return src;
  return xy2expr(x + xn, y + yn);
}
