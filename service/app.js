// 引入express，并获得express的实例
const express = require('express');
const bodyParser = require('body-parser')
const path = require("path")
const app = express()
const cors = require("cors");

// 引入http模块
const http = require('http');
// 用http模块创建一个服务并把express的实例挂载上去
const server = http.Server(app);
// 引入socket.io并立即实例化，把server挂载上去
const io = require('socket.io')(server);
var corsOptions = {
  origin: "http://localhost:8080"
};
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors(corsOptions));
//记录所有已经登录的用户
// const userList = []
const channels = {} // {id: [], id[]}

app.use('/chatroom', express.static(path.join(__dirname, '/chatroom')))
io.on('connection', socket => {
  socket.on("login", data => {
    // 判断，如果data在userList数组中存在，说明该用户已经登录，不允许登录
    // 如果data在userList数组中不存在，说明该用户没有登录，允许登录
    // let user = userList.length !== 0 ? userList.find(item => item.username === data.username) : false
    // if (user) {
    //   //表示用户存在,登录失败，服务器需要给当前用户响应，告诉登录失败
    //   socket.emit("userExit", { msg: "用户已存在，登录失败" })
    // } else {
    // 表示用户不存在,登录成功
    // console.log('data', data)
    // userList.push(data)
    socket.emit("loginsuccess", { ...data, msg: "登录成功" })
    //告诉所有的用户，有用户加入到聊天室，广播消息:io.emit
    // io.emit("addUser", data)
    //告诉所有的用户，目前聊天室中有多少人
    // io.emit("userList", userList)
    // 把登录成功的用户名和头像存储起来
    socket.username = data.username
    // }
  })

  socket.on("enterRoom", data => {
    let userList = channels[data.channelId]
    if (userList && userList.length) {
      let index = userList.findIndex(item => data.user.user.username === item.user.username)
      if (index == -1) channels[data.channelId].push(data.user)
    } else {
      channels[data.channelId] = [data.user]
    }
    // socket.emit("userEnterRoom", data)
    socket.emit('addUser', { channelId: data.channelId, user: data.user })
    // io.emit("userList", channels[data.channelId])
    io.emit("userList", channels)
  })

  socket.on('quitRoom', (data) => {
    channels[data.channelId].splice(channels[data.channelId].findIndex(item => data.username === item.user.username), 1)
    io.emit("leaveroom", { channelId: data.channelId, username: data.username })
    io.emit("userList", channels)
  })

  // 用户断开连接的功能
  socket.on("disconnect", () => {
    // 把当前用户的信息从userList中删除掉
    // let idx = userList.findIndex(item => item.username === socket.username)
    // userList.splice(idx, 1)
    // // 告诉所有人有人离开了聊天室
    // io.emit("leaveroom", { username: socket.username })
    // // 告诉所有人，userList发生了更新
    // io.emit("userList", userList)
  })
  // 监听聊天的消息
  socket.on("sendMessage", data => {
    //广播给所有用户
    io.emit("receiveMessage", data)
  })
  // 接受图片信息
  socket.on("sendImage", data => {
    //广播给所有用户
    io.emit("receiveImage", data)
  })
});

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

require("./app/routes/user.routes")(app);
require("./app/routes/message.routes")(app);
require("./app/routes/channel.routes")(app);

server.listen(3100, function () {
  console.log('服务端启动成功！端口3100');
});