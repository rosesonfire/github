import colors from 'colors'
import axios from 'axios'
import { parseString } from 'xml2js'
import redis from 'redis'

const client = redis.createClient({
  host: 'localhost',
  port: 6379
})

// Sets color of console error log text to red
colors.setTheme({
  error: 'red'
})

// Asynchronously parses xml string to json
const xmlToJson = (xml) => new Promise((resolve, reject) => {
  try {
    parseString(xml, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  } catch (e) {
    reject(e)
  }
})

// Extracts only the required data
const cherryPickRequiredData = ({ feed }) => new Promise((resolve, reject) => {
  try {
    const requiredData = feed.entry.map(e => {
      const author = e.author[0]
      return {
        updateTime: new Date(Date.parse(e.updated[0])),
        event: e.id[0].split(':')[2].split('/')[0],
        author: {
          name: author.name[0],
          uri: author.uri[0].replace('https://github.com/', '')
        }
      }
    })
    resolve(requiredData)
  } catch (e) {
    reject(e)
  }
})

// Persist data
const persist = (data) => new Promise((resolve, reject) => {
  try {
    data.forEach(d => client.hmset(
      d.author.uri,
      'updateTime', d.updateTime,
      'event', d.event,
      'author:name', d.author.name,
      'author:uri', d.author.uri))
  } catch (e) {
    reject(e)
  }
})

// Fetches required data from endpoint and returns in json
const fetchData = async () => {
  const { data } = await axios.get('http://github.com/timeline')
  const jsonData = await xmlToJson(data)
  const requiredData = await cherryPickRequiredData(jsonData)
  persist(requiredData)
}

export default fetchData
// Entrypoint
// fetchData().catch(err => {
//   console.error(err.message.error)
// }).then(() => {
//   client.end(true)
// })
