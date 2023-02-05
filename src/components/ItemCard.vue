<template>
  <div
    class="item-card"
    @mouseover="autoLoopCarousel()"
    @mouseleave="stopCarousel()"
  >
    <div class="item-imgs">
      <div v-if="item.images.length" class="item-img">
        <img :src="item.images[imageIndex].image_url" />
        <div class="item-carousel">
          <div
            class="dot"
            v-for="(image, i) in item.images.length"
            :key="i"
            @click="carouselImage(item.id, i)"
            :style="{ 'background-color': i == imageIndex ? 'red' : '#fff' }"
          ></div>
        </div>
      </div>
      <div v-else>
        <img src="../assets/images/no-image.jpg" alt="" />
      </div>
    </div>
    <div class="item-card-category">
      <md-chip
        style="background-color: red !important;"
        class="md-accent item-card-chip"
        md-clickable
        @click="
          $router.push({ name: 'Items', params: { id: item.category.id } })
        "
        >{{
          item.category.name.length > 8
            ? item.category.name.substring(8, 0) + ".."
            : item.category.name
        }}</md-chip
      >

      <md-chip
        class="md-accent item-card-chip"
        style="background-color: green !important;"
        md-clickable
        @click="
          $router.push({
            name: 'Products',
            params: { id: item.category.id, item_id: item.id },
          })
        "
        >{{ item.products_count }} Products</md-chip
      >
    </div>
    <div class="item-card-contents">
      <div class="item-name">
        Name:
        <span>{{ item.name }}</span>
      </div>
      <div class="item-description">
        {{
          item.description.length > 80
            ? item.description.substring(79, 0)
            : item.description
        }}...
      </div>
      <div class="item-avaialbility">
        Availability:
        <span :style="{ color: item.is_available == '1' ? 'green' : 'red' }">{{
          item.is_available ? "yes" : "no"
        }}</span>
      </div>
    </div>
    <div class="item-card-actions">
      <button v-if="userRole || userId" @click="$emit('editCategory', item.id)">
        Edit
      </button>

      <button v-if="userRole || userId" @click="$emit('deleteItem', item.id)">
        Delete
      </button>
    </div>
    <div class="item-card-created">
      <span>{{ item.created_at }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "item-card",
  data() {
    return {
      imageIndex: 0,
      user: {}, //the user variable i want to fill with data from api
      isHovering: false,
      initialTimeInterval: null,
      myInterval: null,
    };
  },

  props: {
    item: {
      type: Object,
    },
    userId: { type: Boolean, default: false },
    userRole: { type: Boolean, default: false },
  },

  // mounted() {
  //   this.autoLoopCarousel();
  // },

  // async unmounted(){
  //   if(isHovering){
  //     this.autoLoopCarousel();
  //   }
  // }
  // ,

  async mounted() {
    // this.autoLoopCarousel();
    // await this.$store.dispatch("myUser");
    // this.user = await this.$store.getters.myUser;
  }, //this is the method to get user data from db

  methods: {
    carouselImage(item_id, index) {
      this.imageIndex = index;
    },

    intervalCarousel() {
      if (this.item.images.length - 1 > this.imageIndex) {
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
.item-card {
  display: flex;
  flex-direction: column;
  width: 200px;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  box-shadow: 0px 1px 10px black;
  background-color: #fff;
  transition: all 0.3s;

  &:hover {
    scale: 1.05;
  }

  & > :not(.item-imgs, .item-card-category) {
    padding-inline: 15px;
  }

  .item-imgs {
    width: 100%;
    height: 150px;

    .item-img {
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

      .item-carousel {
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

  .item-card-category {
    display: flex;
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
  }

  .item-card-contents {
    display: flex;
    flex-direction: column;
    flex: 1;

    .item-name {
      font-weight: 700;
      line-height: 18px;

      span {
        font-weight: 300;
        font-size: 14px;
      }
    }

    .item-description {
      font-size: 10px;
      // margin-inline: 4px;
      margin-top: -2px;
      line-height: 10px;
    }

    .item-avaialbility {
      margin-block: 8px;
      font-weight: 700;

      span {
        color: green;
        font-weight: 300;
      }
    }
  }

  .item-card-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 12px;
    justify-self: flex-end;
    align-self: flex-end;

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

  .item-card-created {
    justify-self: flex-end;
    margin-top: 10px;
    align-self: flex-end;
    font-size: 10px;
  }
}
</style>
