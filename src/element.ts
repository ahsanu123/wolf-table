function createFragment(...nodes: (HElement | Node | string)[]) {
  const fragment = document.createDocumentFragment();
  nodes.forEach((node) => {
    let nnode: Node;
    if (node instanceof HElement) nnode = node._element;
    else if (typeof node === 'string') nnode = document.createTextNode(node);
    else nnode = node;
    fragment.appendChild(nnode);
  });
  return fragment;
}

export type CSSAttrs = {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  position?: string;
  [property: string]: any;
};

export default class HElement {
  _element: HTMLElement;
  _data = new Map();

  constructor(tag: string | Node, className?: string | string[] | Object) {
    this._element =
      tag instanceof Node ? <HTMLElement>tag : document.createElement(tag);
    if (className) {
      if (typeof className === 'string') {
        this._element.className = className;
      } else if (Array.isArray(className)) {
        this._element.className = className.join(' ');
      } else {
        for (let [key, value] of Object.entries(className)) {
          if (value) this._element.classList.add(key);
        }
      }
    }
  }

  element(): HTMLElement {
    return this._element;
  }

  data(key: string, value?: any) {
    if (value) {
      this._data.set(key, value);
      return this;
    } else {
      return this._data.get(key);
    }
  }

  on(eventName: string, handler: (evt: any) => void) {
    const [evtName, ...prop] = eventName.split('.');
    this._element.addEventListener(evtName, (evt) => {
      handler(evt);
      for (let i = 0; i < prop.length; i += 1) {
        if (prop[i] === 'stop') {
          evt.stopPropagation();
        }
        if (prop[i] === 'prevent') {
          evt.preventDefault();
        }
      }
    });
    return this;
  }

  focus() {
    this._element.focus();
    return this;
  }

  value(v?: string): any {
    if (v) {
      (this._element as any).value = v;
      return this;
    }
    return (this._element as any).value;
  }

  textContent(v: string) {
    this._element.textContent = v;
    return this;
  }

  html(v: string) {
    this._element.innerHTML = v;
    return this;
  }

  attr(key: string): string;
  attr(key: string, value: string): HElement;
  attr(key: string, value?: string): HElement | string {
    if (value) {
      this._element.setAttribute(key, value);
      return this;
    }
    return this._element.getAttribute(key) ?? '';
  }

  css(key: any, value?: string): any {
    const { style } = this._element;
    if (value) {
      style.setProperty(key, value);
      return this;
    }
    if (typeof key === 'string') {
      return style.getPropertyValue(key);
    }
    Object.keys(key).forEach((k) => {
      let v: any = key[k];
      if (typeof v === 'number') v = `${v}px`;
      style.setProperty(k, v);
    });
    return this;
  }

  rect() {
    return this._element.getBoundingClientRect();
  }

  offset() {
    const { _element: _ } = this;
    return {
      x: _.offsetLeft,
      y: _.offsetTop,
      width: _.offsetWidth,
      height: _.offsetHeight,
    };
  }

  computedStyle() {
    return window.getComputedStyle(this._element);
  }

  show(flag: boolean = true) {
    this.css('display', flag ? 'block' : 'none');
    return this;
  }

  hide() {
    this.css('display', 'none');
    return this;
  }

  scrollx(): number;
  scrollx(value: number): HElement;
  scrollx(value?: number): any {
    const { _element: _ } = this;
    if (value !== undefined) {
      _.scrollLeft = value;
      return this;
    }
    return _.scrollLeft;
  }

  scrolly(): number;
  scrolly(value: number): HElement;
  scrolly(value?: number): any {
    const { _element: _ } = this;
    if (value !== undefined) {
      _.scrollTop = value;
      return this;
    }
    return _.scrollTop;
  }

  after(...nodes: (HElement | Node | string)[]) {
    this._element.after(createFragment(...nodes));
    return this;
  }

  before(...nodes: (HElement | Node | string)[]) {
    this._element.before(createFragment(...nodes));
    return this;
  }

  append(...nodes: (HElement | Node | string)[]) {
    this._element.append(createFragment(...nodes));
    return this;
  }

  remove(...nodes: (HElement | Node)[]) {
    nodes.forEach((node) => {
      this._element.removeChild(node instanceof HElement ? node._element : node);
    });
  }

  cloneNode() {
    return this._element.cloneNode(true);
  }

  get firstChild(): HElement | null {
    const first = this._element.firstChild;
    return first ? new HElement(first) : null;
  }
}

export function createHtmlElement(
  tag: string | HTMLElement,
  className?: string | string[] | Object
) {
  return new HElement(tag, className);
}

export function textWidth(text: string, fontSize: string, fontFamily: string) {
  const el = document.createElement('span');
  el.style.display = 'inline-block';
  el.style.position = 'absolute';
  el.style.zIndex = '-900';
  el.style.whiteSpace = 'nowrap';
  el.style.fontSize = fontSize;
  el.style.fontFamily = fontFamily;
  el.textContent = text;
  document.body.appendChild(el);
  const width = el.clientWidth;
  document.body.removeChild(el);
  return width;
}
