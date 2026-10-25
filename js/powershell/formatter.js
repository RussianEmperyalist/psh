/**
 * Форматирование результатов командлета для вывода в терминал.
 */

/** Форматировать массив объектов как текстовую таблицу. */
export function formatOutput(results, proxyWrap) {
  if (!results.length) return '';

  // Прямой текстовый вывод (__txt)
  if (results.length === 1 && results[0] && results[0].__txt) {
    return results[0].__txt;
  }

  // Объекты с предзаданной строкой (__s)
  if (results.every(x => x && typeof x === 'object' && x.__s !== undefined)) {
    return results.map(x => x.__s).join('\n');
  }

  // Хэш-таблицы → пары Name/Value
  results = results.flatMap(x =>
    x && typeof x === 'object' && x.__ht
      ? Object.keys(x).map(k => proxyWrap({ Name: k, Value: x[k] }))
      : [x]
  );

  // Простые значения (числа, строки)
  if (results.every(x => x === null || typeof x !== 'object')) {
    return results.join('\n');
  }

  // Таблица
  const objs = results.filter(x => x && typeof x === 'object');
  if (!objs.length) return '';
  const keys = Object.keys(objs[0]);

  const cell = (obj, key) => {
    const val = obj[key];
    if (Array.isArray(val)) return val.join(',');
    if (typeof val === 'boolean') return val ? 'True' : 'False';
    return String(val ?? '');
  };

  const widths = keys.map(k =>
    Math.max(k.length, ...objs.map(x => cell(x, k).length))
  );

  const row = (fn) =>
    keys.map((k, i) => fn(k).padEnd(widths[i])).join('  ').trimEnd();

  const lines = [
    row(k => k),
    row(k => '-'.repeat(k.length)),
    ...objs.map(x => row(k => cell(x, k)))
  ];

  return lines.join('\n');
}
