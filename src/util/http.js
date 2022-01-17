import axios from "axios";
import store from "../store";

// axios.defaults.baseURL = 'http://localhost:8080';

// const codeMessage = {
// 201: "Save!" .
// 202: "Your request has been submitted, please wait patiently for the server to process!" .
// 204: "Delete successfully!" .
// 400: "An error occurred in the request. The server did not create or modify data." .
// 401: "User has no permission (wrong token, username, password)." .
// 403: "The user is authorized, but access is prohibited." .
// 404: "Request was made for nonexistent record, no action was taken by server." .
// 406: "Requested format not available." .
// 410: "The requested resource was permanently deleted and will not be retrieved." .
// 422: "A validation error occurred while creating an object." .
// 500: "Server error, please check server." .
// 502: "Gateway error." .
// 503: "Service unavailable, server temporarily overloaded or maintained." .
// 504: "Gateway timed out."
// };

axios.interceptors.request.use(
  config => {
    const requestConfig = config;
    if (store.state.token) {
      requestConfig.headers.Authorization = `Bearer ${store.state.token}`;
    }
    return requestConfig;
  },
  err => {
    Promise.reject(err);
  }
);

axios.interceptors.response.use(
  response => {
    if (response.status > 200 && response.status < 300) {
      // let message = codeMessage[response.status];
      // if (response.data && response.data.message) {
      //   message = response.data.message;
      // }
      // Notification({
      //   title: "The system prompt",
      //   type: "success",
      //   message,
      //   duration: 2000
      // });
    }
    return response;
  },
  error => {
    // let message = codeMessage[error.response.status];
    // if (error.response.data && error.response.data.message) {
    //   message = error.response.data.message;
    // }
    // Notification.error({
    //   title: "The system prompt",
    //   dangerouslyUseHTMLString: true,
    //   message,
    //   duration: 2000
    // });
    return Promise.reject(error);
  }
);

export default axios;
