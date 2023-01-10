import router from "@/router";
import { stat } from "fs";

import VueAxios from "vue-axios";
import axios from "../../axios/index.js";

const state = {
  items: [],
  item: null,
};

const mutations = {
  setAllItems: (state, items) => {
    state.items = items;
  },
  setSingleItem: (state, item) => {
    state.item = item;
  },
};

const actions = {
  async getAllItems({ commit }, { page, search }) {
    return await axios
      .get(`/items?page=${page}&search=${search}`)
      .then(({ data }) => {
        commit("setAllItems", data);
      });
  },
  async getAllItemsByCategory({ commit }, { page, categoryId, search }) {
    return await axios
      .get(`/items/${categoryId}?page=${page}&search=${search}`)
      .then(({ data }) => {
        commit("setAllItems", data);
      });
  },

  async storeItem({ commit, state }, item) {
    return await axios.post("/item", item);
  },

  async deleteItem({}, itemId) {
    return await axios.delete(`/item/${itemId}`);
  },

  async getSingleItem({ commit }, itemId) {
    return await axios.get(`/item/${itemId}`).then(({ data }) => {
      commit("setSingleItem", data.data);
    });
  },

  async updateItem({ commit, state }, { id, item }) {
    return await axios.post(`/item/${id}?_method=PUT`, item);
  },
};

const getters = {
  getAllItems: (state) => state.items,
  getSingleItem: (state) => state.item,
};

const items = {
  //namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default items;
