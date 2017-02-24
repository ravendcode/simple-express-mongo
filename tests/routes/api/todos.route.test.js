const request = require('supertest')
const expect = require('expect')
const app = require('../../../app.js')
const Todo = require('../../../models/todo')
const {
  todosSeeder,
  todosSeeds,
} = require('../../../databases/seeds/todos.seeder')

const {
  usersSeeds,
} = require('../../../databases/seeds/users.seeder')

beforeEach(todosSeeder)

describe('routes/api/todos.route.js', () => {
  describe('#GET /api/todos', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/api/todos')
        .set('x-auth', usersSeeds[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(1)
        })
        .end(done)
    })
  })

  describe('#POST /api/todos', () => {
    it('should create a new todo', (done) => {
      let newTodo = {
        text: 'test todo'
      }
      request(app)
        .post('/api/todos')
        .set('x-auth', usersSeeds[0].tokens[0].token)
        .send(newTodo)
        .expect(201).expect((res) => {
          expect(res.body.todo).toInclude(newTodo)
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          Todo.find().then((todos) => {
            expect(todos.length).toBe(todosSeeds.length + 1)
            expect(todos[todosSeeds.length].text).toBe(newTodo.text)
            done()
          }).catch((e) => done(e))
        })
    })
    it('should not create a new todo', (done) => {
      let newTodo = {
        text: 't'
      }
      request(app).post('/api/todos')
        .send(newTodo)
        .set('x-auth', usersSeeds[0].tokens[0].token)
        .expect(400).expect((res) => {
          expect(res.body.name).toBe('ValidationError')
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          Todo.find().then((todos) => {
            expect(todos.length).toBe(todosSeeds.length)
            done()
          }).catch((e) => done(e))
        })
    })
  })

  describe('#GET /api/todos/:id', () => {
    it('should return a todo', (done) => {
      request(app)
        .get('/api/todos/' + todosSeeds[0]._id)
        .set('x-auth', usersSeeds[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo).toInclude(todosSeeds[0])
        })
        .end(done)
    })

    it('should not return todo created by other user', (done) => {
      request(app)
        .get('/api/todos/' + todosSeeds[1]._id)
        .set('x-auth', usersSeeds[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('should return not found todo', (done) => {
      request(app)
        .get('/api/todos/11111')
        .set('x-auth', usersSeeds[0].tokens[0].token)
        .expect(404)
        .end(done)
    })
  })

  describe('#PATCH /api/todos/:id', () => {
    it('should update the todo', (done) => {
      let obj = {
        text: 'new text',
        isCompleted: true
      }
      request(app)
        .patch('/api/todos/' + todosSeeds[0]._id)
        .set('x-auth', usersSeeds[0].tokens[0].token)
        .send(obj)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(obj.text)
          expect(res.body.todo.isCompleted).toBe(obj.isCompleted)
          expect(res.body.todo.completedAt).toBeA('number')
        })
        .end(done)
    })

    it('should clear completedAt when todo is not completed', (done) => {
      let obj = {
        text: 'new text',
        isCompleted: false
      }
      request(app)
        .patch('/api/todos/' + todosSeeds[1]._id)
        .set('x-auth', usersSeeds[1].tokens[0].token)
        .send(obj)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(obj.text)
          expect(res.body.todo.isCompleted).toBe(obj.isCompleted)
          expect(res.body.todo.completedAt).toNotExist()
        })
        .end(done)
    })
  })

  describe('#DELETE /api/todos/:id', () => {
    it('should remove a todo', (done) => {
      request(app)
        .delete('/api/todos/' + todosSeeds[0]._id)
        .set('x-auth', usersSeeds[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo).toInclude(todosSeeds[0])
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          Todo.findById(todosSeeds[0]._id).then((todo) => {
            expect(todo).toNotExist()
            done()
          }).catch((e) => done(e))
        })
    })

    it('should return not found todo', (done) => {
      request(app)
        .delete('/api/todos/11111')
        .set('x-auth', usersSeeds[0].tokens[0].token)
        .expect(404)
        .end(done)
    })
  })
})
