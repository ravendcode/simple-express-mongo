const expect = require('expect')
const exampleUtil = require('../../utils/example.util')

describe('utils/example.util.js', () => {
  describe('#add()', () => {
    it('should add two numbers', () => {
      let res = exampleUtil.add(2, 2)
      expect(res).toBe(4).toBeA('number')
    })
  })

  describe('#asyncAdd()', () => {
    it('should async add two numbers', (done) => {
      exampleUtil.asyncAdd(2, 2, (res) => {
        expect(res).toBe(4).toBeA('number')
        done()
      })
    })
  })
})
