<template>
  <div
    class="item-card"
    @mouseover="autoLoopCarousel()"
    @mouseleave="stopCarousel()"
  >
    <div class="item-imgs" style="position: relative;">
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
      <!-- <div class="edit-container">
        <md-button
          class="md-icon-button md-raised md-round md-info"
          v-if="userRole || userId"
          @click="$emit('editCategory', item.id)"
        >
          <md-icon class="edit">edit</md-icon>
        </md-button>
      </div> -->
      <!-- <md-button
          class="md-icon-button md-raised md-round md-info "
          v-if="userRole || userId"
          @click="$emit('editCategory', item.id)"
        >
          <md-icon>edit</md-icon>
        </md-button> -->
      <button
        v-if="userRole || userId"
        @click="$emit('editCategory', item.id)"
        class="edit-container"
      >
        <md-icon class="edit">edit</md-icon>
      </button>

      <!-- <div class="delete-container">
        <md-icon class="delete">delete</md-icon>
      </div> -->
      <button
        v-if="userRole || userId"
        @click="$emit('deleteItem', item.id)"
        class="delete-container"
      >
        <md-icon class="delete">delete</md-icon>
      </button>
    </div>
    <div class="md-layout" style="padding: 0;">
      <div
        class="md-layout-item md-size-100"
        style="font-size: 20px; font-weight: bold; padding-left: 10px;"
      >
        {{ item.name }}
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
      <div style="align-self: end; padding: 0 2px;">></div>
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
    <!-- <div class="md-layout" style="padding: 0;">
      <div
        class="md-layout-item md-size-45 md-layout md-alignment-center"
        style="padding-left: 10px; margin: 0;"
      >
        <md-chip
          style="background-color: red !important;"
          class="md-accent item-card-chip md-layout-item"
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
      </div>
      <div
        class="md-layout-item md-size-10 md-layout md-alignment-center-center"
        style="padding: 0;"
      >
        >
      </div>
      <div
        class="md-layout-item md-size-45 md-layout md-alignment-center"
        style="padding-left: 0; margin: 0;"
      >
        <md-chip
          class="md-accent item-card-chip md-layout-item"
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
    </div> -->
    <div class="item-card-contents">
      <!-- <div class="item-name">
        Name:
        <span>{{ item.name }}</span>
      </div> -->
      <div class="item-description">
        {{
          item.description.length > 80
            ? item.description.substring(79, 0)
            : item.description
        }}...
      </div>
      <!-- <div class="item-avaialbility">
        Availability:
        <span :style="{ color: item.is_available == '1' ? 'green' : 'red' }">{{
          item.is_available ? "yes" : "no"
        }}</span>
      </div> -->
      <div
        class="md-layout md-alignment-center-center
      "
        style="margin-top: 30px; text-align: center; "
      >
        <div
          v-if="item.is_available"
          class="md-layout-item md-size-70"
          style="padding: 5px 10px; text-align: center; color: white;background-color:#59C89D;
          border-radius: 10px; font-weight: 400;"
        >
          AVAILABLE
        </div>
        <div
          v-else
          class="md-layout-item md-size-70"
          style="padding: 5px 10px; text-align: center; color: white; background-color:red;
          border-radius: 10px; font-weight: 400;"
        >
          UNAVAILABLE
        </div>
      </div>
    </div>
    <!-- <div class="item-card-actions">
      <button v-if="userRole || userId" @click="$emit('editCategory', item.id)">
        Edit
      </button>

      <button v-if="userRole || userId" @click="$emit('deleteItem', item.id)">
        Delete
      </button>
    </div> -->
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
      clearInterval(this.myInterval);
      this.myInterval = setInterval(this.intervalCarousel, 1500); //make the loop function execute
    },

    stopCarousel() {
      clearInterval(this.myInterval); //make the loop function stop
    },
  },
};
</script>

<style lang="scss" scoped>
.md-ripple {
  width: 30px !important;
  height: 30px !important;
}
.item-card {
  display: flex;
  flex-direction: column;
  width: 200px;
  border-radius: 14px;
  box-shadow: 0px 1px 10px #00000059;
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
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;

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
        border-top-left-radius: 14px;
    border-top-right-radius: 14px;
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
    .edit-container {
      position: absolute;
      top: 40px;
      right: 7px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: grid;
      background-color: #00aec5;
      border-color: transparent;
      border: 0;
      padding: 0;
      cursor: pointer;
      .edit {
        color: white;
      }
    }

    .delete-container {
      position: absolute;
      top: 5px;
      right: 7px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: grid;
      background-color: red;
      border: 0 transparent;
      padding: 0;
      cursor: pointer;
      .delete {
        color: white;
      }
    }
  }

  .item-card-category {
    display: flex;
    width: 100%;
    // justify-content: center;
    margin-left: 10px;
    margin-bottom: 10px;
  }

  .item-card-contents {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 10px;

    .item-name {
      font-weight: 700;
      line-height: 18px;

      span {
        font-weight: 300;
        font-size: 14px;
      }
    }

    .item-description {
      // margin-inline: 4px;
      margin-top: 10px;
      line-height: 10px;
      font-size: 11px;
      font-weight: normal;
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
