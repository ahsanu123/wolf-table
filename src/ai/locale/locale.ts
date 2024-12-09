import en from './en';

let $languages: string[] = ['en'];
const $messages: { [key: string]: typeof en } = {
  en,
};

function translate(key: string, messages?: { [key: string]: any }): string | undefined {
  if (messages) {
    for (const lang of $languages) {
      if (!messages[lang]) break;

      let message: any = messages[lang];
      const keys: string[] | null = key.match(/(?:\\.|[^.])+/g);

      if (keys) {
        for (let i = 0; i < keys.length; i += 1) {
          const property: string = keys[i];
          const value: any = message[property];

          if (!value) break;

          if (i === keys.length - 1) return value;

          message = value;
        }
      }
    }
  }

  return undefined;
}

function t(key: string): string {
  let v: string | undefined = translate(key, $messages);
  if (!v && typeof window !== 'undefined' && (window as any).x_spreadsheet && (window as any).x_spreadsheet.$messages) {
    v = translate(key, (window as any).x_spreadsheet.$messages);
  }
  return v || '';
}

function tf(key: string): string {
  return t(key);
}

function locale(lang: string, message?: any, clearLangList: boolean = false): void {
  if (clearLangList) {
    $languages = [lang];
  } else {
    $languages.unshift(lang);
  }

  if (message) {
    $messages[lang] = message;
  }
}

export default {
  t,
};

export {
  locale,
  t,
  tf,
};
