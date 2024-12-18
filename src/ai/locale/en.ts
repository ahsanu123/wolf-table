export default {
  toolbar: {
    undo: 'Undo' as string,
    redo: 'Redo' as string,
    print: 'Print' as string,
    paintformat: 'Paint format' as string,
    clearformat: 'Clear format' as string,
    format: 'Format' as string,
    fontName: 'Font' as string,
    fontSize: 'Font size' as string,
    fontBold: 'Font bold' as string,
    fontItalic: 'Font italic' as string,
    underline: 'Underline' as string,
    strike: 'Strike' as string,
    color: 'Text color' as string,
    bgcolor: 'Fill color' as string,
    border: 'Borders' as string,
    merge: 'Merge cells' as string,
    align: 'Horizontal align' as string,
    valign: 'Vertical align' as string,
    textwrap: 'Text wrapping' as string,
    freeze: 'Freeze cell' as string,
    autofilter: 'Filter' as string,
    formula: 'Functions' as string,
    more: 'More' as string,
  } as Record<string, string>,
  contextmenu: {
    copy: 'Copy' as string,
    cut: 'Cut' as string,
    paste: 'Paste' as string,
    pasteValue: 'Paste values only' as string,
    pasteFormat: 'Paste format only' as string,
    hide: 'Hide' as string,
    insertRow: 'Insert row' as string,
    insertColumn: 'Insert column' as string,
    deleteSheet: 'Delete' as string,
    deleteRow: 'Delete row' as string,
    deleteColumn: 'Delete column' as string,
    deleteCell: 'Delete cell' as string,
    deleteCellText: 'Delete cell text' as string,
    validation: 'Data validations' as string,
    cellprintable: 'Enable export' as string,
    cellnonprintable: 'Disable export' as string,
    celleditable: 'Enable editing' as string,
    cellnoneditable: 'Disable editing' as string,
  } as Record<string, string>,
  print: {
    size: 'Paper size' as string,
    orientation: 'Page orientation' as string,
    orientations: ['Landscape', 'Portrait'] as string[],
  } as Record<string, string | string[]>,
  format: {
    normal: 'Normal' as string,
    text: 'Plain Text' as string,
    number: 'Number' as string,
    percent: 'Percent' as string,
    rmb: 'RMB' as string,
    usd: 'USD' as string,
    eur: 'EUR' as string,
    date: 'Date' as string,
    time: 'Time' as string,
    datetime: 'Date time' as string,
    duration: 'Duration' as string,
  } as Record<string, string>,
  formula: {
    sum: 'Sum' as string,
    average: 'Average' as string,
    max: 'Max' as string,
    min: 'Min' as string,
    _if: 'IF' as string,
    and: 'AND' as string,
    or: 'OR' as string,
    concat: 'Concat' as string,
  } as Record<string, string>,
  validation: {
    required: 'it must be required' as string,
    notMatch: 'it not match its validation rule' as string,
    between: 'it is between {} and {}' as string,
    notBetween: 'it is not between {} and {}' as string,
    notIn: 'it is not in list' as string,
    equal: 'it equal to {}' as string,
    notEqual: 'it not equal to {}' as string,
    lessThan: 'it less than {}' as string,
    lessThanEqual: 'it less than or equal to {}' as string,
    greaterThan: 'it greater than {}' as string,
    greaterThanEqual: 'it greater than or equal to {}' as string,
  } as Record<string, string>,
  error: {
    pasteForMergedCell: 'Unable to do this for merged cells' as string,
  } as Record<string, string>,
  calendar: {
    weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as string[],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as string[],
  } as Record<string, string[]>,
  button: {
    next: 'Next' as string,
    cancel: 'Cancel' as string,
    remove: 'Remove' as string,
    save: 'Save' as string,
    ok: 'OK' as string,
  } as Record<string, string>,
  sort: {
    desc: 'Sort Z -> A' as string,
    asc: 'Sort A -> Z' as string,
  } as Record<string, string>,
  filter: {
    empty: 'empty' as string,
  } as Record<string, string>,
  dataValidation: {
    mode: 'Mode' as string,
    range: 'Cell Range' as string,
    criteria: 'Criteria' as string,
    modeType: {
      cell: 'Cell' as string,
      column: 'Colun' as string,
      row: 'Row' as string,
    } as Record<string, string>,
    type: {
      list: 'List' as string,
      number: 'Number' as string,
      date: 'Date' as string,
      phone: 'Phone' as string,
      email: 'Email' as string,
    } as Record<string, string>,
    operator: {
      be: 'between' as string,
      nbe: 'not betwwen' as string,
      lt: 'less than' as string,
      lte: 'less than or equal to' as string,
      gt: 'greater than' as string,
      gte: 'greater than or equal to' as string,
      eq: 'equal to' as string,
      neq: 'not equal to' as string,
    } as Record<string, string>,
  } as Record<string, any>,
};
