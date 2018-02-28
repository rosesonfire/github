import fetchData from './lib'

const work = () => {
  fetchData().catch(err => {
    console.error(err.message.error)
  })
  setTimeout(work, 5000)
}

work()
