<template>
    <div>
        <div class="Login" v-if="isShow">
            <div class="login-right">
                <div>
                    <p class="small">Welcome to</p>
                    <p class="big">Chat Room</p>
                </div>
            </div>
            <div v-if="showLogin" class="login-left">
                <div class="content">
                    <div>
                        <label for="username" class="iconfont icon-ziyuanxhdpi">Username</label>
                        <input type="text" class="user" v-model="loginUser.username" ref="inputUsername" />
                    </div>
                    <div style="margin-top: 12px">
                        <label for="username" class="iconfont icon-ziyuanxhdpi">Password</label>
                        <input type="password" class="user" v-model="loginUser.password" ref="inputUserPassowrd" />
                    </div>
                    <div style="display:flex">
                        <button class="button" @click="loginRoom">Login</button>
                        <button class="button" @click="showLogin = false">Register</button>
                    </div>
                </div>
            </div>
            <div class="login-left" v-else>
                <div class="content">
                    <div>
                        <label for="username" class="iconfont icon-ziyuanxhdpi">Username:</label>
                        <input type="text" class="user" v-model="register.username" />
                    </div>
                    <div style="margin-top: 12px">
                        <label for="username" class="iconfont icon-ziyuanxhdpi">Nickname:</label>
                        <input type="text" class="user" v-model="register.nickname" ref="inputUserPassowrd" />
                    </div>
                    <div style="margin-top: 12px">
                        <label for="username" class="iconfont icon-ziyuanxhdpi">Email Address:</label>
                        <input type="text" class="user" v-model="register.email" ref="inputUserPassowrd" />
                    </div>
                    <div style="margin-top: 12px">
                        <label for="username" class="iconfont icon-ziyuanxhdpi">Password:</label>
                        <input type="password" class="user" v-model="register.password" ref="inputUserPassowrd" />
                    </div>
                    <div style="margin-top: 12px">
                        <label for="username" class="iconfont icon-ziyuanxhdpi">Password Again: </label>
                        <input type="password" class="user" v-model="register.repassword" ref="inputUserPassowrd" />
                    </div>
                    <div style="display:flex">
                        <button class="button" @click="handleSignUp">Sign Up</button>
                        <!-- <button class="button" @click="showLogin = true">Login</button> -->
                        <a @click="showLogin = true">Back to Login</a>
                    </div>
                </div>
            </div>
        </div>
        <!-- <room v-else :user="user" :userList="userList" ref="chatroom" @sendServer="sendServer" :message="message" @handleFile="handleFile" /> -->
        <room-container v-else :user="user" :userList="userList" @enterRoom="handleEnterChannel" @logout="logout" ref="chatroom" @sendServer="sendServer" :message="message" @handleFile="handleFile" @updateUserInfo="handleUpdateUserInfo" @handleQuitRoom="quitRoom"></room-container>
    </div>
</template>

