import { tf } from '../locale/locale';
import { numberCalc } from './helper';

interface Formula {
  key: string;
  title: string;
  render: (ary: any[]) => any;
}

const baseFormulas: Formula[] = [
  {
    key: 'SUM',
    title: tf('formula.sum'),
    render: (ary: number[]) => ary.reduce((a, b) => numberCalc('+', a, b) as number),
  },
  {
    key: 'AVERAGE',
    title: tf('formula.average'),
    render: (ary: number[]) => ary.reduce((a, b) => Number(a) + Number(b), 0) / ary.length,
  },
  {
    key: 'MAX',
    title: tf('formula.max'),
    render: (ary: number[]) => Math.max(...ary.map(v => Number(v))),
  },
  {
    key: 'MIN',
    title: tf('formula.min'),
    render: (ary: number[]) => Math.min(...ary.map(v => Number(v))),
  },
  {
    key: 'IF',
    title: tf('formula._if'),
    render: ([b, t, f]) => ((b as boolean) ? t : f),
  },
  {
    key: 'AND',
    title: tf('formula.and'),
    render: (ary: boolean[]) => ary.every(it => it),
  },
  {
    key: 'OR',
    title: tf('formula.or'),
    render: (ary: boolean[]) => ary.some(it => it),
  },
  {
    key: 'CONCAT',
    title: tf('formula.concat'),
    render: (ary: string[]) => ary.join(''),
  },
];

const formulas: Formula[] = baseFormulas;

const formulam: { [key: string]: Formula } = {};
baseFormulas.forEach((f) => {
  formulam[f.key] = f;
});

export default {};

export {
  formulam,
  formulas,
  baseFormulas,
};
