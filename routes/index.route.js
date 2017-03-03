const express = require('express')
const path = require('path')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Index'
  })
})

router.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/chat.html'))
})

router.get('/join-chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/join.html'))
})

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    evil: `<script>alert('you hacked')</script>`
  })
})

router.get('/hello', (req, res) => {
  res.send('Hello world')
})

module.exports = router
