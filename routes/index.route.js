const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Index'
  })
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
