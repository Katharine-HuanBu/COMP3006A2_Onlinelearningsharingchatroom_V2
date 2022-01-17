import { DELETE, GET, POST, PUT } from './config';
import { request } from './core';

const api = {
    async login(params) {
        let res = await request(POST, '/api/user/login', params)
        return res.data
    },

    async register(params) {
        let res = await request(POST, '/api/user', params)
        return res.data
    },

    async getChannelList() {
        let res = await request(GET, '/api/channel')
        return res.data
    },

    async createChannel(params) {
        await request(POST, '/api/channel', params)
    },

    async deleteChannel(id) {
        await request(DELETE, `/api/channel/${id}`)
    },

    async getMessages(id) {
        let res = await request(GET, `/api/message/${id}`)
        return res.data
    },

    async createMessage(params) {
        await request(POST, '/api/message', params)
    },

    async updateUser(params) {
        try {
            await request(PUT, `/api/user/${params.id}`, params)
        } catch (e) {
            throw Error(e)
        }
    }
};
export default api;

