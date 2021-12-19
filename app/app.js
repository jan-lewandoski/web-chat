const socket = io('ws://localhost:8080')

let username = ''

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
document.querySelector('#btn-username-submit').addEventListener('click', () => {
  // Save username
  username = document.querySelector('#input-username').value

  //   Close modal
  usernameModal.hide()

  // Show the chat
  document.querySelector('#chat').classList.toggle('d-none')

  // Inform others that a new user joined
  socket.emit('join', username)
  socket.on('join', (newUsername) => {
    const toastEl = document.querySelector('.toast')
    const toastBodyEl = document.querySelector('.toast-body')
    toastBodyEl.innerHTML = `<span class="fw-bold">${newUsername}</span> joined the room!`
    const toast = new bootstrap.Toast(toastEl)
    toast.show()
  })

  // Handle sending new message
  document.querySelector('#send').addEventListener('click', () => {
    const text = document.querySelector('#message').value
    const message = {
      username,
      text,
    }
    socket.emit('message', message)
  })
})

// Handle history
socket.on('history', (history) => {
  history.forEach((message) => {
    console.log(message)
    const el = document.createElement('li')
    el.innerHTML = message
    document.querySelector('ul').appendChild(el)
  })
})

// Handle new messages
socket.on('message', (text) => {
  const el = document.createElement('li')
  el.innerHTML = text
  document.querySelector('ul').appendChild(el)
})

// 2.
// Store history
// Emit the history to the user that connected
// Listen to leave events - if no of users is 0, remove the history
