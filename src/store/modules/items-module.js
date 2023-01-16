import router from "@/router";
import { stat } from "fs";

import VueAxios from "vue-axios";
import axios from "../../axios/index.js";

const state = {
  items: [],
  item: null,
  names: [],
};

const mutations = {
  setAllItems: (state, items) => {
    state.items = items;
  },
  setSingleItem: (state, item) => {
    state.item = item;
  },

  setItemsNames: (state, names) => {
    state.names = names;
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
  async getAllItemsFiltered({ commit }, { page, search, categoryId }) {
    return await axios
      .get(`/filtered-items/${categoryId}?page=${page}&search=${search}`)
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

  async getItemsNames({ commit }) {
    return await axios.get("itemsNames").then(({ data }) => {
      commit("setItemsNames", data);
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
  getItemsNames: (state) => state.names,
};

const items = {
  //namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default items;
