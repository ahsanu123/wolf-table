import TableRenderer, { Rect } from "@wolf-table/table-renderer";
import { createHtmlElement, HElement, TableOptions, TableRendererOptions } from "..";
import { stylePrefix } from "../config";
import { Cells, colsWidth, defaultData, rowsHeight, TableData } from "../data";
import Editor from "../editor";
import { EventEmitter } from "../event";
import Overlayer from "../overlayer";
import Resizer from "../resizer";
import Scrollbar from "../scrollbar";
import Selector from "../selector";

import selector from '../index.selector';
import resizer from "../index.resizer";
import scrollbar from "../index.scrollbar";
import TextEditor from "../editor/text";
import { initEvents } from "../index.event";

export class WolfTable {
  _rendererOptions: TableRendererOptions = {}
  _copyable = false
  _editable = false

  _minRowHeight: number = 25;
  _minColWidth: number = 60;

  _width: () => number;
  _height: () => number;

  // cache for rect of content
  _contentRect: Rect = { x: 0, y: 0, width: 0, height: 0 };
  _container: HElement;
  _data: TableData;
  _renderer: TableRenderer;

  _cells = new Cells();

  // scrollbar
  _vScrollbar?: Scrollbar;
  _hScrollbar?: Scrollbar;

  // resizer
  _rowResizer?: Resizer;
  _colResizer?: Resizer;

  // editor ? extends Editor
  _editor?: Editor;
  _editors = new Map();

  _selector?: Selector;
  _overlayer: Overlayer;

  _canvas: HElement;

  // event emitter
  _emitter = new EventEmitter();

  constructor(
    element: HTMLElement | string,
    width: () => number,
    height: () => number,
    data?: TableData,
    options?: TableOptions
  ) {
    this._width = width;
    this._height = height
    this._data = data ?? defaultData;

    const container: HTMLElement | null = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (container === null) throw new Error('first argument error, container must an element');

    this._container = createHtmlElement(container, `${stylePrefix}-container`).css({
      height: height(),
      width: width(),
    });

    if (options) this._appendOptions(options)

    const canvasElement = document.createElement('canvas');
    this._canvas = createHtmlElement(canvasElement).attr('tabIndex', '1');

    this._renderer = new TableRenderer(canvasElement, width(), height());
    this._overlayer = new Overlayer(this._container);

    resizeContentRect(this);

    if (options?.selectable) selector.init(this);
    if (options?.scrollable) scrollbar.init(this);
    if (options?.resizable) resizer.init(this);
    if (options?.editable) this._editable = true;

    this._copyable = options?.copyable || false;
    this._editors.set('text', new TextEditor());

    initEvents(this);
  }

  private _appendOptions(options: TableOptions) {
    const { minColWidth, minRowHeight, renderer, data } = options;
    if (minColWidth) this._minColWidth = minColWidth;
    if (minRowHeight) this._minRowHeight = minRowHeight;

    if (renderer) {
      this._rendererOptions = renderer;
    }

    if (data) {
      const { cols, rows, rowHeight, colWidth } = data;
      const { _data } = this;
      if (cols) _data.cols.len = cols;
      if (rows) _data.rows.len = rows;
      if (rowHeight) _data.rowHeight = rowHeight;
      if (colWidth) _data.colWidth = colWidth;
    }
  }

}


function resizeContentRect(t: WolfTable) {
  t._contentRect = {
    x: t._renderer._rowHeader.width,
    y: t._renderer._colHeader.height,
    width: colsWidth(t._data),
    height: rowsHeight(t._data),
  };
}
