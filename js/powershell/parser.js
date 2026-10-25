/**
 * Парсер PowerShell-команд.
 * Разбивает строку команды на токены и извлекает позиционные и именованные аргументы.
 *
 * Пример:
 *   Get-Process -Name chrome | Sort-Object CPU -Descending
 *   → { _: [{value:'Get-Process'}], n: { name:'chrome', descending: true } }
 */

/** Разделить строку на токены (с учётом кавычек и скобок). */
export function tokenize(str) {
  const result = [];
  let current = '';
  let quote = '';
  let depth = 0;
  for (const ch of str) {
    if (quote) {
      current += ch;
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }
    if ('{(['.includes(ch)) {
      depth++;
      current += ch;
      continue;
    }
    if ('})]'.includes(ch)) {
      depth--;
      current += ch;
      continue;
    }
    if (/\s/.test(ch)) {
      if (depth === 0 && current) {
        result.push(current);
        current = '';
      } else if (depth > 0) {
        current += ch;
      }
      continue;
    }
    current += ch;
  }
  if (current) result.push(current);
  return result;
}

