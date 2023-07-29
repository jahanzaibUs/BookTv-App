// @ts-nocheck
import axios, { AxiosError } from "axios";

import { BASE_URL } from "@constants/config";
import { getItem } from "@utils/storage";
import { logout } from "@actions/authAction";
import { store } from "@store";
import { navigate } from "@navigation";
import ROUTES from "@navigation/Routes";

export const getError = (error: AxiosError | any) => {
  let message = "Failed to load";
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log("error res", error.response.data);
    const serverMsg = error.response.data.length
      ? error.response.data[0]?.message
      : error.response.data.message;

    if (serverMsg) {
      message = serverMsg;
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  }

  if (typeof message === "string") {
    return message;
  } else if (message.length !== 0) {
    const msgObj = message[0];
    if (msgObj && msgObj.messages) {
      return msgObj.messages[0].message;
    }
  }
};

// Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
API.interceptors.request.use(
  async (config) => {
    const token = await getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    // User Not Found
    if (error.response.data.statusCode === 401) {
      await store.dispatch(logout());
      navigate(ROUTES.HOME_TAB);
    }
    return Promise.reject(error);
  }
);

export default API;
