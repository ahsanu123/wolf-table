import Validator from './validator';
import { CellRange } from './cell-range';

class Validation {
  refs: string[];
  mode: string;
  validator: Validator;

  constructor(mode: string, refs: string[], validator: Validator) {
    this.refs = refs;
    this.mode = mode; // cell
    this.validator = validator;
  }

  includes(ri: number, ci: number): boolean {
    const { refs } = this;
    for (let i = 0; i < refs.length; i += 1) {
      const cr: CellRange = CellRange.valueOf(refs[i]);
      if (cr.includes(ri, ci)) return true;
    }
    return false;
  }

  addRef(ref: string): void {
    this.remove(CellRange.valueOf(ref));
    this.refs.push(ref);
  }

  remove(cellRange: CellRange): void {
    const nrefs: string[] = [];
    this.refs.forEach((it: string) => {
      const cr: CellRange = CellRange.valueOf(it);
      if (cr.intersects(cellRange)) {
        const crs: CellRange[] = cr.difference(cellRange);
        crs.forEach(it1 => nrefs.push(it1.toString()));
      } else {
        nrefs.push(it);
      }
    });
    this.refs = nrefs;
  }

  getData(): { refs: string[], mode: string, type: string, required: boolean, operator: string, value: any } {
    const { refs, mode, validator } = this;
    const {
      type, required, operator, value,
    } = validator;
    return {
      refs, mode, type, required, operator, value,
    };
  }

  static valueOf({
    refs, mode, type, required, operator, value,
  }: { refs: string[], mode: string, type: string, required: boolean, operator: string, value: any }): Validation {
    return new Validation(mode, refs, new Validator(type, required, value, operator));
  }
}

class Validations {
  _: Validation[];
  errors: Map<string, string>;

  constructor() {
    this._ = [];
    this.errors = new Map();
  }

  getError(ri: number, ci: number): string | undefined {
    return this.errors.get(`${ri}_${ci}`);
  }

  validate(ri: number, ci: number, text: string): boolean {
    const v: Validation | null = this.get(ri, ci);
    const key: string = `${ri}_${ci}`;
    const { errors } = this;
    if (v !== null) {
      const [flag, message] = v.validator.validate(text);
      if (!flag) {
        errors.set(key, message as string);
      } else {
        errors.delete(key);
      }
    } else {
      errors.delete(key);
    }
    return true;
  }

  add(mode: string, ref: string, {
    type, required, value, operator,
  }: { type: string, required: boolean, value: any, operator: string }): void {
    const validator: Validator = new Validator(
      type, required, value, operator,
    );
    const v: Validation | null = this.getByValidator(validator);
    if (v !== null) {
      v.addRef(ref);
    } else {
      this._.push(new Validation(mode, [ref], validator));
    }
  }

  getByValidator(validator: Validator): Validation | null {
    for (let i = 0; i < this._.length; i += 1) {
      const v: Validation = this._[i];
      if (v.validator.equals(validator)) {
        return v;
      }
    }
    return null;
  }

  get(ri: number, ci: number): Validation | null {
    for (let i = 0; i < this._.length; i += 1) {
      const v: Validation = this._[i];
      if (v.includes(ri, ci)) return v;
    }
    return null;
  }

  remove(cellRange: CellRange): void {
    this.each((it: Validation) => {
      it.remove(cellRange);
    });
  }

  each(cb: (it: Validation) => void): void {
    this._.forEach(it => cb(it));
  }

  getData(): { refs: string[], mode: string, type: string, required: boolean, operator: string, value: any }[] {
    return this._.filter(it => it.refs.length > 0).map(it => it.getData());
  }

  setData(d: { refs: string[], mode: string, type: string, required: boolean, operator: string, value: any }[]): void {
    this._ = d.map(it => Validation.valueOf(it));
  }
}

export default {};
export {
  Validations,
};
