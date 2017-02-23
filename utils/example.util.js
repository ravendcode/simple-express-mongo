module.exports.add = (a, b) => a + b
module.exports.asyncAdd = (a, b, cb) => {
  setTimeout(() => {
    cb(a + b)
  }, 200)
}
module.exports.square = (x) => x * x
