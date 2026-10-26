(() => {
  // js/course/course-data.js
  var courseModules = [{"name":"Основы","level":"Новичок","lessons":[{"t":"Командлеты и справка","th":"<h2>1. Что такое PowerShell</h2>\n<p><b>PowerShell</b> — это инструмент, с помощью которого можно давать компьютеру команды: показывать процессы, искать файлы, проверять службы и автоматизировать повторяющиеся действия.</p>\n<p>Представь справочную стойку: ты задаёшь вопрос, а система возвращает сведения. Команда — это вопрос или действие, которое ты просишь выполнить.</p>\n<h2>2. Командлет: команда с понятным именем</h2>\n<p>Многие команды PowerShell называются <b>командлетами</b> (cmdlet). Обычно имя состоит из двух частей: действие и объект.</p>\n<ul><li><code>Get</code> — получить или показать;</li><li><code>Set</code> — установить или изменить;</li><li><code>New</code> — создать;</li><li><code>Remove</code> — удалить;</li><li><code>Start</code> — запустить;</li><li><code>Stop</code> — остановить.</li></ul>\n<pre><code>Get-Process\nGet-Service</code></pre>\n<p>Первую команду можно прочитать как «получи список процессов», вторую — «получи список служб».</p>\n<h2>3. Параметры: уточняем запрос</h2>\n<p>Параметр начинается с дефиса и уточняет, что именно нужно команде. Значение после параметра объясняет, что искать или какое действие выполнить.</p>\n<pre><code>Get-Process -Name notepad</code></pre>\n<ul><li><code>Get-Process</code> — получить процессы;</li><li><code>-Name</code> — искать по имени;</li><li><code>notepad</code> — нужное имя.</li></ul>\n<h2>4. Если команда незнакома</h2>\n<pre><code>Get-Command\nGet-Command Get-*\nGet-Help Get-Process</code></pre>\n<p><code>Get-Command</code> показывает доступные команды. Шаблон <code>Get-*</code> означает «имена, начинающиеся с Get-». <code>Get-Help</code> открывает справку о команде.</p>\n<p><b>Запомни:</b> незнакомо название — ищи через <code>Get-Command</code>; название знаешь, но не понимаешь параметры — смотри <code>Get-Help</code>.</p>\n<div class=\"note\"><b>Важно:</b> в учебной консоли этого сайта команды выполняются в симуляторе. Это не полноценная консоль Windows.</div>","ex":["Get-Command","Get-Command Get-*","Get-Help Get-Process","Get-Process | Get-Member"],"task":"Получите справку по командлету Get-Service с помощью Get-Help.","h":"Get-Help Get-Service","ok":/get-help\s+get-service/i},{"t":"Конвейер и объекты","th":"<h2>1. Что такое объект</h2>\n<p>PowerShell умеет работать не только с готовым текстом, но и с <b>объектами</b>. Объект — это запись о какой-либо вещи, у которой есть данные.</p>\n<p>Например, объект процесса похож на карточку: имя процесса, его идентификатор и другие характеристики. Эти характеристики называются <b>свойствами</b>.</p>\n<pre><code>Get-Process</code></pre>\n<p>Команда получает объекты процессов. Условно представь список карточек, по одной на каждый процесс.</p>\n<h2>2. Конвейер <code>|</code></h2>\n<p>Вертикальная черта называется <b>конвейером</b>. Она передаёт результат команды слева следующей команде справа. Как лента на производстве: первый этап подготовил детали, следующий их обработал.</p>\n<pre><code>Get-Process | Get-Member</code></pre>\n<p>Сначала получаем процессы, затем передаём их в <code>Get-Member</code>, чтобы изучить свойства и методы объектов.</p>\n<h2>3. Сортировка</h2>\n<p><code>Sort-Object</code> упорядочивает объекты по выбранному свойству.</p>\n<pre><code>Get-Process | Sort-Object Name\nGet-Process | Sort-Object CPU -Descending</code></pre>\n<p>Первая команда сортирует по имени. Параметр <code>-Descending</code> меняет порядок на обратный — от большего к меньшему для чисел.</p>\n<h2>4. Выбираем нужные данные</h2>\n<p><code>Select-Object</code> позволяет оставить нужные свойства или ограничить число результатов.</p>\n<pre><code>Get-Process | Select-Object Name, Id\nGet-Process | Select-Object -First 3</code></pre>\n<p>В первом примере оставляем имя и идентификатор. Во втором берём первые три объекта.</p>\n<h2>5. Собираем цепочку</h2>\n<pre><code>Get-Process | Sort-Object CPU -Descending | Select-Object -First 3</code></pre>\n<ol><li>Получить процессы.</li><li>Расположить их по CPU от большего к меньшему.</li><li>Оставить первые три.</li></ol>\n<div class=\"note\"><b>Главная идея:</b> читай конвейер слева направо. Каждая команда получает результат предыдущего шага и делает с ним что-то своё.</div>","ex":["Get-Process | Sort-Object CPU -Descending","Get-Process | Select-Object Name,Id -First 3"],"task":"Выведите 3 процесса с наибольшей загрузкой CPU: Sort-Object по убыванию, затем Select-Object -First 3.","h":"Get-Process | Sort-Object CPU -Descending | Select-Object -First 3","ok":/sort(-object)?[^|\n]*\|\s*select(-object)?[^|\n]*first\s+3/i},{"t":"Фильтрация","th":"<h2>1. Зачем нужна фильтрация</h2>\n<p>Иногда результатов слишком много. Например, система показывает десятки процессов, а тебе нужны только те, которые подходят условию. <b>Фильтрация</b> — это отбор нужных элементов из общего списка.</p>\n<h2>2. Команда Where-Object</h2>\n<pre><code>Get-Process | Where-Object { $_.CPU -gt 50 }</code></pre>\n<p>Читаем по шагам:</p>\n<ul><li><code>Get-Process</code> получает процессы;</li><li><code>|</code> передаёт их дальше;</li><li><code>Where-Object</code> оставляет подходящие объекты;</li><li><code>{ }</code> обрамляют условие;</li><li><code>$_</code> означает «объект, который проверяется прямо сейчас»;</li><li><code>.CPU</code> обращается к свойству CPU этого объекта;</li><li><code>-gt 50</code> означает «больше 50».</li></ul>\n<p>Иными словами: «Оставь процессы, у которых значение CPU больше 50».</p>\n<h2>3. Операторы сравнения</h2>\n<table><tr><th>Оператор</th><th>Простое значение</th><th>Пример</th></tr><tr><td><code>-eq</code></td><td>равно</td><td><code>$_.Status -eq 'Running'</code></td></tr><tr><td><code>-ne</code></td><td>не равно</td><td><code>$_.Name -ne 'notepad'</code></td></tr><tr><td><code>-gt</code></td><td>больше</td><td><code>$_.CPU -gt 50</code></td></tr><tr><td><code>-ge</code></td><td>больше или равно</td><td><code>$_.CPU -ge 50</code></td></tr><tr><td><code>-lt</code></td><td>меньше</td><td><code>$_.CPU -lt 50</code></td></tr><tr><td><code>-le</code></td><td>меньше или равно</td><td><code>$_.CPU -le 50</code></td></tr></table>\n<h2>4. Поиск по шаблону</h2>\n<pre><code>Get-Process | Where-Object { $_.Name -like 's*' }</code></pre>\n<p><code>-like</code> сравнивает текст с шаблоном. Звёздочка <code>*</code> означает «любое количество символов». В примере отбираются имена, начинающиеся с буквы s.</p>\n<div class=\"note\"><b>Для начала запомни три вещи:</b> <code>Where-Object</code> фильтрует; <code>$_</code> — текущий объект; оператор вроде <code>-eq</code> или <code>-gt</code> задаёт правило проверки.</div>","ex":["Get-Service | Where-Object { $_.Status -eq \"Running\" }","Get-Process | Where-Object { $_.Name -like \"s*\" }"],"task":"Покажите процессы, у которых CPU больше 50.","h":"Get-Process | Where-Object { $_.CPU -gt 50 }","ok":/where(-object)?\s*(\{[^}]*cpu\s*-gt|cpu\s+-gt)/i},{"t":"Переменные и массивы","th":"<h2>1. Переменная — именованное хранилище</h2>\n<p>Переменная позволяет сохранить значение и обратиться к нему позже. Представь коробку с наклейкой: наклейка — имя переменной, содержимое коробки — значение.</p>\n<pre><code>$name = 'Alex'\n$name</code></pre>\n<p>Знак <code>$</code> используется в имени переменной. Знак <code>=</code> здесь означает «сохрани справа в переменную слева».</p>\n<h2>2. Что можно хранить</h2>\n<p>Переменная может хранить текст, число, один объект или целый набор объектов.</p>\n<pre><code>$age = 25\n$processes = Get-Process</code></pre>\n<p>В первом примере хранится число. Во втором — результат команды получения процессов.</p>\n<h2>3. Массив — несколько значений вместе</h2>\n<p><b>Массив</b> — это набор элементов под одним именем.</p>\n<pre><code>$numbers = 10, 20, 30\n$numbers[0]\n$numbers[1]</code></pre>\n<p>Номер элемента называется <b>индексом</b>. В PowerShell отсчёт начинается с нуля: <code>[0]</code> — первый элемент, <code>[1]</code> — второй.</p>\n<h2>4. Сколько элементов в наборе</h2>\n<pre><code>$numbers.Count</code></pre>\n<p>Свойство <code>Count</code> показывает количество элементов. Точка перед <code>Count</code> означает обращение к свойству переменной.</p>\n<h2>5. Пример с реальными данными</h2>\n<pre><code>$svc = Get-Service | Where-Object { $_.Status -eq 'Running' }\n$svc.Count</code></pre>\n<p>Первая строка получает работающие службы и сохраняет их в <code>$svc</code>. Вторая показывает, сколько элементов оказалось в наборе.</p>\n<div class=\"note\"><b>Типичная ошибка:</b> путать имя переменной и текст. <code>$name</code> — обращение к переменной, а <code>'$name'</code> в одинарных кавычках — буквальный текст.</div>","ex":["$name = \"Admin\"","\"Привет, $name\"","$nums = 1..5","$nums | ForEach-Object { $_ * 2 }"],"task":"Сохраните запущенные службы в переменную $svc (Where-Object, Status -eq Running), затем выведите $svc.Count.","h":"$svc = Get-Service | Where-Object { $_.Status -eq \"Running\" }\n$svc.Count","ok":/\$svc\s*=.*running[\s\S]*\$svc\.count/i}]},{"name":"Файлы и скрипты","level":"Базовый","lessons":[{"t":"Файлы и папки","th":"<h2>1. Файлы и папки — часть файловой системы</h2>\n<p>Папка может содержать другие папки и файлы. Путь показывает, где именно находится объект. Например, <code>Documents\\notes.txt</code> означает файл <code>notes.txt</code> внутри папки <code>Documents</code> относительно текущего расположения.</p>\n<h2>2. Посмотреть содержимое папки</h2>\n<pre><code>Get-ChildItem\nGet-ChildItem Documents</code></pre>\n<p><code>Get-ChildItem</code> выводит список объектов в текущей папке. Если указать <code>Documents</code>, команда покажет содержимое этой папки.</p>\n<h2>3. Создать или заменить содержимое файла</h2>\n<pre><code>Set-Content hello.txt -Value 'Привет!'\nGet-Content hello.txt</code></pre>\n<p><code>Set-Content</code> записывает содержимое в файл и создаёт файл, если его нет. Если файл уже существует, его прежнее содержимое обычно заменяется. <code>Get-Content</code> читает содержимое.</p>\n<h2>4. Добавить текст, не заменяя старый</h2>\n<pre><code>Add-Content hello.txt -Value 'Ещё одна строка'\nGet-Content hello.txt</code></pre>\n<p><code>Add-Content</code> добавляет данные в конец файла. Это отличие важно: <code>Set-Content</code> заменяет содержимое, а <code>Add-Content</code> дополняет его.</p>\n<h2>5. Создать новый объект</h2>\n<pre><code>New-Item -ItemType Directory -Name Scripts\nNew-Item -ItemType File -Name test.txt</code></pre>\n<p>Здесь создаётся папка, а затем файл. Доступность и точное поведение зависят от текущего пути и прав.</p>\n<div class=\"note\"><b>Правило безопасности:</b> перед записью или удалением всегда проверяй путь. Не запускай команды изменения на важных данных, пока не уверен, что понимаешь их действие.</div>","ex":["Get-ChildItem","Get-Content Documents\\notes.txt","Get-ChildItem -Recurse","New-Item -ItemType File -Path Documents\\Scripts\\test.ps1"],"task":"Создайте файл hello.txt с любым текстом (Set-Content) и выведите его через Get-Content.","h":"Set-Content hello.txt -Value \"Привет\"\nGet-Content hello.txt","ok":/(set-content|add-content|new-item)[^\n]*hello\.txt[\s\S]*(get-content|cat|type|gc)\s[^\n]*hello\.txt/i},{"t":"Условия и циклы","th":"<h2>1. Условие помогает программе выбирать</h2>\n<p>В жизни мы говорим: «если идёт дождь, возьми зонт; иначе выходи без него». В коде решение задаёт конструкция <code>if</code>.</p>\n<pre><code>$x = 12\nif ($x -gt 10) {\n    'Число больше 10'\n}</code></pre>\n<p>Условие находится в круглых скобках. Если оно истинно, выполняется команда внутри фигурных скобок.</p>\n<h2>2. Вариант «иначе»</h2>\n<pre><code>if ($x -gt 10) {\n    'Больше 10'\n} else {\n    '10 или меньше'\n}</code></pre>\n<p><code>else</code> задаёт действие на случай, если условие не выполнилось.</p>\n<h2>3. Повторение с помощью цикла</h2>\n<p>Цикл полезен, когда нужно повторить действие несколько раз. <code>foreach</code> перебирает элементы набора по одному.</p>\n<pre><code>foreach ($n in 1..5) {\n    $n\n}</code></pre>\n<p><code>1..5</code> — диапазон чисел от 1 до 5. На каждом шаге очередное число помещается в переменную <code>$n</code>, а код в фигурных скобках выполняется снова.</p>\n<h2>4. Условие внутри цикла</h2>\n<pre><code>foreach ($n in 1..5) {\n    if ($n -gt 3) {\n        $n\n    }\n}</code></pre>\n<p>Цикл перебирает числа, а условие выводит только числа больше трёх: 4 и 5.</p>\n<h2>5. Как не запутаться</h2>\n<ul><li><code>if</code> — принять решение;</li><li><code>else</code> — сделать другое, если условие ложно;</li><li><code>foreach</code> — повторить действие для каждого элемента;</li><li><code>{ }</code> — обозначают блок кода.</li></ul>\n<div class=\"note\"><b>Совет:</b> сначала попробуй маленький диапазон и простое условие. Увеличивай сложность только после того, как понимаешь каждый шаг.</div>","ex":["foreach ($i in 1..3) { Write-Host \"Шаг $i\" }","if (5 -gt 3) { \"да\" } else { \"нет\" }","foreach ($p in Get-Process) { if ($p.CPU -gt 100) { $p.Name } }"],"task":"Выведите числа от 1 до 5 циклом foreach.","h":"foreach ($i in 1..5) { $i }","ok":/foreach\s*\(\s*\$\w+\s+in\s+1\.\.5/i},{"t":"Поиск по тексту и логам","th":"<h2>1. Что такое журнал и зачем его читать</h2>\n<p>Программы и операционная система могут записывать сообщения о своей работе. Такой набор записей называют <b>журналом</b> или логом. В нём могут быть обычные сообщения, предупреждения и ошибки.</p>\n<p>Когда журнал содержит тысячи строк, искать вручную неудобно. PowerShell помогает найти только строки с нужным словом.</p>\n<h2>2. Прочитать текстовый файл</h2>\n<pre><code>Get-Content 'Documents\\Logs\\app.log'</code></pre>\n<p><code>Get-Content</code> читает файл построчно. Путь в кавычках — это текстовое имя расположения файла. Если путь в твоей системе другой, замени его на существующий.</p>\n<h2>3. Найти строки с определённым словом</h2>\n<pre><code>Select-String -Pattern 'ERROR' -Path 'Documents\\Logs\\app.log'</code></pre>\n<p><code>Select-String</code> ищет совпадения в файле. <code>-Pattern</code> задаёт искомый текст, а <code>-Path</code> — файл, в котором нужно искать.</p>\n<h2>4. Соединяем чтение и поиск</h2>\n<pre><code>Get-Content 'Documents\\Logs\\app.log' | Select-String 'ERROR'</code></pre>\n<ol><li>Прочитать строки файла.</li><li>Передать строки через конвейер.</li><li>Оставить совпадения со словом <code>ERROR</code>.</li></ol>\n<h2>5. Ищем и другие сообщения</h2>\n<pre><code>Select-String -Pattern 'WARN' -Path 'Documents\\Logs\\app.log'\nSelect-String -Pattern 'timeout' -Path 'Documents\\Logs\\app.log'</code></pre>\n<p>Можно искать разные слова: например, предупреждения или сообщения о тайм-ауте. Результат зависит от того, что действительно записано в файле.</p>\n<div class=\"note\"><b>Важно:</b> если файл не найден, сначала проверь путь и имя файла. Отсутствие результатов поиска не обязательно означает ошибку — искомого слова может не быть в журнале.</div>","ex":["Get-Content Documents\\Logs\\app.log","Select-String -Pattern \"ERROR\" -Path Documents\\Logs\\app.log","Get-Content Documents\\Logs\\app.log | Select-String WARN"],"task":"Найдите в Documents\\Logs\\app.log строки со словом ERROR.","h":"Select-String -Pattern ERROR -Path Documents\\Logs\\app.log","ok":/select-string[^\n]*error/i}]},{"name":"Администрирование","level":"Средний","lessons":[{"t":"Службы и процессы","th":"<h2>1. Что такое процесс</h2>\n<p><b>Процесс</b> — это запущенный экземпляр программы. Например, открытый браузер обычно создаёт один или несколько процессов.</p>\n<pre><code>Get-Process\nGet-Process -Name notepad</code></pre>\n<p>Первая команда показывает процессы, вторая пытается найти процесс по имени.</p>\n<h2>2. Что такое служба</h2>\n<p><b>Служба Windows</b> — это компонент, который может работать в фоне, часто без обычного окна программы. Например, службы помогают выполнять системные задачи.</p>\n<pre><code>Get-Service\nGet-Service -Name Spooler</code></pre>\n<p>Свойство <code>Status</code> показывает состояние службы. <code>Running</code> означает, что она работает; <code>Stopped</code> — остановлена.</p>\n<h2>3. Отобрать работающие службы</h2>\n<pre><code>Get-Service | Where-Object { $_.Status -eq 'Running' }</code></pre>\n<p>Команда получает службы и оставляет только те, у которых свойство <code>Status</code> равно <code>Running</code>.</p>\n<h2>4. Запуск и остановка требуют осторожности</h2>\n<pre><code>Start-Service -Name Spooler\nStop-Service -Name Spooler</code></pre>\n<p>Эти команды меняют состояние службы и могут требовать прав администратора. Не останавливай неизвестные службы: от них могут зависеть Windows или приложения. В начале обучения достаточно научиться читать состояние и проверять результат.</p>\n<h2>5. Проверяем, что произошло</h2>\n<pre><code>Get-Service -Name Spooler</code></pre>\n<p>После любого изменения проверяй фактическое состояние, а не предполагай, что команда сработала.</p>\n<div class=\"note\"><b>Разница:</b> процесс — запущенная программа; служба — фоновый компонент, управляемый системой. Иногда служба использует процесс, но это не одно и то же.</div>","ex":["Get-Service","Get-Service -Name Spooler","Stop-Process -Name chrome"],"task":"Остановите службу Spooler, затем проверьте её статус через Get-Service.","h":"Stop-Service Spooler\nGet-Service Spooler","ok":/stop-service\s+(-name\s+)?spooler[\s\S]*get-service/i},{"t":"Учётные записи","th":"<h2>1. Что такое учётная запись</h2>\n<p>Учётная запись — это идентичность пользователя или системы, от имени которой выполняются действия. У неё могут быть имя, идентификатор и права доступа.</p>\n<p>В Windows важно различать обычную учётную запись и права администратора: администратор может выполнять больше системных действий, но это не означает, что каждую команду нужно запускать с повышенными правами.</p>\n<h2>2. Принцип минимальных прав</h2>\n<p>Безопаснее работать с минимальным набором разрешений, необходимым для задачи. Это уменьшает последствия случайной ошибки или вредоносной команды.</p>\n<h2>3. Изучаем данные, прежде чем менять их</h2>\n<p>В настоящем PowerShell доступные команды для учётных записей зависят от версии Windows, установленных модулей и прав. Сначала выясни, какие команды доступны:</p>\n<pre><code>Get-Command *LocalUser*\nGet-Help Get-LocalUser</code></pre>\n<p>Если команда доступна, сведения о локальных пользователях можно получить с помощью <code>Get-LocalUser</code>. На некоторых системах нужный модуль может отсутствовать.</p>\n<h2>4. Почему нельзя бездумно менять пользователей</h2>\n<p>Создание, отключение или изменение учётных записей влияет на доступ к компьютеру и данным. Такие действия выполняй только на системе, которой ты вправе управлять, и только после проверки цели и команды.</p>\n<h2>5. Практический порядок действий</h2>\n<ol><li>Уточни, какую информацию нужно получить.</li><li>Найди соответствующую команду через <code>Get-Command</code>.</li><li>Прочитай справку через <code>Get-Help</code>.</li><li>Сначала выполни безопасный просмотр.</li><li>Изменяй настройки только при наличии разрешения и понимания последствий.</li></ol>\n<div class=\"note\"><b>Для новичка:</b> пока цель — научиться находить команды и понимать права. Не экспериментируй с реальными пользовательскими учётными записями на рабочем компьютере.</div>","ex":["Get-LocalUser","Get-LocalUser | Where-Object { $_.Enabled -eq $true }"],"task":"Выведите только включённые учётные записи, отфильтровав по свойству Enabled.","h":"Get-LocalUser | Where-Object { $_.Enabled -eq $true }","ok":/get-localuser[^\n]*where(-object)?[^\n]*enabled/i},{"t":"Журналы событий","th":"<h2>1. Что такое журнал событий Windows</h2>\n<p>Windows записывает некоторые события в системные журналы: запуск служб, ошибки приложений, предупреждения и другие важные ситуации. Это помогает выяснить, что происходило на компьютере.</p>\n<h2>2. Посмотреть доступные события</h2>\n<pre><code>Get-Command Get-WinEvent\nGet-Help Get-WinEvent</code></pre>\n<p>Сначала проверяем, доступна ли команда, и читаем справку. <code>Get-WinEvent</code> используется в настоящем PowerShell для получения событий из журналов.</p>\n<h2>3. Получить события из системного журнала</h2>\n<pre><code>Get-WinEvent -LogName System -MaxEvents 10</code></pre>\n<p><code>-LogName System</code> указывает журнал, а <code>-MaxEvents 10</code> ограничивает количество результатов десятью. Ограничение помогает не выводить слишком много данных.</p>\n<h2>4. Сузить результаты</h2>\n<pre><code>Get-WinEvent -LogName System -MaxEvents 50 | Select-Object TimeCreated, Id, LevelDisplayName, Message</code></pre>\n<p><code>Select-Object</code> оставляет только удобные для чтения поля: время, идентификатор, уровень и сообщение события.</p>\n<h2>5. Как читать событие</h2>\n<ul><li><b>TimeCreated</b> — когда событие произошло;</li><li><b>Id</b> — числовой идентификатор типа события;</li><li><b>LevelDisplayName</b> — уровень, например ошибка или предупреждение;</li><li><b>Message</b> — текстовое описание.</li></ul>\n<p>Одна ошибка не всегда означает серьёзную неисправность. Смотри на время, сообщение и другие события рядом, прежде чем делать выводы.</p>\n<div class=\"note\"><b>Примечание:</b> чтение некоторых журналов может зависеть от прав пользователя. Учебный симулятор сайта не подключается к реальному журналу Windows.</div>","ex":["Get-WinEvent -MaxEvents 3","Get-WinEvent | Where-Object { $_.Id -eq 4625 }","Get-WinEvent | Group-Object Id"],"task":"Найдите события 4625 и подсчитайте их через Measure-Object.","h":"Get-WinEvent | Where-Object { $_.Id -eq 4625 } | Measure-Object","ok":/4625[^\n]*\|\s*measure/i}]},{"name":"Автоматизация","level":"Продвинутый","lessons":[{"t":"Хэш-таблицы и свои объекты","th":"<h2>1. Что такое хэш-таблица</h2>\n<p>Хэш-таблица хранит данные в виде пар «ключ — значение». Представь телефонную книгу: имя человека — ключ, номер телефона — значение. По ключу можно быстро обратиться к связанным данным.</p>\n<pre><code>$user = @{\n    Name = 'Alex'\n    Role = 'Student'\n}\n$user</code></pre>\n<p>Здесь <code>Name</code> и <code>Role</code> — ключи, а строки справа — значения. Конструкция <code>@{ }</code> создаёт хэш-таблицу.</p>\n<h2>2. Получить значение</h2>\n<pre><code>$user['Name']\n$user.Role</code></pre>\n<p>К значению можно обратиться через ключ в квадратных скобках или через точку и имя ключа. Оба примера возвращают имя.</p>\n<h2>3. Изменить или добавить значение</h2>\n<pre><code>$user.Role = 'Admin'\n$user['City'] = 'Helsinki'</code></pre>\n<p>Первая строка меняет значение существующего ключа, вторая добавляет новый ключ и значение.</p>\n<h2>4. Свои объекты</h2>\n<p>Иногда удобно создать объект с именованными свойствами, чтобы данные выглядели как одна запись.</p>\n<pre><code>$person = [PSCustomObject]@{\n    Name = 'Alex'\n    Age = 25\n}\n$person</code></pre>\n<p><code>[PSCustomObject]</code> просит PowerShell представить набор полей как объект. Это полезно для создания аккуратных структурированных результатов.</p>\n<h2>5. Когда что использовать</h2>\n<ul><li>Массив — когда важен упорядоченный список элементов.</li><li>Хэш-таблица — когда нужно находить значение по ключу.</li><li>Объект — когда удобно представить одну сущность с именованными свойствами.</li></ul>\n<div class=\"note\"><b>Не зубри синтаксис:</b> сначала спроси себя, какие данные хранишь и как будешь к ним обращаться.</div>","ex":["$h = @{ Host = \"srv01\"; Port = 443 }","$h.Port","[PSCustomObject]@{ Name = \"srv01\"; Risk = \"High\" }"],"task":"Создайте хэш-таблицу $h с ключами Host и Port, затем выведите значение $h.Port.","h":"$h = @{ Host = \"srv01\"; Port = 443 }\n$h.Port","ok":/\$h\s*=\s*@\{/i},{"t":"Функции","th":"<h2>1. Зачем нужны функции</h2>\n<p>Если один и тот же набор команд приходится повторять, его можно оформить в <b>функцию</b>. Функция — это именованный блок кода, который можно вызвать по имени.</p>\n<pre><code>function Say-Hello {\n    'Привет!'\n}\nSay-Hello</code></pre>\n<p>Сначала мы объявляем функцию, затем вызываем её. Само объявление описывает, что делать; вызов запускает это действие.</p>\n<h2>2. Параметры функции</h2>\n<p>Параметр позволяет передать функции данные, чтобы она работала не только с одним фиксированным значением.</p>\n<pre><code>function Say-Hello {\n    param($Name)\n    \"Привет, $Name!\"\n}\nSay-Hello -Name 'Alex'</code></pre>\n<p><code>param($Name)</code> объявляет параметр. При вызове мы передаём значение <code>Alex</code>, которое становится доступно внутри функции через <code>$Name</code>.</p>\n<h2>3. Вернуть результат</h2>\n<pre><code>function Add-Numbers {\n    param($A, $B)\n    $A + $B\n}\nAdd-Numbers -A 2 -B 3</code></pre>\n<p>Результатом вызова будет число 5. В PowerShell выражения, выведенные внутри функции, попадают в её вывод. Ключевое слово <code>return</code> тоже существует, но для простых примеров оно не всегда обязательно.</p>\n<h2>4. Имена и повторное использование</h2>\n<p>Выбирай имя, которое описывает действие, например <code>Get-Report</code> или <code>Say-Hello</code>. Хорошая функция выполняет понятную задачу и не делает неожиданных изменений.</p>\n<h2>5. Как проверить функцию</h2>\n<ol><li>Объяви функцию.</li><li>Вызови её с простыми данными.</li><li>Сравни полученный результат с ожидаемым.</li><li>Попробуй другое значение параметра.</li></ol>\n<div class=\"note\"><b>Важно:</b> функция не запускается только потому, что ты её написал. Обычно её нужно вызвать по имени после объявления.</div>","ex":["function Hello($n) { \"Привет, $n\" }; Hello Admin","function Top($k) { Get-Process | Sort-Object CPU -Descending | Select-Object -First $k }; Top 2"],"task":"Объявите функцию Hello с параметром $n, которая выводит приветствие, и вызовите её со своим именем.","h":"function Hello($n) { \"Привет, $n\" }\nHello Admin","ok":/function\s+hello/i},{"t":"Обработка ошибок","th":"<h2>1. Ошибки — нормальная часть работы</h2>\n<p>Ошибка может появиться из-за опечатки, отсутствующего файла, неверного типа данных или недостаточных прав. Задача разработчика — не избегать всех ошибок, а уметь их замечать и разбираться в причине.</p>\n<h2>2. Сначала прочитай сообщение</h2>\n<p>Сообщение об ошибке часто подсказывает, какая команда не сработала и почему. Не игнорируй его и не копируй случайные исправления, не понимая причины.</p>\n<h2>3. Try и Catch</h2>\n<p>Конструкция <code>try</code>/<code>catch</code> позволяет обработать некоторые ошибки, чтобы программа могла вывести понятное сообщение или выполнить запасное действие.</p>\n<pre><code>try {\n    Get-Item 'missing-file.txt' -ErrorAction Stop\n}\ncatch {\n    'Не удалось найти или прочитать объект.'\n}</code></pre>\n<p><code>try</code> содержит действие, которое может завершиться ошибкой. <code>catch</code> выполняется, если подходящая ошибка передана в механизм обработки. Параметр <code>-ErrorAction Stop</code> помогает превратить многие ошибки команды в ошибки, которые перехватит <code>catch</code>.</p>\n<h2>4. Не скрывай ошибку полностью</h2>\n<p>В реальной программе полезно сохранить подробности для диагностики. Например, можно вывести текст ошибки через <code>$_.Exception.Message</code> внутри блока <code>catch</code>.</p>\n<pre><code>try {\n    Get-Item 'missing-file.txt' -ErrorAction Stop\n}\ncatch {\n    \"Причина: $($_.Exception.Message)\"\n}</code></pre>\n<h2>5. Порядок поиска причины</h2>\n<ol><li>Прочитай сообщение целиком.</li><li>Проверь имя команды и параметры.</li><li>Проверь путь и наличие объекта.</li><li>Уточни, нужны ли права.</li><li>Повтори действие на безопасном примере.</li></ol>\n<div class=\"note\"><b>Запомни:</b> обработка ошибок не делает ошибочную операцию успешной. Она помогает программе контролируемо отреагировать на неудачу.</div>","ex":["try { Get-Content nofile.txt } catch { \"Ошибка: $_\" }","try { Get-Service Spooler } catch { \"нет такой службы\" } finally { \"готово\" }","try { throw \"Тревога!\" } catch { \"Поймали: $_\" }"],"task":"Прочитайте несуществующий файл внутри try и обработайте ошибку в блоке catch.","h":"try { Get-Content nofile.txt } catch { \"Файл не найден\" }","ok":/try\s*\{/i}]},{"name":"Безопасность","level":"Продвинутый","lessons":[{"t":"Подозрительные соединения","th":"<h2>1. Что такое сетевое соединение</h2>\n<p>Приложения обмениваются данными через сеть. Соединение может связывать компьютер с сайтом, сервером или другим устройством. Сам факт соединения не означает, что оно опасно.</p>\n<h2>2. Посмотреть сетевые команды</h2>\n<pre><code>Get-Command *NetTCPConnection*\nGet-Help Get-NetTCPConnection</code></pre>\n<p>В полноценной Windows-командной оболочке команда <code>Get-NetTCPConnection</code> может показать TCP-соединения. Доступность зависит от среды и прав.</p>\n<h2>3. Посмотреть соединения</h2>\n<pre><code>Get-NetTCPConnection</code></pre>\n<p>У соединения могут быть локальный и удалённый адреса, порты и состояние. Порт — это номер, помогающий системе направлять сетевой трафик нужному приложению или службе.</p>\n<h2>4. Ограничить вывод</h2>\n<pre><code>Get-NetTCPConnection | Select-Object State, LocalAddress, LocalPort, RemoteAddress, RemotePort</code></pre>\n<p>Мы выбираем только поля, которые помогают понять, какие адреса и порты участвуют в соединении.</p>\n<h2>5. Как оценивать подозрительность</h2>\n<p>Не объявляй соединение вредоносным только потому, что адрес незнаком. Учитывай запущенное приложение, время, назначение устройства, репутацию адреса и другие признаки. В рабочей среде следуй правилам организации и подтверждай выводы дополнительными источниками.</p>\n<div class=\"note\"><b>Безопасность:</b> этот урок посвящён наблюдению и анализу. Не отключай соединения и не блокируй адреса, если не понимаешь последствий или не имеешь разрешения. Учебный терминал сайта использует симуляцию, а не реальную сеть.</div>","ex":["Get-NetTCPConnection","Get-NetTCPConnection -State Established","Get-Process -Id (Get-NetTCPConnection -RemotePort 4444).OwningProcess"],"task":"Найдите соединение на порт 4444 и определите процесс-владелец через Get-Process -Id.","h":"Get-Process -Id (Get-NetTCPConnection -RemotePort 4444).OwningProcess","ok":/4444[\s\S]*get-process\s+-id/i},{"t":"Целостность и политики","th":"<h2>1. Что такое целостность данных</h2>\n<p><b>Целостность</b> означает, что данные не изменились незаметно. Один из способов проверить файл — вычислить его хэш: короткое значение, полученное специальным алгоритмом из содержимого файла.</p>\n<h2>2. Хэш — цифровой отпечаток</h2>\n<p>Если содержимое файла изменится, его хэш обычно тоже изменится. Но хэш не показывает, кто изменил файл, и сам по себе не доказывает, что файл безопасен.</p>\n<h2>3. Вычислить хэш файла</h2>\n<pre><code>Get-FileHash 'C:\\Temp\\example.txt'\nGet-FileHash 'C:\\Temp\\example.txt' -Algorithm SHA256</code></pre>\n<p><code>Get-FileHash</code> вычисляет хэш файла. <code>-Algorithm SHA256</code> явно задаёт алгоритм SHA-256. Путь в примере условный — используй путь к существующему файлу.</p>\n<h2>4. С чем сравнивать результат</h2>\n<p>Само вычисленное значение мало что говорит. Его сравнивают с доверенным контрольным значением, полученным из надёжного источника или ранее сохранённым в момент, когда файл считался корректным.</p>\n<h2>5. Что такое политика выполнения скриптов</h2>\n<p>PowerShell имеет настройки, влияющие на запуск сценариев. Их часто называют <b>Execution Policy</b>. Они помогают уменьшить риск случайного запуска скриптов, но не являются полноценной границей безопасности и не заменяют антивирус или права доступа.</p>\n<pre><code>Get-ExecutionPolicy\nGet-ExecutionPolicy -List</code></pre>\n<p>Эти команды показывают текущую политику и политики для разных областей. Изменять настройки без понимания последствий не следует.</p>\n<div class=\"note\"><b>Правило:</b> сначала проверяй состояние и изучай настройки. Не отключай защитные ограничения просто ради запуска неизвестного скрипта.</div>","ex":["Get-FileHash Documents\\notes.txt","Get-ExecutionPolicy"],"task":"Посчитайте хэш файла Documents\\notes.txt, затем узнайте политику выполнения скриптов.","h":"Get-FileHash Documents\\notes.txt\nGet-ExecutionPolicy","ok":/get-filehash[\s\S]*get-executionpolicy/i},{"t":"Поиск секретов","th":"<h2>1. Что называют секретами</h2>\n<p>Секрет — это информация, которую нельзя раскрывать посторонним: пароль, API-ключ, токен доступа или приватный ключ. Если секрет попадёт в публичный репозиторий или журнал, кто-то может получить доступ к системе.</p>\n<h2>2. Почему ищут секреты в файлах</h2>\n<p>Иногда разработчик случайно оставляет токен в исходном коде, конфигурации или текстовом файле. Поиск помогает обнаружить подозрительные строки до публикации или передачи проекта.</p>\n<h2>3. Простой поиск по шаблону</h2>\n<pre><code>Select-String -Pattern 'API_KEY|PASSWORD|TOKEN' -Path '.\\config.txt'</code></pre>\n<p>Команда ищет строки, похожие на имена полей для ключей, паролей и токенов. Вертикальная черта внутри шаблона означает «или» в регулярном выражении. Такой поиск — лишь первичная проверка: он может пропустить секреты или найти обычный текст.</p>\n<h2>4. Проверить несколько файлов</h2>\n<pre><code>Get-ChildItem -File -Recurse |\n    Select-String -Pattern 'API_KEY|PASSWORD|TOKEN'</code></pre>\n<p><code>Get-ChildItem -File -Recurse</code> получает файлы в текущей папке и вложенных папках. Затем <code>Select-String</code> ищет совпадения. На больших папках такой поиск может занять время.</p>\n<h2>5. Что делать при обнаружении секрета</h2>\n<ol><li>Не публикуй найденное значение и не вставляй его в переписку.</li><li>Если это настоящий действующий ключ, сообщи ответственному лицу и отзови или замени ключ по установленной процедуре.</li><li>Удали секрет из файлов и проверь, не попал ли он в историю версий или журналы.</li><li>В дальнейшем храни секреты в подходящем хранилище или переменных окружения, а не прямо в исходном коде.</li></ol>\n<div class=\"note\"><b>Этика и безопасность:</b> ищи секреты только в файлах и системах, которые принадлежат тебе или на проверку которых у тебя есть разрешение. Не пытайся использовать найденные ключи для доступа к чужим сервисам.</div>","ex":["Get-ChildItem -Recurse","Get-ChildItem -Recurse | Select-String -Pattern \"password\""],"task":"Рекурсивно найдите во всех файлах строки со словом password.","h":"Get-ChildItem -Recurse | Select-String -Pattern password","ok":/get-childitem[^\n]*recurse[^\n]*\|\s*select-string/i}]}];
  function flattenLessons() {
    return courseModules.flatMap(
      (m) => m.lessons.map((l) => ({ ...l, module: m.name, level: m.level }))
    );
  }

  // js/core/storage.js
  var STORAGE_KEY = "pshell4all";
  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch (e) {
      return null;
    }
  }
  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
    }
  }
  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
    }
  }

  // js/core/state.js
  var state = {
    currentLesson: 0,
    completedLessons: {}
    // { [lessonIndex]: 1 }
  };
  function initState() {
    const saved = load();
    const maxLesson = Math.max(flattenLessons().length - 1, 0);
    if (saved) {
      state.currentLesson = Math.min(Math.max(Number(saved.c) || 0, 0), maxLesson);
      state.completedLessons = saved.d || {};
    } else {
      state.currentLesson = 0;
      state.completedLessons = {};
    }
    return state;
  }
  function persist() {
    save({
      c: state.currentLesson,
      d: state.completedLessons
    });
  }
  function resetProgress() {
    state.currentLesson = 0;
    state.completedLessons = {};
    clear();
  }
  function getCurrentLesson() {
    return state.currentLesson;
  }
  function setCurrentLesson(index) {
    state.currentLesson = index;
    persist();
  }
  function isLessonCompleted(index) {
    return !!state.completedLessons[index];
  }
  function markLessonCompleted(index) {
    state.completedLessons[index] = 1;
    persist();
  }
  function completedCount() {
    return Object.keys(state.completedLessons).length;
  }
  function progressPercent(totalLessons) {
    if (!totalLessons || totalLessons <= 0) return 0;
    return Math.round(completedCount() / totalLessons * 100);
  }

  // js/ui/toast.js
  function showToast(text, duration) {
    let el = document.querySelector("#ts");
    if (!el) return;
    el.textContent = text;
    el.className = "on";
    setTimeout(() => {
      el.className = "";
    }, duration || 2200);
  }

  // js/powershell/parser.js
  function tokenize(str) {
    const result = [];
    let current = "";
    let quote = "";
    let depth = 0;
    for (const ch of str) {
      if (quote) {
        current += ch;
        if (ch === quote) quote = "";
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
        current += ch;
        continue;
      }
      if ("{([".includes(ch)) {
        depth++;
        current += ch;
        continue;
      }
      if ("})]".includes(ch)) {
        depth--;
        current += ch;
        continue;
      }
      if (/\s/.test(ch)) {
        if (depth === 0 && current) {
          result.push(current);
          current = "";
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

  // js/powershell/evaluator.js
  var comparisonOps = {
    like(s, p) {
      const re = new RegExp(
        "^" + String(p).replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$",
        "i"
      );
      return re.test(s);
    },
    notlike(s, p) {
      return !this.like(s, p);
    },
    match(s, p) {
      return new RegExp(p, "i").test(s);
    },
    notmatch(s, p) {
      return !new RegExp(p, "i").test(s);
    },
    contains(a, b) {
      return [].concat(a).includes(b);
    },
    in(a, b) {
      return [].concat(b).includes(a);
    }
  };
  function add(a, b) {
    return typeof a === "string" || typeof b === "string" ? String(a) + String(b) : Number(a) + Number(b);
  }
  function subtract(a, b) {
    return Number(a) - Number(b);
  }
  function multiply(a, b) {
    return Number(a) * Number(b);
  }
  function divide(a, b) {
    return Number(a) / Number(b);
  }
  function modulo(a, b) {
    return Number(a) % Number(b);
  }
  function range(from, to) {
    if (Math.abs(to - from) >= 1e4) {
      throw new Error("\u0414\u0438\u0430\u043F\u0430\u0437\u043E\u043D \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439: \u0432 \u043B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u0438 \u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C 10 000 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432.");
    }
    const step = from <= to ? 1 : -1;
    const length = Math.abs(to - from) + 1;
    return Array.from({ length }, (_, i) => from + i * step);
  }
  function getProperty(obj, key) {
    if (obj == null) return void 0;
    if (key.toLowerCase() === "count" && Array.isArray(obj)) return obj.length;
    if (key.toLowerCase() === "length" && (Array.isArray(obj) || typeof obj === "string")) return obj.length;
    const found = Object.getOwnPropertyNames(Object(obj)).find((z) => z.toLowerCase() === key.toLowerCase());
    return found === void 0 ? void 0 : obj[found];
  }
  function splitBracketed(str, sep) {
    const result = [];
    let current = "";
    let quote = "";
    let depth = 0;
    for (const ch of str) {
      if (quote) {
        current += ch;
        if (ch === quote) quote = "";
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
      } else if ("{([".includes(ch)) {
        depth++;
      } else if ("})]".includes(ch)) {
        depth--;
      }
      if (ch === sep && depth === 0) {
        result.push(current);
        current = "";
        continue;
      }
      current += ch;
    }
    result.push(current);
    return result;
  }
  function findClosingBracket(str, start2) {
    let depth = 0;
    let quote = "";
    for (let i = start2; i < str.length; i++) {
      const ch = str[i];
      if (quote) {
        if (ch === quote) quote = "";
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}" && --depth === 0) {
        return i;
      }
    }
    return -1;
  }
  function isBalancedOuter(str) {
    if (str[0] !== "(" || str[str.length - 1] !== ")") return false;
    let depth = 0;
    let quote = "";
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (quote) {
        if (ch === quote) quote = "";
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === "(") {
        depth++;
      } else if (ch === ")") {
        depth--;
        if (depth === 0 && i < str.length - 1) return false;
      }
    }
    return depth === 0;
  }
  function splitByOperator(str, ops, lastOnly) {
    let quote = "";
    let depth = 0;
    let found = null;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (quote) {
        if (ch === quote) quote = "";
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
      } else if ("([{".includes(ch)) {
        depth++;
      } else if (")]}".includes(ch)) {
        depth--;
      }
      if (depth !== 0) continue;
      for (const op of ops) {
        const slice = str.slice(i, i + op.length);
        if (slice.toLowerCase() === op.toLowerCase() && (op === "-" || op[0] !== "-" || i === 0 || /\s/.test(str[i - 1])) && (op === "-" || op[0] !== "-" || i + op.length === str.length || /\s/.test(str[i + op.length]))) {
          const parts = [str.slice(0, i).trim(), op.toLowerCase(), str.slice(i + op.length).trim()];
          if (!lastOnly) return parts;
          found = parts;
        }
      }
    }
    return found;
  }

  // js/powershell/aliases.js
  var aliases = {
    // File system
    ls: "Get-ChildItem",
    dir: "Get-ChildItem",
    gci: "Get-ChildItem",
    cd: "Set-Location",
    sl: "Set-Location",
    pwd: "Get-Location",
    gl: "Get-Location",
    cat: "Get-Content",
    gc: "Get-Content",
    type: "Get-Content",
    echo: "Write-Output",
    write: "Write-Output",
    // Filter / sort
    where: "Where-Object",
    "?": "Where-Object",
    select: "Select-Object",
    sort: "Sort-Object",
    // Loop
    foreach: "ForEach-Object",
    "%": "ForEach-Object",
    // Measure
    measure: "Measure-Object",
    // Process / service
    ps: "Get-Process",
    gps: "Get-Process",
    gsv: "Get-Service",
    // Remove
    rm: "Remove-Item",
    del: "Remove-Item",
    ri: "Remove-Item",
    // Clear
    cls: "Clear-Host",
    clear: "Clear-Host",
    // Help
    help: "Get-Help",
    man: "Get-Help",
    // Member
    gm: "Get-Member",
    // Format
    ft: "Format-Table",
    fl: "Format-List",
    // Search
    sls: "Select-String",
    // New
    ni: "New-Item",
    // Set content
    sc: "Set-Content",
    ac: "Add-Content",
    // Stop
    kill: "Stop-Process",
    // Group
    group: "Group-Object",
    // Command
    gcm: "Get-Command",
    // Date
    date: "Get-Date"
  };
  function resolveAlias(name) {
    const lower = name.toLowerCase();
    return aliases[lower] || null;
  }

  // js/simulator/filesystem.js
  function F(f) {
    return { f };
  }
  function D(c) {
    return { c };
  }
  function createFilesystem() {
    return D({
      "C:": D({
        Users: D({
          Admin: D({
            Documents: D({
              "notes.txt": F("\u0412\u0441\u0442\u0440\u0435\u0447\u0430 \u0432 10:00\n\u041F\u0430\u0440\u043E\u043B\u044C \u043E\u0442 VPN: Winter2024!\n"),
              "creds.txt": F("login=admin\npassword=P@ssw0rd\n"),
              Logs: D({
                "app.log": F("INFO start\nWARN disk 91%\nERROR db timeout\nINFO ok\nERROR auth failed\n")
              }),
              Scripts: D({})
            })
          })
        })
      })
    });
  }
  function findKey(node, name) {
    if (!node || !node.c) return void 0;
    return Object.keys(node.c).find((k) => k.toLowerCase() === name.toLowerCase());
  }
  function getNode(fsRoot, segments) {
    let node = fsRoot;
    for (const s of segments) {
      const k = findKey(node, s);
      if (!k) return null;
      node = node.c[k];
    }
    return node;
  }
  function pathToString(segments) {
    return segments.length === 1 ? segments[0] + "\\" : segments.join("\\");
  }
  function resolvePath(fsRoot, cwd, path) {
    if (path == null || path === true) {
      throw new Error("\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D \u043F\u0443\u0442\u044C. \u041F\u0440\u0438\u043C\u0435\u0440: Get-Content Logs\\app.log");
    }
    let segments = /^[A-Za-z]:/.test(path) ? [] : [...cwd];
    for (const s of String(path).split(/[\\/]/)) {
      if (!s || s === ".") continue;
      if (s === "..") segments.pop();
      else segments.push(s);
    }
    const node = getNode(fsRoot, segments);
    const parent = segments.length > 0 ? getNode(fsRoot, segments.slice(0, -1)) : null;
    const name = segments[segments.length - 1];
    return { segments, node, parent, name };
  }
  function readFile(fsRoot, cwd, path) {
    const r = resolvePath(fsRoot, cwd, path);
    if (!r.node) throw new Error(`\u041D\u0435 \u0443\u0434\u0430\u0451\u0442\u0441\u044F \u043D\u0430\u0439\u0442\u0438 \u043F\u0443\u0442\u044C "${path}", \u0442\u0430\u043A \u043A\u0430\u043A \u043E\u043D \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442.`);
    if (r.node.c) throw new Error("\u0423\u043A\u0430\u0437\u0430\u043D \u043A\u0430\u0442\u0430\u043B\u043E\u0433, \u0430 \u043D\u0435 \u0444\u0430\u0439\u043B: " + path);
    return r.node.f.replace(/\r\n?/g, "\n");
  }
  function writeFile(fsRoot, cwd, path, text, append) {
    const r = resolvePath(fsRoot, cwd, path);
    if (!r.parent || !r.parent.c) throw new Error("\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D: " + path);
    if (r.node && r.node.c) throw new Error("\u0423\u043A\u0430\u0437\u0430\u043D \u043A\u0430\u0442\u0430\u043B\u043E\u0433.");
    const key = findKey(r.parent, r.name) || r.name;
    if (append && r.node) {
      r.parent.c[key] = F(r.node.f + text);
    } else {
      r.parent.c[key] = F(text + "\n");
    }
  }
  function listDirectory(node, segments, recursive) {
    const result = [];
    for (const k of Object.keys(node.c)) {
      const child = node.c[k];
      const entry = {
        Mode: child.c ? "d-----" : "-a----",
        Name: k,
        Length: child.c ? "" : child.f.length
      };
      Object.defineProperty(entry, "FullName", {
        value: pathToString([...segments, k])
      });
      result.push(proxyWrap(entry));
      if (recursive && child.c) {
        result.push(...listDirectory(child, [...segments, k], 1));
      }
    }
    return result;
  }
  function proxyWrap(obj) {
    return new Proxy(obj, {
      get(target, key) {
        if (typeof key !== "string" || key in target) return target[key];
        const found = Object.keys(target).find((k) => k.toLowerCase() === key.toLowerCase());
        return found !== void 0 ? target[found] : void 0;
      }
    });
  }

  // js/simulator/policies.js
  var executionPolicy = "RemoteSigned";
  function getExecutionPolicy() {
    return executionPolicy;
  }
  function setExecutionPolicy(value) {
    executionPolicy = value || executionPolicy;
  }
  function resetExecutionPolicy() {
    executionPolicy = "RemoteSigned";
  }

  // js/powershell/commands.js
  function g(args, key, defaultPos) {
    if (args.n[key] !== void 0) return args.n[key];
    if (args._[defaultPos] !== void 0) return args._[defaultPos];
    return void 0;
  }
  function findService(svcs, args) {
    const name = g(args, "name", 0);
    const found = svcs.find((s) => s.Name.toLowerCase() === String(name).toLowerCase());
    if (!found) throw new Error(`\u041D\u0435 \u0443\u0434\u0430\u0451\u0442\u0441\u044F \u043D\u0430\u0439\u0442\u0438 \u0441\u043B\u0443\u0436\u0431\u0443 "${name}".`);
    return found;
  }
  var HELP = {
    "Get-Process": ["\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u043D\u044B\u0435 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u044B.", "Get-Process -Name chrome"],
    "Get-Service": ["\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0441\u043B\u0443\u0436\u0431\u044B Windows.", "Get-Service -Name Spooler"],
    "Where-Object": ["\u0424\u0438\u043B\u044C\u0442\u0440\u0443\u0435\u0442 \u043E\u0431\u044A\u0435\u043A\u0442\u044B \u043F\u043E \u0443\u0441\u043B\u043E\u0432\u0438\u044E.", "Get-Process | Where-Object { $_.CPU -gt 50 }"],
    "Select-Object": ["\u0412\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u0430 \u0438 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432.", "Get-Process | Select-Object Name,Id -First 3"],
    "Sort-Object": ["\u0421\u043E\u0440\u0442\u0438\u0440\u0443\u0435\u0442 \u043E\u0431\u044A\u0435\u043A\u0442\u044B \u043F\u043E \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u0443.", "Get-Process | Sort-Object CPU -Descending"],
    "Get-ChildItem": ["\u0421\u043F\u0438\u0441\u043E\u043A \u0444\u0430\u0439\u043B\u043E\u0432 \u0438 \u043F\u0430\u043F\u043E\u043A (ls, dir).", "Get-ChildItem -Recurse"],
    "Get-Content": ["\u0427\u0438\u0442\u0430\u0435\u0442 \u0444\u0430\u0439\u043B \u043F\u043E\u0441\u0442\u0440\u043E\u0447\u043D\u043E (cat).", "Get-Content Documents\\Logs\\app.log"],
    "Select-String": ["\u0418\u0449\u0435\u0442 \u0442\u0435\u043A\u0441\u0442 \u043F\u043E \u0448\u0430\u0431\u043B\u043E\u043D\u0443 (\u0430\u043D\u0430\u043B\u043E\u0433 grep).", "Select-String -Pattern ERROR -Path Documents\\Logs\\app.log"],
    "Measure-Object": ["\u0421\u0447\u0438\u0442\u0430\u0435\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443.", "Get-Process | Measure-Object CPU -Sum"],
    "Get-WinEvent": ["\u0427\u0438\u0442\u0430\u0435\u0442 \u0436\u0443\u0440\u043D\u0430\u043B\u044B \u0441\u043E\u0431\u044B\u0442\u0438\u0439.", "Get-WinEvent -MaxEvents 5"],
    "Get-NetTCPConnection": ["\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 TCP-\u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F.", "Get-NetTCPConnection -State Established"],
    "Get-FileHash": ["\u0421\u0447\u0438\u0442\u0430\u0435\u0442 \u0445\u044D\u0448 \u0444\u0430\u0439\u043B\u0430.", "Get-FileHash Documents\\notes.txt"]
  };
  var _procs;
  var _svcs;
  var _users;
  var _events;
  var _net;
  var _fsRoot;
  var _cwd;
  var _proxyWrap;
  var _out;
  function initCommands(procs, svcs, users, events, net, fsRoot, cwd, proxyWrap2, out) {
    _procs = procs;
    _svcs = svcs;
    _users = users;
    _events = events;
    _net = net;
    _fsRoot = fsRoot;
    _cwd = cwd;
    _proxyWrap = proxyWrap2;
    _out = out;
  }
  var _cmds = null;
  function getCommands() {
    if (_cmds) return _cmds;
    _cmds = {
      "Get-Process": (args) => {
        const name = g(args, "name", 0);
        const id = args.n.id;
        let result = _procs.filter(
          (p) => (name == null || p.Name.toLowerCase() === String(name).toLowerCase()) && (id == null || p.Id === id)
        );
        if (!result.length && (name !== void 0 || id !== void 0)) {
          throw new Error("\u041D\u0435 \u0443\u0434\u0430\u0451\u0442\u0441\u044F \u043D\u0430\u0439\u0442\u0438 \u043F\u0440\u043E\u0446\u0435\u0441\u0441.");
        }
        return result;
      },
      "Stop-Process": (args) => {
        const name = g(args, "name", 0);
        const id = args.n.id;
        const target = _procs.filter(
          (p) => name != null ? p.Name.toLowerCase() === String(name).toLowerCase() : p.Id === id
        );
        if (!target.length) throw new Error("\u041D\u0435 \u0443\u0434\u0430\u0451\u0442\u0441\u044F \u043D\u0430\u0439\u0442\u0438 \u043F\u0440\u043E\u0446\u0435\u0441\u0441.");
        target.forEach((p) => _procs.splice(_procs.indexOf(p), 1));
        return [];
      },
      "Get-Service": (args) => {
        const name = g(args, "name", 0);
        const result = _svcs.filter((s) => name == null || s.Name.toLowerCase() === String(name).toLowerCase());
        if (!result.length) throw new Error(`\u041D\u0435 \u0443\u0434\u0430\u0451\u0442\u0441\u044F \u043D\u0430\u0439\u0442\u0438 \u0441\u043B\u0443\u0436\u0431\u0443 "${name}".`);
        return result;
      },
      "Start-Service": (args) => {
        findService(_svcs, args).Status = "Running";
        return [];
      },
      "Stop-Service": (args) => {
        findService(_svcs, args).Status = "Stopped";
        return [];
      },
      "Get-LocalUser": () => _users,
      "Get-WinEvent": (args) => {
        return args.n.maxevents ? _events.slice(0, args.n.maxevents) : _events;
      },
      "Get-NetTCPConnection": (args) => {
        return _net.filter(
          (c) => ["state", "remoteport", "localport", "owningprocess"].every((k) => {
            const key = Object.keys(c).find((x) => x.toLowerCase() === k);
            return args.n[k] == null || String(c[key]).toLowerCase() === String(args.n[k]).toLowerCase();
          })
        );
      },
      "Get-ChildItem": (args) => {
        const path = g(args, "path", 0) || ".";
        const r = resolvePath(_fsRoot, _cwd, path);
        if (!r.node) throw new Error(`\u041D\u0435 \u0443\u0434\u0430\u0451\u0442\u0441\u044F \u043D\u0430\u0439\u0442\u0438 \u043F\u0443\u0442\u044C "${path}", \u0442\u0430\u043A \u043A\u0430\u043A \u043E\u043D \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442.`);
        if (r.node.c) return listDirectory(r.node, r.segments, args.n.recurse);
        return [r.name];
      },
      "Get-Content": (args) => {
        const content = readFile(_fsRoot, _cwd, g(args, "path", 0));
        return content.split("\n").filter((l, i, arr) => l || i < arr.length - 1);
      },
      "Set-Content": (args) => {
        writeFile(_fsRoot, _cwd, g(args, "path", 0), [].concat(g(args, "value", 1) ?? "").join("\n"));
        return [];
      },
      "Add-Content": (args) => {
        writeFile(_fsRoot, _cwd, g(args, "path", 0), [].concat(g(args, "value", 1) ?? "").join("\n") + "\n", true);
        return [];
      },
      "New-Item": (args) => {
        let path = g(args, "path", 0) || ".";
        if (args.n.name) path += "\\" + args.n.name;
        const r = resolvePath(_fsRoot, _cwd, path);
        if (r.node) throw new Error("\u042D\u043B\u0435\u043C\u0435\u043D\u0442 \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442.");
        if (!r.parent || !r.parent.c) throw new Error("\u0420\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439 \u043A\u0430\u0442\u0430\u043B\u043E\u0433 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.");
        const isDir = /dir/i.test(args.n.itemtype);
        r.parent.c[r.name] = isDir ? { c: {} } : { f: args.n.value != null ? args.n.value + "\n" : "" };
        return [_proxyWrap({ Mode: isDir ? "d-----" : "-a----", Name: r.name })];
      },
      "Remove-Item": (args) => {
        const r = resolvePath(_fsRoot, _cwd, g(args, "path", 0));
        if (!r.node) throw new Error("\u041D\u0435 \u0443\u0434\u0430\u0451\u0442\u0441\u044F \u043D\u0430\u0439\u0442\u0438 \u043F\u0443\u0442\u044C.");
        if (r.node.c && Object.keys(r.node.c).length > 0) {
          throw new Error("\u041D\u0435\u043B\u044C\u0437\u044F \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0435\u043F\u0443\u0441\u0442\u0443\u044E \u043F\u0430\u043F\u043A\u0443.");
        }
        if (r.segments.length <= 3) throw new Error("\u042D\u0442\u0443 \u043F\u0430\u043F\u043A\u0443 \u0443\u0434\u0430\u043B\u044F\u0442\u044C \u043D\u0435\u043B\u044C\u0437\u044F: \u043E\u043D\u0430 \u043D\u0443\u0436\u043D\u0430 \u043B\u0430\u0431\u043E\u0440\u0430\u0442\u043E\u0440\u0438\u0438.");
        delete r.parent.c[findKey(r.parent, r.name)];
        return [];
      },
      "Test-Path": (args) => {
        return [!!resolvePath(_fsRoot, _cwd, g(args, "path", 0)).node];
      },
      "Set-Location": (args) => {
        const path = g(args, "path", 0) || "C:\\Users\\Admin";
        const r = resolvePath(_fsRoot, _cwd, path);
        if (!r.node || !r.node.c) throw new Error(`\u041D\u0435 \u0443\u0434\u0430\u0451\u0442\u0441\u044F \u043D\u0430\u0439\u0442\u0438 \u043F\u0443\u0442\u044C "${path}".`);
        _cwd.length = 0;
        r.segments.forEach((s) => _cwd.push(s));
        return [];
      },
      "Get-Location": () => [_proxyWrap({ Path: pathToString(_cwd) })],
      "Write-Output": (args) => args._.flat(),
      "Write-Host": (args) => {
        _out(args._.flat().join(" "), "wh");
        return [];
      },
      "Get-Date": () => {
        const d = /* @__PURE__ */ new Date();
        const t = d.toLocaleString("ru-RU");
        const days = ["\u0412\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435", "\u041F\u043E\u043D\u0435\u0434\u0435\u043B\u044C\u043D\u0438\u043A", "\u0412\u0442\u043E\u0440\u043D\u0438\u043A", "\u0421\u0440\u0435\u0434\u0430", "\u0427\u0435\u0442\u0432\u0435\u0440\u0433", "\u041F\u044F\u0442\u043D\u0438\u0446\u0430", "\u0421\u0443\u0431\u0431\u043E\u0442\u0430"];
        const o = {};
        Object.defineProperties(o, { __s: { value: t }, toString: { value: () => t } });
        const props = { DateTime: t, Year: d.getFullYear(), Month: d.getMonth() + 1, Day: d.getDate(), Hour: d.getHours(), Minute: d.getMinutes(), DayOfWeek: days[d.getDay()] };
        for (const k in props) Object.defineProperty(o, k, { value: props[k] });
        return [_proxyWrap(o)];
      },
      "Clear-Host": () => [],
      "Select-Object": (args, input) => {
        let result = input;
        const props = [].concat(args.n.property ?? [], args._).flat().filter((x) => typeof x === "string");
        if (args.n.first) result = result.slice(0, args.n.first);
        if (args.n.last) result = result.slice(-args.n.last);
        if (args.n.expandproperty) return result.map((x) => x[args.n.expandproperty]);
        if (props.length) {
          result = result.map((x) => {
            const o = {};
            props.forEach((k) => {
              const key = Object.keys(x).find((z) => z.toLowerCase() === k.toLowerCase()) || k;
              o[key] = x[key];
            });
            return _proxyWrap(o);
          });
        }
        if (args.n.unique) {
          const seen = /* @__PURE__ */ new Set();
          result = result.filter((x) => {
            const key = props.length ? JSON.stringify(x) : String(x);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }
        return result;
      },
      "Sort-Object": (args, input) => {
        const key = g(args, "property", 0);
        const fn = (x) => key ? x[key] : x;
        const dir = args.n.descending ? -1 : 1;
        return [...input].sort((x, y) => (fn(x) > fn(y) ? 1 : fn(x) < fn(y) ? -1 : 0) * dir);
      },
      "Measure-Object": (args, input) => {
        const prop = g(args, "property", 0);
        const obj = { Count: input.length };
        if (prop) {
          const vals = input.map((x) => +x[prop]);
          const sum = vals.reduce((a, b) => a + b, 0);
          Object.assign(obj, {
            Average: +(sum / vals.length).toFixed(2),
            Sum: +sum.toFixed(2),
            Maximum: Math.max(...vals),
            Minimum: Math.min(...vals),
            Property: prop
          });
        }
        return [_proxyWrap(obj)];
      },
      "Group-Object": (args, input) => {
        const key = g(args, "property", 0);
        const map = {};
        input.forEach((x) => {
          map[x[key]] = (map[x[key]] || 0) + 1;
        });
        return Object.entries(map).map(([Name, Count]) => _proxyWrap({ Count, Name }));
      },
      "Get-Member": (args, input) => {
        if (!input.length) throw new Error("\u041D\u0435\u0442 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432 \u0434\u043B\u044F Get-Member.");
        return Object.getOwnPropertyNames(input[0]).filter((k) => k !== "__s" && k !== "__ht" && k !== "toString").map((k) => _proxyWrap({ Name: k, MemberType: "Property", Type: typeof input[0][k] }));
      },
      "Format-Table": (args, input) => args._.length ? _cmds["Select-Object"](args, input) : input,
      "Format-List": (args, input) => [{
        __txt: input.map((x) => Object.keys(x).map((k) => k.padEnd(14) + ": " + x[k]).join("\n")).join("\n\n")
      }],
      "ConvertTo-Json": (args, input) => [{
        __txt: JSON.stringify(input.length === 1 ? input[0] : input, null, 2)
      }],
      "Select-String": (args, input) => {
        const pattern = g(args, "pattern", 0);
        let re;
        try {
          re = new RegExp(args.n.simplematch ? String(pattern).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : pattern, "i");
        } catch (e) {
          throw new Error("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0448\u0430\u0431\u043B\u043E\u043D \u043F\u043E\u0438\u0441\u043A\u0430.");
        }
        const src = args.n.path ? [[args.n.path, readFile(_fsRoot, _cwd, args.n.path).split("\n")]] : input.some((x) => x && x.FullName) ? input.filter((x) => x.FullName && x.Mode[0] !== "d").map((x) => [x.FullName, readFile(_fsRoot, _cwd, x.FullName).split("\n")]) : [["", input.map(String)]];
        return src.flatMap(
          ([file, lines]) => lines.map((s, n) => [s, n]).filter(([s]) => s && re.test(s)).map(
            ([s, n]) => file ? `${file}:${n + 1}:${s}` : s
          )
        );
      },
      "Get-FileHash": (args) => {
        const path = g(args, "path", 0);
        const text = readFile(_fsRoot, _cwd, path);
        let h = 2166136261;
        const hashes = [];
        for (let k = 0; k < 8; k++) {
          for (const ch of text + k) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
          hashes.push((h >>> 0).toString(16).padStart(8, "0"));
        }
        return [_proxyWrap({
          Algorithm: "EDU-FNV",
          Hash: hashes.join("").toUpperCase(),
          Path: pathToString(resolvePath(_fsRoot, _cwd, path).segments),
          Note: "\u0423\u0447\u0435\u0431\u043D\u044B\u0439 \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043E\u043A; \u043D\u0435 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u043A\u0440\u0438\u043F\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043A\u0438\u043C SHA-256"
        })];
      },
      "Get-ExecutionPolicy": () => [getExecutionPolicy()],
      "Set-ExecutionPolicy": (args) => {
        setExecutionPolicy(args._[0]);
        return [];
      },
      "Where-Object": (args, input) => input || [],
      "ForEach-Object": (args, input) => input || [],
      "Get-Command": (args) => {
        const pattern = g(args, "name", 0);
        const all = Object.keys(_cmds).filter((k) => k.includes("-"));
        if (pattern) return all.filter((k) => comparisonOps.like(k, pattern)).sort();
        return all.sort();
      },
      "Get-Help": (args) => {
        const name = String(g(args, "name", 0) || "Get-Help");
        const key = Object.keys(_cmds).find((c) => c.toLowerCase() === name.toLowerCase());
        if (!key) throw new Error(`\u0421\u043F\u0440\u0430\u0432\u043A\u0430 \u043F\u043E "${name}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 Get-Command.`);
        const h = HELP[key] || ["\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0441\u043C\u043E\u0442\u0440\u0438\u0442\u0435 \u0432 \u0443\u0440\u043E\u043A\u0430\u0445 \u043A\u0443\u0440\u0441\u0430.", key];
        return [{
          __txt: `\u0418\u041C\u042F
    ${key}

\u041E\u041F\u0418\u0421\u0410\u041D\u0418\u0415
    ${h[0]}

\u041F\u0420\u0418\u041C\u0415\u0420
    PS> ${h[1]}`
        }];
      }
    };
    return _cmds;
  }

  // js/powershell/formatter.js
  function formatOutput(results, proxyWrap2) {
    if (!results.length) return "";
    if (results.length === 1 && results[0] && results[0].__txt) {
      return results[0].__txt;
    }
    if (results.every((x) => x && typeof x === "object" && x.__s !== void 0)) {
      return results.map((x) => x.__s).join("\n");
    }
    results = results.flatMap(
      (x) => x && typeof x === "object" && x.__ht ? Object.keys(x).map((k) => proxyWrap2({ Name: k, Value: x[k] })) : [x]
    );
    if (results.every((x) => x === null || typeof x !== "object")) {
      return results.join("\n");
    }
    const objs = results.filter((x) => x && typeof x === "object");
    if (!objs.length) return "";
    const keys = Object.keys(objs[0]);
    const cell = (obj, key) => {
      const val = obj[key];
      if (Array.isArray(val)) return val.join(",");
      if (typeof val === "boolean") return val ? "True" : "False";
      return String(val ?? "");
    };
    const widths = keys.map(
      (k) => Math.max(k.length, ...objs.map((x) => cell(x, k).length))
    );
    const row = (fn) => keys.map((k, i) => fn(k).padEnd(widths[i])).join("  ").trimEnd();
    const lines = [
      row((k) => k),
      row((k) => "-".repeat(k.length)),
      ...objs.map((x) => row((k) => cell(x, k)))
    ];
    return lines.join("\n");
  }

  // js/powershell/interpreter.js
  var ReturnSignal = class {
    constructor(value) {
      this.value = value;
    }
  };
  function createInterpreter(env) {
    const V = /* @__PURE__ */ Object.create(null);
    const FN = {};
    let CAUGHT = false;
    let CUR = null;
    let depth = 0;
    function evalExpr(s) {
      s = String(s).trim();
      if (!s) return "";
      if (isBalancedOuter(s)) return evalExpr(s.slice(1, -1));
      if (/^"[^"]*"$/.test(s)) return interpolate(s.slice(1, -1));
      if (/^'[^']*'$/.test(s)) return s.slice(1, -1);
      let m;
      if (m = s.match(/^\(([\s\S]+)\)\.([A-Za-z_]\w*)$/)) {
        const r = exec(m[1]);
        const vals = r.map((v) => getProperty(v, m[2]));
        return vals.length === 1 ? vals[0] : vals;
      }
      if (m = s.match(/^\$\(([\s\S]+)\)$/)) {
        const r = exec(m[1]);
        return r.length === 1 ? r[0] : r;
      }
      if (/^\$true$/i.test(s)) return true;
      if (/^\$false$/i.test(s)) return false;
      if (/^\$null$/i.test(s)) return null;
      if (m = s.match(/^(-?\d+)\.\.(-?\d+)$/)) return range(+m[1], +m[2]);
      if (m = s.match(/^@\(([\s\S]*)\)$/)) {
        if (!m[1].trim()) return [];
        const p = splitBracketed(m[1], ",");
        return p.length > 1 ? p.map(evalExpr) : exec(m[1]);
      }
      if (m = s.match(/^(@\([\s\S]*\))\.([A-Za-z_]\w*)$/)) {
        return getProperty(evalExpr(m[1]), m[2]);
      }
      if (m = s.match(/^(\[pscustomobject\]\s*)?@\{([\s\S]*)\}$/i)) {
        const o = {};
        for (const pair of splitBracketed(m[2].replace(/\n/g, ";"), ";")) {
          const q = pair.trim();
          if (!q) continue;
          const eq = q.indexOf("=");
          if (eq < 0) throw new Error("\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C \u0432 \u0445\u044D\u0448-\u0442\u0430\u0431\u043B\u0438\u0446\u0435: " + q);
          o[q.slice(0, eq).trim().replace(/^["']|["']$/g, "")] = evalExpr(q.slice(eq + 1));
        }
        if (!m[1]) Object.defineProperty(o, "__ht", { value: true });
        return env.proxyWrap(o);
      }
      if (m = s.match(/^(\$[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\[([^\[\]]+)\]$/)) {
        const v = evalExpr(m[1]);
        const i = evalExpr(m[2]);
        return Array.isArray(v) ? v[i < 0 ? v.length + i : i] : getProperty(v, String(i));
      }
      if (m = s.match(/^\$[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*$/)) {
        return resolveVar(s);
      }
      if (m = s.match(/^(-?\d+(?:\.\d+)?)$/)) return Number(s);
      {
        const parts = splitBracketed(s, ",");
        if (parts.length > 1) return parts.map(evalExpr);
      }
      for (const ops of [["-or"], ["-and"]]) {
        const z = splitByOperator(s, ops, false);
        if (z) {
          const a = evalExpr(z[0]), b = evalExpr(z[2]);
          if (z[1] === "-or") return !!a || !!b;
          if (z[1] === "-and") return !!a && !!b;
        }
      }
      {
        const ops = ["-eq", "-ne", "-gt", "-lt", "-ge", "-le", "-like", "-notlike", "-match", "-notmatch", "-contains", "-in"];
        const z = splitByOperator(s, ops, true);
        if (z) {
          const a = evalExpr(z[0]), b = evalExpr(z[2]);
          switch (z[1]) {
            case "-eq":
              return String(a).toLowerCase() === String(b).toLowerCase();
            case "-ne":
              return String(a).toLowerCase() !== String(b).toLowerCase();
            case "-gt":
              return a > b;
            case "-lt":
              return a < b;
            case "-ge":
              return a >= b;
            case "-le":
              return a <= b;
            case "-like":
              return comparisonOps.like(a, b);
            case "-notlike":
              return comparisonOps.notlike(a, b);
            case "-match":
              return comparisonOps.match(a, b);
            case "-notmatch":
              return comparisonOps.notmatch(a, b);
            case "-contains":
              return comparisonOps.contains(a, b);
            case "-in":
              return comparisonOps.in(a, b);
          }
        }
      }
      for (const ops of [["+", "-"], ["*", "/", "%"]]) {
        const z = splitByOperator(s, ops, ops[0] === "+" || ops[0] === "*");
        if (z) {
          const a = evalExpr(z[0]), b = evalExpr(z[2]);
          if (z[1] === "+") return add(a, b);
          if (z[1] === "-") return subtract(a, b);
          if (z[1] === "*") return multiply(a, b);
          if (z[1] === "/") return divide(a, b);
          if (z[1] === "%") return modulo(a, b);
        }
      }
      if (m = s.match(/^-not\s+([\s\S]+)$/i)) return !evalExpr(m[1]);
      if (s[0] === "!" && s.length > 1) return !evalExpr(s.slice(1));
      if (m = s.match(/^("[^"]*"|'[^']*'|\$[A-Za-z_]\w*|[A-Za-z_]\w*)\.(ToUpper|ToLower)\s*\(\)$/i)) {
        const v = evalExpr(m[1]);
        return m[2].toLowerCase() === "toupper" ? String(v).toUpperCase() : String(v).toLowerCase();
      }
      if (m = s.match(/^(.+)\.Contains\((.*)\)$/i)) {
        return String(evalExpr(m[1])).includes(evalExpr(m[2]));
      }
      if (/^[A-Za-z_][\w-]*$/.test(s)) {
        throw new Error(`\u0422\u0435\u0440\u043C\u0438\u043D "${s}" \u043D\u0435 \u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D \u043A\u0430\u043A \u0438\u043C\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u043B\u0435\u0442\u0430, \u0444\u0443\u043D\u043A\u0446\u0438\u0438 \u0438\u043B\u0438 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B. Get-Command \u043F\u043E\u043A\u0430\u0436\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B.`);
      }
      if (/^[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*$/.test(s)) {
        const parts = s.split(".");
        let v = V[parts.shift().toLowerCase()];
        for (const k of parts) v = getProperty(v, k);
        return v;
      }
      throw new Error("\u041D\u0435\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u043E\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0435: " + s);
    }
    function interpolate(str) {
      return str.replace(/\$\(([^()]*)\)|\$([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)/g, (m, cmd, vn) => {
        try {
          if (cmd !== void 0) {
            const r = exec(cmd);
            return r.map((z) => z && typeof z === "object" ? formatOutput([z], env.proxyWrap) : String(z)).join(" ");
          }
          const v = resolveVar("$" + vn);
          return v == null ? "" : Array.isArray(v) ? v.join(" ") : String(v);
        } catch (e) {
          return m;
        }
      }).replace(/`n/g, "\n");
    }
    function resolveVar(x) {
      const m = x.match(/^\$([A-Za-z_]\w*)((?:\.[A-Za-z_]\w*)*)$/);
      if (!m) return void 0;
      let v = m[1] === "_" ? CUR : V[m[1].toLowerCase()];
      for (const k of m[2].split(".").filter(Boolean)) v = getProperty(v, k);
      return v;
    }
    function toValue(token) {
      if (token[0] === "{") return token;
      if (/^["'$(@]/.test(token)) return evalExpr(token);
      if (/^-?\d+(\.\d+)?$/.test(token)) return +token;
      if (token.includes(",")) return token.split(",");
      return token;
    }
    function parseTokenValues(tokens) {
      const args = { _: [], n: {} };
      const switchNames = /* @__PURE__ */ new Set(["recurse", "descending", "force", "unique", "simplematch", "autosize", "sum", "average", "maximum", "minimum"]);
      for (let i = 1; i < tokens.length; i++) {
        const token = tokens[i];
        if (/^-[a-z]/i.test(token)) {
          const key = token.slice(1).toLowerCase();
          if (switchNames.has(key) || i + 1 >= tokens.length || /^-[a-z]/i.test(tokens[i + 1])) {
            args.n[key] = true;
          } else {
            args.n[key] = toValue(tokens[++i]);
          }
        } else {
          args._.push(toValue(token));
        }
      }
      return args;
    }
    function runBlock(blockCode, currentItem) {
      if (typeof blockCode !== "string" || blockCode[0] !== "{") {
        throw new Error("\u041E\u0436\u0438\u0434\u0430\u043B\u0441\u044F \u0431\u043B\u043E\u043A { ... }.");
      }
      const prev = CUR;
      CUR = currentItem;
      try {
        return runMultiline(blockCode.trim().slice(1, -1));
      } finally {
        CUR = prev;
      }
    }
    function runMultiline(s) {
      const out = [];
      for (const part of splitBracketed(s, ";")) {
        for (const line of splitBracketed(part, "\n")) {
          out.push(...exec(line));
        }
      }
      return out;
    }
    function coerceParamValue(typeName, value) {
      if (value === void 0 || value === null || !typeName) return value;
      const type = String(typeName).toLowerCase();
      if (type === "int" || type === "long") return Number.isFinite(Number(value)) ? parseInt(Number(value), 10) : value;
      if (type === "double" || type === "float" || type === "decimal") return Number(value);
      if (type === "string") return String(value);
      if (type === "bool") return !!value;
      if (type === "array") return Array.isArray(value) ? value : [value];
      return value;
    }
    function parseParamSpec(spec) {
      const s = String(spec).trim();
      if (!s) return null;
      const match = s.match(/^(?:\[([^\]]+)\])?\s*(?:\$)?([A-Za-z_][\w]*)\s*(?:=\s*([\s\S]+))?$/);
      if (!match) return { name: s.replace(/^\$?/, "").split("=")[0].trim().toLowerCase(), type: null, defaultValue: void 0 };
      const [, type, name, defaultValue] = match;
      return {
        name: name.toLowerCase(),
        type: type ? type.trim().toLowerCase() : null,
        defaultValue: defaultValue !== void 0 ? evalExpr(defaultValue.trim()) : void 0
      };
    }
    function callUserFunction(fnDef, args) {
      const saved = {}, had = {}, names = [], pos = [];
      let body = fnDef.b;
      const pm = body.match(/^\s*param\s*\(([\s\S]*?)\)\s*;?\s*/i);
      let params = (fnDef.params || fnDef.p || []).map((p) => typeof p === "string" ? { name: p, type: null, defaultValue: void 0 } : p);
      if (pm) {
        body = body.slice(pm[0].length);
        params = splitBracketed(pm[1], ",").map(parseParamSpec).filter(Boolean);
      }
      params.forEach((p, i) => {
        const name = p.name;
        names.push(name);
        had[name] = Object.prototype.hasOwnProperty.call(V, name);
        saved[name] = V[name];
        const value = args.n[name] !== void 0 ? args.n[name] : args._[i] !== void 0 ? args._[i] : p.defaultValue;
        V[name] = coerceParamValue(p.type, value);
      });
      const used = new Set(params.map((p, i) => args.n[p.name] !== void 0 ? i : -1).filter((i) => i >= 0));
      args._.forEach((v, i) => {
        if (i >= params.length) pos.push(v);
      });
      const oldArgs = V.args, hadArgs = Object.prototype.hasOwnProperty.call(V, "args");
      V.args = pos;
      try {
        return runMultiline(body);
      } catch (e) {
        if (e instanceof ReturnSignal) return e.value;
        throw e;
      } finally {
        names.forEach((p) => {
          if (had[p]) V[p] = saved[p];
          else delete V[p];
        });
        if (hadArgs) V.args = oldArgs;
        else delete V.args;
      }
    }
    function runTry(line) {
      const braceStart = line.indexOf("{");
      const braceEnd = findClosingBracket(line, braceStart);
      if (braceEnd < 0) throw new Error("\u041D\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0430 \u0441\u043A\u043E\u0431\u043A\u0430 } \u0432 \u0431\u043B\u043E\u043A\u0435 try.");
      const tryBody = line.slice(braceStart + 1, braceEnd);
      let rest = line.slice(braceEnd + 1).trim();
      let catchBody = null, finallyBody = null;
      function readBlock(word) {
        const j = rest.indexOf("{");
        if (j < 0) return null;
        const k = findClosingBracket(rest, j);
        if (k < 0) throw new Error("\u041D\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0430 \u0441\u043A\u043E\u0431\u043A\u0430 } \u0432 \u0431\u043B\u043E\u043A\u0435 " + word + ".");
        const b = rest.slice(j + 1, k);
        rest = rest.slice(k + 1).trim();
        return b;
      }
      if (/^catch\b/i.test(rest)) catchBody = readBlock("catch");
      if (/^finally\b/i.test(rest)) finallyBody = readBlock("finally");
      if (catchBody === null && finallyBody === null) throw new Error("\u041F\u043E\u0441\u043B\u0435 try \u043D\u0443\u0436\u0435\u043D \u0431\u043B\u043E\u043A catch \u0438\u043B\u0438 finally.");
      let output = [];
      try {
        try {
          output = runMultiline(tryBody);
        } catch (er) {
          if (er instanceof ReturnSignal || catchBody === null) throw er;
          CAUGHT = true;
          const msg = er && er.message ? er.message : "\u041E\u0448\u0438\u0431\u043A\u0430";
          const oldCur = CUR;
          CUR = env.strObj(msg, { Message: msg, Exception: env.proxyWrap({ Message: msg }) });
          try {
            output = runMultiline(catchBody);
          } finally {
            CUR = oldCur;
          }
        }
      } finally {
        if (finallyBody !== null) output.push(...runMultiline(finallyBody));
      }
      return output;
    }
    function pipelineStage(s, input) {
      const tokens = tokenize(s);
      const name = tokens[0].toLowerCase();
      if (FN[name]) {
        return callUserFunction(FN[name], parseTokenValues(tokens));
      }
      const resolvedName = resolveAlias(name) || name;
      const cmds = getCommands();
      const cmdFn = cmds[resolvedName.toLowerCase()] || cmds[Object.keys(cmds).find((k) => k.toLowerCase() === name)];
      if (cmdFn) {
        const args = parseTokenValues(tokens);
        const inp = input || [];
        if (name === "where" || name === "?" || name === "where-object") {
          const block = args._[0];
          if (typeof block === "string" && block[0] === "{") {
            return inp.filter((x) => {
              const r2 = runBlock(block, x);
              return r2.length && r2[r2.length - 1];
            });
          }
          const prop = args._[0];
          for (const op of ["eq", "ne", "gt", "lt", "ge", "le", "like", "match", "contains"]) {
            if (args.n[op] !== void 0) {
              return inp.filter((x) => {
                const pv = x[prop];
                const cmp = {
                  eq: () => String(pv).toLowerCase() === String(args.n[op]).toLowerCase(),
                  ne: () => String(pv).toLowerCase() !== String(args.n[op]).toLowerCase(),
                  gt: () => pv > args.n[op],
                  lt: () => pv < args.n[op],
                  ge: () => pv >= args.n[op],
                  le: () => pv <= args.n[op],
                  like: () => comparisonOps.like(String(pv), args.n[op]),
                  match: () => new RegExp(String(args.n[op]), "i").test(String(pv)),
                  contains: () => [].concat(pv).includes(args.n[op])
                };
                return cmp[op] ? cmp[op]() : false;
              });
            }
          }
        }
        if (name === "foreach" || name === "%" || name === "foreach-object") {
          const block = args._[0] || args.n.process;
          if (!block) throw new Error("ForEach-Object \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0431\u043B\u043E\u043A, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: ForEach-Object { $_.Name }");
          return inp.flatMap((x) => runBlock(block, x));
        }
        return cmdFn(args, inp) || [];
      }
      if (input !== null) {
        throw new Error(`\u0422\u0435\u0440\u043C\u0438\u043D "${tokens[0]}" \u043D\u0435 \u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D \u043A\u0430\u043A \u0438\u043C\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u043B\u0435\u0442\u0430, \u0444\u0443\u043D\u043A\u0446\u0438\u0438 \u0438\u043B\u0438 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B.`);
      }
      if (tokens.length > 1 && /^[A-Za-z_][\w-]*$/.test(tokens[0])) {
        throw new Error(`\u0422\u0435\u0440\u043C\u0438\u043D "${tokens[0]}" \u043D\u0435 \u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D \u043A\u0430\u043A \u0438\u043C\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u043B\u0435\u0442\u0430, \u0444\u0443\u043D\u043A\u0446\u0438\u0438 \u0438\u043B\u0438 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B.`);
      }
      const r = evalExpr(s);
      return r === void 0 ? [] : Array.isArray(r) ? r : [r];
    }
    function findMatchingPair(str, startIndex, openChar, closeChar) {
      let depth2 = 0;
      let quote = "";
      for (let i = startIndex; i < str.length; i++) {
        const ch = str[i];
        if (quote) {
          if (ch === quote) quote = "";
          continue;
        }
        if (ch === '"' || ch === "'") {
          quote = ch;
          continue;
        }
        if (ch === openChar) depth2++;
        else if (ch === closeChar) {
          depth2--;
          if (depth2 === 0) return i;
        }
      }
      return -1;
    }
    function parseControlBlock(line, keyword) {
      const startIndex = line.search(new RegExp(`\\b${keyword}\\b`, "i"));
      if (startIndex < 0) return null;
      const parenStart = line.indexOf("(", startIndex + keyword.length);
      if (parenStart < 0) return null;
      const parenEnd = findMatchingPair(line, parenStart, "(", ")");
      if (parenEnd < 0) return null;
      const braceStart = line.indexOf("{", parenEnd + 1);
      if (braceStart < 0) return null;
      const braceEnd = findClosingBracket(line, braceStart);
      if (braceEnd < 0) throw new Error(`\u041D\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0430 \u0441\u043A\u043E\u0431\u043A\u0430 } \u0432 \u0431\u043B\u043E\u043A\u0435 ${keyword}.`);
      return {
        condition: line.slice(parenStart + 1, parenEnd).trim(),
        body: line.slice(braceStart + 1, braceEnd),
        rest: line.slice(braceEnd + 1).trim()
      };
    }
    function readElseBranch(rest) {
      const trimmed = rest.trim();
      if (!trimmed || !/^else\b/i.test(trimmed)) return null;
      const tail = trimmed.replace(/^else\b\s*/i, "").trim();
      if (!tail) return null;
      if (/^if\b/i.test(tail)) return { type: "if", value: tail };
      const braceStart = tail.indexOf("{");
      if (braceStart < 0) throw new Error("\u041F\u043E\u0441\u043B\u0435 else \u043E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u0431\u043B\u043E\u043A { ... }.");
      const braceEnd = findClosingBracket(tail, braceStart);
      if (braceEnd < 0) throw new Error("\u041D\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0430 \u0441\u043A\u043E\u0431\u043A\u0430 } \u0432 \u0431\u043B\u043E\u043A\u0435 else.");
      return { type: "block", value: tail.slice(braceStart + 1, braceEnd) };
    }
    function exec(l) {
      if (++depth > 200) throw new Error("\u041F\u0440\u0435\u0432\u044B\u0448\u0435\u043D\u0430 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0433\u043B\u0443\u0431\u0438\u043D\u0430 \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u043E\u0441\u0442\u0438 (200). \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0440\u0435\u043A\u0443\u0440\u0441\u0438\u044E.");
      try {
        l = l.trim();
        if (!l) return [];
        let m;
        if (/^function\b/i.test(l)) {
          const fnMatch = l.match(/^function\s+([A-Za-z_][\w-]*)/i);
          if (!fnMatch) throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438.");
          const name = fnMatch[1];
          const afterName = l.slice(fnMatch[0].length).trim();
          let paramsText = "";
          let bodyOffset = 0;
          const openParen = afterName.indexOf("(");
          if (openParen === 0) {
            const closeParen = findMatchingPair(afterName, openParen, "(", ")");
            if (closeParen < 0) throw new Error("\u041D\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0430 \u0441\u043A\u043E\u0431\u043A\u0430 ) \u0432 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0438 \u0444\u0443\u043D\u043A\u0446\u0438\u0438.");
            paramsText = afterName.slice(openParen + 1, closeParen);
            bodyOffset = closeParen + 1;
          }
          const braceStart = afterName.indexOf("{", bodyOffset);
          if (braceStart < 0) throw new Error("\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0431\u043B\u043E\u043A { ... } \u0432 \u0444\u0443\u043D\u043A\u0446\u0438\u0438.");
          const braceEnd = findClosingBracket(afterName, braceStart);
          if (braceEnd < 0) throw new Error("\u041D\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0430 \u0441\u043A\u043E\u0431\u043A\u0430 } \u0432 \u0444\u0443\u043D\u043A\u0446\u0438\u0438.");
          const body = afterName.slice(braceStart + 1, braceEnd);
          const rawParams = paramsText ? paramsText.split(",").map((x) => x.trim()).filter(Boolean) : [];
          const parsedParams = rawParams.map(parseParamSpec).filter(Boolean);
          FN[name.toLowerCase()] = {
            p: parsedParams.map((p) => p.name),
            params: parsedParams,
            b: body
          };
          return [];
        }
        if (/^try\s*\{/i.test(l)) return runTry(l);
        if (m = l.match(/^throw\s+([\s\S]+)$/i)) throw new Error(String(evalExpr(m[1])));
        if (m = l.match(/^return(?:\s+([\s\S]+))?$/i)) {
          const r = m[1] ? exec(m[1]) : [];
          throw new ReturnSignal(r);
        }
        if (/^while\b/i.test(l)) {
          const block = parseControlBlock(l, "while");
          if (!block) throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0441\u0438\u043D\u0442\u0430\u043A\u0441\u0438\u0441 while.");
          const out = [];
          let n = 0;
          while (evalExpr(block.condition)) {
            if (++n > 1e4) throw new Error("\u041F\u0440\u0435\u0432\u044B\u0448\u0435\u043D \u043B\u0438\u043C\u0438\u0442 \u0438\u0442\u0435\u0440\u0430\u0446\u0438\u0439 while (10 000). \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u0435 \u0446\u0438\u043A\u043B\u0430.");
            out.push(...runMultiline(block.body));
          }
          return out;
        }
        if (/^for\b/i.test(l)) {
          const block = parseControlBlock(l, "for");
          if (!block) throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0441\u0438\u043D\u0442\u0430\u043A\u0441\u0438\u0441 for.");
          const out = [];
          const parts = splitBracketed(block.condition, ";");
          const init = parts[0] ? parts[0].trim() : "";
          const cond = parts[1] ? parts[1].trim() : "";
          const step = parts[2] ? parts[2].trim() : "";
          if (init) exec(init);
          let n = 0;
          while (!cond || evalExpr(cond)) {
            if (++n > 1e4) throw new Error("\u041F\u0440\u0435\u0432\u044B\u0448\u0435\u043D \u043B\u0438\u043C\u0438\u0442 \u0438\u0442\u0435\u0440\u0430\u0446\u0438\u0439 for (10 000). \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u0435 \u0446\u0438\u043A\u043B\u0430.");
            out.push(...runMultiline(block.body));
            if (step) exec(step);
          }
          return out;
        }
        if (/^foreach\b/i.test(l)) {
          const block = parseControlBlock(l, "foreach");
          if (!block) throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0441\u0438\u043D\u0442\u0430\u043A\u0441\u0438\u0441 foreach.");
          const condition = block.condition.trim();
          const inIndex = condition.search(/\s+in\s+/i);
          if (inIndex < 0) throw new Error('\u0412 foreach \u043E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0435 "in".');
          const variable = condition.slice(0, inIndex).trim().replace(/^\$/, "").toLowerCase();
          const source = condition.slice(inIndex + 3).trim();
          const out = [];
          for (const x of exec(source)) {
            V[variable] = x;
            out.push(...runMultiline(block.body));
          }
          return out;
        }
        if (/^if\b/i.test(l)) {
          const block = parseControlBlock(l, "if");
          if (!block) throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0441\u0438\u043D\u0442\u0430\u043A\u0441\u0438\u0441 if.");
          const conditionResult = !!evalExpr(block.condition);
          const elseBranch = readElseBranch(block.rest);
          if (conditionResult) {
            const out = runMultiline(block.body);
            if (!elseBranch) return out;
            return out;
          }
          if (!elseBranch) return [];
          if (elseBranch.type === "if") return exec(elseBranch.value);
          return runMultiline(elseBranch.value);
        }
        if (m = l.match(/^\$(\w+)\s*(\+\+|--|\+=|-=|\*=|\/=)\s*([\s\S]*)$/)) {
          const k = m[1].toLowerCase(), op = m[2];
          const old = Number(V[k] ?? 0);
          const delta = m[3].trim() ? Number(evalExpr(m[3])) : 1;
          const ops = { "++": () => old + 1, "--": () => old - 1, "+=": () => old + delta, "-=": () => old - delta, "*=": () => old * delta, "/=": () => old / delta };
          V[k] = ops[op] ? ops[op]() : old;
          return [];
        }
        if (m = l.match(/^\$(\w+)\s*=\s*([^=][\s\S]*)$/)) {
          const r = exec(m[2]);
          V[m[1].toLowerCase()] = r.length === 1 ? r[0] : r;
          return [];
        }
        let d = null;
        for (const s of splitBracketed(l, "|")) {
          if (s.trim()) d = pipelineStage(s.trim(), d);
        }
        return d || [];
      } finally {
        depth--;
      }
    }
    function run(command) {
      CAUGHT = false;
      const results = runMultiline(command);
      return results;
    }
    function wasCaught() {
      return CAUGHT;
    }
    function getVars() {
      return V;
    }
    function getFns() {
      return FN;
    }
    function reset() {
      for (const k of Object.keys(V)) delete V[k];
      for (const k of Object.keys(FN)) delete FN[k];
      CUR = null;
      CAUGHT = false;
      depth = 0;
    }
    return {
      run,
      wasCaught,
      getVars,
      getFns,
      reset,
      getV: () => V,
      getFN: () => FN
    };
  }

  // js/simulator/processes.js
  function createProcesses() {
    const data = [
      ["svchost", 812, 12.4, 48],
      ["chrome", 4120, 356.2, 612],
      ["explorer", 2210, 88.7, 140],
      ["powershell", 5012, 3.1, 72],
      ["lsass", 712, 9.8, 22],
      ["MsMpEng", 3340, 210.5, 260],
      ["spoolsv", 1544, 1.2, 18],
      ["updater", 6666, 70.2, 35]
    ];
    return data.map(([Name, Id, CPU, WS]) => proxyWrap({ Name, Id, CPU, WS }));
  }

  // js/simulator/services.js
  function createServices() {
    const data = [
      ["Spooler", "Running", "Print Spooler", "Automatic"],
      ["WinDefend", "Running", "Microsoft Defender", "Automatic"],
      ["EventLog", "Running", "Windows Event Log", "Automatic"],
      ["TermService", "Running", "Remote Desktop", "Automatic"],
      ["wuauserv", "Stopped", "Windows Update", "Manual"],
      ["RemoteRegistry", "Stopped", "Remote Registry", "Disabled"]
    ];
    return data.map(
      ([Name, Status, DisplayName, StartType]) => proxyWrap({ Name, Status, DisplayName, StartType })
    );
  }

  // js/simulator/users.js
  function createUsers() {
    const data = [
      ["Admin", true, "\u0441\u0435\u0433\u043E\u0434\u043D\u044F", "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440"],
      ["Guest", false, "\u043D\u0438\u043A\u043E\u0433\u0434\u0430", "\u0413\u043E\u0441\u0442\u0435\u0432\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C"],
      ["svc_backup", true, "3 \u0434\u043D\u044F \u043D\u0430\u0437\u0430\u0434", "\u0421\u043B\u0443\u0436\u0431\u0430 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u043E\u0433\u043E \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F"],
      ["j.ivanov", true, "\u0432\u0447\u0435\u0440\u0430", "\u0418\u0432\u0430\u043D\u043E\u0432 \u0418."],
      ["tempuser", false, "90 \u0434\u043D\u0435\u0439 \u043D\u0430\u0437\u0430\u0434", "\u0412\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F"]
    ];
    return data.map(
      ([Name, Enabled, LastLogon, Description]) => proxyWrap({ Name, Enabled, LastLogon, Description })
    );
  }

  // js/simulator/events-log.js
  var MSG = {
    4624: "\u0423\u0441\u043F\u0435\u0448\u043D\u044B\u0439 \u0432\u0445\u043E\u0434",
    4625: "\u041D\u0435\u0443\u0434\u0430\u0447\u043D\u044B\u0439 \u0432\u0445\u043E\u0434",
    4688: "\u0421\u043E\u0437\u0434\u0430\u043D \u043F\u0440\u043E\u0446\u0435\u0441\u0441",
    4672: "\u041E\u0441\u043E\u0431\u044B\u0435 \u043F\u0440\u0438\u0432\u0438\u043B\u0435\u0433\u0438\u0438",
    7045: "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0441\u043B\u0443\u0436\u0431\u0430"
  };
  function createEvents() {
    const ids = [4624, 4625, 4625, 4688, 4625, 4672, 7045, 4625, 4624, 4625];
    return ids.map((Id, n) => proxyWrap({
      Time: "10:0" + n,
      Id,
      Level: Id === 4625 ? "Warning" : "Information",
      Message: MSG[Id]
    }));
  }

  // js/simulator/network.js
  function createNetworkConnections() {
    const data = [
      ["192.168.1.15", 50122, "93.184.216.34", 443, "Established", 4120],
      ["192.168.1.15", 50301, "185.220.101.5", 4444, "Established", 6666],
      ["0.0.0.0", 3389, "0.0.0.0", 0, "Listen", 1544],
      ["0.0.0.0", 445, "0.0.0.0", 0, "Listen", 4]
    ];
    return data.map(
      ([LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess]) => proxyWrap({ LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess })
    );
  }

  // js/laboratory/history.js
  function createHistory() {
    const commands = [];
    let pos = 0;
    return {
      push(cmd) {
        if (cmd === commands[commands.length - 1]) return;
        commands.push(cmd);
        pos = commands.length;
      },
      prev() {
        if (pos > 0) {
          pos--;
          return commands[pos] || "";
        }
        return "";
      },
      next() {
        if (pos < commands.length) {
          pos++;
          return commands[pos] || "";
        }
        pos = commands.length;
        return "";
      },
      all() {
        return [...commands];
      },
      reset() {
        commands.length = 0;
        pos = 0;
      }
    };
  }

  // js/laboratory/terminal.js
  function createTerminal(options) {
    const { outputEl, inputEl, promptEl, onAfterExec } = options;
    let procs = createProcesses();
    let svcs = createServices();
    let users = createUsers();
    let events = createEvents();
    let net = createNetworkConnections();
    let fsRoot = createFilesystem();
    let cwd = ["C:", "Users", "Admin"];
    const MAX_OUTPUT_NODES = 5e3;
    function out(text, cssClass) {
      const div = document.createElement("div");
      div.className = cssClass || "";
      div.textContent = text;
      outputEl.append(div);
      outputEl.scrollTop = outputEl.scrollHeight;
      if (outputEl.childElementCount > MAX_OUTPUT_NODES) {
        while (outputEl.childElementCount > MAX_OUTPUT_NODES / 2) {
          outputEl.removeChild(outputEl.firstChild);
        }
        const trimDiv = document.createElement("div");
        trimDiv.className = "er";
        trimDiv.textContent = "\u2026 \u0432\u044B\u0432\u043E\u0434 \u043E\u0431\u0440\u0435\u0437\u0430\u043D (\u0431\u043E\u043B\u0435\u0435 5000 \u0441\u0442\u0440\u043E\u043A)";
        outputEl.insertBefore(trimDiv, outputEl.firstChild);
      }
    }
    initCommands(procs, svcs, users, events, net, fsRoot, cwd, proxyWrap, out);
    const interp = createInterpreter({
      proxyWrap,
      strObj(s, props) {
        const o = {};
        Object.defineProperties(o, {
          __s: { value: s },
          toString: { value: () => s }
        });
        for (const k in props) Object.defineProperty(o, k, { value: props[k] });
        return proxyWrap(o);
      }
    });
    const history = createHistory();
    function updatePrompt() {
      if (promptEl) {
        promptEl.textContent = "PS " + pathToString(cwd) + ">";
      }
    }
    function exec(line) {
      line = line.trim();
      if (!line) return;
      out((promptEl ? promptEl.textContent : "PS>") + " " + line, "cm");
      history.push(line);
      try {
        const commandName = line.split(/\s+/)[0].toLowerCase();
        if (["clear-host", "cls", "clear"].includes(commandName)) {
          clearOutput();
          if (onAfterExec) {
            onAfterExec(line, history.all(), "", []);
          }
          return;
        }
        const results = interp.run(line);
        const text = formatOutput(results, proxyWrap);
        if (text) out(text);
        if (onAfterExec) {
          onAfterExec(line, history.all(), text, results);
        }
      } catch (e) {
        const msg = e instanceof RangeError ? "\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0433\u043B\u0443\u0431\u043E\u043A\u0430\u044F \u0440\u0435\u043A\u0443\u0440\u0441\u0438\u044F \u0438\u043B\u0438 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u043E\u0431\u044A\u0451\u043C \u0434\u0430\u043D\u043D\u044B\u0445." : e && e.message ? e.message : "\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u044B";
        out(msg, "er");
      }
      updatePrompt();
    }
    if (inputEl) {
      inputEl.onkeydown = (e) => {
        if (e.key === "Enter") {
          exec(inputEl.value);
          inputEl.value = "";
        } else if (e.key === "ArrowUp") {
          inputEl.value = history.prev();
          e.preventDefault();
        } else if (e.key === "ArrowDown") {
          inputEl.value = history.next();
        } else if (e.key === "l" && e.ctrlKey) {
          outputEl.innerHTML = "";
          e.preventDefault();
        }
      };
    }
    function clearOutput() {
      outputEl.innerHTML = "";
    }
    function resetLab() {
      procs = createProcesses();
      svcs = createServices();
      users = createUsers();
      events = createEvents();
      net = createNetworkConnections();
      fsRoot = createFilesystem();
      cwd = ["C:", "Users", "Admin"];
      resetExecutionPolicy();
      interp.reset();
      history.reset();
      clearOutput();
      updatePrompt();
      initCommands(procs, svcs, users, events, net, fsRoot, cwd, proxyWrap, out);
    }
    updatePrompt();
    return {
      exec,
      clearOutput,
      resetLab,
      updatePrompt,
      getHistory: () => history.all(),
      getInterp: () => interp,
      getEnv: () => ({ procs, svcs, users, events, net, fsRoot, cwd, getExecutionPolicy: () => getExecutionPolicy() }),
      out
    };
  }

  // js/laboratory/task-checker.js
  var LS = flattenLessons();
  function checkTask(lessonIndex, history, outText, result, interp, env) {
    if (lessonIndex < 0 || lessonIndex >= LS.length) {
      return { passed: false, message: "\u041D\u0435\u0442 \u0442\u0430\u043A\u043E\u0433\u043E \u0437\u0430\u0434\u0430\u043D\u0438\u044F." };
    }
    const lastCmd = history.length ? history[history.length - 1].toLowerCase() : "";
    const historyText = history.join("\n");
    const has = (re) => re.test(historyText);
    const lastHas = (re) => re.test(lastCmd);
    const V = interp.getVars();
    const FN = interp.getFns();
    const checks = [
      // 0: Командлеты и справка
      () => lastHas(/get-help\s+get-service/) && /Get-Service|служб/i.test(outText),
      // 1: Конвейер и объекты
      () => lastHas(/select(-object)?\b.*-first\s+3/) && result.length === 3 && result.every((x) => x && x.CPU !== void 0) && result.every((x, j, a) => !j || a[j - 1].CPU >= x.CPU),
      // 2: Фильтрация
      () => lastHas(/where(-object)?/) && result.length > 0 && result.every((x) => Number(x.CPU) > 50),
      // 3: Переменные и массивы
      () => has(/\$svc\s*=.*get-service/i) && Array.isArray(V.svc) && V.svc.every((x) => x.Status === "Running") && lastHas(/\$svc\.count/i) && Number(outText.trim()) === V.svc.length,
      // 4: Файлы и папки
      () => has(/(set-content|sc)\s+hello\.txt/i) && lastHas(/(get-content|cat|type|gc)\s+hello\.txt/i) && outText.trim().length > 0,
      // 5: Условия и циклы
      () => lastHas(/foreach\s*\(\s*\$\w+\s+in\s+1\.\.5/i) && result.map(String).join(",") === "1,2,3,4,5",
      // 6: Поиск по тексту и логам
      () => lastHas(/select-string/i) && /ERROR/i.test(outText) && outText.split("\n").filter((x) => /ERROR/i.test(x)).length >= 2,
      // 7: Службы и процессы
      () => has(/stop-service\s+(-name\s+)?spooler/i) && lastHas(/get-service/i) && env.svcs.find((x) => x.Name === "Spooler")?.Status === "Stopped" && result.some((x) => x.Status === "Stopped"),
      // 8: Учётные записи
      () => lastHas(/get-localuser/) && result.length > 0 && result.every((x) => x.Enabled === true),
      // 9: Журналы событий
      () => lastHas(/measure(-object)?/) && result.length === 1 && Number(result[0].Count) >= 1 && has(/4625/i),
      // 10: Хэш-таблицы
      () => has(/\$h\s*=\s*@\{/i) && V.h && V.h.Host !== void 0 && V.h.Port !== void 0 && lastHas(/\$h(\.port|\[["']port["']\])/i) && outText.trim() === String(V.h.Port),
      // 11: Функции
      () => Object.keys(FN).some((n) => {
        const name = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp("function\\s+" + name + "\\b|\\b" + name + "\\s*\\(", "i").test(historyText);
      }) && lastHas(/^[a-z_][\w-]*(?:\s|$)/i) && outText.trim().length > 0 && result.length > 0,
      // 12: Обработка ошибок
      () => interp.wasCaught() && /^try\s*\{/i.test(lastCmd) && /catch/i.test(lastCmd) && outText.trim().length > 0,
      // 13: Подозрительные соединения
      () => lastHas(/get-process\s+-id/) && result.some((x) => x.Id === 6666) && has(/4444/),
      // 14: Целостность и политики
      () => has(/get-filehash/i) && lastHas(/get-executionpolicy/i) && outText.trim() === env.getExecutionPolicy(),
      // 15: Поиск секретов
      () => lastHas(/select-string/i) && /password/i.test(outText) && /get-childitem[\s\S]*recurse[\s\S]*select-string/i.test(historyText)
    ];
    let passed = false;
    try {
      passed = !!checks[lessonIndex] && checks[lessonIndex]();
    } catch (e) {
      passed = false;
    }
    if (passed) {
      return { passed: true, message: "\u0417\u0430\u0434\u0430\u043D\u0438\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E \u2713" };
    }
    const lesson = LS[lessonIndex];
    if (lesson && lesson.h) {
      return { passed: false, message: "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435: " + lesson.h };
    }
    return { passed: false, message: "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u0443\u044E \u043A\u043E\u043C\u0430\u043D\u0434\u0443." };
  }

  // js/app.js
  var LS2 = flattenLessons();
  var TOTAL_LESSONS = LS2.length;

  // js/pages/common.js
  var $ = (s) => document.querySelector(s);
  var esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function initPage() {
    initState();
    document.querySelectorAll("[data-go]").forEach((b) => {
      b.onclick = () => {
        location.href = b.dataset.go;
      };
    });
    refreshHeader();
  }
  function refreshHeader() {
    const bar = $("#bar");
    if (bar) bar.style.width = progressPercent(TOTAL_LESSONS) + "%";
    const pc = $("#pc");
    if (pc) pc.textContent = completedCount() + " / " + TOTAL_LESSONS;
  }

  // js/pages/course.js
  initPage();
  var hdr = document.querySelector("header");
  var rs = document.createElement("button");
  rs.className = "gh";
  rs.id = "rs";
  rs.textContent = "\u0421\u0431\u0440\u043E\u0441";
  hdr.append(rs);
  var cur = getCurrentLesson();
  var start = 0;
  var term = createTerminal({
    outputEl: $("#o"),
    inputEl: $("#in"),
    promptEl: $("#ps"),
    onAfterExec(line, hist, text, results) {
      const r = checkTask(cur, hist.slice(start), text, results, term.getInterp(), term.getEnv());
      if (r.passed && !isLessonCompleted(cur)) {
        markLessonCompleted(cur);
        const tk = $("#tk");
        if (tk) tk.classList.add("ok");
        renderNav();
        refreshHeader();
        showToast(completedCount() === TOTAL_LESSONS ? "\u041A\u0443\u0440\u0441 \u043F\u0440\u043E\u0439\u0434\u0435\u043D! \u{1F389}" : "\u0417\u0430\u0434\u0430\u043D\u0438\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E \u2713");
      }
    }
  });
  function renderNav() {
    let k = 0;
    $("#nv").innerHTML = courseModules.map((m) => "<h4>" + esc(m.name) + " <span>" + esc(m.level) + "</span></h4>" + m.lessons.map((l) => {
      const i = k++, done = isLessonCompleted(i);
      return '<button data-i="' + i + '" class="' + (done ? "d " : "") + (i === cur ? "on" : "") + '"><b>' + (done ? "\u2713" : i + 1) + "</b>" + esc(l.t) + "</button>";
    }).join("")).join("") + '<div class="pages"><a href="index.html">\u0413\u043B\u0430\u0432\u043D\u0430\u044F</a><a href="progress.html">\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441</a><a href="about.html">\u041E \u043F\u0440\u043E\u0435\u043A\u0442\u0435</a></div>';
  }
  function show(i) {
    cur = Math.min(Math.max(i, 0), LS2.length - 1);
    setCurrentLesson(cur);
    start = term.getHistory().length;
    const l = LS2[cur];
    $("#ls").innerHTML = '<div class="bd">' + esc(l.level) + " \xB7 " + esc(l.module) + "</div><h1>" + esc(l.t) + "</h1><div>" + l.th + "</div><h3>\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0432 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B\u0435</h3>" + l.ex.map((e, k) => '<button class="ch" data-k="' + k + '">' + esc(e) + "</button>").join("") + '<div class="task' + (isLessonCompleted(cur) ? " ok" : "") + '" id="tk"><div class="st">\u2713 \u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E</div><b>\u0417\u0430\u0434\u0430\u043D\u0438\u0435</b><p>' + esc(l.task) + '</p><button id="hn" aria-expanded="false">\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0440\u0435\u0448\u0435\u043D\u0438\u0435</button><pre id="hi" hidden>' + esc(l.h) + '</pre></div><div class="nv"><button id="pv"' + (cur ? "" : " disabled") + '>\u2190 \u041D\u0430\u0437\u0430\u0434</button><button class="pr" id="nx"' + (cur < LS2.length - 1 ? "" : " disabled") + ">\u0414\u0430\u043B\u0435\u0435 \u2192</button></div>";
    $("#hn").onclick = () => {
      const h = $("#hi");
      h.hidden = !h.hidden;
      $("#hn").setAttribute("aria-expanded", String(!h.hidden));
    };
    $("#pv").onclick = () => show(cur - 1);
    $("#nx").onclick = () => show(cur + 1);
    $("#ls").scrollTop = 0;
    window.scrollTo(0, 0);
    renderNav();
    refreshHeader();
    closeDrawer();
  }
  function closeDrawer() {
    $("#nv").classList.remove("open");
    $("#mn").setAttribute("aria-expanded", "false");
  }
  $("#ls").onclick = (e) => {
    const b = e.target.closest(".ch");
    if (!b) return;
    term.exec(LS2[cur].ex[b.dataset.k]);
    if (innerWidth < 1e3) $("#tm").scrollIntoView({ behavior: "smooth" });
  };
  $("#nv").onclick = (e) => {
    const b = e.target.closest("button[data-i]");
    if (b) show(+b.dataset.i);
  };
  $("#mn").onclick = () => {
    const o = $("#nv").classList.toggle("open");
    $("#mn").setAttribute("aria-expanded", String(o));
  };
  $("#cl").onclick = () => term.clearOutput();
  $("#tm").onclick = () => {
    if (!getSelection().toString()) $("#in").focus({ preventScroll: true });
  };
  var timer = 0;
  rs.onclick = () => {
    if (!timer) {
      rs.textContent = "\u0422\u043E\u0447\u043D\u043E?";
      timer = setTimeout(() => {
        timer = 0;
        rs.textContent = "\u0421\u0431\u0440\u043E\u0441";
      }, 3e3);
      return;
    }
    clearTimeout(timer);
    timer = 0;
    rs.textContent = "\u0421\u0431\u0440\u043E\u0441";
    resetProgress();
    term.resetLab();
    show(0);
  };
  term.out("PShell 4All \u2014 \u0443\u0447\u0435\u0431\u043D\u0430\u044F \u043A\u043E\u043D\u0441\u043E\u043B\u044C. \u042D\u0442\u043E \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u044B\u0439 \u0441\u0438\u043C\u0443\u043B\u044F\u0442\u043E\u0440: \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u0437\u0430\u0442\u0440\u0430\u0433\u0438\u0432\u0430\u0435\u0442 \u0432\u0430\u0448 \u043A\u043E\u043C\u043F\u044C\u044E\u0442\u0435\u0440.\n\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0441 Get-Command, \u0441\u0442\u0440\u0435\u043B\u043A\u0430 \u0432\u0432\u0435\u0440\u0445 \u2014 \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0430\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u0430.\n", "sy");
  var fromHash = parseInt(location.hash.slice(1), 10);
  show(fromHash >= 1 && fromHash <= LS2.length ? fromHash - 1 : cur);
})();
