// import Vue from "vue";
import router from "@/router";

import VueAxios from "vue-axios";
import axios from "../../axios/index.js";

export default {
  state: {
    myUser: null,

    allUsers: [],

    isAuthenticated: localStorage.getItem("USERTOKEN") !== null,

    isUserVerified: localStorage.getItem("UserV")
      ? localStorage.getItem("UserV")
      : false,

    userToken: localStorage.getItem("USERTOKEN")
      ? localStorage.getItem("USERTOKEN")
      : null,
  },

  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    myUser(state) {
      return state.myUser;
    },
    userToken(state) {
      return state.userToken;
    },
    isUserVerified(state) {
      return state.isUserVerified;
    },

    allUsers(state) {
      return state.allUsers;
    },
  },

  mutations: {
    isAuthenticated(state, payload) {
      state.isAuthenticated = payload.isAuthenticated;
    },
    myUser(state, payload) {
      state.myUser = payload;
    },

    userToken(state, payload) {
      state.userToken = payload;
      localStorage.setItem("USERTOKEN", payload);
    },

    isUserVerified(state, payload) {
      state.isUserVerified = payload;
      localStorage.setItem("UserV", payload);
    },

    allUsers(state, payload) {
      state.allUsers = payload;
    },
  },

  actions: {
    async login({ commit }, user) {
      await axios.post(`/login`, user).then(({ data }) => {
        commit("isAuthenticated", {
          isAuthenticated: true,
        });

        commit("userToken", data.data.token);

        commit("isUserVerified", data.data.verified);

        delete data.data.token;
        commit("myUser", data.data);
      });

      router.push({ name: "Home" });
    },

    async register({ commit }, payload) {
      return await axios.post("/register", payload.user).then(({ data }) => {
        router.push({ name: "Login" });
      });
    },

    async createUser({ commit, state }, user) {
      return await axios.post("/register", user);
    },

    async getAllUsers({ commit }, page) {
      return await axios.get(`all-users?page=${page}`).then(({ data }) => {
        commit("allUsers", data);
      });
    },

    async logout(context, payload) {
      await axios.post(`/logout`).then((response) => {
        context.commit("isAuthenticated", {
          isAuthenticated: false,
        });

        localStorage.removeItem("USERTOKEN");
        localStorage.removeItem("UserV");
        // context.commit("myUser", null);
      });
      router.push({ name: "Login" });
    },

    async updateUser({ commit }, user) {
      return await axios
        .put(`/update/user/${user.id}`, user)
        .then(({ data }) => {
          commit("isUserVerified", data.data.verified);
          commit("myUser", data.data);
        });
    },

    async updateOtherUser({ commit, state }, { id, user }) {
      return await axios
        .post(`/update/user/${id}?_method=PUT`, user)
        .then(({ data }) => {
          let allUserss = state.allUsers.data.map((mapedUser) => {
            if (user.id == mapedUser.id) {
              user.role == "admin"
                ? (user.role_id = "1")
                : (user.role_id = "2");
              return (mapedUser = user);
            }
            return mapedUser;
          });
          commit("allUsers", allUserss);
        });
    },

    async deleteUser({ commit }, userId) {
      return await axios.delete(`/delete/${userId}`);
    },

    async myUser({ commit }) {
      return await axios.get(`/user`).then(({ data }) => {
        commit("myUser", data.data);
      });
    },
  },
};
