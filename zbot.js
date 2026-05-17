const mineflayer = require('mineflayer')
const { Vec3 } = require('vec3')

const SERVER_HOST = 'celestiansmp.us'
const SERVER_PORT = 25565

const BASE_NICK = 'test' // test1, test2, etc
const BOT_COUNT = 2

const PASSWORD = 'reiko14'
const TPA_TARGET = 'zDrowzy'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function createBot(index) {
  const username = `${BASE_NICK}${index}`

  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username,
    version: false
  })

  bot.once('spawn', async () => {
    console.log(`[${username}] Entró al servidor`)

    try {
      await sleep(3000)
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`)
      console.log(`[${username}] /register enviado`)

      await sleep(2000)
      bot.chat(`/login ${PASSWORD}`)
      console.log(`[${username}] /login enviado`)

      await sleep(2000)
      bot.chat(`/tpa ${TPA_TARGET}`)
      console.log(`[${username}] /tpa enviado`)

      await sleep(5000)
      bot.chat('/shop Mobs')
      console.log(`[${username}] /shop Mobs enviado`)

      await sleep(4000)

      if (!bot.currentWindow) {
        console.log(`[${username}] No se abrió ninguna GUI`)
        return
      }

      console.log(`[${username}] GUI detectada`)

      // Buscar hueso
      let boneSlot = bot.currentWindow.slots.findIndex(item =>
        item && item.name.includes('bone')
      )

      if (boneSlot === -1) {
        console.log(`[${username}] No encontró el hueso`)
        return
      }

      await bot.clickWindow(boneSlot, 0, 0)
      console.log(`[${username}] Click al hueso`)

      await sleep(1500)

      // Buscar cofre
      let chestSlot = bot.currentWindow.slots.findIndex(item =>
        item && item.name.includes('chest')
      )

      if (chestSlot === -1) {
        console.log(`[${username}] No encontró el cofre`)
        return
      }

      await bot.clickWindow(chestSlot, 0, 0)
      console.log(`[${username}] Click al cofre`)

      await sleep(1500)

      // Buscar crystal azul/celeste x32
      let crystalSlot = bot.currentWindow.slots.findIndex(item => {
        if (!item) return false

        const name = item.name.toLowerCase()

        return (
          item.count === 32 &&
          (
            name.includes('crystal') ||
            name.includes('blue') ||
            name.includes('cyan')
          )
        )
      })

      if (crystalSlot === -1) {
        console.log(`[${username}] No encontró el bloque crystal x32`)
        return
      }

      await bot.clickWindow(crystalSlot, 0, 0)
      await sleep(400)
      await bot.clickWindow(crystalSlot, 0, 0)

      console.log(`[${username}] Doble click al crystal`)

      await sleep(1500)

      // Buscar papel
      let paperSlot = bot.currentWindow.slots.findIndex(item =>
        item && item.name.includes('paper')
      )

      if (paperSlot === -1) {
        console.log(`[${username}] No encontró el papel`)
        return
      }

      await bot.clickWindow(paperSlot, 0, 0)
      console.log(`[${username}] Click al papel`)

      await sleep(2500)

      // Esperar mensaje de zDrowzy con "refill"
      console.log(`[${username}] Esperando mensaje de ${TPA_TARGET} con "refill"`)

      bot.on('messagestr', async (message) => {
        const msg = message.toLowerCase()

        if (
          msg.includes(TPA_TARGET.toLowerCase()) &&
          msg.includes('refill')
        ) {
          console.log(`[${username}] Detectó mensaje refill de ${TPA_TARGET}`)

          const bones = bot.inventory.items().filter(item =>
            item.name.includes('bone')
          )

          if (bones.length === 0) {
            console.log(`[${username}] No tiene huesos en el inventario`)
            return
          }

          bot.setControlState('forward', true)

          for (const bone of bones) {
            try {
              await bot.tossStack(bone)
              console.log(`[${username}] Tiró ${bone.count} huesos`)
            } catch (err) {
              console.log(`[${username}] Error tirando huesos:`, err.message)
            }
          }

          await sleep(1000)
          bot.setControlState('forward', false)

          console.log(`[${username}] Terminó todo`)
        }
      })

    } catch (err) {
      console.log(`[${username}] Error general:`, err)
    }
  })

  bot.on('message', msg => {
    console.log(`[${username}] ${msg.toAnsi()}`)
  })

  bot.on('kicked', reason => {
    console.log(`[${username}] Kickeado:`, reason)
  })

  bot.on('error', err => {
    console.log(`[${username}] Error:`, err.message)
  })
}

for (let i = 1; i <= BOT_COUNT; i++) {
  createBot(i)
}

/*
INSTALACIÓN:

1. Instalar Node.js
2. Abrir carpeta del proyecto
3. Ejecutar:

npm init -y
npm install mineflayer vec3

4. Guardar esto como index.js
5. Ejecutar:

node index.js

PARA CAMBIAR EL NICK:
Cambiar BASE_NICK.

Ejemplo:
BASE_NICK = 'reiko'

=> reiko1 y reiko2
*/
