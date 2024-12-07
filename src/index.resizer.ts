import { WolfTable } from '.';
import Resizer from './resizer';
import selector from './index.selector';

function init(table: WolfTable) {
  table._rowResizer = new Resizer({
    type: 'row',
    targetContainer: table._container,
    minValue: table._minRowHeight,
    lineLength: () => table._width(),
    change: (value, { row, height }) => {
      table.rowHeight(row, height + value).render();
      selector.reset(table);
      table._canvas.focus();
    }
  });

  table._colResizer = new Resizer({
    type: 'col',
    targetContainer: table._container,
    minValue: table._minColWidth,
    lineLength: () => table._height(),
    change: (value, { col, width }) => {
      table.colWidth(col, width + value).render();
      selector.reset(table);
      table._canvas.focus();
    }
  });
}

export default {
  init,
};
