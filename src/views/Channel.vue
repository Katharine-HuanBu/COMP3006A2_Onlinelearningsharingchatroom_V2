<template>
    <div class="channel-container" ref="room">
        <div class="room-center">
            <div class="center-h">
                <p>Current User List</p>
                <p />
            </div>
            <div style="width: 5rem;" class="center-b">
                <ul>
                    <li class="user-item" v-for="(item, index) in userList" :key="index">
                        <!-- <img :src="require('@/assets/avatar/' + item.avatar)" alt /> -->
                        <span>{{item.user.username}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="room-right">
            <div class="name">
                <div>switch channel:
                    <select v-model="selectedChannel" @change="handleSwitchChannel($event)">
                        <option v-for="item in channels" :key="item.id" :value="item.id">{{item.name}}</option>
                    </select>
                </div>
                <div>{{channelData.name}} ({{userListLength}})</div>
                <div style="cursor: pointer" @click="handleQuit">quit</div>
            </div>
            <div class="chatcontent">
                <ul class="join" ref="joinUs">
                    <li v-for="(item, index) in joinRoom" :key="index">Welcome {{item.user.user.username}} join the group chat !</li>
                    <li v-for="(item1,index) in messageContent" :key="index" :class="{'my-message':item1.type===1?true:false,'other-message':item1.type===2?true:false}">
                        <div v-if="item1.type === 3">
                            {{item1.username}} Left the group chat !
                        </div>
                        <div v-if="item1.type === 1">
                            <p class="date-time right">{{formatDate(item1.createdAt || new Date())}}</p>
                            <img :src="item1.file" alt class="file" v-if="item1.file" @load="loadOverImg" preview="1" />
                            <span v-else>{{item1.msg}}</span>
                            <img :src="item1.avatar || 'https://img1.baidu.com/it/u=1237364890,4141563158&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500'" class="avatar" />
                        </div>
                        <div v-if="item1.type ===2">
                            <p class="date-time left">{{formatDate(item1.createdAt || new Date())}}</p>
                            <img :src="item1.avatar || 'https://img1.baidu.com/it/u=1237364890,4141563158&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500'" class="avatar" />
                            <p class="username">{{item1.username}}</p>
                            <img :src="item1.file" alt class="file" v-if="item1.file" @load="loadOverImg" preview="1" />
                            <p class="content" v-else>{{item1.msg}}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="sendMessage">
                <div class="icon">
                    <span class="iconfont icon-smile" @click="emojiShow = !emojiShow"></span>
                    <div class="emoji" tabindex="1" v-show="emojiShow" @blur="handleEmojiBlur">
                        <span v-for="item in emojiList" :key="item.codes" @click="handleEmoji(item)">{{item.char}}</span>
                    </div>
                    <label class="iconfont icon-wenjianjia" for="file"></label>
                    <input type="file" style="display:none" id="file" @change="handleFile" />
                </div>
                <textarea cols="80" rows="5" ref="textarea" @keyup.enter="handlePress"></textarea>
                <button class="sendMessage" @click="sendContentToServe">Send</button>
                <img :src="imgUrl" alt />
            </div>
        </div>
    </div>
</template>

<script>
import html2canvas from 'html2canvas'
import emoji from '../assets/emoji.json'
export default {
    name: 'Channel',
    props: {
        user: Object,
        // userList: Array,
        message: Object,
        channelData: Object
    },
    computed: {
        userListLength() {
            return this.userList.length
        },
        userList() {
            return this.$store.state.userList[this.channelData.id] || []
        }
    },

    data() {
        return {
            iconList: ['icon-liaotianqingqiu', 'icon-yonghu'],
            iconCurrentIndex: 0,
            joinRoom: [],
            messageContent: [], //0 does not render, 1 represents the message sent by oneself, and 2 represents the message sent by others
            emojiList: [],
            content: '',
            emojiShow: false,
            imgUrl: '',
            imgAllUrl: [],
            channels: [],
            selectedChannel: ''
        }
    },
    async mounted() {
        this.joinRoom = this.$store.state.joinRoom
        this.selectedChannel = this.channelData.id
        this.emojiList = emoji
        this.channels = await this.$api.getChannelList()
        let messages = await this.$api.getMessages(this.channelData.id)
        for (let message of messages) {
            this.handleMessageBox(message)
        }
        console.log("messageContent", this.messageContent)
    },
    methods: {
        handlePress() {
            this.sendContentToServe()
        },
        handleCanvas() {
            const room = this.$refs.room
            html2canvas(room).then((canvas) => {
                const imgUrl = canvas.toDataURL()
                this.$emit('handleFile', imgUrl)
            })
        },
        handleEmojiBlur() {
            this.emojiShow = false
        },
        handleEmoji(emoji) {
            this.content = this.$refs.textarea.value
            this.$refs.textarea.value += emoji.char
        },
        loadOverImg() {
            this.$previewRefresh()
            this.handleScrollBottom()
        },
        handleImage(file) {
            this.handleMessageBox(file)
        },
        handleFile(e) {
            const file = e.target.files[0]
            const reader = new FileReader() // Create a read file object
            reader.readAsDataURL(file) // Make an asynchronous request to read the file
            reader.onload = (e) => {
                // After the file is read
                // After reading, assign the result to the SRC of img
                this.$emit('handleFile', e.target.result)
            }
        },
        haveOneleaveRoom() {
            const leaveRoom = this.$store.state.leaveRoom
            console.log('haveOneleaveRoom', leaveRoom)
            if (this.channelData.id == leaveRoom.channelId) {
                this.messageContent.push({ username: leaveRoom.username, type: 3 })
            }
        },
        async sendContentToServe() {
            console.log('sendContentToServe')
            this.content = this.$refs.textarea.value
            this.$refs.textarea.value = ''
            if (!this.content) {
                return alert('Please enter the content!')
            }
            console.log('user avatar', this.user.avatar)
            await this.$api.createMessage({ channelId: this.channelData.id, msg: this.content, username: this.user.user.username, userId: this.user.user.id })
            //Send to the server
            this.$emit('sendServer', this.content)
        },
        handleMessageBox(newValue) {
            console.log('file', newValue)
            if (newValue.username === this.user?.user.username || newValue.user?.username === this.user?.user?.username) {
                //I sent the message myself
                this.messageContent.push({ ...newValue, type: 1 })
            } else {
                //It was someone else's message
                this.messageContent.push({ ...newValue, type: 2 })
            }
        },
        handleQuit() {
            this.$emit('quitRoom', { channelId: this.channelData.id, username: this.user.user.username })
        },
        handleScrollBottom() {
            const ul = this.$refs.joinUs
            ul.scrollTop = ul.scrollHeight
        },
        async handleSwitchChannel(e) {
            let channelId = e.target.value
            this.messageContent = []
            let messages = await this.$api.getMessages(channelId)
            this.$emit('switchChannel', this.channels.find(item => item.id === channelId))
            for (let message of messages) {
                this.handleMessageBox(message)
            }
        },
        formatDate(date) {
            date = new Date(date)
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        },
       
    },
    watch: {
        message(newValue) {
            this.handleMessageBox(newValue)
        },
    },

    updated() {
        // Chat to the bottom
        this.handleScrollBottom()
    },
}
</script>

<style lang="less" scoped>
.channel-container {
    display: flex;
    height: 500px;
}
.date-time {
    display: block;
    width: 8rem;
    color: #a7a7a7;
    position: absolute;
}

.right {
    right: 15px;
    top: -15px;
}
.left {
    top: -20px;
    left: 12px;
}
.room-left {
    background-color: #474574;
    width: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
    .icon-liaotianqingqiu,
    .icon-yonghu {
        font-size: 24px;
        padding-top: 10px;
        cursor: pointer;
    }
    .active {
        color: #ecf0f1;
    }
    img {
        width: 40px;
    }
}
.room-center {
    width: 200px;
    background-color: #e6e5e5;
    color: #000;
    display: flex;
    flex-direction: column;
    .center-h {
        padding: 9.6px 10px;
        height: 20px;
        border-bottom: 1px solid #e5e5e58c;
        box-shadow: 1px 1px 1px #b2c0c9;
        display: flex;
        align-items: center;
        img {
            width: 50px;
            height: 50px;
        }
    }
    .center-b {
        flex: 1;
        .user-item-name {
            padding: 5px 10px;
            height: 40px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e5e5e58c;
            box-shadow: 1px 1px 1px #2980b9;
            font-size: 17px;
        }
        .user-item {
            padding: 5px 10px;
            height: 40px;
            display: flex;
            align-items: center;
            img {
                width: 40px;
                height: 40px;
            }
            span {
                margin-left: 5px;
            }
        }
    }
}
.room-right {
    flex: 1;
    background-color: #f6f6f6;
    display: flex;
    flex-direction: column;
    .name {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        font-size: 16px;
        border-bottom: 1px solid rgba(100, 100, 100, 0.3);
        align-items: center;
        padding: 0px 12px;
    }
    .chatcontent {
        height: 300px;
        .join {
            text-align: center;
            color: #ccc;
            overflow: auto;
            height: 300px;
            li {
                padding: 10px;
            }
        }
        .my-message {
            display: flex;
            justify-content: flex-end;
            div {
                display: flex;
                position: relative;
                &::after {
                    content: '';
                    right: 38px;
                    top: 50%;
                    transform: translateY(-50%);
                    position: absolute;
                    border-left: 6px solid #9eea6a;
                    border-top: 6px solid transparent;
                    border-bottom: 6px solid transparent;
                    border-right: 6px solid transparent;
                }
                .file {
                    max-width: 330px;
                    max-height: 170px;
                    margin-right: 10px;
                    cursor: pointer;
                }
                .avatar {
                    width: 40px;
                    height: 40px;
                }
                span {
                    box-sizing: border-box;
                    display: inline-block;
                    border-radius: 5px;
                    line-height: 32px;
                    background-color: #9eea6a;
                    color: #000;
                    padding: 5px;
                    margin-right: 10px;
                    min-width: 40px;
                }
            }
        }
        .other-message {
            position: relative;
            display: flex;
            justify-content: flex-start;
            div {
                display: flex;
                position: relative;

                &::before {
                    content: '';
                    left: 40px;
                    top: 55%;
                    transform: translateY(-50%);
                    position: absolute;
                    border-left: 5px solid transparent;
                    border-top: 5px solid transparent;
                    border-bottom: 5px solid transparent;
                    border-right: 5px solid #ccc;
                }
                .file {
                    max-width: 330px;
                    max-height: 170px;
                    margin-top: 14px;
                    margin-left: 10px;
                    cursor: pointer;
                }
                .avatar {
                    width: 40px;
                    height: 40px;
                }
                .username {
                    position: absolute;
                    left: 0px;
                    top: -20px;
                    font-size: 13px;
                    color: #b2b2b2;
                }
                .content {
                    margin-top: 12px;
                    box-sizing: border-box;
                    display: inline-block;
                    border-radius: 5px;
                    line-height: 32px;
                    background-color: #fff;
                    color: #000;
                    padding: 5px;
                    margin-left: 10px;
                    border: 1px solid #ccc;
                    min-width: 40px;
                }
            }
        }
    }
    .sendMessage {
        position: relative;
        flex: 1;
        background-color: #fff;
        padding-left: 10px;
        .icon {
            height: 25px;
            padding-top: 6px;
            display: flex;
            .icon-smile,
            .icon-wenjianjia,
            .icon-jietu {
                font-size: 20px;
                padding: 0 6px;
                cursor: pointer;
            }
            .icon-jietu {
                font-size: 23px !important;
            }
            .emoji {
                position: absolute;
                display: flex;
                flex-wrap: wrap;
                width: 276px;
                height: 218px;
                overflow: auto;
                bottom: 159px;
                background-color: #fff;
                border: 1px solid #cccccc;
                outline: none;
                span {
                    padding: 7px;
                    cursor: pointer;
                }
            }
        }
        textarea {
            border: none;
            resize: none;
            outline: none;
            font-size: 15px;
            padding-left: 9px;
        }
        .sendMessage {
            position: absolute;
            bottom: 10px;
            right: 10px;
            padding: 4px 10px;
            background-color: #f5f5f5;
            border: 1px solid #ccc;
        }
    }
}
.join {
    color: #333;
    font-size: 13px;
}
.send {
    background-color: #2ecc71;
    color: #000;
}
.receive {
    background-color: #fff;
    color: #000;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
