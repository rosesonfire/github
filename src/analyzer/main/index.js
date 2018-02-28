import express from 'express'
import getStats from './lib'

const app = express()
const port = 8080

app.get('/stats', async (req, res, next) => {
  const r = await getStats()
  res.json({
    val: r
  })
  // res.write(`${r}`)
})

app.listen(port, () => {
  console.log(`listening at port ${port}`)
})
