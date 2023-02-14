import router from "@/router";
import { stat } from "fs";

import VueAxios from "vue-axios";
import axios from "../../axios/index.js";

const state = {
  products: [],
  product: null,
  sales: [],
  maxPrice: 0,
};

const mutations = {
  setAllProducts: (state, products) => {
    state.products = products;
  },
  setSingleProduct: (state, product) => {
    state.product = product;
  },
  setSales: (state, sales) => {
    state.sales = sales;
  },
  setMaxPrice: (state, maxPrice) => {
    state.maxPrice = maxPrice;
  },
};

const actions = {
  async getAllIProducts({ commit }, { page, search = "" }) {
    return await axios
      .get(`/products?page=${page}&search=${search}`)
      .then(({ data }) => {
        commit("setAllProducts", data);
      });
  },

  async getAllIProductsFiltered(
    { commit },
    { page, categoryIds, itemIds, prices, sales, search }
  ) {
    let url = `/filtered-products`;
    if (categoryIds) url += `/${categoryIds}`;
    else url += `/no-cat`;

    if (itemIds) url += `/${itemIds}`;
    else url += `/no-item`;

    url += `?page=${page}`;

    if (prices) url += `&prices=${prices}`;
    if (sales) url += `&sales=${sales}`;
    if (search) url = `/filtered-products?page=${page}&search=${search}`;

    return await axios.get(url).then(({ data }) => {
      commit("setAllProducts", data);
    });
  },

  async getSales({ commit }) {
    return await axios.get("product-sales").then(({ data }) => {
      commit("setSales", data);
    });
  },

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
  async getMaxPrice({ commit }) {
    return await axios.get(`/product-max-price`).then(({ data }) => {
      commit("setMaxPrice", data);
    });
  },
};

const getters = {
  getAllProducts: (state) => state.products,
  getSingleProduct: (state) => state.product,
  getSales: (state) => state.sales,
  getMaxPrice: (state) => state.maxPrice,
};

const products = {
  //namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default products;
