import { AreaCell } from '@wolf-table/table-renderer';
import { stylePrefix } from '../config';
import HElement, { createHtmlElement } from '../element';
import { bind, unbind } from '../event';

export type ResizerType = 'row' | 'col';

export interface ResizerConstructorTypes {
  type: ResizerType,
  targetContainer: HElement,
  minValue: number,
  lineLength: () => number,
  change: (value: number, cell: AreaCell) => void
}

export default class Resizer {
  _element: HElement;
  _hover: HElement;
  _line: HElement;

  _type: ResizerType;
  _minValue: number;
  _lineLength: () => number;
  _cell: AreaCell | null = null;
  _change: (value: number, cell: AreaCell) => void;

  constructor({
    type,
    targetContainer,
    minValue,
    lineLength,
    change
  }: ResizerConstructorTypes) {
    this._type = type;
    this._minValue = minValue;
    this._lineLength = lineLength;
    this._change = change;

    this._element = createHtmlElement('div', `${stylePrefix}-resizer ${type}`)
      .append(
        this._hover = createHtmlElement('div', 'hover')
          .on('mousedown.stop', (evt) =>
            mousedownHandler(this, evt)
          ))
      .append((this._line = createHtmlElement('div', 'line')));

    targetContainer.append(this._element);
  }

  show(cell: AreaCell) {
    this._cell = cell;
    const { _type } = this;
    const { x, y, width, height } = cell;

    this._element.css('left', `${_type === 'row' ? x : x + width - 5}px`)
      .css('top', `${_type === 'row' ? y + height - 5 : y}px`)
      .show();

    const key = _type === 'row' ? 'width' : 'height';
    this._hover.css(key, `${cell[key]}px`);
    this._line.css(key, `${this._lineLength()}px`);
  }

  hide() {
    this._element.hide();
  }
}

function mousedownHandler(resizer: Resizer, evt: any) {
  console.log('resizer:', resizer, evt)
  let prevEvent = evt;
  const { _type, _cell, _minValue, _element: _, _line, _change } = resizer;
  let distance = 0;

  _line.show();

  const moveHandler = (e: any) => {
    if (evt !== null && e.buttons === 1 && _cell) {
      if (_type === 'row') {
        distance += e.movementY;
        if (distance + _cell.height >= _minValue) {
          _.css('top', `${_cell.y + _cell.height + distance}px`);
        } else distance = _minValue - _cell.height;
      } else {
        distance += e.movementX;
        if (distance + _cell.width >= _minValue) {
          _.css('left', `${_cell.x + _cell.width + distance}px`);
        } else distance = _minValue - _cell.width;
      }
    }
    prevEvent = e;
  };

  const upHandler = () => {
    unbind(<any>window, 'mousemove', moveHandler);
    unbind(<any>window, 'mouseup', upHandler);
    prevEvent = null;
    _line.hide();
    _.hide();
    if (_cell && distance != 0) {
      _change(distance, _cell);
    }
  };

  bind(window as any, 'mousemove', moveHandler);
  bind(window as any, 'mouseup', upHandler);
}
