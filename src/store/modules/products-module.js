import router from "@/router";
import { stat } from "fs";

import VueAxios from "vue-axios";
import axios from "../../axios/index.js";

const state = {
  products: [],
  product: null,
};

const mutations = {
  setAllProducts: (state, products) => {
    state.products = products;
  },
  setSingleProduct: (state, product) => {
    state.product = product;
  },
};

const actions = {
  async getAllIProductsByItem({ commit }, { page, itemId, search = "" }) {
    return await axios
      .get(`/products/${itemId}?page=${page}&search=${search}`)
      .then(({ data }) => {
        commit("setAllProducts", data);
      });
  },

  async storeProduct({ commit, state }, product) {
    return await axios.post("/product", product);
  },

  async deleteProduct({}, productId) {
    return await axios.delete(`/product/${productId}`);
  },

  async getSingleProduct({ commit }, productId) {
    return await axios.get(`/product/${productId}`).then(({ data }) => {
      commit("setSingleProduct", data.data);
    });
  },

  async updateProduct({ commit, state }, { id, product }) {
    return await axios.post(`/product/${id}?_method=PUT`, product);
  },
};

const getters = {
  getAllProducts: (state) => state.products,
  getSingleProduct: (state) => state.product,
};

const products = {
  //namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default products;
