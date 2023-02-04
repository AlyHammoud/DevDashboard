<template>
  <md-card class="hoverElevate">
    <md-card-area>
      <md-card-media>
        <img
          src="https://cdn.shopify.com/s/files/1/0559/0899/1136/products/s-l1600-32_1500x.png?v=1670788356"
          alt="People"
          class="most_view_products"
          style="max-width:100%; max-height:100%;"
        />
      </md-card-media>

      <md-card-header>
        <div
          class="md-title"
          style="text-align: center; font-size: 22px !important;"
        >
          {{ item.name }}
        </div>
        <div class=" md-layout md-alignment-center-space-around">
          <div
            class="md-layout-item md-size-60"
            style=" padding:0 0 0 10px !important; font-weight: bold; color: green;"
          >
            {{ item.category }}
          </div>
          <div
            class="md-layout-item md-size-10"
            style="padding: 0; font-weight: bold; font-size: 20px;"
          >
            &dollar;
          </div>
          <div
            class="md-layout-item md-size-30"
            style="text-align: left !important; color: black !important; font-weight: bold !important; font-size: 1rem !important; padding: 0 !important;"
          >
            {{ item.price }}
          </div>
        </div>
      </md-card-header>

      <md-card-content class="card_content">
        <div class="md-layout ">
          <div class="md-layout-item md-size-15" style="padding: 0;">
            <img src="../assets/images/eye.png" alt="" style="width: 50%;" />
          </div>
          <div
            class="md-layout-item md-size-85"
            style="font-weight: bold; padding: 0;"
          >
            {{ item.views }}
          </div>
        </div>
        <div
          class="md-layout md-alignment-center-space-around"
          style="margin-top: 1em;"
        >
          <div class="md-layout-item md-size-15" style="padding: 0;">
            <img
              alt=""
              style="width: 50%;"
              src="../assets/images/kartone.png"
            />
          </div>
          <div
            class="md-layout-item md-size-85"
            style="font-weight: bold; padding: 0;"
          >
            {{ item.purchases }}
          </div>
        </div>
      </md-card-content>
    </md-card-area>
  </md-card>
</template>

<script>
import { type } from "os";

export default {
  data() {
    return {
      //   item: {
      //     //   type:Object
      //     name: "pack 1",
      //     category: "BackPacks",
      //     price: 129,
      //     views: 100,
      //     purchases: 55,
      //   },
    };
  },

  props: {
    // item: {
    //   //   type:Object
    //   name: "pack 1",
    //   category: "BackPacks",
    //   price: 129,
    //   views: 100,
    //   purchases: 55,
    // },
    item: {
      type: Object,
    },
  },
};
</script>

<style>
.most_view_products {
  /* background-color: #8a9316; */
  padding: 1rem 3rem;
  border-radius: 1rem;
  color: #808080;
}

.card_bottom_radius {
  border: 5px solid;
  font-weight: bold;
  border-color: transparent #8a9316 #8a9316 #8a9316;
  border-radius: 6px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.card_content {
  border-color: transparent rgb(138, 147, 22) rgb(138, 147, 22);
  border-image: initial;
  border-radius: 0px 0px 30px 30px;
}

.hoverElevate {
  border-radius: 45px !important;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.hoverElevate:hover {
  box-shadow: 0px 10px 20px 5px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}
</style>
