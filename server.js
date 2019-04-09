const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const dbConfig = require("./database/dbConfig.js");

const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");

const db = require("./database/dbConfig.js");

const server = express();


const sessionConfig = {
  name: "monkey-pants",
  secret: process.env.SECRET || "moon landing was a hoax",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: dbConfig,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 10
  })
};


server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));



server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.send("It's alive!");
});



module.exports = server;