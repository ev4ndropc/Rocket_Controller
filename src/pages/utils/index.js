import TelegramBot from 'node-telegram-bot-api'
import database from '../../database'
import moment from 'moment'
moment.locale('pt-br')

const telegram = new TelegramBot(process.env.TELEGRAM_ACCESS_TOKEN, { polling: true })

const getExpireUsers = async () => {
    const users = await database('users').where({ is_active: 1 }).select()
    const expire_users = []

    users.forEach(async user => {
        if(moment().isAfter(moment(user.expire_at).format('YYYY-MM-DD HH:mm:ss'))) {
            if(user.message_sent == 0) {
                var message = "O client <b>"+user.domain+"</b> expira hoje\n\nContato: "+user.contact+"\nValor:"+user.price+"</b>."
                await telegram.sendMessage(process.env.TELEGRAM_USER_ID, message, {parse_mode: 'HTML'})
                return await database('users').update({ message_sent: 1 }).where({ id: user.id })
            }
        }
    })

    return expire_users
}

getExpireUsers()

export default getExpireUsers