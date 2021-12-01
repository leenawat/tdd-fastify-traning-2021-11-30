import App from './main-app'

const startServer  = async () => {
    try {
        await App.listen(3000)
      } catch (err) {
        App.log.error(err)
        process.exit(1)
      }
}

startServer()