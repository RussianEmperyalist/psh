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

/** Педагогический принцип: от простого к сложному; каждый новый синтаксический элемент объясняется до его использования. */
export const courseModules = [
  {
    name: 'Основы',
    level: 'Новичок',
    lessons: [
      {
        t: 'Командлеты и справка',
        th: '<h2>1. Что такое команда PowerShell</h2><p><b>PowerShell</b> — это командная оболочка и язык сценариев. С её помощью можно управлять файлами, папками, процессами, службами, пользователями и другими объектами системы.</p><p>Главная идея для новичка: <b>PowerShell не просто показывает текст — он работает с объектами</b>. Объект можно представить как «вещь» с данными о ней.</p><h2>2. Командлеты</h2><p>Основные команды PowerShell называются <b>командлетами (cmdlet)</b>. Обычно их имена состоят из двух частей:</p><pre><code>Глагол-Существительное</code></pre><ul><li><code>Get</code> — получить;</li><li><code>Set</code> — изменить;</li><li><code>New</code> — создать;</li><li><code>Remove</code> — удалить;</li><li><code>Start</code> — запустить;</li><li><code>Stop</code> — остановить.</li></ul><p>Например, <code>Get-Process</code> буквально означает «получить процессы», а <code>Get-Service</code> — «получить службы».</p><h2>3. Параметры</h2><p>После команды можно указать <b>параметры</b>. Они начинаются с дефиса.</p><pre><code>Get-Process -Name chrome</code></pre><p>Здесь <code>-Name</code> говорит команде, по какому имени искать процесс, а <code>chrome</code> — значение параметра.</p><h2>4. Как искать незнакомые команды</h2><p>Не нужно запоминать PowerShell целиком. Важнее научиться находить нужную информацию.</p><ul><li><code>Get-Command</code> — найти доступные команды.</li><li><code>Get-Help</code> — узнать, как работает команда.</li><li><code>Get-Member</code> — посмотреть свойства и методы полученных объектов.</li></ul><pre><code>Get-Command Get-*Get-Help Get-ProcessGet-Process | Get-Member</code></pre><div class="note"><b>Запомни:</b> если не знаешь команду — сначала ищи её через <code>Get-Command</code>. Если знаешь название, но не знаешь синтаксис — используй <code>Get-Help</code>.</div><h2>Мини-проверка понимания</h2><ul><li><code>Get-Process</code> — получить процессы.</li><li><code>-Name</code> — параметр.</li><li><code>Get-Help</code> — справка.</li><li><code>Get-Member</code> — изучение объектов.</li></ul>',
        ex: ['Get-Command', 'Get-Command Get-*', 'Get-Help Get-Process', 'Get-Process | Get-Member'],
        task: 'Получите справку по командлету Get-Service с помощью Get-Help.',
        h: 'Get-Help Get-Service',
        ok: /get-help\s+get-service/i
      },
      {
        t: 'Конвейер и объекты',
        th: '<h2>1. Сначала поймём объект</h2><p>Когда PowerShell выполняет <code>Get-Process</code>, результат — это не просто большой кусок текста. PowerShell получает объекты процессов.</p><p>У объекта есть <b>свойства</b>. Например, у процесса могут быть <code>Name</code>, <code>Id</code>, <code>CPU</code>, <code>WS</code> и другие свойства.</p><pre><code>$p = Get-Process</code></pre><p>Теперь в <code>$p</code> находятся полученные объекты процессов.</p><h2>2. Конвейер <code>|</code></h2><p>Символ <code>|</code> называется <b>конвейером</b>. Он передаёт результат команды слева следующей команде справа.</p><pre><code>Get-Process | Get-Member</code></pre><p>Читаем слева направо: «получи процессы → передай их в Get-Member → покажи, что умеют эти объекты».</p><h2>3. Сортировка</h2><p><code>Sort-Object</code> сортирует объекты по выбранному свойству.</p><pre><code>Get-Process | Sort-Object CPU</code></pre><p>Если нужно от большего к меньшему, используется <code>-Descending</code>:</p><pre><code>Get-Process | Sort-Object CPU -Descending</code></pre><h2>4. Выбор объектов</h2><p><code>Select-Object</code> может выбрать конкретные свойства или ограничить количество объектов.</p><pre><code>Get-Process | Select-Object Name,IdGet-Process | Select-Object -First 3</code></pre><p>Поэтому команда:</p><pre><code>Get-Process | Sort-Object CPU -Descending | Select-Object -First 3</code></pre><p>означает:</p><ol><li>получить процессы;</li><li>отсортировать их по CPU от большего к меньшему;</li><li>взять первые три.</li></ol><div class="note"><b>Главная мысль:</b> конвейер — это не «магический символ». Он просто передаёт результат одной команды следующей.</div>',
        ex: ['Get-Process | Sort-Object CPU -Descending', 'Get-Process | Select-Object Name,Id -First 3'],
        task: 'Выведите 3 процесса с наибольшей загрузкой CPU: Sort-Object по убыванию, затем Select-Object -First 3.',
        h: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 3',
        ok: /sort(-object)?[^|\n]*\|\s*select(-object)?[^|\n]*first\s+3/i
      },
      {
        t: 'Фильтрация',
        th: '<h2>1. Зачем нужна фильтрация</h2><p>Допустим, PowerShell получил 300 процессов, а нам нужны только процессы, у которых CPU больше 50. Выводить всё подряд неудобно. Для этого используется <code>Where-Object</code>.</p><pre><code>Get-Process | Where-Object { $_.CPU -gt 50 }</code></pre><h2>2. Разберём команду по частям</h2><ul><li><code>Get-Process</code> — получаем процессы.</li><li><code>|</code> — передаём их дальше.</li><li><code>Where-Object</code> — оставляем только подходящие объекты.</li><li><code>{ }</code> — внутри записываем условие.</li><li><code>$_</code> — текущий объект, который сейчас проверяется.</li><li><code>CPU</code> — свойство текущего объекта.</li><li><code>-gt</code> — «больше чем».</li><li><code>50</code> — значение для сравнения.</li></ul><p>То есть условие <code>$_.CPU -gt 50</code> можно прочитать так:</p><p><b>«У CPU текущего процесса значение больше 50?»</b></p><h2>3. Операторы сравнения</h2><table><tr><th>Оператор</th><th>Смысл</th><th>Пример</th></tr><tr><td><code>-eq</code></td><td>равно</td><td><code>$_.Name -eq \'explorer\'</code></td></tr><tr><td><code>-ne</code></td><td>не равно</td><td><code>$_.Name -ne \'explorer\'</code></td></tr><tr><td><code>-gt</code></td><td>больше</td><td><code>$_.CPU -gt 50</code></td></tr><tr><td><code>-ge</code></td><td>больше или равно</td><td><code>$_.CPU -ge 50</code></td></tr><tr><td><code>-lt</code></td><td>меньше</td><td><code>$_.CPU -lt 50</code></td></tr><tr><td><code>-le</code></td><td>меньше или равно</td><td><code>$_.CPU -le 50</code></td></tr></table><h2>4. Фильтрация по тексту</h2><pre><code>Get-Process | Where-Object { $_.Name -like \'chrome*\' }</code></pre><p><code>-like</code> сравнивает текст с шаблоном. Символ <code>*</code> означает «любое количество любых символов».</p><div class="note"><b>Не пытайся сразу запомнить всё.</b> На этом этапе достаточно уверенно понимать четыре вещи: <code>Where-Object</code> фильтрует, <code>{ }</code> содержит условие, <code>$_</code> — текущий объект, оператор сравнения говорит, что именно проверяем.</div>',
        ex: ['Get-Service | Where-Object { $_.Status -eq "Running" }', 'Get-Process | Where-Object { $_.Name -like "s*" }'],
        task: 'Покажите процессы, у которых CPU больше 50.',
        h: 'Get-Process | Where-Object { $_.CPU -gt 50 }',
        ok: /where(-object)?\s*(\{[^}]*cpu\s*-gt|cpu\s+-gt)/i
      },
      {
        t: 'Переменные и массивы',
        th: '<h2>1. Переменная</h2><p><b>Переменная</b> — это имя, под которым мы сохраняем значение, чтобы использовать его позже.</p><pre><code>$name = \'Vladimir\'</code></pre><p>Здесь <code>$name</code> — переменная, а справа находится значение. Знак <code>=</code> означает «запиши значение в переменную».</p><pre><code>$name</code></pre><p>Так мы получим сохранённое значение.</p><h2>2. В переменной может лежать объект</h2><p>В PowerShell переменная может содержать не только текст или число.</p><pre><code>$processes = Get-Process</code></pre><p>Теперь <code>$processes</code> содержит полученные объекты процессов.</p><h2>3. Массив</h2><p><b>Массив</b> — это набор нескольких значений.</p><pre><code>$numbers = 10,20,30</code></pre><p>Можно обратиться к отдельному элементу по индексу. В PowerShell нумерация начинается с <b>нуля</b>:</p><pre><code>$numbers[0]$numbers[1]</code></pre><p>Первый элемент — <code>[0]</code>, второй — <code>[1]</code>.</p><h2>4. Количество элементов</h2><pre><code>$numbers.Count</code></pre><p>Свойство <code>Count</code> показывает количество элементов.</p><h2>5. Практический пример</h2><pre><code>$svc = Get-Service | Where-Object { $_.Status -eq \'Running\' }$svc.Count</code></pre><p>Сначала мы сохраняем в <code>$svc</code> только работающие службы. Затем через <code>.Count</code> узнаём, сколько их получилось.</p><div class="note"><b>Важно:</b> переменная не обязательно хранит один элемент. В ней может находиться целая коллекция объектов.</div>',
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
        th: '<h2>1. Работа с файловой системой</h2><p>PowerShell позволяет получать список файлов, создавать их, читать и изменять содержимое.</p><p>Главная команда для просмотра содержимого папки — <code>Get-ChildItem</code>.</p><pre><code>Get-ChildItemGet-ChildItem Documents</code></pre><p>У этой команды есть распространённый алиас <code>ls</code>, но в учебных скриптах лучше привыкать к полным именам командлетов.</p><h2>2. Создание файла</h2><p><code>Set-Content</code> записывает текст в файл. Если файла нет, он будет создан.</p><pre><code>Set-Content hello.txt \'Hello PowerShell!\'</code></pre><h2>3. Чтение файла</h2><pre><code>Get-Content hello.txt</code></pre><p>Команда читает содержимое файла и выводит его.</p><h2>4. Полезная схема</h2><table><tr><th>Команда</th><th>Что делает</th></tr><tr><td><code>Get-ChildItem</code></td><td>показывает файлы и папки</td></tr><tr><td><code>Set-Content</code></td><td>записывает содержимое</td></tr><tr><td><code>Add-Content</code></td><td>добавляет содержимое</td></tr><tr><td><code>Get-Content</code></td><td>читает содержимое</td></tr></table><div class="note"><b>Правило:</b> перед изменением важных файлов сначала убедись, какой путь ты указал. Ошибка в пути может привести к работе не с тем объектом, который ты ожидал.</div>',
        ex: ['Get-ChildItem', 'Get-Content Documents\\notes.txt', 'Get-ChildItem -Recurse', 'New-Item Scripts\\test.ps1'],
        task: 'Создайте файл hello.txt с любым текстом (Set-Content) и выведите его через Get-Content.',
        h: 'Set-Content hello.txt -Value "Привет"\nGet-Content hello.txt',
        ok: /(set-content|add-content|new-item)[^\n]*hello\.txt[\s\S]*(get-content|cat|type|gc)\s[^\n]*hello\.txt/i
      },
      {
        t: 'Условия и циклы',
        th: '<h2>1. Условие</h2><p>Условие позволяет программе принять решение: если что-то верно — сделать одно, иначе — другое.</p><pre><code>if ($x -gt 10) {    \'Больше 10\'}</code></pre><p>Здесь PowerShell проверяет условие <code>$x -gt 10</code>. Если оно истинно, выполняется код внутри фигурных скобок.</p><h2>2. Вариант «иначе»</h2><pre><code>if ($x -gt 10) {    \'Больше 10\'} else {    \'10 или меньше\'}</code></pre><h2>3. Цикл foreach</h2><p>Цикл нужен, когда одно действие нужно выполнить для нескольких элементов.</p><pre><code>foreach ($n in 1..5) {    $n}</code></pre><p>Читаем: «для каждого <code>$n</code> из диапазона от 1 до 5 выполни код внутри <code>{ }</code>».</p><h2>4. Почему это полезно</h2><p>Без цикла пришлось бы писать одно и то же действие пять раз. С циклом мы описываем действие один раз и говорим PowerShell, для каких элементов его повторить.</p><div class="note"><b>Не путай:</b> <code>if</code> принимает решение, а <code>foreach</code> повторяет действие для элементов коллекции.</div>',
        ex: ['foreach ($i in 1..3) { Write-Host "Шаг $i" }', 'if (5 -gt 3) { "да" } else { "нет" }', 'foreach ($p in Get-Process) { if ($p.CPU -gt 100) { $p.Name } }'],
        task: 'Выведите числа от 1 до 5 циклом foreach.',
        h: 'foreach ($i in 1..5) { $i }',
        ok: /foreach\s*\(\s*\$\w+\s+in\s+1\.\.5/i
      },
      {
        t: 'Поиск по тексту и логам',
        th: '<h2>1. Зачем искать текст в логах</h2><p>Журналы и текстовые файлы могут содержать тысячи строк. Часто нас интересуют только строки с определённым словом, например <code>ERROR</code>.</p><h2>2. Get-Content</h2><pre><code>Get-Content Documents\\Logspp.log</code></pre><p>Команда получает строки файла.</p><h2>3. Передаём строки в Select-String</h2><pre><code>Get-Content Documents\\Logspp.log | Select-String \'ERROR\'</code></pre><p><code>Select-String</code> ищет совпадения в тексте.</p><h2>4. Что происходит по шагам</h2><ol><li><code>Get-Content</code> читает файл.</li><li><code>|</code> передаёт полученные строки дальше.</li><li><code>Select-String \'ERROR\'</code> оставляет строки, где найдено слово <code>ERROR</code>.</li></ol><div class="note"><b>Практическая идея:</b> поиск по логам — один из самых полезных навыков для администратора и специалиста по безопасности. Сначала получи данные, затем сузь результат до нужных строк.</div>',
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
        th: '<h2>1. Что такое служба</h2><p><b>Служба Windows</b> — это фоновый компонент системы или программы, который может запускаться автоматически и работать без открытого окна.</p><p>Посмотреть службы можно так:</p><pre><code>Get-Service</code></pre><h2>2. Состояние службы</h2><p>У службы есть свойство <code>Status</code>. Например, оно может быть <code>Running</code> — служба работает.</p><pre><code>Get-Service | Where-Object { $_.Status -eq \'Running\' }</code></pre><h2>3. Запуск и остановка</h2><pre><code>Start-Service -Name SpoolerStop-Service -Name Spooler</code></pre><p><b>Важно:</b> команды изменения состояния требуют соответствующих прав и могут повлиять на работу Windows или приложений. В учебной среде безопаснее сначала изучить службу через <code>Get-Service</code>.</p><h2>4. Проверка результата</h2><pre><code>Get-Service -Name Spooler</code></pre><p>После действия всегда полезно проверить фактическое состояние, а не предполагать, что команда выполнилась успешно.</p><div class="note"><b>Для ИБ:</b> список служб помогает понять, какие фоновые компоненты работают на компьютере. Неизвестная служба сама по себе не является доказательством вредоносности — её нужно исследовать.</div>',
        ex: ['Get-Service', 'Get-Service -Name Spooler', 'Stop-Process -Name chrome'],
        task: 'Остановите службу Spooler, затем проверьте её статус через Get-Service.',
        h: 'Stop-Service Spooler\nGet-Service Spooler',
        ok: /stop-service\s+(-name\s+)?spooler[\s\S]*get-service/i
      },
      {
        t: 'Учётные записи',
        th: '<h2>1. Что такое учётная запись</h2><p>Учётная запись Windows описывает пользователя, которому система может предоставлять права доступа.</p><p>В PowerShell сведения о локальных пользователях можно получать командой <code>Get-LocalUser</code>.</p><h2>2. Свойство Enabled</h2><p>У локальной учётной записи есть свойство <code>Enabled</code>. Оно показывает, включена ли учётная запись.</p><pre><code>Get-LocalUser | Where-Object { $_.Enabled -eq $true }</code></pre><h2>3. Почему фильтрация здесь важна</h2><p>Команда сначала получает всех локальных пользователей, затем <code>Where-Object</code> оставляет только тех, у кого <code>Enabled</code> равно <code>$true</code>.</p><h2>4. Что проверять при аудите</h2><ul><li>какие учётные записи существуют;</li><li>какие из них включены;</li><li>какие учётные записи имеют повышенные права;</li><li>есть ли неизвестные или ненужные учётные записи.</li></ul><div class="note"><b>Не делай поспешный вывод:</b> наличие неизвестной учётной записи — повод для проверки, но не автоматическое доказательство атаки.</div>',
        ex: ['Get-LocalUser', 'Get-LocalUser | Where-Object { $_.Enabled -eq $true }'],
        task: 'Выведите только включённые учётные записи, отфильтровав по свойству Enabled.',
        h: 'Get-LocalUser | Where-Object { $_.Enabled -eq $true }',
        ok: /get-localuser[^\n]*where(-object)?[^\n]*enabled/i
      },
      {
        t: 'Журналы событий',
        th: '<h2>1. Что такое журнал событий</h2><p>Windows записывает многие важные действия и ошибки в <b>Event Log</b>. Эти записи помогают понять, что происходило в системе.</p><h2>2. Поиск событий</h2><p>Для работы с журналами можно использовать <code>Get-WinEvent</code>.</p><pre><code>Get-WinEvent -LogName Security</code></pre><p>В журнале Security встречаются события, связанные с безопасностью. Например, <code>4625</code> обычно связано с неудачной попыткой входа.</p><h2>3. Фильтрация по идентификатору</h2><pre><code>Get-WinEvent -FilterHashtable @{    LogName = \'Security\'    Id = 4625}</code></pre><p>Здесь мы используем хэш-таблицу как набор условий: журнал должен быть Security, а идентификатор события — 4625.</p><h2>4. Подсчёт</h2><p>Чтобы посчитать количество полученных объектов, можно использовать <code>Measure-Object</code>:</p><pre><code>Get-WinEvent -FilterHashtable @{LogName=\'Security\'; Id=4625} |    Measure-Object</code></pre><div class="note"><b>Логика анализа:</b> получить события → отфильтровать нужные → посмотреть содержимое → при необходимости посчитать или сравнить их.</div>',
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
        th: '<h2>1. Хэш-таблица</h2><p><b>Хэш-таблица</b> хранит данные в виде пар <b>ключ → значение</b>. Это удобно, когда нужно обращаться к данным по понятному имени.</p><pre><code>$h = @{    Host = \'192.168.1.10\'    Port = 443}</code></pre><p>Здесь есть два ключа: <code>Host</code> и <code>Port</code>.</p><h2>2. Получение значения</h2><pre><code>$h.Port$h[\'Port\']</code></pre><p>Оба варианта обращаются к значению ключа <code>Port</code>.</p><h2>3. Почему это не обычный массив</h2><p>В массиве мы обычно обращаемся к элементу по индексу: <code>$array[0]</code>. В хэш-таблице мы можем обратиться по имени: <code>$h.Port</code>.</p><h2>4. Объекты</h2><p>PowerShell позволяет создавать собственные объекты. Это удобно, когда нужно собрать несколько связанных характеристик в одну структуру.</p><pre><code>$server = [PSCustomObject]@{    Host = \'server01\'    Port = 443}</code></pre><div class="note"><b>Главная разница:</b> хэш-таблица — удобное хранилище пар «ключ → значение». <code>PSCustomObject</code> — объект, который особенно удобно передавать по конвейеру и обрабатывать как обычный PowerShell-объект.</div>',
        ex: ['$h = @{ Host = "srv01"; Port = 443 }', '$h.Port', '[PSCustomObject]@{ Name = "srv01"; Risk = "High" }'],
        task: 'Создайте хэш-таблицу $h с ключами Host и Port, затем выведите значение $h.Port.',
        h: '$h = @{ Host = "srv01"; Port = 443 }\n$h.Port',
        ok: /\$h\s*=\s*@\{/i
      },
      {
        t: 'Функции',
        th: '<h2>1. Зачем нужна функция</h2><p>Если один и тот же набор команд приходится использовать несколько раз, его можно объединить в <b>функцию</b>.</p><pre><code>function Hello {    \'Привет!\'}</code></pre><p>После объявления функцию можно вызвать по имени:</p><pre><code>Hello</code></pre><h2>2. Параметр функции</h2><p>Параметр позволяет передавать функции данные извне.</p><pre><code>function Hello {    param($n)    "Привет, $n!"}</code></pre><p>Вызов:</p><pre><code>Hello \'Vladimir\'</code></pre><p>Внутри функции <code>$n</code> получает переданное значение.</p><h2>3. Почему функции важны</h2><ul><li>не приходится копировать один и тот же код;</li><li>код становится понятнее;</li><li>ошибки проще исправлять в одном месте;</li><li>функцию можно использовать с разными входными данными.</li></ul><div class="note"><b>Запомни:</b> объявление функции создаёт правило. Вызов функции запускает это правило.</div>',
        ex: ['function Hello($n) { "Привет, $n" }', 'Hello Admin', 'function Top($k) { Get-Process | Sort-Object CPU -Descending | Select-Object -First $k }', 'Top 2'],
        task: 'Объявите функцию Hello с параметром $n, которая выводит приветствие, и вызовите её со своим именем.',
        h: 'function Hello($n) { "Привет, $n" }\nHello Admin',
        ok: /function\s+hello/i
      },
      {
        t: 'Обработка ошибок',
        th: '<h2>1. Ошибка — это часть реальной работы</h2><p>Скрипт может столкнуться с отсутствующим файлом, недостатком прав, недоступным компьютером или другой проблемой. Хороший скрипт должен уметь обработать такую ситуацию.</p><h2>2. try и catch</h2><p><code>try</code> содержит код, который мы пытаемся выполнить. <code>catch</code> обрабатывает ошибку, если она возникла.</p><pre><code>try {    Get-Content \'not-found.txt\' -ErrorAction Stop}catch {    \'Файл не найден или возникла ошибка\'}</code></pre><h2>3. Зачем нужен ErrorAction Stop</h2><p>Некоторые ошибки PowerShell может считать некритичными и просто вывести сообщение. <code>-ErrorAction Stop</code> заставляет такую ошибку перейти в обработку <code>catch</code>.</p><h2>4. Что происходит</h2><ol><li>PowerShell входит в <code>try</code>.</li><li>Пытается прочитать файл.</li><li>Если возникает обрабатываемая ошибка, выполнение переходит в <code>catch</code>.</li><li>Код в <code>catch</code> сообщает или обрабатывает проблему.</li></ol><div class="note"><b>Хорошая практика:</b> не скрывай ошибки без причины. При анализе ИБ ошибка часто содержит важную информацию о состоянии системы.</div>',
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
        th: '<h2>1. Что такое сетевое соединение</h2><p>Программа может открывать сетевые соединения. При расследовании важно понять: <b>какой процесс</b> открыл соединение, <b>с каким адресом</b> и <b>на каком порту</b>.</p><h2>2. Получение TCP-соединений</h2><pre><code>Get-NetTCPConnection</code></pre><p>У результата есть свойства, например <code>LocalPort</code>, <code>RemoteAddress</code>, <code>RemotePort</code> и <code>OwningProcess</code>.</p><h2>3. Поиск нужного порта</h2><pre><code>Get-NetTCPConnection |    Where-Object { $_.RemotePort -eq 4444 }</code></pre><p>Здесь мы ищем соединения, у которых удалённый порт равен 4444.</p><h2>4. Как узнать процесс-владелец</h2><p>Свойство <code>OwningProcess</code> содержит идентификатор процесса. Его можно передать в <code>Get-Process</code>:</p><pre><code>$c = Get-NetTCPConnection | Where-Object { $_.RemotePort -eq 4444 }Get-Process -Id $c.OwningProcess</code></pre><div class="note"><b>Важно:</b> сам по себе необычный порт не означает наличие вредоносной программы. Нужно связать сетевую активность с процессом и затем исследовать этот процесс.</div>',
        ex: ['Get-NetTCPConnection', 'Get-NetTCPConnection -State Established', 'Get-Process -Id (Get-NetTCPConnection -RemotePort 4444).OwningProcess'],
        task: 'Найдите соединение на порт 4444 и определите процесс-владелец через Get-Process -Id.',
        h: 'Get-Process -Id (Get-NetTCPConnection -RemotePort 4444).OwningProcess',
        ok: /4444[\s\S]*get-process\s+-id/i
      },
      {
        t: 'Целостность и политики',
        th: '<h2>1. Что такое хэш файла</h2><p><b>Хэш</b> — это результат работы хэш-функции над данными файла. Его можно использовать как цифровой «отпечаток» содержимого.</p><p>Если содержимое файла изменилось, его хэш обычно тоже изменится.</p><h2>2. Получение хэша</h2><pre><code>Get-FileHash Documentsotes.txt</code></pre><p>Команда возвращает информацию о файле и его хэше.</p><h2>3. Зачем это нужно в ИБ</h2><p>Хэши помогают сравнивать файл с известным эталоном или фиксировать состояние файла на определённый момент времени.</p><h2>4. Политика выполнения</h2><p>PowerShell имеет механизм <b>Execution Policy</b>, который определяет правила обработки и запуска скриптов в конкретной среде.</p><pre><code>Get-ExecutionPolicyGet-ExecutionPolicy -List</code></pre><p><code>-List</code> позволяет увидеть политики на разных уровнях конфигурации, а не только итоговое значение.</p><div class="note"><b>Не путай:</b> хэш отвечает на вопрос «изменилось ли содержимое?», а Execution Policy — на вопрос «какие правила применяются к запуску PowerShell-скриптов?». Это разные механизмы.</div>',
        ex: ['Get-FileHash Documents\\notes.txt', 'Get-ExecutionPolicy'],
        task: 'Посчитайте хэш файла Documents\\notes.txt, затем узнайте политику выполнения скриптов.',
        h: 'Get-FileHash Documents\\notes.txt\nGet-ExecutionPolicy',
        ok: /get-filehash[\s\S]*get-executionpolicy/i
      },
      {
        t: 'Поиск секретов',
        th: '<h2>1. Что такое секрет</h2><p>Секретом может быть пароль, токен, ключ или другая строка, которую нельзя публиковать или оставлять в открытом виде.</p><h2>2. Поиск текста в файлах</h2><p>Для поиска по одному файлу можно использовать <code>Select-String</code>:</p><pre><code>Select-String -Path Documentsotes.txt -Pattern \'password\'</code></pre><h2>3. Рекурсивный поиск</h2><p>Если нужно проверить папку и её вложенные каталоги, используем <code>-Recurse</code>.</p><pre><code>Get-ChildItem Documents -File -Recurse |    Select-String -Pattern \'password\'</code></pre><p>Здесь сначала получаем все файлы внутри <code>Documents</code>, включая вложенные папки, затем передаём их в <code>Select-String</code> для поиска.</p><h2>4. Что важно понимать</h2><p>Поиск по слову <code>password</code> — только простой пример. Реальный аудит требует учитывать разные названия параметров, форматы конфигурации, регистр, ложные совпадения и контекст найденной строки.</p><div class="note"><b>Безопасность:</b> обнаруженный секрет не следует копировать в отчёт целиком. В учебном или рабочем отчёте обычно фиксируют факт обнаружения и безопасно маскируют само значение.</div>',
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
