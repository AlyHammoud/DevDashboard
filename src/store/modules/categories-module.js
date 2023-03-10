import router from "@/router";
import { stat } from "fs";

import VueAxios from "vue-axios";
import axios from "../../axios/index.js";

const state = {
  categories: [],
  category: null,
  names: [],
};

const mutations = {
  setAllCategories: (state, categories) => {
    state.categories = categories;
  },
  setSingleCategory: (state, category) => {
    state.category = category;
  },
  setCategoriesNames: (state, names) => {
    state.names = names;
  },
};

const actions = {
  async getAllCategories({ commit }, { page = 1, search = "" }) {
    return await axios
      .get(`/category?page=${page}&search=${search}`)
      .then(({ data }) => {
        commit("setAllCategories", data);
      });
  },

  async storeCategory({ commit, state }, category) {
    return await axios.post("/category", category);
  },

  async deleteCategory({}, categoryId) {
    return await axios.delete(`/category/${categoryId}`);
  },

  async getSingleCategory({ commit }, categoryId) {
    return await axios.get(`/category/${categoryId}`).then(({ data }) => {
      commit("setSingleCategory", data.data);
    });
  },

  async updateCategory({ commit }, { id, category }) {
    return await axios.post(`/category/${id}?_method=PUT`, category);
  },

  async getCategoriesNames({ commit }) {
    return await axios.get("categories-names").then(({ data }) => {
      commit("setCategoriesNames", data);
    });
  },
};

const getters = {
  getAllCategories: (state) => state.categories,
  getSingleCategory: (state) => state.category,
  getCategoryNames: (state) => state.names,
};

const categories = {
  //namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default categories;
