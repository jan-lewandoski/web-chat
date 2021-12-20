const http = require('http').createServer()

const io = require('socket.io')(http, {
  cors: { origin: '*' },
})

let users = []
let history = []

io.on('connection', (socket) => {
  socket.on('join', (username) => {
    users.push({ id: socket.id, username })
    io.emit('join', {
      joined: username,
      users,
    })

    io.to(socket.id).emit(
      'history',
      history.map(({ username, text }) => `${username}: ${text}`)
    )
  })

  socket.on('message', (message) => {
    const { username, text } = message

    history.push({ username, text })

    io.emit('message', `${username}: ${text}`)
  })

  socket.on('disconnect', () => {
    const disconnectedUser = users.find((user) => user.id === socket.id)

    users = users.filter((user) => user.id !== socket.id)

    io.emit('leave', {
      left: disconnectedUser?.username,
      users,
    })

    if (!users?.length) {
      history = []
    }
  })
})

http.listen(8080, () => console.log('Listening on http://localhost:8080'))
