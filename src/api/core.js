import axios from 'axios';
import { GET, POST, DELETE, PUT } from './config';

//Create an AXIOS instance that returns an AXIos object
const instance = axios.create({
    baseURL: 'http://localhost:3100',  //The baseURL is concatenated in front of the URL when the request is sent
    // timeout: 5000,
    //Set axios to form-data
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    transformRequest: [function (data) {
        let ret = '';
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }]
});

// Creating an loading instance
// var loading = null;
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // loading = Loading.service({
    //     lock: true,
    //     text: 'Loading',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.5)'
    // });
    // config.headers = {DeviceType: 'H5'};
    return config;
}, function (error) {
    // What to do about the request error
    console.log("========>", error);
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // What do you do with the response data
    // setTimeout(() => {
    //     loading.close();
    // }, 2000);
    return response;
}, function (error) {
    // What do you do about the response error
    console.log("========>", error);
    return Promise.reject(error);
});

//The throw Request method takes three arguments: 1. Request method 2. Request path 3. parameters passed
export function request(methods, url, params) {
    switch (methods) {
        case GET:
            return get(url, params);  //Return the Promise object
        case POST:
            return post(url, params);
        case DELETE:
            return _delete(url, params);
        case PUT:
            return put(url, params);
    }
}

//A get request
function get(url, params) {
    //The axios request returns a promise object that returns a value and then you can call a method like then catch
    return instance.get(url, params)
}

//post request
function post(url, params) {
    return instance.post(url, params)
}

function put(url, params) {
    return instance.put(url, params)
}

function _delete(url, params) {
    return instance.delete(url, params)
}