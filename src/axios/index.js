import axios from "axios";
import VueAxios from "vue-axios";
import store from "../store";
import router from "@/router";

var token = store.getters.userToken ? store.getters.userToken : "";

export default axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});
