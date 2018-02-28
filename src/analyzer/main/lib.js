import colors from 'colors'
import redis from 'redis'

const client = redis.createClient({
  host: 'localhost',
  port: 6379
})

// Sets color of console error log text to red
colors.setTheme({
  error: 'red'
})

// Gets keys of all the persisted users
const getAllUserKeys = () => new Promise((resolve, reject) => {
  try {
    client.keys('*', (err, replies) => {
      if (err) {
        reject(err)
      } else {
        resolve(replies)
      }
    })
  } catch (e) {
    reject(e)
  }
})

const getUserData = (key) => new Promise((resolve, reject) => {
  try {
    client.hgetall(key, (err, replies) => {
      if (err) {
        reject(err)
      } else {
        resolve(replies)
      }
    })
  } catch (e) {
    reject(e)
  }
})

const getAllUserData = (keys) => Promise.all(keys.map(getUserData))

const countUsers = (userData) => new Promise((resolve, reject) => {
  try {
    resolve(userData.length)
  } catch (e) {
    reject(e)
  }
})

// Entrypoint
const getStats = () =>
  getAllUserKeys().then(getAllUserData).then(countUsers).catch(err => {
    console.error(err.message.error)
  }).then((r) => {
    // client.end(true)
    return r
  })

export default getStats
