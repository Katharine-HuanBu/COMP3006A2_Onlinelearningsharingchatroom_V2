<template>
    <div>
        <div class="header">
           Online learning sharing chat room
            <div class="subtitle">Chatroom List</div>
            <a class="user-logout" @click="logout">Logout</a>
        </div>
        <div class="operation">
            <input placeholder="channel name" v-model="channelName" /> <button class="create-channel" @click="handleCreateChannel">Create Channel</button>
        </div>
        <table class="gridtable">
            <tr>
                <th>Chatroom ID</th>
                <th>Chatroom Name</th>
                <th>Chatroom By</th>
                <th>Chatroom Date</th>
                <th>Operation</th>
            </tr>
            <template v-if="channelList.length">
                <tr v-for="(channel, index) in channelList" :key="index">
                    <td>{{index + 1}}</td>
                    <td>{{channel.name}}</td>
                    <td>{{channel.createdBy}}</td>
                    <td>{{formatDate(channel.createdAt)}}</td>
                    <td>
                        <button class="enter-channel" @click="handleEnterChannel(channel)">Enter Channel</button>
                        <button class="delete-channel" @click="handleDeleteChannel(channel.id)">Delete Channel</button>
                    </td>
                </tr>
            </template>
            <template v-else>
                <div>No channel list, please create channel</div>
            </template>
        </table>
    </div>
</template>
<script>
export default {
    props: ['user'],
    data() {
        return {
            channelName: '',
            channelList: []
        }
    },
    mounted() {
        this.getChannelList()
    },
    methods: {
        async getChannelList() {
            this.channelList = await this.$api.getChannelList()
        },
        async handleCreateChannel() {
            console.log('user', this.user)
            if (!this.channelName) {
                alert('channel name cannot be null', this.channelName)
            }
            await this.$api.createChannel({
                createdBy: this.user.user.username,
                name: this.channelName
            })
            alert('create successfully')
            this.channelName = ''
            this.getChannelList()

        },
        async handleDeleteChannel(id) {
            if (confirm('Are you sure to delete this channel?')) {
                await this.$api.deleteChannel(id)
                alert('delete successfully')
                this.getChannelList()
            }
        },
        handleEnterChannel(channel) {
            console.log('handleEnterChannel')
            this.$emit('show-channel', channel)
        },
        formatDate(date) {
            date = new Date(date)
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        },
        logout() {
            this.$emit('logout')
        }
    }
}
</script>
<style lang="less">
.header {
    background: #927887;
    text-align: center;
    font-size: 1.5rem;
    padding: 12px 0;
    color: #fff;
    position: relative;
    .subtitle {
        font-size: 20px;
        color: #303030;
    }
    .user-logout {
        position: absolute;
        top: 1px;
        right: 12px;
        top: 12px;
        font-size: 12px;
        cursor: pointer;
        color: #fff;
    }
}
.operation {
    text-align: center;
    padding: 6px;
    .create-channel {
        padding: 8px;
        background: #ebe0f1;
        border: 1px solid #cbcce1;
        border-radius: 5px;
    }
    input {
        outline-style: none;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 6px 14px;
        font-size: 14px;
        font-weight: 700;
        font-family: 'Microsoft soft';
    }
    input:focus {
        border-color: #66afe9;
        outline: 0;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
            0 0 8px rgba(102, 175, 233, 0.6);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
            0 0 8px rgba(102, 175, 233, 0.6);
    }
}

table.gridtable {
    margin: 20px;
    font-family: verdana, arial, sans-serif;
    font-size: 11px;
    color: #333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
}
table.gridtable th {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #dedede;
}
table.gridtable td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #ffffff;
    .enter-channel {
        padding: 8px;
        background: #66c0f5;
        border: 1px solid #cbcce1;
        border-radius: 5px;
    }
    .delete-channel {
        padding: 8px;
        background: #ff2525;
        border: 1px solid #cbcce1;
        border-radius: 5px;
    }
}
</style>
