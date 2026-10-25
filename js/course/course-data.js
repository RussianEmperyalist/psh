/**
 * Данные курса PShell4All.
 * Каждый урок содержит:
 *   - t    : название
 *   - th   : теория (HTML)
 *   - ex   : примеры команд для пробного запуска
 *   - task : задание
 *   - h    : подсказка (решение)
 *   - ok   : регулярное выражение для проверки выполнения
 */

export const courseModules = [
  {
    name: 'Основы',
    level: 'Новичок',
    lessons: [
      {
        t: 'Командлеты и справка',
        th: 'Команды PowerShell называются <b>командлетами</b> и строятся по схеме <code>Глагол-Существительное</code>: Get-Process, Stop-Service, New-Item. Регистр не важен. Три главных помощника: <code>Get-Command</code> — что вообще есть, <code>Get-Help</code> — как этим пользоваться, <code>Get-Member</code> — какие свойства у объекта. Освоив их, вы разберётесь с любой незнакомой командой сами.',
        ex: ['Get-Command', 'Get-Command Get-*', 'Get-Help Get-Process', 'Get-Process | Get-Member'],
        task: 'Получите справку по командлету Get-Service с помощью Get-Help.',
        h: 'Get-Help Get-Service',
        ok: /get-help\s+get-service/i
      },
      {
        t: 'Конвейер и объекты',
        th: 'Главная идея PowerShell: по конвейеру <code>|</code> передаются <b>объекты</b>, а не текст. У процесса есть свойства Name, Id, CPU — по ним можно сортировать и выбирать без разбора строк, как в bash. <code>Sort-Object</code> сортирует, <code>Select-Object</code> выбирает свойства и количество.',
        ex: ['Get-Process | Sort-Object CPU -Descending', 'Get-Process | Select-Object Name,Id -First 3'],
        task: 'Выведите 3 процесса с наибольшей загрузкой CPU: Sort-Object по убыванию, затем Select-Object -First 3.',
        h: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 3',
        ok: /sort(-object)?[^|\n]*\|\s*select(-object)?[^|\n]*first\s+3/i
      },
      {
        t: 'Фильтрация',
        th: '<code>Where-Object</code> оставляет только подходящие объекты. В блоке <code>{ }</code> текущий объект — это <code>$_</code>. Операторы сравнения: <code>-eq -ne -gt -lt -ge -le -like -match</code>, логика — <code>-and -or -not</code>. Знаки == и &gt; здесь не работают.',
        ex: ['Get-Service | Where-Object { $_.Status -eq "Running" }', 'Get-Process | Where-Object { $_.Name -like "s*" }'],
        task: 'Покажите процессы, у которых CPU больше 50.',
        h: 'Get-Process | Where-Object { $_.CPU -gt 50 }',
        ok: /where(-object)?\s*(\{[^}]*cpu\s*-gt|cpu\s+-gt)/i
      },
      {
        t: 'Переменные и массивы',
        th: 'Переменные начинаются с <code>$</code>. В строках с двойными кавычками они подставляются, в одинарных — нет. Диапазон <code>1..5</code> создаёт массив, свойство <code>.Count</code> — число элементов, а <code>ForEach-Object</code> выполняет действие для каждого.',
        ex: ['$name = "Admin"', '"Привет, $name"', '$nums = 1..5', '$nums | ForEach-Object { $_ * 2 }'],
        task: 'Сохраните запущенные службы в переменную $svc (Where-Object, Status -eq Running), затем выведите $svc.Count.',
        h: '$svc = Get-Service | Where-Object { $_.Status -eq "Running" }\n$svc.Count',
        ok: /\$svc\s*=.*running[\s\S]*\$svc\.count/i
      }
    ]
  },
  {
    name: 'Файлы и скрипты',
    level: 'Базовый',
    lessons: [
      {
        t: 'Файлы и папки',
        th: 'Файловая система тоже состоит из объектов. <code>Get-ChildItem</code> (ls, dir) — список, <code>Set-Location</code> (cd) — переход, <code>Get-Content</code> (cat) — чтение, <code>Set-Content</code> и <code>Add-Content</code> — запись, <code>New-Item</code> и <code>Remove-Item</code> — создание и удаление. Ключ <code>-Recurse</code> обходит вложенные папки.',
        ex: ['Get-ChildItem', 'Get-Content Documents\\notes.txt', 'Get-ChildItem -Recurse', 'New-Item Scripts\\test.ps1'],
        task: 'Создайте файл hello.txt с любым текстом (Set-Content) и выведите его через Get-Content.',
        h: 'Set-Content hello.txt -Value "Привет"\nGet-Content hello.txt',
        ok: /(set-content|add-content|new-item)[^\n]*hello\.txt[\s\S]*(get-content|cat|type|gc)\s[^\n]*hello\.txt/i
      },
      {
        t: 'Условия и циклы',
        th: 'Цикл <code>foreach ($x in коллекция) { ... }</code> и условие <code>if (...) { ... } else { ... }</code> — основа скриптов: проверки, обход файлов, массовые операции. Несколько команд в строке разделяются <code>;</code>.',
        ex: ['foreach ($i in 1..3) { Write-Host "Шаг $i" }', 'if (5 -gt 3) { "да" } else { "нет" }', 'foreach ($p in Get-Process) { if ($p.CPU -gt 100) { $p.Name } }'],
        task: 'Выведите числа от 1 до 5 циклом foreach.',
        h: 'foreach ($i in 1..5) { $i }',
        ok: /foreach\s*\(\s*\$\w+\s+in\s+1\.\.5/i
      },
      {
        t: 'Поиск по тексту и логам',
        th: '<code>Select-String</code> — аналог grep: ищет строки по шаблону (регулярному выражению) в файлах или в тексте из конвейера. Это основа разбора логов: ошибки, предупреждения, подозрительные события.',
        ex: ['Get-Content Documents\\Logs\\app.log', 'Select-String -Pattern "ERROR" -Path Documents\\Logs\\app.log', 'Get-Content Documents\\Logs\\app.log | Select-String WARN'],
        task: 'Найдите в Documents\\Logs\\app.log строки со словом ERROR.',
        h: 'Select-String -Pattern ERROR -Path Documents\\Logs\\app.log',
        ok: /select-string[^\n]*error/i
      }
    ]
  },
  {
    name: 'Администрирование',
    level: 'Средний',
    lessons: [
      {
        t: 'Службы и процессы',
        th: 'Службы — основа работы сисадмина: <code>Get-Service</code>, <code>Start-Service</code>, <code>Stop-Service</code>; для процессов — <code>Get-Process</code> и <code>Stop-Process</code>. С точки зрения ИБ каждая лишняя служба (Spooler, RemoteRegistry) расширяет поверхность атаки, поэтому на серверах их отключают.',
        ex: ['Get-Service', 'Get-Service -Name Spooler', 'Stop-Process -Name chrome'],
        task: 'Остановите службу Spooler, затем проверьте её статус через Get-Service.',
        h: 'Stop-Service Spooler\nGet-Service Spooler',
        ok: /stop-service\s+(-name\s+)?spooler[\s\S]*get-service/i
      },
      {
        t: 'Учётные записи',
        th: '<code>Get-LocalUser</code> показывает локальные учётные записи. Аудит учёток — классическая задача: что включено, кто давно не входил, какие технические аккаунты остались. Лишние включённые записи — прямая лазейка для атакующего.',
        ex: ['Get-LocalUser', 'Get-LocalUser | Where-Object { $_.Enabled -eq $true }'],
        task: 'Выведите только включённые учётные записи, отфильтровав по свойству Enabled.',
        h: 'Get-LocalUser | Where-Object { $_.Enabled -eq $true }',
        ok: /get-localuser[^\n]*where(-object)?[^\n]*enabled/i
      },
      {
        t: 'Журналы событий',
        th: 'Журнал безопасности — главный источник для расследований. Ключевые Id: <b>4624</b> успешный вход, <b>4625</b> неудачный вход (серия — признак перебора паролей), <b>4688</b> запуск процесса, <b>7045</b> установка службы (частый способ закрепления). В настоящей Windows используется <code>Get-WinEvent</code>.',
        ex: ['Get-WinEvent -MaxEvents 3', 'Get-WinEvent | Where-Object { $_.Id -eq 4625 }', 'Get-WinEvent | Group-Object Id'],
        task: 'Найдите события 4625 и подсчитайте их через Measure-Object.',
        h: 'Get-WinEvent | Where-Object { $_.Id -eq 4625 } | Measure-Object',
        ok: /4625[^\n]*\|\s*measure/i
      }
    ]
  },
  {
    name: 'Автоматизация',
    level: 'Продвинутый',
    lessons: [
      {
        t: 'Хэш-таблицы и свои объекты',
        th: 'Хэш-таблица <code>@{ Ключ = значение; ... }</code> хранит пары «ключ — значение». Если добавить <code>[PSCustomObject]</code>, получится полноценный объект — так собирают отчёты и результаты аудита. Доступ к значению: <code>$h.Port</code> или <code>$h["Port"]</code>.',
        ex: ['$h = @{ Host = "srv01"; Port = 443 }', '$h.Port', '[PSCustomObject]@{ Name = "srv01"; Risk = "High" }'],
        task: 'Создайте хэш-таблицу $h с ключами Host и Port, затем выведите значение $h.Port.',
        h: '$h = @{ Host = "srv01"; Port = 443 }\n$h.Port',
        ok: /\$h\s*=\s*@\{/i
      },
      {
        t: 'Функции',
        th: 'Функция упаковывает повторяющийся код: <code>function Имя($параметр) { ... }</code>. Вызывается как обычный командлет: <code>Имя значение</code>. Так собирают собственные инструменты — например, проверку хоста или отчёт по службам.',
        ex: ['function Hello($n) { "Привет, $n" }', 'Hello Admin', 'function Top($k) { Get-Process | Sort-Object CPU -Descending | Select-Object -First $k }', 'Top 2'],
        task: 'Объявите функцию Hello с параметром $n, которая выводит приветствие, и вызовите её со своим именем.',
        h: 'function Hello($n) { "Привет, $n" }\nHello Admin',
        ok: /function\s+hello/i
      },
      {
        t: 'Обработка ошибок',
        th: '<code>try { ... } catch { ... }</code> перехватывает ошибки, а <code>$_</code> в блоке catch описывает ошибку. <code>finally</code> выполняется всегда, <code>throw "текст"</code> вызывает ошибку вручную. Скрипт, который не падает от первой же проблемы, — признак зрелой автоматизации.',
        ex: ['try { Get-Content nofile.txt } catch { "Ошибка: $_" }', 'try { Get-Service Spooler } catch { "нет такой службы" } finally { "готово" }', 'try { throw "Тревога!" } catch { "Поймали: $_" }'],
        task: 'Прочитайте несуществующий файл внутри try и обработайте ошибку в блоке catch.',
        h: 'try { Get-Content nofile.txt } catch { "Файл не найден" }',
        ok: /try\s*\{/i
      }
    ]
  },
  {
    name: 'Безопасность',
    level: 'Продвинутый',
    lessons: [
      {
        t: 'Подозрительные соединения',
        th: '<code>Get-NetTCPConnection</code> показывает соединения: адреса, порты, состояние и <b>OwningProcess</b> — Id процесса-владельца. Так находят нестандартные порты (4444 — классика Metasploit) и неизвестные внешние адреса. Выражение <code>(команда).Свойство</code> достаёт значение из результата другой команды.',
        ex: ['Get-NetTCPConnection', 'Get-NetTCPConnection -State Established', 'Get-Process -Id (Get-NetTCPConnection -RemotePort 4444).OwningProcess'],
        task: 'Найдите соединение на порт 4444 и определите процесс-владелец через Get-Process -Id.',
        h: 'Get-Process -Id (Get-NetTCPConnection -RemotePort 4444).OwningProcess',
        ok: /4444[\s\S]*get-process\s+-id/i
      },
      {
        t: 'Целостность и политики',
        th: 'Хэш — отпечаток содержимого файла: изменился файл — изменился хэш. <code>Get-FileHash</code> применяют для контроля целостности и поиска известных вредоносных файлов. <code>Get-ExecutionPolicy</code> показывает политику запуска скриптов — это страховка от случайного запуска, а не защита от атакующего. В симуляторе используется учебный отпечаток EDU-FNV, а не настоящий SHA-256; не применяйте его для проверки реальной целостности.',
        ex: ['Get-FileHash Documents\\notes.txt', 'Get-ExecutionPolicy'],
        task: 'Посчитайте хэш файла Documents\\notes.txt, затем узнайте политику выполнения скриптов.',
        h: 'Get-FileHash Documents\\notes.txt\nGet-ExecutionPolicy',
        ok: /get-filehash[\s\S]*get-executionpolicy/i
      },
      {
        t: 'Поиск секретов',
        th: 'Пароли в текстовых файлах — частая находка при аудите. Связка <code>Get-ChildItem -Recurse | Select-String</code> прочёсывает всё дерево каталогов за секунды. Найденное нужно убирать в менеджер секретов и менять пароли.',
        ex: ['Get-ChildItem -Recurse', 'Get-ChildItem -Recurse | Select-String -Pattern "password"'],
        task: 'Рекурсивно найдите во всех файлах строки со словом password.',
        h: 'Get-ChildItem -Recurse | Select-String -Pattern password',
        ok: /get-childitem[^\n]*recurse[^\n]*\|\s*select-string/i
      }
    ]
  }
];

/** Плоский массив всех уроков: { t, th, ex, task, h, ok, module, level } */
export function flattenLessons() {
  return courseModules.flatMap(m =>
    m.lessons.map(l => ({ ...l, module: m.name, level: m.level }))
  );
}
