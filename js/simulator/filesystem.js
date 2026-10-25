/**
 * Виртуальная файловая система.
 * Структура: D({ c: { ... } }) — каталог, F(f) — файл.
 */

export function F(f) {
  return { f };
}

export function D(c) {
  return { c };
}

/**
 * Создать исходную файловую структуру лаборатории.
 * C:\Users\Admin\Documents\notes.txt
 * C:\Users\Admin\Documents\creds.txt
 * C:\Users\Admin\Documents\Logs\app.log
 * C:\Users\Admin\Documents\Scripts\
 */
export function createFilesystem() {
  return D({
    'C:': D({
      Users: D({
        Admin: D({
          Documents: D({
            'notes.txt': F('Встреча в 10:00\nПароль от VPN: Winter2024!\n'),
            'creds.txt': F('login=admin\npassword=P@ssw0rd\n'),
            Logs: D({
              'app.log': F('INFO start\nWARN disk 91%\nERROR db timeout\nINFO ok\nERROR auth failed\n')
            }),
            Scripts: D({})
          })
        })
      })
    })
  });
}

/**
 * Ключевой фильтр: найти ключ в объекте (case-insensitive).
 */
export function findKey(node, name) {
  if (!node || !node.c) return undefined;
  return Object.keys(node.c).find(k => k.toLowerCase() === name.toLowerCase());
}

/**
 * Получить узел по пути (массив сегментов).
 */
export function getNode(fsRoot, segments) {
  let node = fsRoot;
  for (const s of segments) {
    const k = findKey(node, s);
    if (!k) return null;
    node = node.c[k];
  }
  return node;
}

/**
 * Преобразовать массив сегментов в строку пути (C:\Users\Admin).
 */
export function pathToString(segments) {
  return segments.length === 1 ? segments[0] + '\\' : segments.join('\\');
}

/**
 * Разрешить относительный/абсолютный путь в [segments, node, parent, name].
 */
export function resolvePath(fsRoot, cwd, path) {
  if (path == null || path === true) {
    throw new Error('Не указан путь. Пример: Get-Content Logs\\app.log');
  }
  let segments = /^[A-Za-z]:/.test(path) ? [] : [...cwd];
  for (const s of String(path).split(/[\\/]/)) {
    if (!s || s === '.') continue;
    if (s === '..') segments.pop();
    else segments.push(s);
  }
  const node = getNode(fsRoot, segments);
  const parent = segments.length > 0 ? getNode(fsRoot, segments.slice(0, -1)) : null;
  const name = segments[segments.length - 1];
  return { segments, node, parent, name };
}

/**
 * Считать содержимое файла.
 */
export function readFile(fsRoot, cwd, path) {
  const r = resolvePath(fsRoot, cwd, path);
  if (!r.node) throw new Error(`Не удаётся найти путь "${path}", так как он не существует.`);
  if (r.node.c) throw new Error('Указан каталог, а не файл: ' + path);
  return r.node.f.replace(/\r\n?/g, '\n');
}

/**
 * Записать/добавить содержимое файла.
 */
export function writeFile(fsRoot, cwd, path, text, append) {
  const r = resolvePath(fsRoot, cwd, path);
  if (!r.parent || !r.parent.c) throw new Error('Каталог не найден: ' + path);
  if (r.node && r.node.c) throw new Error('Указан каталог.');
  const key = findKey(r.parent, r.name) || r.name;
  if (append && r.node) {
    r.parent.c[key] = F(r.node.f + text);
  } else {
    r.parent.c[key] = F(text + '\n');
  }
}

/**
 * Получить список каталога (Get-ChildItem).
 */
export function listDirectory(node, segments, recursive) {
  const result = [];
  for (const k of Object.keys(node.c)) {
    const child = node.c[k];
    const entry = {
      Mode: child.c ? 'd-----' : '-a----',
      Name: k,
      Length: child.c ? '' : child.f.length
    };
    Object.defineProperty(entry, 'FullName', {
      value: pathToString([...segments, k])
    });
    result.push(proxyWrap(entry));
    if (recursive && child.c) {
      result.push(...listDirectory(child, [...segments, k], 1));
    }
  }
  return result;
}

/**
 * Proxy для case-insensitive доступа к свойствам.
 */
export function proxyWrap(obj) {
  return new Proxy(obj, {
    get(target, key) {
      if (typeof key !== 'string' || key in target) return target[key];
      const found = Object.keys(target).find(k => k.toLowerCase() === key.toLowerCase());
      return found !== undefined ? target[found] : undefined;
    }
  });
}
