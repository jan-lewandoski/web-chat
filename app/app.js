const socket = io('ws://localhost:8080')

let username = ''
let connected = false

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
  document.querySelector('#chat-wrapper').classList.toggle('d-none')

  // Inform others that a new user joined
  socket.emit('join', username)
  socket.on('join', ({ joined, users }) => {
    connected = true
    const toastEl = document.querySelector('.toast')
    const toastBodyEl = document.querySelector('.toast-body')
    toastBodyEl.innerHTML = `<span class="fw-bold">${joined}</span> joined the room!`
    const toast = new bootstrap.Toast(toastEl)
    toast.show()

    document.querySelector('#users-list').innerHTML = ''

    users.forEach((user) => {
      const div = document.createElement('div')
      div.classList.add(
        'd-flex',
        'align-items-center',
        'justify-content-center',
        'px-3',
        'py-2',
        'mb-2',
        'bg-light',
        'rounded'
      )
      div.style.width = 'fit-content'

      const activeIndicator = document.createElement('div')
      activeIndicator.classList.add(
        'p-1',
        'me-2',
        'bg-success',
        'rounded-circle'
      )

      const username = document.createElement('span')
      username.innerHTML = user.username

      div.appendChild(activeIndicator)
      div.appendChild(username)

      document.querySelector('#users-list').appendChild(div)
    })
  })

  // Inform others that a user has left the room
  socket.on('leave', ({ left, users }) => {
    connected = false
    const toastEl = document.querySelector('.toast')
    const toastBodyEl = document.querySelector('.toast-body')
    toastBodyEl.innerHTML = `<span class="fw-bold">${left}</span> has left the room...`
    const toast = new bootstrap.Toast(toastEl)
    toast.show()

    document.querySelector('#users-list').innerHTML = ''

    users.forEach((user) => {
      const div = document.createElement('div')
      div.classList.add(
        'd-flex',
        'align-items-center',
        'justify-content-center',
        'px-3',
        'py-2',
        'mb-2',
        'bg-light',
        'rounded'
      )
      div.style.width = 'fit-content'

      const activeIndicator = document.createElement('div')
      activeIndicator.classList.add(
        'p-1',
        'me-2',
        'bg-success',
        'rounded-circle'
      )

      const username = document.createElement('span')
      username.innerHTML = user.username

      div.appendChild(activeIndicator)
      div.appendChild(username)

      document.querySelector('#users-list').appendChild(div)
    })
  })

  // Handle sending new message
  document.querySelector('#send').addEventListener('click', () => {
    console.log('here')
    const text = document.querySelector('#message').value
    document.querySelector('#message').value = ''
    const message = {
      username,
      text,
    }
    socket.emit('message', message)
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
    if (!connected) return

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
