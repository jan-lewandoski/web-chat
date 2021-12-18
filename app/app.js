const socket = io('ws://localhost:8080')

// Open username modal
const usernameModal = new bootstrap.Modal(
  document.getElementById('username-modal'),
  {
    keyboard: false,
    backdrop: 'static',
  }
)
usernameModal.show()

// Generate random username
const randomNumber = Math.floor(Math.random() * 100)
const randomUsername = `user${randomNumber}`
document.querySelector('#input-username').value = randomUsername

// Username submitted
let username = ''
document.querySelector('#btn-username-submit').addEventListener('click', () => {
  // Save username
  username = document.querySelector('#input-username').value

  //   Close modal
  usernameModal.hide()

  // Init chat
  document.querySelector('#chat').classList.toggle('d-none')

  socket.on('message', (text) => {
    const el = document.createElement('li')
    el.innerHTML = text
    document.querySelector('ul').appendChild(el)
  })

  document.querySelector('#send').addEventListener('click', () => {
    const text = document.querySelector('#message').value
    socket.emit('message', text)
  })
})
// 1.
// When sending the message, send sender's username
// When joining the chat, send username
// When message comes in, send like <username>: message

// 2.
// Store history
// Emit the history to the user that connected
// Listen to leave events - if no of users is 0, remove the history
