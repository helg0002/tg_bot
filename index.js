const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = "5694658936:AAEqvuqKnKxqfxG9yGFen5Tau3qJD-a_EFo"

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const starGame = async chatId => {
    await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, попробуй угадать")
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},


    ])


    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;



        if (text === '/start'){
            await bot.sendMessage(chatId, "https://pictures.telegram-store.com/stickers/momITspecialist/momITspecialist_21.jpg")
            return bot.sendMessage(chatId, 'Добро пожаловать')
        }

        if (text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }
        if(text === "/game"){
           starGame(chatId)
        }
        return bot.sendMessage(chatId, "Я тебя не понимаю")
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if ( data === "/again") {
           return starGame(chatId)
        }
        if(data == chats[chatId]) {
            return bot.sendMessage(chatId, `Ты угадал, эта цифра ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты не угадал, это была цифра ${chats[chatId]}`, againOptions)
        }
    })

}

start()