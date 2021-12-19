const http = require('http').createServer()

const io = require('socket.io')(http, {
  cors: { origin: '*' },
})

let connectionsCount = 0
let history = []

io.on('connection', (socket) => {
  connectionsCount++
  console.log('a user connected: ', socket.id)

  io.to(socket.id).emit(
    'history',
    history.map(({ username, text }) => `${username}: ${text}`)
  )

  socket.on('message', (message) => {
    const { username, text } = message

    history.push({ username, text })

    socket.emit('message', `${username}: ${text}`)
  })

  socket.on('disconnect', () => {
    connectionsCount--

    console.log('Disconnected')
    console.log('Clients count: ', connectionsCount)

    if (connectionsCount === 0) {
      history = []
    }
  })
})

http.listen(8080, () => console.log('Listening on http://localhost:8080'))
