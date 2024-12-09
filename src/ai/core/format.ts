import { tf } from '../locale/locale';

const formatStringRender = (v: string): string => v;

const formatNumberRender = (v: string): string => {
  if (/^(-?\d*.?\d*)$/.test(v)) {
    const v1: string = Number(v).toFixed(2).toString();
    const [first, ...parts]: string[] = v1.split('.');
    return [first.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'), ...parts].join('.');
  }
  return v;
};

interface BaseFormat {
  key: string;
  title: string;
  type: 'string' | 'number' | 'date';
  label: string;
  render: (v: string) => string;
}

const baseFormats: BaseFormat[] = [
  {
    key: 'normal',
    title: tf('format.normal'),
    type: 'string',
    label: '',
    render: formatStringRender,
  },
  {
    key: 'text',
    title: tf('format.text'),
    type: 'string',
    label: '',
    render: formatStringRender,
  },
  {
    key: 'number',
    title: tf('format.number'),
    type: 'number',
    label: '1,000.12',
    render: formatNumberRender,
  },
  {
    key: 'percent',
    title: tf('format.percent'),
    type: 'number',
    label: '10.12%',
    render: (v: string): string => `${v}%`,
  },
  {
    key: 'rmb',
    title: tf('format.rmb'),
    type: 'number',
    label: '￥10.00',
    render: (v: string): string => `￥${formatNumberRender(v)}`,
  },
  {
    key: 'usd',
    title: tf('format.usd'),
    type: 'number',
    label: '$10.00',
    render: (v: string): string => `$${formatNumberRender(v)}`,
  },
  {
    key: 'eur',
    title: tf('format.eur'),
    type: 'number',
    label: '€10.00',
    render: (v: string): string => `€${formatNumberRender(v)}`,
  },
  {
    key: 'date',
    title: tf('format.date'),
    type: 'date',
    label: '26/09/2008',
    render: formatStringRender,
  },
  {
    key: 'time',
    title: tf('format.time'),
    type: 'date',
    label: '15:59:00',
    render: formatStringRender,
  },
  {
    key: 'datetime',
    title: tf('format.datetime'),
    type: 'date',
    label: '26/09/2008 15:59:00',
    render: formatStringRender,
  },
  {
    key: 'duration',
    title: tf('format.duration'),
    type: 'date',
    label: '24:01:00',
    render: formatStringRender,
  },
];

const formatm: { [key: string]: BaseFormat } = {};
baseFormats.forEach((f: BaseFormat) => {
  formatm[f.key] = f;
});

export default {};
export {
  formatm,
  baseFormats,
};
