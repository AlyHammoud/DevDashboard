import Swal from "sweetalert2";

const state = {};

const mutations = {};

const actions = {
  success({ commit, dispatch }, message) {
    this.$app.$notify({
      timeout: 2500,
      message: message,
      horizontalAlign: "right",
      verticalAlign: "top",
      icon: "add_alert",
      type: "success",
    });
  },

  warning({ commit, dispatch }, message) {
    this.$app.$notify({
      timeout: 2500,
      message: message,
      horizontalAlign: "right",
      verticalAlign: "top",
      icon: "add_alert",
      type: "warning",
    });
  },
  error({ commit, dispatch }, message) {
    this.$app.$notify({
      timeout: 2500,
      message: message,
      horizontalAlign: "right",
      verticalAlign: "top",
      icon: "add_alert",
      type: "danger",
    });
  },
};

const getters = {};

const alerts = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default alerts;
