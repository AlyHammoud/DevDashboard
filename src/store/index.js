import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth";
import alerts from "./modules/alerts-module";
import categories from "./modules/categories-module";
import items from "./modules/items-module";
import products from "./modules/products-module";
import siteData from "./modules/site-data";
import ads from "./modules/ads-module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    alerts,
    categories,
    items,
    products,
    siteData,
    ads
  },
});
