import router from "@/router";
import { stat } from "fs";

import VueAxios from "vue-axios";
import axios from "../../axios/index.js";

const state = {
  ads: [],
  ad: {},
  general_info: {}
};

const mutations = {
  setAllAds: (state, ads) => {
    state.ads =  ads 
  },
  setSingleAd: (state, ad) => {
    state.ad = ad;
  },
  setGeneralInfo: (state, general_info) => {
    state.general_info = general_info
  }
};

const actions = {
  async getAllGeneralInfo({commit}){
    return await axios.get('general-info').then(({data}) => {
      commit('setGeneralInfo', data)
    })
  },

  async storeGeneralInfo({}, formData){
    return await axios.post('/general-info', formData)
  },

  async updateGeneralInfo({ commit }, { id, formData }) {
    
    return await axios.post(`/general-info/${id}?_method=PUT`, formData);
  },

  async getAllAds({ commit }, page=1) {
    return await axios
      .get(`/get-all-advert?page=${page}`)
      .then(({ data }) => {
        
        commit("setAllAds", data);
        
      });
  },

  async storeAd({ commit, state }, AdContent) {
    return await axios.post("/add-new-ad", AdContent);
  },

  async deleteAd({}, adId) {
    return await axios.delete(`/delete-ad/${adId}`);
  },

  async getSingleAd({ commit }, adId,) {
    
    return await axios.get(`/get-ad/${adId}`).then(({data}) => {
      
      commit("setSingleAd", data);
    })
  },

  async updateAd({ commit }, { id, formData }) {
    
    return await axios.post(`/update-ad/${id}?_method=PUT`, formData);
  },

//   async getCategoriesNames({ commit }) {
//     return await axios.get("categories-names").then(({ data }) => {
//       commit("setCategoriesNames", data);
//     });
//   },
};

const getters = {
  getAllAds: (state) => state.ads,
  getSingleAd: (state) => state.ad,
  getGeneralInfo: (state) => state.general_info,
};

const ads = {
  //namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default ads;
