<template>
    <div class="Room" ref="room">
        <div class="room-left" v-show="user">
            <img :src="user.user.avatar || 'https://img1.baidu.com/it/u=1237364890,4141563158&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500'" @click="updateUserInfo" />
        </div>
        <div class="room-right" v-if="!showUpdateUserInfo">
            <room-list @logout="logout" :user="user" v-if="showList" @show-channel="handleShowChannel"></room-list>
            <channel ref="channel" v-else :channel-data="channelData" @switchChannel="handleSwitchChannel" :user="user" @quitRoom="handleQuitRoom" @sendServer="sendServer" @handleFile="handleFile" :message="message" @show-channel="handleShowChannel"></channel>
        </div>
        <div class="room-right" v-else>
            <div class="editor-user">
                <div>
                    <label for="username" class="iconfont icon-ziyuanxhdpi">Username: </label>
                    <input type="text" class="user-input" v-model="updateUser.username" />
                </div>
                <div style="margin-top: 2rem">
                    <label for="username" class="iconfont icon-ziyuanxhdpi">Email Address: </label>
                    <input type="text" class="user-input" v-model="updateUser.email" />
                </div>
                <div style="margin-top: 2rem">
                    <label for="username" class="iconfont icon-ziyuanxhdpi">Password: </label>
                    <input type="password" class="user-input" v-model="updateUser.password" />
                </div>
                <div style="margin-top: 2rem">
                    <label for="username" class="iconfont icon-ziyuanxhdpi">Head portrait: </label>
                    <input @change="uploadPhoto($event)" type="file">
                </div>
            </div>
            <button class="confirm" @click="handleUpdateUserInfo">Save</button>
            <button class="cancel" @click="showUpdateUserInfo = false">Back</button>
        </div>
    </div>
</template>
<script>
import Channel from './Channel'
import RoomList from './RoomList'

export default {
    props: {
        user: Object,
        message: Object,
    },
    components: { Channel, RoomList },
    data() {
        return {
            showList: true,
            channelData: {},
            iconList: ['icon-liaotianqingqiu', 'icon-yonghu'],
            iconCurrentIndex: 0,
            showUpdateUserInfo: false,
            updateUser: {},
            avatar: ''
        }
    },
    methods: {
        handleShowChannel(channelData) {
            this.showList = false
            this.channelData = channelData
            this.$emit('enterRoom', channelData.id)
        },
        sendServer(data) {
            this.$emit('sendServer', data)
        },
        async handleFile(data) {
            console.log('data', data)
            this.$emit('handleFile', data)
            await this.$api.createMessage({ channelId: this.channelData.id, username: this.user.user.username, avatar: this.user.avatar, file: data.toString(), userId: this.user.user.id })
        },
        handleImage(file) {
            this.$refs.channel.handleImage(file)
        },
        handleSwitchChannel(data) {
            console.log('channel data', data)
            this.$emit('handleQuitRoom', { channelId: this.channelData.id, username: this.user.user.username })
            this.channelData = data
            this.$emit('enterRoom', this.channelData.id)
        },
        handleQuitRoom(data) {
            this.$emit('handleQuitRoom', data)
            this.showList = true
        },
        haveOneleaveRoom(data) {
            console.log('channel', this.$refs.channel)
            this.$refs.channel.haveOneleaveRoom(data)
        },
        updateUserInfo() {
            this.showUpdateUserInfo = true
        },
        uploadPhoto(e) {
            // Get the file using the fileReader object
            let that = this
            var file = e.target.files[0];
            var filesize = file.size;
            if (filesize > 2101440) {
                console.log("The picture is too big, please use other way to upload!");
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async function (e) {
                that.avatar = e.target.result;
            };
        },

        async handleUpdateUserInfo() {
            let temp = Object.assign({}, this.updateUser)
            if (this.avatar) {
                temp.avatar = this.avatar
            }
            try {
                await this.$api.updateUser(temp)
                localStorage.setItem('user', JSON.stringify(temp))
                alert('Saved Successfully!')
                this.$emit('updateUserInfo')
            } catch (e) {
                alert('Failed to save, please change another picture!')
                console.log('error', e)
            }
        },
        logout() {
            this.$emit('logout')
        }

    },
    mounted() {
        const user = localStorage.getItem('user')
        this.updateUser = JSON.parse(user)
        console.log("this.updateUser", this.updateUser)
    }
}
</script>
<style lang="less" scoped>
.Room {
    width: 900px;
    height: 500px;
    margin: 50px auto;
    display: flex;
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
    .room-right {
        width: 48rem;
        background: #fff;
        .editor-user {
            padding: 2rem;
        }
    }
    .confirm {
        padding: 1rem;
        border-radius: 7px;
        background: antiquewhite;
        box-shadow: 1px 1px silver;
        margin-left: 10rem;
    }
    .cancel {
        padding: 1rem;
        border-radius: 7px;
        background: #cbcaca;
        box-shadow: 1px 1px silver;
        margin-left: 2rem;
    }
    .user-input {
        width: 95%;
        border: 1px solid #ccc;
        font-size: 14px;
        line-height: 30px;
        padding-left: 10px;
        display: block;
    }
}
</style>