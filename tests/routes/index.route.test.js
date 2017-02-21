const request = require('supertest')
const expect = require('expect')
const app = require('../../app.js')

describe('routes/index.route.js', () => {
  describe('#GET /', () => {
    it('should return <h1>Index</h1> response', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.text).toInclude('<h1>Index</h1>')
        })
        .end(done)
    })
  })

  describe('#GET /hello', () => {
    it('should return hello world response', (done) => {
      request(app)
        .get('/hello')
        .expect(200)
        .expect('Hello world')
        .end(done)
    })
  })
})
