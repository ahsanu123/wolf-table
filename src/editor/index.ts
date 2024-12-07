import HElement, { createHtmlElement } from '../element';
import { borderWidth } from '../config';
import { Rect } from '@wolf-table/table-renderer';
import { DataCell } from '../data';

type MoveDirection = 'up' | 'down' | 'left' | 'right' | 'none';
type MoveChanger = (direction: MoveDirection) => void;
type Changer = (value: DataCell) => void;

/**
 * new -> cellIndex -> rect -> target -> hide
 */
export default class Editor {
  _element: HElement;
  _target: HElement | null = null;
  _rect: Rect | null = null;
  _value: DataCell;
  _visible: boolean = false;

  _moveChanger: MoveChanger = () => { };
  _changer: Changer = () => { };

  constructor(cssClass: String) {
    this._element = createHtmlElement('div', cssClass);
  }

  get visible() {
    return this._visible;
  }

  target(target: HElement) {
    target.append(this._element);
    this._target = target;
    return this;
  }

  cellIndex(r: number, c: number) {
    return this;
  }

  value(v: DataCell) {
    this._value = v;
    return this;
  }

  changed() {
    this._changer(this._value);
    this.hide();
  }

  rect(rect: Rect | null) {
    if (rect) {
      this._visible = true;
      this._rect = rect;
      const { x, y, width, height } = rect;
      this._element.css({
        left: x - borderWidth / 2,
        top: y - borderWidth / 2,
        width: width - borderWidth,
        height: height - borderWidth,
      }).show();
    }
    return this;
  }

  show() {
    this._element.show();
    return this;
  }

  hide() {
    this._visible = false;
    this.value('');
    this._element.hide();
    return this;
  }

  moveChanger(value: MoveChanger) {
    this._moveChanger = value;
    return this;
  }

  changer(value: Changer) {
    this._changer = value;
    return this;
  }
}
