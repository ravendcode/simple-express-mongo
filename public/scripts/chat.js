var socket = io()
socket.on('connect', function () {
  console.log('Connection to server')
})

socket.on('disconnect', function () {
  console.log('Disconect from server')
})

socket.on('newMessage', function (message) {
  var $li = $('<li>')
  $li.text(message.from + ': ' + message.text)

  $('#messages').append($li)
})

socket.on('newLocationMessage', function (message) {
  var $li = $('<li>')
  var $a = $('<a target="_blank">My current location</a>')
  $li.text(message.from + ': ')
  $a.attr('href', message.url)
  $li.append($a)
  $('#messages').append($li)
})

// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'Hello all!'
// }, function (data) {
//   console.log('Got it', data)
// })

$('#message-form').on('submit', function (e) {
  e.preventDefault()
  var $input = $(this).find('[name=message]')
  socket.emit('createMessage', {
    from: 'User',
    text: $input.val()
  }, function () {
    $input.val('')
  })
})

var $locationButton = $('#send-location')
$locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.')
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, function () {
    alert('Unable to fetch location.')
  })
})
