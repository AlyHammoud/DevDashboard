import Vue from "vue";
import axios from "./axios";

// Plugins
import App from "./App.vue";
import Chartist from "chartist";
import VueAxios from "vue-axios";
import DashboardPlugin from "./material-dashboard";
import VueSimpleAlert from "vue-simple-alert";
import "vue-search-select/dist/VueSearchSelect.css";

// plugin setup
Vue.use(DashboardPlugin);
Vue.use(VueSimpleAlert);
// Vue.use(VueAxios, axios);

////////////////////////////////
////////////////////////////////
////////////////////////////////
////////////////////////////////
////////////////////////////////
////////////////////////////////
Vue.config.productionTip = false;

Vue.prototype.$http = axios;
axios.defaults.timeout = 10000;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("USERTOKEN");
    if (token) {
      config.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        case 400:
          //do something
          break;

        case 401:
          localStorage.clear("USERTOKEN");
          router.go({
            path: "/login",
            query: { redirect: router.currentRoute.fullPath },
          });
          break;
        case 403:
          router.replace({
            path: "/login",
            query: { redirect: router.currentRoute.fullPath },
          });
          break;
        case 404:
          router.replace({
            path: "/login",
            query: { redirect: router.currentRoute.fullPath },
          });
          break;
        case 502:
          setTimeout(() => {
            router.replace({
              path: "/login",
              query: {
                redirect: router.currentRoute.fullPath,
              },
            });
          }, 1000);
      }
      return Promise.reject(error.response);
    }
  }
);

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

// router & store setup
import router from "./router";
import store from "./store";

// global library setup
Vue.prototype.$Chartist = Chartist;

/* eslint-disable no-new */
const app = new Vue({
  router: router,
  store: store,
  el: "#app",
  render: (h) => h(App),
});

store.$app = app;
