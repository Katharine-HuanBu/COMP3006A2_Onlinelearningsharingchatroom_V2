const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorials = require("./tutorial.model.js")(mongoose);
db.channel = require("./channel.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);
db.message = require("./message.model.js")(mongoose);

module.exports = db;
