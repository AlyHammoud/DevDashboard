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
    <!-- <div class="all-infos">
      <div class="product-name-description">
        <p class="product-name">
          Name: <span>{{ product.name }}</span>
        </p>
        <p class="product-desc">
          {{
            product.description.length > 80
              ? product.description.substring(79, 0) + "..."
              : product.description
          }}
        </p>
      </div>

      <div class="product-availability">
        <p>
          Availability:
          <span
            :style="{ color: product.is_available == '1' ? 'green' : 'red' }"
            >{{ product.is_available ? "yes" : "no" }}</span
          >
        </p>
      </div>
    </div> -->

    <!-- <div class="product-card-actions">
      <button @click="$emit('editCategory', product.id)">Edit</button>
      <button @click="$emit('deleteItem', product.id)">Delete</button>
    </div> -->
    <div class="product-card-category">
      <md-chip
        style="background-color: red !important;"
        class="md-accent product-card-chip"
        md-clickable
        @click="
          $router.push({
            name: 'Items',
            params: { id: product.item.category.id },
          })
        "
      >
        {{
          product.item.category.name.length > 8
            ? product.item.category.name.substring(8, 0) + ".."
            : product.item.category.name
        }}</md-chip
      >

      <md-chip
        class="md-accent product-card-chip"
        style="background-color: green !important;"
        @click="
          $router.push({
            name: 'Products',
            params: { id: product.item.category.id, item_id: product.item.id },
          })
        "
        md-clickable
      >
        {{ product.item.name }}</md-chip
      >
    </div>
    <div class="product-card-contents">
      <div class="product-name">
        Name:
        <span>{{ product.name }}</span>
      </div>
      <div class="product-description">
        {{
          product.description.length > 111
            ? product.description.substring(110, 0) + "..."
            : product.description
        }}
      </div>
      <div class="product-avaialbility">
        Availability:
        <span
          :style="{ color: product.is_available == '1' ? 'green' : 'red' }"
          >{{ product.is_available ? "yes" : "no" }}</span
        >
      </div>

      <div class="product-infos">
        <div class="quantity">
          <p>Qty:</p>
          <p>{{ product.quantity }}</p>
        </div>
        <div class="price">
          <p>price</p>
          <p>{{ product.price }}$</p>
        </div>
        <div class="sale">
          <p>sale</p>
          <p>{{ product.sale }}%</p>
        </div>
        <div class="final price">
          <p>final price</p>
          <p>{{ (Math.round(product.final_price * 100) / 100).toFixed(2) }}$</p>
        </div>
      </div>
      <div class="product-colors" v-if="product.color">
        <p>Colors:</p>
        <div
          class=""
          v-for="(color, i) in product.color"
          :key="i"
          style="width: 15px; height: 15px;"
          :style="{ 'background-color': color }"
        ></div>
      </div>
      <div class="product-sizes" v-if="product.size">
        <p>Sizes:</p>
        <div class="" v-for="(size, i) in product.size" :key="i">
          {{ size }},
        </div>
      </div>
    </div>
    <div class="product-card-actions">
      <button
        v-if="userRole || userId"
        @click="$emit('editProduct', product.id)"
      >
        Edit
      </button>
      <button
        v-if="userRole || userId"
        @click="$emit('deleteProduct', product.id)"
      >
        Delete
      </button>
    </div>

    <div class="product-card-created">
      <span>{{ product.created_at }}</span>
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
      this.myInterval = setInterval(this.intervalCarousel, 1500); //make the loop function execute
    },

    stopCarousel() {
      clearInterval(this.myInterval); //make the loop function stop
    },
  },
};
</script>

<style lang="scss" scoped>
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
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  box-shadow: 0px 1px 10px black;
  background-color: #fff;
  transition: all 0.3s;
  padding-bottom: 10px;
  overflow-x: hidden;

  &:hover {
    scale: 1.05;
  }

  & > :not(.product-imgs, .product-card-category) {
    padding-inline: 15px;
  }

  .product-imgs {
    width: 100%;
    height: 200px;

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
          width: 5px;
          height: 5px;
          background-color: #fff;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }
  }

  // .all-infos {
  //   display: flex;
  //   flex-direction: column;
  //   gap: 0;

  //   .product-name-description {
  //     display: block;

  //     .product-name {
  //       font-size: 15px;
  //       font-weight: 900;
  //       margin-bottom: -14px;
  //       span {
  //         font-weight: 300;
  //       }
  //     }

  //     .product-desc {
  //       font-size: 12px;
  //       padding-inline: 10px;
  //     }
  //   }
  // }

  .product-card-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 12px;
    justify-self: flex-end;
    align-self: flex-end;
    margin-top: 10px;

    button {
      cursor: pointer;
      border: none;
      box-shadow: 0px 1px 14px red;
      border-radius: 50px;
      padding: 2px 8px;
    }

    button:first-child {
      box-shadow: 0px 1px 14px green;
    }
  }

  .product-card-created {
    justify-self: flex-end;
    margin-top: 10px;
    align-self: flex-end;
    font-size: 10px;
  }

  .product-card-category {
    display: flex;
    width: 100%;
    justify-content: center;
    margin: 10px 0;
  }

  .product-card-contents {
    display: flex;
    flex-direction: column;
    flex: 1;

    .product-name {
      font-weight: 700;
      line-height: 18px;

      span {
        font-weight: 300;
        font-size: 14px;
      }
    }

    .product-description {
      font-size: 10px;
      // margin-inline: 4px;
      margin-top: -2px;
      line-height: 10px;
    }

    .product-avaialbility {
      margin-block: 8px;
      font-weight: 700;

      span {
        color: green;
        font-weight: 300;
      }
    }

    .product-infos {
      display: flex;
      gap: 20px;
      margin: 0 auto;

      * {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        p:first-child {
          font-weight: 900;
        }
      }
    }

    .product-colors {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 10px;
      gap: 5px;

      p {
        font-size: 15px;
        font-weight: 900;
      }
    }
    .product-sizes {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 10px;
      gap: 5px;

      p {
        font-size: 15px;
        font-weight: 900;
      }
    }
  }
}
</style>
