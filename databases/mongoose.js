const mongoose = require("mongoose");
const debug = require("debug")("app:mongodb");
const {
    env,
    mongoUri
} = require("../config");

// mongoose.connect(mongoUri, {
//     auth: {
//         authdb: "admin"
//     }
// });
mongoose.connect(mongoUri);
if (env === "development") {
    mongoose.set('debug', true);
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function () {
    debug("connection success");
});

module.exports = db;
