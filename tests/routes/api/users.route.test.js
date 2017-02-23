const request = require('supertest')
const expect = require('expect')
const app = require('../../../app.js')
const User = require('../../../models/user')
const {
  usersSeeder,
  usersSeeds,
} = require('../../../databases/seeds/users.seeder')

beforeEach(usersSeeder)

describe('routes/api/users.route.js', () => {
  describe('#GET /api/users/me', () => {
    it('should return user if authenticated', (done) => {
      request(app)
        .get('/api/users/me')
        .set('x-auth', usersSeeds[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.user._id).toBe(usersSeeds[0]._id.toHexString())
          expect(res.body.user.email).toBe(usersSeeds[0].email)
        })
        .end(done)
    })

    it('should return 401 if not authenticated', (done) => {
      request(app)
        .get('/api/users/me')
        .send('x-auth', 'aaaaaaaaa')
        .expect(401)
        .end(done)
    })

    it('should return 401 if good token but user already removed', (done) => {
      User.findByIdAndRemove(usersSeeds[0]._id).then((user) => {
        request(app)
          .get('/api/users/me')
          .send('x-auth', user.tokens[0].token)
          .expect(401)
          .end(done)
      })
    })
  })

  describe('#POST /api/users', () => {
    it('should create a user', (done) => {
      let email = 'test@email.com'
      let password = 'qwerty'

      request(app)
        .post('/api/users')
        .send({
          email,
          password
        })
        .expect(201)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist()
          expect(res.body.user._id).toExist()
          expect(res.body.user.email).toBe(email)
        })
        .end((err) => {
          if (err) {
            return done(err)
          }

          User.findOne({
            email
          }).then((user) => {
            expect(user).toExist()
            expect(user.password).toNotBe(password)
            done()
          }).catch((e) => done(e))
        })
    })

    it('should return validation errors', (done) => {
      request(app)
        .post('/api/users')
        .send({
          email: 'aaa',
          password: 'aaa'
        })
        .expect(400)
        .end(done)
    })

    it('should not create user if email in use', (done) => {
      request(app)
        .post('/api/users')
        .send({
          email: usersSeeds[1].email,
          password: 'qwerty'
        })
        .expect(400)
        .end(done)
    })
  })

  describe('#POST /api/users/login', () => {
    it('should login user and return auth token', (done) => {
      request(app)
        .post('/api/users/login')
        .send({
          email: usersSeeds[1].email,
          password: usersSeeds[1].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist()
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          User.findById(usersSeeds[1]._id).then((user) => {
            expect(user.tokens[1]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            })
            done()
          }).catch((e) => done(e))
        })
    })

    it('should reject invalid login', (done) => {
      request(app)
      .post('/api/users/login')
      .send({
        email: usersSeeds[1].email,
        password: usersSeeds[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(usersSeeds[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1)
          done()
        }).catch((e) => done(e))
      })
    })
  })

  describe('#DELETE /api/users/me/token', () => {
    it('should remove auth token on logout', (done) => {
      request(app)
        .delete('/api/users/me/token')
        .set('x-auth', usersSeeds[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          User.findById(usersSeeds[0]._id).then((user) => {
            expect(user.tokens.length).toBe(0)
            done()
          }).catch((e) => done(e))
        })
    })
  })
})
