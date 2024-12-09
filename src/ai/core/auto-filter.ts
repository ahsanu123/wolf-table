import { CellRange } from './cell-range';

type Operator = 'all' | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'be';

class Filter {
  ci: string;
  operator: Operator;
  value: string | string[];

  constructor(ci: string, operator: Operator, value: string | string[]) {
    this.ci = ci;
    this.operator = operator;
    this.value = value;
  }

  set(operator: Operator, value: string | string[]): void {
    this.operator = operator;
    this.value = value;
  }

  includes(v: string): boolean {
    const { operator, value } = this;
    if (operator === 'all') {
      return true;
    }
    if (operator === 'in') {
      return (value as string[]).includes(v);
    }
    return false;
  }

  vlength(): number {
    const { operator, value } = this;
    if (operator === 'in') {
      return (value as string[]).length;
    }
    return 0;
  }

  getData(): { ci: string; operator: Operator; value: string | string[] } {
    const { ci, operator, value } = this;
    return { ci, operator, value };
  }
}

class Sort {
  ci: string;
  order: 'asc' | 'desc';

  constructor(ci: string, order: 'asc' | 'desc') {
    this.ci = ci;
    this.order = order;
  }

  asc(): boolean {
    return this.order === 'asc';
  }

  desc(): boolean {
    return this.order === 'desc';
  }
}

export default class AutoFilter {
  ref: string | null;
  filters: Filter[];
  sort: Sort | null;

  constructor() {
    this.ref = null;
    this.filters = [];
    this.sort = null;
  }

  setData({ ref, filters, sort }: { ref: string; filters: { ci: string; operator: Operator; value: string | string[] }[]; sort?: { ci: string; order: 'asc' | 'desc' } | null }): void {
    if (ref != null) {
      this.ref = ref;
      this.filters = filters.map(it => new Filter(it.ci, it.operator, it.value));
      if (sort) {
        this.sort = new Sort(sort.ci, sort.order);
      }
    }
  }

  getData(): { ref: string | null; filters: { ci: string; operator: Operator; value: string | string[] }[]; sort: Sort | null } {
    if (this.active()) {
      const { ref, filters, sort } = this;
      return { ref, filters: filters.map(it => it.getData()), sort };
    }
    return {} as any;
  }

  addFilter(ci: string, operator: Operator, value: string | string[]): void {
    const filter = this.getFilter(ci);
    if (filter == null) {
      this.filters.push(new Filter(ci, operator, value));
    } else {
      filter.set(operator, value);
    }
  }

  setSort(ci: string, order: 'asc' | 'desc' | null): void {
    this.sort = order ? new Sort(ci, order) : null;
  }

  includes(ri: number, ci: string): boolean {
    if (this.active()) {
      return this.hrange().includes(ri, ci);
    }
    return false;
  }

  getSort(ci: string): Sort | null {
    const { sort } = this;
    if (sort && sort.ci === ci) {
      return sort;
    }
    return null;
  }

  getFilter(ci: string): Filter | null {
    const { filters } = this;
    for (let i = 0; i < filters.length; i += 1) {
      if (filters[i].ci === ci) {
        return filters[i];
      }
    }
    return null;
  }

  filteredRows(getCell: (ri: number, ci: string) => { text: string } | null): { rset: Set<number>; fset: Set<number> } {
    const rset = new Set<number>();
    const fset = new Set<number>();
    if (this.active()) {
      const { sri, eri } = this.range();
      const { filters } = this;
      for (let ri = sri + 1; ri <= eri; ri += 1) {
        for (let i = 0; i < filters.length; i += 1) {
          const filter = filters[i];
          const cell = getCell(ri, filter.ci);
          const ctext = cell ? cell.text : '';
          if (!filter.includes(ctext)) {
            rset.add(ri);
            break;
          } else {
            fset.add(ri);
          }
        }
      }
    }
    return { rset, fset };
  }

  items(ci: string, getCell: (ri: number, ci: string) => { text: string } | null): { [key: string]: number } {
    const m: { [key: string]: number } = {};
    if (this.active()) {
      const { sri, eri } = this.range();
      for (let ri = sri + 1; ri <= eri; ri += 1) {
        const cell = getCell(ri, ci);
        if (cell !== null && !/^\s*$/.test(cell.text)) {
          const key = cell.text;
          const cnt = (m[key] || 0) + 1;
          m[key] = cnt;
        } else {
          m[''] = (m[''] || 0) + 1;
        }
      }
    }
    return m;
  }

  range() {
    return CellRange.valueOf(this.ref ?? '');
  }

  hrange() {
    const r = this.range();
    r.eri = r.sri;
    return r;
  }

  clear(): void {
    this.ref = null;
    this.filters = [];
    this.sort = null;
  }

  active(): boolean {
    return this.ref !== null;
  }
}
