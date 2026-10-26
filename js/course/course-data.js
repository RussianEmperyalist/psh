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
        th: '<p><b>PowerShell</b> — это командная оболочка и язык сценариев от Microsoft. В отличие от старой командной строки (cmd), он работает не с текстом, а с <b>объектами</b>: у процесса, службы или файла есть именованные свойства, и их можно читать, сортировать и фильтровать.</p><p>Команды PowerShell называются <b>командлетами</b> (cmdlet). Имя строится по схеме <code>Глагол-Существительное</code>, поэтому его легко угадать:</p><ul><li><code>Get</code> — получить, <code>Set</code> — изменить, <code>New</code> — создать, <code>Remove</code> — удалить, <code>Start</code> / <code>Stop</code> — запустить / остановить;</li><li><code>Get-Process</code> — получить процессы, <code>Stop-Service</code> — остановить службу.</li></ul><p>После имени идут <b>параметры</b>, они начинаются с дефиса: <code>Get-Process -Name chrome</code>. Регистр букв не важен. У частых командлетов есть короткие <b>алиасы</b>: <code>ls</code> = <code>Get-ChildItem</code>, <code>ps</code> = <code>Get-Process</code>.</p><p>Три главных помощника, с которых начинается работа с любой незнакомой командой:</p><ul><li><code>Get-Command</code> — какие команды вообще есть. Звёздочка в шаблоне означает «любые символы»: <code>Get-Command Get-*</code> покажет все команды на Get.</li><li><code>Get-Help имя</code> — описание команды и пример использования.</li><li><code>Get-Member</code> — какие свойства есть у объектов, которые вернула команда: <code>Get-Process | Get-Member</code>.</li></ul>',
        ex: ['Get-Command', 'Get-Command Get-*', 'Get-Help Get-Process', 'Get-Process | Get-Member'],
        task: 'Получите справку по командлету Get-Service с помощью Get-Help.',
        h: 'Get-Help Get-Service',
        ok: /get-help\s+get-service/i
      },
      {
        t: 'Конвейер и объекты',
        th: '<p><b>Объект</b> — это набор свойств. У процесса это <code>Name</code> (имя), <code>Id</code> (номер процесса), <code>CPU</code> (сколько процессорного времени он потратил), <code>WS</code> (занимаемая память в МБ). Посмотреть свойства можно через <code>Get-Process | Get-Member</code>.</p><p><b>Конвейер</b> — символ <code>|</code>. Он берёт результат команды слева и передаёт его команде справа. Передаются именно объекты, поэтому не нужно «разбирать текст», как в bash: можно сразу обращаться к свойствам.</p><p>Два основных помощника конвейера:</p><ul><li><code>Sort-Object СВОЙСТВО</code> — сортировка по возрастанию; ключ <code>-Descending</code> — по убыванию (от большего к меньшему).</li><li><code>Select-Object</code> — выбор: <code>-First 3</code> оставляет первые 3 объекта, а список имён (<code>Name,Id</code>) оставляет только эти свойства.</li></ul><p>Пример по шагам: <code>Get-Process | Sort-Object CPU -Descending | Select-Object -First 3</code> — «получить процессы → расположить по CPU от большего к меньшему → взять первые три». Так находят самые «прожорливые» процессы.</p>',
        ex: ['Get-Process | Sort-Object CPU -Descending', 'Get-Process | Select-Object Name,Id -First 3'],
        task: 'Выведите 3 процесса с наибольшей загрузкой CPU: Sort-Object по убыванию, затем Select-Object -First 3.',
        h: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 3',
        ok: /sort(-object)?[^|\n]*\|\s*select(-object)?[^|\n]*first\s+3/i
      },
      {
        t: 'Фильтрация',
        th: '<p><code>Where-Object</code> пропускает дальше только те объекты, которые подходят под условие. Условие пишется в фигурных скобках <code>{ }</code>, а <code>$_</code> означает «текущий объект, который проверяется прямо сейчас». Запись <code>$_.CPU</code> — это свойство CPU у текущего объекта.</p><p>Условия строятся из <b>операторов сравнения</b>. Они начинаются с дефиса и являются сокращениями английских слов:</p><div class="tw"><table><tr><th>Оператор</th><th>Расшифровка</th><th>Значит</th></tr><tr><td><code>-eq</code></td><td>equal</td><td>равно</td></tr><tr><td><code>-ne</code></td><td>not equal</td><td>не равно</td></tr><tr><td><code>-gt</code></td><td>greater than</td><td>больше</td></tr><tr><td><code>-ge</code></td><td>greater or equal</td><td>больше или равно</td></tr><tr><td><code>-lt</code></td><td>less than</td><td>меньше</td></tr><tr><td><code>-le</code></td><td>less or equal</td><td>меньше или равно</td></tr><tr><td><code>-like</code></td><td>like</td><td>совпадает с шаблоном: <code>*</code> — любые символы, <code>?</code> — один символ</td></tr><tr><td><code>-match</code></td><td>match</td><td>совпадает с регулярным выражением</td></tr><tr><td><code>-and</code> <code>-or</code> <code>-not</code></td><td>and / or / not</td><td>«и», «или», «не» — для объединения условий</td></tr></table></div><p>Почему не <code>&gt;</code> и <code>==</code>? В PowerShell знак <code>&gt;</code> уже занят: он перенаправляет вывод в файл. Поэтому сравнения записываются словами.</p><p>Примеры: <code>$_.CPU -gt 50</code> — CPU больше 50; <code>$_.Status -eq "Running"</code> — статус равен Running; <code>$_.CPU -gt 50 -and $_.Name -like "u*"</code> — CPU больше 50 <b>и</b> имя начинается на u. Для строк регистр не важен. Есть и короткая запись без скобок: <code>Where-Object CPU -gt 50</code>.</p>',
        ex: ['Get-Service | Where-Object { $_.Status -eq "Running" }', 'Get-Process | Where-Object { $_.Name -like "s*" }'],
        task: 'Покажите процессы, у которых CPU больше 50.',
        h: 'Get-Process | Where-Object { $_.CPU -gt 50 }',
        ok: /where(-object)?\s*(\{[^}]*cpu\s*-gt|cpu\s+-gt)/i
      },
      {
        t: 'Переменные и массивы',
        th: '<p><b>Переменная</b> — именованная «ячейка» для значения. Имя начинается со знака <code>$</code>: <code>$name = "Admin"</code>. Чтобы использовать значение, просто пишете <code>$name</code>.</p><p><b>Кавычки.</b> В двойных кавычках имена переменных подставляются: <code>"Привет, $name"</code> даст «Привет, Admin». В одинарных кавычках текст остаётся как есть. Выражение можно вставить так: <code>"Сумма: $(2+3)"</code>.</p><p><b>Массив</b> — список значений. <code>1..5</code> — это диапазон «от 1 до 5», то есть массив 1, 2, 3, 4, 5. Что с ним можно делать:</p><ul><li><code>$nums.Count</code> — сколько в нём элементов;</li><li><code>$nums[0]</code> — первый элемент (нумерация идёт с нуля), <code>$nums[-1]</code> — последний;</li><li><code>$nums | ForEach-Object { $_ * 2 }</code> — выполнить действие для каждого элемента; <code>$_</code> здесь — текущий элемент.</li></ul><p>Результат любой команды тоже можно сохранить: <code>$svc = Get-Service</code>. Дальше с ним можно работать, не запуская команду заново.</p>',
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
        th: '<p><b>Путь</b> — адрес файла или папки. <code>C:\\Users\\Admin</code> — полный (абсолютный) путь. Относительный путь считается от текущей папки: <code>Documents\\notes.txt</code>. В пути <code>.</code> означает текущую папку, а <code>..</code> — папку уровнем выше.</p><p>Основные командлеты для файлов:</p><div class="tw"><table><tr><th>Командлет</th><th>Алиас</th><th>Что делает</th></tr><tr><td><code>Get-ChildItem</code></td><td>ls, dir</td><td>показывает содержимое папки</td></tr><tr><td><code>Set-Location</code></td><td>cd</td><td>переходит в другую папку</td></tr><tr><td><code>Get-Location</code></td><td>pwd</td><td>показывает, где вы сейчас</td></tr><tr><td><code>Get-Content</code></td><td>cat</td><td>читает файл построчно</td></tr><tr><td><code>Set-Content</code></td><td>sc</td><td>записывает текст в файл, <b>заменяя</b> старое содержимое</td></tr><tr><td><code>Add-Content</code></td><td>ac</td><td>добавляет текст в конец файла</td></tr><tr><td><code>New-Item</code></td><td>ni</td><td>создаёт файл или папку (<code>-ItemType Directory</code>)</td></tr><tr><td><code>Remove-Item</code></td><td>rm</td><td>удаляет файл или папку</td></tr></table></div><p>Ключ <code>-Recurse</code> (рекурсивно) заставляет командлет заходить и во вложенные папки. В списке файлов колонка <code>Mode</code> с буквой <code>d</code> означает папку, <code>Length</code> — размер в байтах.</p>',
        ex: ['Get-ChildItem', 'Get-Content Documents\\notes.txt', 'Get-ChildItem -Recurse', 'New-Item Scripts\\test.ps1'],
        task: 'Создайте файл hello.txt с любым текстом (Set-Content) и выведите его через Get-Content.',
        h: 'Set-Content hello.txt -Value "Привет"\nGet-Content hello.txt',
        ok: /(set-content|add-content|new-item)[^\n]*hello\.txt[\s\S]*(get-content|cat|type|gc)\s[^\n]*hello\.txt/i
      },
      {
        t: 'Условия и циклы',
        th: '<p><b>Цикл</b> повторяет действие для каждого элемента. Запись <code>foreach ($x in коллекция) { тело }</code> читается как «для каждого $x из коллекции выполни тело». На каждом шаге в <code>$x</code> лежит очередной элемент.</p><p><b>Условие</b> выполняет действие только если проверка верна: <code>if (условие) { делай это } else { иначе вот это }</code>. Блок <code>else</code> необязателен. В условии работают те же операторы, что в <code>Where-Object</code>: <code>-gt</code>, <code>-eq</code> и другие.</p><p>Несколько команд на одной строке разделяются точкой с запятой <code>;</code>. Цикл и условие можно вкладывать друг в друга, как в третьем примере ниже: «для каждого процесса, если CPU больше 100, показать имя».</p><p>Зачем это нужно: проверки, массовые действия (остановить десять служб), обход файлов. Без циклов и условий скрипт — просто список команд, с ними он принимает решения.</p>',
        ex: ['foreach ($i in 1..3) { Write-Host "Шаг $i" }', 'if (5 -gt 3) { "да" } else { "нет" }', 'foreach ($p in Get-Process) { if ($p.CPU -gt 100) { $p.Name } }'],
        task: 'Выведите числа от 1 до 5 циклом foreach.',
        h: 'foreach ($i in 1..5) { $i }',
        ok: /foreach\s*\(\s*\$\w+\s+in\s+1\.\.5/i
      },
      {
        t: 'Поиск по тексту и логам',
        th: '<p><b>Лог</b> (журнал) — файл, куда программа записывает свои события: что произошло и насколько это важно. В учебном логе три уровня: <code>INFO</code> — обычное сообщение, <code>WARN</code> — предупреждение, <code>ERROR</code> — ошибка.</p><p><code>Select-String</code> — это «поиск по тексту», аналог grep в Linux. Он показывает только строки, где найден шаблон. Шаблон — это <b>регулярное выражение</b>, то есть запись, описывающая текст; регистр не важен. Внутри шаблона символ <code>|</code> значит «или»: <code>"ERROR|WARN"</code> найдёт и ошибки, и предупреждения.</p><p>Две формы использования:</p><ul><li>по файлу: <code>Select-String -Pattern "ERROR" -Path Documents\\Logs\\app.log</code> (параметр <code>-Pattern</code> — что искать, <code>-Path</code> — где);</li><li>по тексту из конвейера: <code>Get-Content ...log | Select-String WARN</code>.</li></ul><p>Для файлов результат выглядит как <code>путь:номер_строки:текст</code>, поэтому сразу видно, где найдено совпадение. Так разбирают логи: ищут ошибки, неудачные входы, подозрительные адреса.</p>',
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
        th: '<p><b>Служба</b> — программа, которая работает в фоне без окна: печать, обновления, удалённый рабочий стол. У службы есть имя (<code>Name</code>), статус (<code>Status</code>: <code>Running</code> — работает, <code>Stopped</code> — остановлена) и тип запуска (<code>StartType</code>: <code>Automatic</code> — стартует сама, <code>Manual</code> — по требованию, <code>Disabled</code> — отключена).</p><ul><li><code>Get-Service</code> — список служб, <code>Get-Service -Name Spooler</code> — одна служба;</li><li><code>Start-Service</code> и <code>Stop-Service</code> — запустить и остановить;</li><li><code>Get-Process</code> и <code>Stop-Process</code> — то же для процессов; у каждого процесса есть номер <code>Id</code> (в Windows его называют PID).</li></ul><p><b>Зачем это для ИБ.</b> Каждая лишняя работающая служба — дополнительная точка, через которую можно атаковать систему (поверхность атаки). Например, служба печати <code>Spooler</code> несколько раз оказывалась уязвимой, а <code>RemoteRegistry</code> позволяет менять реестр удалённо. Поэтому всё ненужное на серверах отключают.</p>',
        ex: ['Get-Service', 'Get-Service -Name Spooler', 'Stop-Process -Name chrome'],
        task: 'Остановите службу Spooler, затем проверьте её статус через Get-Service.',
        h: 'Stop-Service Spooler\nGet-Service Spooler',
        ok: /stop-service\s+(-name\s+)?spooler[\s\S]*get-service/i
      },
      {
        t: 'Учётные записи',
        th: '<p><code>Get-LocalUser</code> показывает локальные учётные записи компьютера. Основные свойства: <code>Name</code> (имя), <code>Enabled</code> (включена ли), <code>LastLogon</code> (когда последний раз входили), <code>Description</code> (описание).</p><p>Свойство <code>Enabled</code> хранит логическое значение: <code>$true</code> — «истина» (включена) или <code>$false</code> — «ложь» (выключена). Поэтому фильтр пишется так: <code>Where-Object { $_.Enabled -eq $true }</code>.</p><p><b>Аудит учётных записей</b> — проверка, что в системе нет лишнего. На что смотрят специалисты по ИБ:</p><ul><li>включённые записи, которыми давно не пользуются (чужой может подобрать пароль незаметно);</li><li>включённая гостевая запись <code>Guest</code>;</li><li>служебные записи (например, <code>svc_backup</code>) со слишком широкими правами;</li><li>временные записи, которые забыли удалить.</li></ul>',
        ex: ['Get-LocalUser', 'Get-LocalUser | Where-Object { $_.Enabled -eq $true }'],
        task: 'Выведите только включённые учётные записи, отфильтровав по свойству Enabled.',
        h: 'Get-LocalUser | Where-Object { $_.Enabled -eq $true }',
        ok: /get-localuser[^\n]*where(-object)?[^\n]*enabled/i
      },
      {
        t: 'Журналы событий',
        th: '<p><b>Журнал событий</b> — системный «дневник» Windows: входы, запуск процессов, установка служб. У события есть время (<code>Time</code>), номер типа (<code>Id</code>), уровень (<code>Level</code>) и описание (<code>Message</code>). В реальной Windows читают через <code>Get-WinEvent</code>.</p><p>Запомните ключевые номера событий:</p><div class="tw"><table><tr><th>Id</th><th>Что произошло</th><th>Почему важно</th></tr><tr><td>4624</td><td>успешный вход</td><td>кто и когда зашёл в систему</td></tr><tr><td>4625</td><td>неудачный вход</td><td>серия за короткое время — признак подбора пароля</td></tr><tr><td>4688</td><td>запущен процесс</td><td>видно, что запускалось на машине</td></tr><tr><td>4672</td><td>вход с особыми привилегиями</td><td>вошёл администратор</td></tr><tr><td>7045</td><td>установлена служба</td><td>частый способ закрепиться в системе</td></tr></table></div><p>Для анализа пригодятся два командлета: <code>Group-Object Id</code> группирует события по номеру и показывает, сколько их каждого типа, а <code>Measure-Object</code> просто считает количество.</p>',
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
        th: '<p><b>Хэш-таблица</b> — набор пар «ключ → значение», как карточка с подписанными полями. Записывается так: <code>@{ Host = "srv01"; Port = 443 }</code>. Пары разделяются точкой с запятой.</p><p>Достать значение можно по ключу двумя способами: <code>$h.Port</code> или <code>$h["Port"]</code>.</p><p>Если добавить перед таблицей <code>[PSCustomObject]</code>, получится полноценный объект со своими свойствами, который выводится как таблица и работает в конвейере: <code>[PSCustomObject]@{ Name = "srv01"; Risk = "High" }</code>.</p><p>Зачем: собирать <b>отчёты</b> и результаты проверок в удобном виде. Например, для каждого найденного узла создавать объект с адресом и уровнем риска, а потом сортировать или фильтровать их так же, как процессы.</p>',
        ex: ['$h = @{ Host = "srv01"; Port = 443 }', '$h.Port', '[PSCustomObject]@{ Name = "srv01"; Risk = "High" }'],
        task: 'Создайте хэш-таблицу $h с ключами Host и Port, затем выведите значение $h.Port.',
        h: '$h = @{ Host = "srv01"; Port = 443 }\n$h.Port',
        ok: /\$h\s*=\s*@\{/i
      },
      {
        t: 'Функции',
        th: '<p><b>Функция</b> — именованный кусок кода, который можно вызывать много раз. Так не приходится копировать одни и те же команды. Записывается так: <code>function Имя($параметр) { тело }</code>.</p><ul><li><b>Параметры</b> в скобках — это «входные данные» функции. Можно задать несколько через запятую: <code>function Add($a, $b) { $a + $b }</code>.</li><li><b>Вызов</b> — как у обычного командлета: <code>Hello Admin</code> или <code>Hello -n Admin</code>.</li><li><b>Результат</b> — всё, что функция вывела, возвращается тому, кто её вызвал.</li></ul><p>Функции пригодятся, чтобы упаковывать свои проверки: например, функция, которая принимает число <code>$k</code> и показывает топ-<code>$k</code> процессов по CPU (см. третий пример). В учебной консоли функции живут до сброса или обновления страницы.</p>',
        ex: ['function Hello($n) { "Привет, $n" }', 'Hello Admin', 'function Top($k) { Get-Process | Sort-Object CPU -Descending | Select-Object -First $k }', 'Top 2'],
        task: 'Объявите функцию Hello с параметром $n, которая выводит приветствие, и вызовите её со своим именем.',
        h: 'function Hello($n) { "Привет, $n" }\nHello Admin',
        ok: /function\s+hello/i
      },
      {
        t: 'Обработка ошибок',
        th: '<p>Любая команда может завершиться <b>ошибкой</b>: файла нет, службы не существует, нет прав. Без обработки скрипт на этом падает. Конструкция <code>try / catch / finally</code> позволяет реагировать:</p><ul><li><code>try { ... }</code> — «попробуй выполнить это»;</li><li><code>catch { ... }</code> — «если случилась ошибка, выполни вот это»; внутри <code>$_</code> описывает ошибку, а текст ошибки лежит в <code>$_.Exception.Message</code>;</li><li><code>finally { ... }</code> — выполнится всегда, были ошибки или нет (например, для «уборки»);</li><li><code>throw "текст"</code> — вызвать ошибку вручную, если данные неверны.</li></ul><p>Зачем: скрипт, который обработал проблему и пошёл дальше, надёжнее скрипта, который падает на первой же. Особенно когда он обходит сотни компьютеров или файлов.</p>',
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
        th: '<p><b>TCP-соединение</b> — установленный между двумя программами канал обмена данными. <code>Get-NetTCPConnection</code> показывает их список:</p><ul><li><code>LocalAddress</code> / <code>LocalPort</code> — адрес и порт на вашей машине, <code>RemoteAddress</code> / <code>RemotePort</code> — на удалённой стороне;</li><li><code>State</code>: <code>Established</code> — соединение установлено, <code>Listen</code> — программа ждёт входящих подключений;</li><li><code>OwningProcess</code> — <code>Id</code> процесса, которому принадлежит соединение.</li></ul><p>Порт — «номер двери» сервиса. Известные: 443 — защищённый веб (HTTPS), 3389 — удалённый рабочий стол (RDP), 445 — общие папки Windows (SMB). Порт 4444 по умолчанию использует Metasploit, популярный инструмент тестирования на проникновение, поэтому такой порт у неизвестного процесса настораживает.</p><p>Как расследуют: <b>1)</b> найти подозрительное соединение, <b>2)</b> по <code>OwningProcess</code> определить процесс, <b>3)</b> оценить, нормален ли он. Результат команды в скобках даёт значение для другой команды: <code>(Get-NetTCPConnection -RemotePort 4444).OwningProcess</code>. Но порт — только повод проверить, а не доказательство взлома.</p>',
        ex: ['Get-NetTCPConnection', 'Get-NetTCPConnection -State Established', 'Get-Process -Id (Get-NetTCPConnection -RemotePort 4444).OwningProcess'],
        task: 'Найдите соединение на порт 4444 и определите процесс-владелец через Get-Process -Id.',
        h: 'Get-Process -Id (Get-NetTCPConnection -RemotePort 4444).OwningProcess',
        ok: /4444[\s\S]*get-process\s+-id/i
      },
      {
        t: 'Целостность и политики',
        th: '<p><b>Хэш</b> файла — короткая «контрольная сумма», вычисленная по его содержимому. У одинакового содержимого всегда одинаковый хэш, а изменение даже одного символа даёт совершенно другой. Поэтому хэши используют для проверки <b>целостности</b> (файл не подменили) и для поиска известных вредоносных файлов по базам хэшей. В учебной консоли <code>Get-FileHash</code> считает не настоящий SHA-256, а упрощённый отпечаток.</p><p><b>Политика выполнения</b> (<code>Get-ExecutionPolicy</code>) определяет, какие сценарии PowerShell разрешено запускать:</p><ul><li><code>Restricted</code> — сценарии запрещены, работают только отдельные команды;</li><li><code>RemoteSigned</code> — скачанные из интернета сценарии должны быть подписаны, свои запускаются свободно;</li><li><code>AllSigned</code> — разрешены только подписанные сценарии;</li><li><code>Unrestricted</code> — можно всё, лишь с предупреждением.</li></ul><p>Важно: это страховка от случайного запуска, а не защита от злоумышленника. Её легко обойти, поэтому полагаться только на неё нельзя.</p>',
        ex: ['Get-FileHash Documents\\notes.txt', 'Get-ExecutionPolicy'],
        task: 'Посчитайте хэш файла Documents\\notes.txt, затем узнайте политику выполнения скриптов.',
        h: 'Get-FileHash Documents\\notes.txt\nGet-ExecutionPolicy',
        ok: /get-filehash[\s\S]*get-executionpolicy/i
      },
      {
        t: 'Поиск секретов',
        th: '<p><b>Секрет</b> — это пароль, ключ доступа, токен. Частая проблема: люди оставляют их в обычных текстовых файлах (заметки, конфиги, скрипты). При аудите безопасности такие находки ищут в первую очередь.</p><p>Связка <code>Get-ChildItem -Recurse | Select-String -Pattern "password"</code> работает в три шага: «обойти все файлы и вложенные папки → прочитать каждый → показать строки со словом password». Шаблон можно расширить через «или»: <code>"password|passwd|secret|token"</code>.</p><p>Если секрет нашёлся: <b>1)</b> считать его скомпрометированным и сменить, <b>2)</b> убрать из файла и хранить в менеджере секретов, <b>3)</b> проверить, кто имел доступ к файлу. Одной лишь замены текста недостаточно, потому что копии могли остаться в архивах и истории изменений.</p>',
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
