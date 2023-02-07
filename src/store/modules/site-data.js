import router from "@/router";

import VueAxios from "vue-axios";
import axios from "../../axios/index.js";

const state = {
  siteData: [],
};

const mutations = {
  setAllSiteData: (state, siteData) => {
    state.siteData = siteData;
  },
};

const actions = {
  async setSiteVisits() {
    return await axios.get(`/siteData`);
  },

  async getAllSiteData({ commit }, year = "") {
    return await axios.get(`/getAllSiteData?year=${year}`).then(({ data }) => {
      commit("setAllSiteData", data);
    });
  },
};

const getters = {
  getAllsiteData: (state) => state.siteData,
};

const siteData = {
  //namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default siteData;
