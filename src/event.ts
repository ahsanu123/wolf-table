export type CallbackFunction =
  ((evt: any) => void)
  | ((evt: UIEvent) => void)

type EventNameTypes = keyof CustomEventMap

export function bind(target: HTMLElement, eventName: EventNameTypes, callback: CallbackFunction) {
  target.addEventListener(eventName, callback);
}

export function unbind(
  target: HTMLElement,
  eventName: EventNameTypes,
  callback: CallbackFunction
) {
  target.removeEventListener(eventName, callback);
}

export function bindMousemoveAndMouseup(
  target: any,
  move: (evt: any) => void,
  up: (evt: any) => void
) {
  const upHandler = (evt: any) => {
    up(evt);
    unbind(target, 'mousemove', move);
    unbind(target, 'mouseup', upHandler);
  };
  bind(target, 'mousemove', move);
  bind(target, 'mouseup', upHandler);
}

// event.emitter
type Handler = (...args: any) => void;

export class EventEmitter {
  _events = new Map<EventNameTypes, Array<CallbackFunction>>();

  on(type: EventNameTypes, handler: Handler) {
    const { _events } = this;
    if (!_events.has(type)) {
      _events.set(type, []);
    }
    _events.get(type)?.push(handler);
    return this;
  }

  off(type: EventNameTypes, handler?: Handler) {
    const { _events } = this;

    if (_events.has(type)) {
      const handlers = _events.get(type);
      if (handler && handlers) {

        const findIndex = handlers.findIndex((it) => it === handler);
        if (findIndex !== -1) {
          handlers.splice(findIndex, 1);
        }
      } else {
        handlers && (handlers.length = 0);
      }
    }
    return this;
  }

  emit(type: EventNameTypes, ...args: any) {
    const { _events } = this;
    if (_events.has(type)) {
      _events.get(type)?.forEach((handler: Handler) => handler(...args));
    }
    return this;
  }
}

declare global {
  interface CustomEventMap {
    'mousemove': CallbackFunction
    'mouseup': CallbackFunction
    'click': CallbackFunction
    'contextmenu': CallbackFunction
  }
}
