var env = process.env.NODE_ENV || "development";
var host = "app.dev";
var port = normalizePort(process.env.PORT || "80");

const mongoHost = process.env.MONGO_HOST || "localhost";
const mongoDb = process.env.MONGO_DB || "startexpress";
const mongoPort = normalizePort(process.env.MONGO_PORT || 27017);
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoUri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}`;

if (process.env.NODE_ENV === "production") {
    env = "production";
    host = "localhost";
} else if (process.env.NODE_ENV === "test") {
    env = "test";
}

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

module.exports = {
    env,
    host,
    port,
    mongoUri,
}
