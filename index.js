const http = require('http')

http.createServer(function(req, res) {
res.write('online')
res.end()
}).listen(process.env.PORT || 3000)

const mineflayer = require('mineflayer')

const SERVER_HOST = 'celestiansmp.us'
const SERVER_PORT = 25565

const BASE_NICK = 'zDrowzyAFK'
const BOT_COUNT = 2

const PASSWORD = 'reiko14'
const TPA_TARGET = 'zDrowzy'

function sleep(ms) {
return new Promise(function(resolve) {
setTimeout(resolve, ms)
})
}

function createBot(index) {
const username = BASE_NICK + index
let reconnecting = false

const bot = mineflayer.createBot({
host: SERVER_HOST,
port: SERVER_PORT,
username: username,
version: false
})

bot.once('spawn', async function() {
console.log('[' + username + '] Entró al servidor')


try {
  await sleep(3000)

  bot.chat('/register ' + PASSWORD + ' ' + PASSWORD)
  console.log('[' + username + '] Register enviado')

  await sleep(2000)

  bot.chat('/login ' + PASSWORD)
  console.log('[' + username + '] Login enviado')

  await sleep(2000)

  bot.chat('/tpa ' + TPA_TARGET)
  console.log('[' + username + '] TPA enviado')

  await sleep(5000)

  bot.chat('/shop Mobs')
  console.log('[' + username + '] Shop abierto')

  await sleep(4000)

  if (!bot.currentWindow) {
    console.log('[' + username + '] No se abrió la GUI')
    return
  }

  const boneSlot = bot.currentWindow.slots.findIndex(function(item) {
    return item && item.name.includes('bone')
  })

  if (boneSlot !== -1) {
    await bot.clickWindow(boneSlot, 0, 0)
    console.log('[' + username + '] Click hueso')
  }

  await sleep(1500)

  const chestSlot = bot.currentWindow.slots.findIndex(function(item) {
    return item && item.name.includes('chest')
  })

  if (chestSlot !== -1) {
    await bot.clickWindow(chestSlot, 0, 0)
    console.log('[' + username + '] Click cofre')
  }

  await sleep(1500)

  const crystalSlot = bot.currentWindow.slots.findIndex(function(item) {
    if (!item) return false

    const name = item.name.toLowerCase()

    return (
      item.count === 32 &&
      (
        name.includes('crystal') ||
        name.includes('cyan') ||
        name.includes('blue')
      )
    )
  })

  if (crystalSlot !== -1) {
    await bot.clickWindow(crystalSlot, 0, 0)
    await sleep(400)
    await bot.clickWindow(crystalSlot, 0, 0)

    console.log('[' + username + '] Doble click crystal')
  }

  await sleep(1500)

  const paperSlot = bot.currentWindow.slots.findIndex(function(item) {
    return item && item.name.includes('paper')
  })

  if (paperSlot !== -1) {
    await bot.clickWindow(paperSlot, 0, 0)
    console.log('[' + username + '] Click papel')
  }

  console.log('[' + username + '] Esperando refill...')

  bot.on('messagestr', async function(message) {
    const msg = message.toLowerCase()

    if (
      msg.includes(TPA_TARGET.toLowerCase()) &&
      msg.includes('refill')
    ) {
      console.log('[' + username + '] Refill detectado')

      const bones = bot.inventory.items().filter(function(item) {
        return item.name.includes('bone')
      })

      if (bones.length === 0) {
        console.log('[' + username + '] No tiene huesos')
        return
      }

      bot.setControlState('forward', true)

      for (const bone of bones) {
        try {
          await bot.tossStack(bone)
          console.log('[' + username + '] Tiró ' + bone.count + ' huesos')
        } catch (err) {
          console.log(err.message)
        }
      }

      await sleep(1000)

      bot.setControlState('forward', false)

      console.log('[' + username + '] Terminó')
    }
  })

} catch (err) {
  console.log('[' + username + '] Error general')
  console.log(err)
}


})

bot.on('kicked', function(reason) {
console.log('[' + username + '] Kickeado')
console.log(reason)


if (!reconnecting) {
  reconnecting = true

  setTimeout(function() {
    console.log('[' + username + '] Reconectando...')
    createBot(index)
  }, 10000)
}


})

bot.on('end', function() {
console.log('[' + username + '] Desconectado')


if (!reconnecting) {
  reconnecting = true

  setTimeout(function() {
    console.log('[' + username + '] Reconectando...')
    createBot(index)
  }, 10000)
}


})

bot.on('error', function(err) {
console.log('[' + username + '] Error')
console.log(err.message)
})

bot.on('message', function(msg) {
console.log('[' + username + '] ' + msg.toAnsi())
})
}

for (let i = 1; i <= BOT_COUNT; i++) {
createBot(i)
}
