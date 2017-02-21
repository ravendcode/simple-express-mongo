const expect = require('expect')
const util = require('../../utils')

describe('utils/index.util.js', () => {
  describe('#normalizePort()', () => {
    it('should return undefined', () => {
      let res = util.normalizePort(undefined)
      expect(res).toBe(undefined)
    })
  })

  describe('#normalizePort()', () => {
    it('should return number when arg number', () => {
      let res = util.normalizePort(2000)
      expect(res).toBe(2000).toBeA('number')
    })
  })

  describe('#normalizePort()', () => {
    it('should return number when arg string', () => {
      let res = util.normalizePort('3000')
      expect(res).toBe(3000).toBeA('number')
    })
  })
})
