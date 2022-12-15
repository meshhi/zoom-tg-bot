const TelegramApi = require('node-telegram-bot-api')
const ZoomTokenGenerator = require('./token-generator.js');

const zoomApi = require('./zoom-api.js');
var request = require('request');
require('dotenv').config()

const token = process.env.ZOOM_TOKEN
const zoomToken = ZoomTokenGenerator.token

const bot = new TelegramApi(token, {polling: true})

db = {}

const start = () => {
  bot.setMyCommands([
    {"command": '/userinfo', "description": 'Информация о пользователе'},
    {"command": '/createmeeting', "description": 'Создать вкс'},
    {"command": '/updatemeeting', "description": 'Обновить вкс'},
    {"command": '/deletemeeting', "description": 'Удалить вкс'},
    {"command": '/getmeeting', "description": 'Получить данные о вкс'},
])

  bot.on('message', async msg=>{
    if (msg.text == '/userinfo'){
        zoomuserResponse = await zoomApi.zoomuserInfo(zoomToken);
        zoomuserResult = `Your zoom user is ${zoomuserResponse.first_name} ${zoomuserResponse.last_name}, email ${zoomuserResponse.email}`;
        return bot.sendMessage(msg.chat.id, `${zoomuserResult}`);
    } 
    
    //createmeet-step1
    if (msg.text == '/createmeeting'){
      //в БД создаем запись для хранения вкс пользователя
      if (!db[msg.chat.id]){
        db[msg.chat.id] = []
      } 

      //в список вкс пользователя добавляем объект-вкс
      db[msg.chat.id].push({})
    
      //на 1 шаге генерируем выбор пользователем даты
      let dataArr = []
      let CurrentTime = new Date();
      CurrentTime.setDate(CurrentTime.getDate()-1)
    
      for (let i = 0; i <=30; i++) {
        CurrentTime.setDate(CurrentTime.getDate() + 1)
        let dd = String(CurrentTime.getDate()).padStart(2, '0');
        let mm = String(CurrentTime.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = CurrentTime.getFullYear();

        currentStr = yyyy + '-' + mm + '-' + dd;

        //DATEWRAP

        if(((i % 3) == 0) || (i == 0)){
          dataArr.push([]);
        }
        dataArr[dataArr.length-1].push({text: `${currentStr}`, callback_data: `/datastart${currentStr}`})

      }
    
      const zoomOptions = {
        reply_markup: JSON.stringify({
          inline_keyboard: 
            dataArr
        })
      }
      return bot.sendMessage(msg.chat.id, `Выберите дату`, zoomOptions);
    }

    if (msg.text == '/updatemeeting'){
      topic = 'Test title';
      start_time = "2022-12-12T17:00:00";
      duration = 60;
      // updatezoomMeetingResponse = await zoomApi.updateMeeting(zoomToken, meetingId=undefined, topic=undefined, start_time=undefined);
      // updatezoomMeetingResult = `Updated meeting ${updatezoomMeetingResponse}`;
      // return bot.sendMessage(msg.chat.id, `${updatezoomMeetingResult}`);
      return bot.sendMessage(msg.chat.id, `Функционал в разработке`);
    }
    if (msg.text == '/deletemeeting'){
      topic = 'Test title';
      start_time = "2022-12-12T17:00:00";
      duration = 60;
      // deletezoomMeetingResponse = await zoomApi.deleteMeeting(zoomToken, meetingId=undefined);
      // deletezoomMeetingResult = `Deleted meeting ${deletezoomMeetingResponse}`;
      // return bot.sendMessage(msg.chat.id, `${deletezoomMeetingResult}`);
      return bot.sendMessage(msg.chat.id, `Функционал в разработке`);
    }
    if (msg.text == '/getmeeting'){
      // getMeetingResponse = await zoomApi.getMeeting(zoomToken, topic=undefined, start_time=undefined, duration=undefined);
      // getMeetingResult = `Get meeting is ${getMeetingResponse}`;
      // return bot.sendMessage(msg.chat.id, `${getMeetingResult}`);
      return bot.sendMessage(msg.chat.id, `Функционал в разработке`);
    }

    //createmeet-step4
    if (msg.text.toLowerCase().indexOf(`т+`) == 0){
      //обрабатываем тему вкс
      const topic = msg.text.slice(2);
      const chatId = msg.chat.id;
      
      //если функция была вызвана минуя /createmeeting, то ошибка
      if (!db[msg.chat.id]){
        return bot.sendMessage(chatId, `Некорректный ввод`);
      } 

      //для простоты, работаем только с последней записью о вкс
      //если в записи отсутствует topic, то вносим его, иначе возвращаем существующее значение
      if (!('topic' in db[chatId][db[chatId].length-1])){
        db[chatId][db[chatId].length-1].topic = topic;
      } else {
        return bot.sendMessage(msg.chat.id, `Название последней конференции ${db[chatId][db[chatId].length-1].topic}`);
      }
      return bot.sendMessage(msg.chat.id, `Введите участников, начиная с <b>у+</b>. Пример ввода: \n<pre>у+МИАЦ, АОКБ, АГКП1</pre>`, {parse_mode : "HTML"});
    }

    //createmeet-step5
    if (msg.text.toLowerCase().indexOf(`у+`) == 0){
      //обрабатываем участников вкс
      const members = msg.text.slice(2);
      const chatId = msg.chat.id;
      let duration = 120;

      //если функция была вызвана минуя /createmeeting, то ошибка
      if (!db[msg.chat.id]){
        return bot.sendMessage(chatId, `Неизвестная команда`);
      }

      //для простоты, работаем только с последней записью о вкс
      //если в записи отсутствует members, то вносим его, иначе возвращаем существующее значение
      if (!('members' in db[chatId][db[chatId].length-1])){
        db[chatId][db[chatId].length-1].members = members;
      } else {
        return bot.sendMessage(msg.chat.id, `Участники последней конференции ${db[chatId][db[chatId].length-1].members}`);
      }
      
      //если какой либо параметр по последней вкс пользователь не внес, то вкс не создается, нужно создать новую
      if (!(('members' in db[chatId][db[chatId].length-1])&&('topic' in db[chatId][db[chatId].length-1])&&('dateStart' in db[chatId][db[chatId].length-1])&&('dateTime' in db[chatId][db[chatId].length-1]))){
        return bot.sendMessage(msg.chat.id, `По последней вкс не хватает данных. Создайте новую через команду /start`);
      }
      
      vksStartTime = `Дата:${db[chatId][db[chatId].length-1].dateStart}\nВремя:${db[chatId][db[chatId].length-1].dateTime}`;
      vksTopic = db[chatId][db[chatId].length-1].topic;
      vksMembers = db[chatId][db[chatId].length-1].members
      //если дошли до сюда, то создаем вкс через zoom api
      createzoomMeetingResponse = await zoomApi.createZoomMeeting(zoomToken, vksTopic, vksStartTime, duration);
      await bot.sendMessage(msg.chat.id, `Вы создали ВКС на ${createzoomMeetingResponse.start_time} c темой ${createzoomMeetingResponse.topic}. Ссылка ниже.`);
      createzoomMeetingResult = `ГБУЗ АО МИАЦ приглашает вас на запланированную конференцию: Zoom.\nТема: ${vksTopic}\n${vksStartTime} Москва\nУчастники: ${vksMembers}\nПодключиться к конференции Zoom ${createzoomMeetingResponse.start_url}\nИдентификатор конференции: ${createzoomMeetingResponse.id}\nКод доступа: ${createzoomMeetingResponse.password}`;
      
      return bot.sendMessage(msg.chat.id, `${createzoomMeetingResult}`);
    }
      
    // return bot.sendMessage(msg.chat.id, 'Unknown command');
})

bot.on('callback_query', async (msg)=>{
      const data = msg.data;
      const chatId = msg.message.chat.id;

      //createmeet-step2
      //обрабатываем результат с выбранной пользователем датой
      if (data.toString().toLowerCase().indexOf(`/datastart`) == 0){
        currentDate = data.toString().slice(10)
      
        //если функция была вызвана минуя /createmeeting, то ошибка
        if (!db[chatId]){
          return bot.sendMessage(chatId, `Некорректный ввод`);
        }

        //для простоты, работаем только с последней записью о вкс
        //если в записи отсутствует members, то вносим его, иначе возвращаем существующее значение
        if (!('dateStart' in db[chatId][db[chatId].length-1])){
          db[chatId][db[chatId].length-1].dateStart = currentDate;
        } else {
          return bot.sendMessage(chatId, `Дата последней вкс ${db[chatId][db[chatId].length-1].dateStart}`);
        }

        //на 2 шаге генерируем выбор пользователем времени
        let timeArr = []
        let tempTime = new Date();
        
        for (let i = 0; i <=23; i++) {
            timeArr.push([]);
          for (let j = 0; j <60; j += 15) {
            tempTime.setHours(i)
            tempTime.setMinutes(j)
            tempTime.setSeconds(0)
            let hour = String(tempTime.getHours()).padStart(2, '0');
            let min = String(tempTime.getMinutes()).padStart(2, '0');         
            let sec = String(tempTime.getSeconds()).padStart(2, '0');

            currentStr = hour + ':' + min + ':' + sec;
          
            timeArr[timeArr.length-1].push({text: `${hour + ':' + min}`, callback_data: `/datatime${currentStr}`})
          }
        }
      
        const timeOptions = {
          reply_markup: JSON.stringify({
            inline_keyboard: 
              timeArr
          })
        }
        
        return bot.sendMessage(chatId, `Выберите время`, timeOptions);

        }
      
      //createmeet-step3
      //обрабатываем результат с выбранным пользователем временем
      if (data.toString().toLowerCase().indexOf(`/datatime`) == 0){
        currentTime = data.toString().slice(9)
      
        //если функция была вызвана минуя /createmeeting, то ошибка
        if (!db[chatId]){
          return bot.sendMessage(chatId, `Некорректный ввод`);
        }

        //для простоты, работаем только с последней записью о вкс
        //если в записи отсутствует members, то вносим его, иначе возвращаем существующее значение
        if (!('dateTime' in db[chatId][db[chatId].length-1])){
          db[chatId][db[chatId].length-1].dateTime = currentTime;
        } else {
          return bot.sendMessage(chatId, `Время последней вкс ${db[chatId][db[chatId].length-1].dateTime}`);
        }

        return bot.sendMessage(chatId, 'Введите тему, начиная с <b>т+</b>. Пример ввода: \n<pre>т+Вопросы реализации ТМК</pre>', {parse_mode : "HTML"});
        }
    }
  )
}

start();