module.exports = () => {
    return (req, res, next) => {
        let now = new Date();
        let log = `${now}: ${req.method} ${req.url}`;
        console.log(log);
        next();
    }
}
