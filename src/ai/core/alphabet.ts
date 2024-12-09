const alphabets: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

/** index number 2 letters
 * @example stringAt(26) ==> 'AA'
 * @date 2019-10-10
 * @export
 * @param {number} index
 * @returns {string}
 */
export function stringAt(index: number): string {
  let str: string = '';
  let cindex: number = index;
  while (cindex >= alphabets.length) {
    cindex /= alphabets.length;
    cindex -= 1;
    str += alphabets[parseInt(cindex.toString(), 10) % alphabets.length];
  }
  const last: number = index % alphabets.length;
  str += alphabets[last];
  return str;
}

/** translate letter in A1-tag to number
 * @date 2019-10-10
 * @export
 * @param {string} str "AA" in A1-tag "AA1"
 * @returns {number}
 */
export function indexAt(str: string): number {
  let ret: number = 0;
  for (let i: number = 0; i !== str.length; ++i) ret = 26 * ret + str.charCodeAt(i) - 64;
  return ret - 1;
}

// B10 => x,y
/** translate A1-tag to XY-tag
 * @date 2019-10-10
 * @export
 * @param {string} src
 * @returns {[number, number]}
 */
export function expr2xy(src: string): [number, number] {
  let x: string = '';
  let y: string = '';
  for (let i: number = 0; i < src.length; i += 1) {
    if (src.charAt(i) >= '0' && src.charAt(i) <= '9') {
      y += src.charAt(i);
    } else {
      x += src.charAt(i);
    }
  }
  return [indexAt(x), parseInt(y, 10) - 1];
}

/** translate XY-tag to A1-tag
 * @example x,y => B10
 * @date 2019-10-10
 * @export
 * @param {number} x
 * @param {number} y
 * @returns {string}
 */
export function xy2expr(x: number, y: number): string {
  return `${stringAt(x)}${y + 1}`;
}

/** translate A1-tag src by (xn, yn)
 * @date 2019-10-10
 * @export
 * @param {string} src
 * @param {number} xn
 * @param {number} yn
 * @param {(x: number, y: number) => boolean} condition
 * @returns {string}
 */
export function expr2expr(src: string, xn: number, yn: number, condition: (x: number, y: number) => boolean = () => true): string {
  if (xn === 0 && yn === 0) return src;
  const [x, y] = expr2xy(src);
  if (!condition(x, y)) return src;
  return xy2expr(x + xn, y + yn);
}

export default {
  stringAt,
  indexAt,
  expr2xy,
  xy2expr,
  expr2expr,
};