<script>
// import Room from './Room'
import RoomContainer from './RoomContainer.vue'
import io from 'socket.io-client' //Into the socket. IO - client
export default {
    name: 'Login',
    components: { RoomContainer },
    data() {
        return {
            imgUrl: [
                'one.jpg',
                'two.jpg',
                'four.jpg',
                'three.jpeg',
                'eight.jpg',
                'seven.jpg',
                'six.jpg',
                'five.jpg',
                'nine.jpg',
                'ten.jpeg'
            ],
            currentIndex: 0,
            currentImg: 'one.jpg',
            socket: null,
            isShow: true,
            user: {},
            userList: [],
            message: {},
            loginUser: {
                username: '',
                password: ''
            },
            showLogin: true,
            register: {

            }
        }
    },
    methods: {
        async handleFile(file) {
            this.socket.emit('sendImage', { ...this.user, file })
            console.log('file', file)
            console.log('info', { channelId: this.channelData.id, file: file, username: this.user.user.username, avatar: this.user.avatar })

        },
        clickImg(index, item) {
            this.currentIndex = index
            this.currentImg = item
        },
        async loginRoom() {
            let user = await this.$api.login(this.loginUser)
            console.log('user', user)

            this.socket.emit('login', {
                user: { ...this.loginUser, avatar: user.avatar },
                avatar: this.currentImg,
            })
            localStorage.setItem('user', JSON.stringify(user));
        },
        sendServer(content) {
            const { user } = this.user
            this.socket.emit('sendMessage', { msg: content, username: user.username, avatar: user.avatar })
        },
        handleEnterChannel(id) {
            console.log('id', id)
            this.socket.emit('enterRoom', { channelId: id, user: this.user })
        },
        async handleSignUp() {
            console.log('register info', this.register)
            if (!this.register.username || !this.register.password || !this.register.repassword) {
                alert('please enter username or password')
                return
            }

            if (this.register.password != this.register.repassword) {
                alert('The two passwords are inconsistent')
                return
            }

            await this.$api.register(this.register)
            alert('Signup Succeed')
        },
        quitRoom(data) {
            console.log('data', data)
            this.socket.emit('quitRoom', data)
        },
        handleUpdateUserInfo() {
            const user = localStorage.getItem('user')
            if (user != null) {
                this.socket.emit('login', {
                    user: JSON.parse(user),
                })
            }
        },
        logout() {
            localStorage.removeItem('user')
            this.isShow = true
            this.showLogin = true
        }
    },
    mounted() {
        /**
         * The main function of chat room
         */
        // 1.Connecting to the server
        // baseURL:process.env.VUE_APP_URL || "/admin/api",
        this.socket = io(process.env.VUE_APP_URL || "/")
        // 2.Listen for logon failed requests
        this.socket.on('userExit', (data) => alert(data.msg))
        // 3.Listen for successful login requests
        this.socket.on('loginsuccess', (data) => {
            this.user = data
            this.isShow = false
        })
        this.socket.on('addUser', (data) => {
            console.log('data', data)
            this.$store.commit('setJoinRoom', data)
        })
        this.socket.on('leaveroom', (data) => {
            this.$store.commit('setLeaveRoom', data)
            this.$refs.chatroom ? this.$refs.chatroom.haveOneleaveRoom() : null
        })
        // Listen for information on the user list
        this.socket.on('userList', (data) => {
            console.log('data', data)
            this.userList = data
            this.$store.commit('setUserList', data)
        })
        // Listen for chat messages
        this.socket.on('receiveMessage', (data) => {
            // Displays the received message in the chat window
            this.message = data
            console.log('message', data)
        })
        // Listen for messages from pictures
        this.socket.on('receiveImage', (data) => {
            // Displays the received picture in the chat window
            console.log('xx', data)
            this.$refs.chatroom.handleImage(data)
        })
        const user = localStorage.getItem('user')
        if (user != null) {
            this.socket.emit('login', {
                user: JSON.parse(user),
                avatar: 'one.jpg',
            })
        }
    }
}
</script>

<style lang="less" scoped>
.Login {
    width: 600px;
    height: 408px;
    margin: 130px auto;
    display: flex;
    .login-right {
        width: 260px;
        height: 100%;
        background-color: rgba(66, 69, 120, 0.76);
        display: flex;
        justify-content: center;
        align-items: center;
        .small {
            color: #f1e9e9;
            font-size: 14px;
            font-family: sans-serif;
        }
        .big {
            font-size: 20px;
            font-weight: 600;
            margin-top: 5px;
            color: #f1e9e9;
            font-family: sans-serif;
        }
    }
    .login-left {
        width: 32rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        .icon-ziyuanxhdpi,
        .icon-icon26 {
            color: #353c73;
        }
        label {
            color: #000;
            font-size: 14px;
        }
        .content {
            margin: 20px auto;
            width: 90%;
            .user {
                width: 95%;
                border: 1px solid #ccc;
                font-size: 14px;
                line-height: 30px;
                padding-left: 10px;
                display: block;
            }
            .chooseAvatar {
                margin-top: 15px;
            }
            .avatarWrap {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                border: 1px solid #ccc;
                li {
                    cursor: pointer;
                    width: 50px;
                    height: 50px;
                    padding: 7px;
                    img {
                        width: 50px;
                        height: 50px;
                    }
                    .active {
                        border: 3px solid #2980b9;
                    }
                }
            }
        }
        .button {
            width: 100px;
            line-height: 30px;
            background-color: #705a76;
            color: #fff;
            border-radius: 10px;
            margin-left: 34%;
            margin-top: 30px;
        }
    }
}
</style>
