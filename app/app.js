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

  // Inform others that a user has left the room
  socket.on('leave', (oldUsername) => {
    const toastEl = document.querySelector('.toast')
    const toastBodyEl = document.querySelector('.toast-body')
    toastBodyEl.innerHTML = `<span class="fw-bold">${oldUsername}</span> has left the room...`
    const toast = new bootstrap.Toast(toastEl)
    toast.show()
  })

  // Handle sending new message
  document.querySelector('#send').addEventListener('click', () => {
    const text = document.querySelector('#message').value
    document.querySelector('#message').value = ''
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
    const div = document.createElement('div')
    div.classList.add(
      'px-3',
      'py-2',
      'mb-2',
      'bg-primary',
      'rounded-pill',
      'text-light'
    )
    div.style.width = 'fit-content'
    div.innerHTML = message
    document.querySelector('#messages').appendChild(div)
  })
})

// Handle new messages
socket.on('message', (message) => {
  const div = document.createElement('div')
  div.classList.add(
    'px-3',
    'py-2',
    'mb-2',
    'bg-primary',
    'rounded-pill',
    'text-light'
  )
  div.style.width = 'fit-content'
  div.innerHTML = message
  document.querySelector('#messages').appendChild(div)
})

// 2.
// Store history
// Emit the history to the user that connected
// Listen to leave events - if no of users is 0, remove the history
