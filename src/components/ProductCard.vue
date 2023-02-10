<template>
  <div
    class="product-card"
    @mouseover="autoLoopCarousel()"
    @mouseleave="stopCarousel()"
  >
    <div class="product-imgs">
      <div v-if="product.images.length" class="product-img">
        <img :src="product.images[imageIndex].image_url" />
        <div class="product-carousel">
          <div
            class="dot"
            v-for="(image, i) in product.images.length"
            :key="i"
            @click="carouselImage(product.id, i)"
            :style="{ 'background-color': i == imageIndex ? 'red' : '#fff' }"
          ></div>
        </div>
      </div>
      <div class="product-img" v-else>
        <img src="../assets/images/no-image.jpg" alt="" />
      </div>
    </div>

    <div class="product-card-main-details">
      <div class="name-category-item">
        <p class="product-name">{{ product.name }}</p>
        <div class="category-item">
          <p
            class="category-name"
            @click="
              $router.push({
                name: 'Items',
                params: { id: product.item.category.id },
              })
            "
          >
            <!-- {{
              product.item.category.name.length > 8
                ? product.item.category.name.substring(8, 0) + ".."
                : product.item.category.name
            }} -->
            {{ product.item.category.name }}
          </p>
          <span>></span>
          <p
            class="item-name"
            @click="
              $router.push({
                name: 'Products',
                params: {
                  id: product.item.category.id,
                  item_id: product.item.id,
                },
              })
            "
          >
            {{ product.item.name }}
            <!-- {{
              product.item.name.length > 8
                ? product.item.name.substring(8, 0) + ".."
                : product.item.name
            }} -->
          </p>
        </div>
      </div>
      <div class="styled-price">
        <p>{{ product.final_price }}$</p>
        <p>{{ product.price }}$</p>
      </div>
    </div>

    <div class="product-description">
      <p>
        {{
          descriptionShow
            ? descriptionShow
            : product.description.length > 150
            ? this.product.description.substring(70, 0) + "..."
            : this.product.description
        }}
      </p>
      <span
        v-if="product.description.length > 90"
        @click="descriptionCrop((viewMoreLess = !viewMoreLess))"
        >{{ !viewMoreLess ? "view more" : "view less" }}</span
      >
    </div>

    <div class="colors-sizes">
      <div class="colors" v-if="product.color">
        <div
          v-for="(color, i) in product.color"
          class="color"
          :key="i"
          :style="{ 'background-color': color }"
        ></div>
      </div>
      <div class="colors" v-else>
        <div
          class="color"
          style="width: 100%; font-size: 14px; text-align: center; border-bottom: 1px solid rgb(218, 210, 218);"
        >
          No colors added
        </div>
      </div>
      <div class="sizes" v-if="product.size">
        <div class="size" v-for="(size, i) in product.size" :key="i">
          {{ size }}
        </div>
      </div>
      <div class="sizes" v-else>
        <div
          class="color"
          style="width: 100%; font-size: 14px; text-align: center; border-bottom: 1px solid rgb(218, 210, 218);"
        >
          No Sizes added
        </div>
      </div>
    </div>

    <div
      class="product-infos"
      style="align-self: flex-start; justify-self: space-between"
    >
      <div class="quantity">
        <p>Qty:</p>
        <p>{{ product.quantity }}</p>
      </div>
      <div class="price">
        <p>price:</p>
        <p>{{ product.price }}$</p>
      </div>
      <div class="sale">
        <p>sale:</p>
        <p>{{ product.sale }}%</p>
      </div>
      <div class="final price">
        <p>final price:</p>
        <p>{{ (Math.round(product.final_price * 100) / 100).toFixed(2) }}$</p>
      </div>

      <div class="product-card-created">
        <span>{{ product.created_at }}</span>
      </div>
    </div>

    <div class="product-card-actions">
      <md-button
        v-if="userRole || userId"
        @click="$emit('deleteProduct', product.id)"
        class="md-icon-button md-danger product-action"
      >
        <md-icon>delete</md-icon>
      </md-button>

      <md-button
        v-if="userRole || userId"
        @click="$emit('editProduct', product.id)"
        class="md-icon-button md-primary product-action"
      >
        <md-icon>edit</md-icon>
      </md-button>

      <div class="product-avaialbility">
        <span
          :style="{ color: product.is_available == '1' ? 'green' : 'red' }"
          >{{ product.is_available ? "available" : "not available" }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "product-card",
  data() {
    return {
      imageIndex: 0,
      user: {}, //object to fill user data in it,
      myInterval: null,
      descriptionShow: "",
      viewMoreLess: false,
    };
  },

  props: {
    product: {
      type: Object,
    },
    userRole: { type: Boolean, default: false },
    userId: { type: Boolean, default: false },
  },

  async mounted() {},

  methods: {
    carouselImage(product_id, index) {
      clearInterval(this.myInterval);
      this.imageIndex = index;
    },

    intervalCarousel() {
      if (this.product.images.length - 1 > this.imageIndex) {
        this.imageIndex++;
      } else {
        this.imageIndex = 0;
      }
    },

    autoLoopCarousel() {
      clearInterval(this.myInterval);
      this.myInterval = setInterval(this.intervalCarousel, 1500); //make the loop function execute
    },

    stopCarousel() {
      clearInterval(this.myInterval); //make the loop function stop
    },

    descriptionCrop(viewAll = false) {
      if (!viewAll) {
        return (this.descriptionShow =
          this.product.description.length > 150
            ? this.product.description.substring(149, 0) + "..."
            : this.product.description);
      } else {
        return (this.descriptionShow = this.product.description);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$colorOffBlack: rgb(36, 32, 32);

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  line-height: initial;
}
.product-card {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
  border-radius: 14px;
  box-shadow: 0px 1px 10px black;
  background-color: #fff;
  transition: all 0.3s;
  // padding-bottom: 10px;
  overflow-x: hidden;
  position: relative;

  &:hover {
    transform: scale(1.01);
  }

  & > :not(.product-imgs, .colors-sizes) {
    padding-inline: 15px;
  }

  .product-imgs {
    width: 100%;
    height: 250px;

    .product-img {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
      }

      .product-carousel {
        width: 100%;
        height: 20px;
        margin-right: 100px;
        position: absolute;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 5px;
        bottom: 20px;
        flex-wrap: wrap;
        padding-inline: 5px;

        .dot {
          width: 6px;
          height: 6px;
          background-color: #fff;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }
  }

  .product-card-main-details {
    background: linear-gradient(to bottom, rgb(236, 232, 232) 20%, #fcfcfc 80%);
    border-top-left-radius: 18px !important;
    border-top-right-radius: 18px;
    display: flex;
    justify-content: space-between;
    margin-top: -14px;
    z-index: 1;
    padding-top: 20px;

    .name-category-item {
      display: flex;
      // flex: 1;
      flex-direction: column;

      .product-name {
        color: $colorOffBlack;
        font-size: 1.7rem;
        font-weight: 700;
        word-spacing: 1px;
      }

      .category-item {
        margin-left: 5px;
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 7px;

        * {
          font-size: 14px;
        }

        span {
          font-size: 1.7rem;
        }

        .category-name {
          color: aqua;
          font-weight: 300;
          cursor: pointer;
        }

        .item-name {
          color: crimson;
          font-weight: 300;
          cursor: pointer;
        }
      }
    }

    .styled-price {
      display: flex;
      height: 100%;
      flex-direction: column;
      // justify-content: center;
      align-items: flex-end;

      p:first-child {
        font-size: 1.2rem;
        color: rgb(190, 25, 53);
        font-weight: 500;
      }

      p:last-child {
        font-size: 1.01rem;
        color: $colorOffBlack;
        text-decoration: line-through;
        font-weight: 500;
      }
    }
  }

  .product-description {
    display: flex;
    flex-direction: column;

    p {
      font-size: 13px;
      overflow: auto;
      // height: 100%;
      max-height: 90px;
    }
    span {
      cursor: pointer;
      font-size: 14px;
      color: blue;
      z-index: inherit;
      align-self: flex-end;
      margin: 0px 10px 0 0;
    }
  }

  .colors-sizes {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    // gap: 7px;
    margin-block: 10px;

    .colors,
    .sizes {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      border: 0.5px solid rgb(228, 217, 217);
      padding: 5px;
    }

    .colors {
      display: flex;
      align-items: center;
      // justify-content: center;
      .color {
        height: 20px;
        width: 20px;
      }
    }

    .sizes {
      gap: 5px;
      .size {
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        background-color: black;
        width: 30px;
        height: 30px;
        color: #fff;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .product-infos {
    display: flex;
  }
  .product-card-actions {
    position: absolute;
    right: 10px;
    top: 10px;
    // width: 50px;
    display: flex;
    flex-direction: column;

    .product-action {
      width: 40px !important;
      height: 40px !important;
      border-radius: 50%;
      align-self: flex-end;

      &:nth-child(2) {
        background-color: rgb(70, 143, 238) !important;
      }
    }

    .product-avaialbility {
      background-color: purple;
      width: 100% !important;
      // height: 40px;
      padding: 10px;
      // display: grid;
      // place-items: center;
      // border-radius: 50%;

      span {
        color: #fff !important;
      }
    }
  }

  .product-infos {
    background-color: rgb(26, 24, 24);
    margin-top: auto;
    justify-self: flex-end !important;
    position: relative;

    align-self: flex-end;
    width: 100%;
    color: #fff;
    height: 100px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;

    div {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      flex-direction: column;
      font-weight: 700;

      p:last-child {
        margin-right: 5px;
      }
    }

    .product-card-created {
      position: absolute;
      bottom: 4px;
      right: 10px;
      font-weight: 300;
      font-size: 14px;
    }
  }
}
</style>
