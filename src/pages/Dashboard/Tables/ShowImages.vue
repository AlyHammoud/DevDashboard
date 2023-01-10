<template>
  <div style="">
    <md-dialog :md-active.sync="showDialog" style="z-index: 999999999;">
      <div
        style="overflow-y: auto; display: flex; flex-wrap: wrap; gap: 20px; width: 100%; padding: 20px; justify-content: center;"
      >
        <md-content v-for="image in images" :key="image.id"
          ><img
            :src="image.image_url"
            alt=""
            style="width: 150px; height: 150px; object-fit: cover;"
        /></md-content>
      </div>
      <div class="" style="text-align: center;  width: 100%;">
        <md-button
          @click="() => this.$emit('closeShowDialog')"
          class="md-dense md-raised"
          style="background-color: #ff0000 !important; color: #fff !important;"
          >Close</md-button
        >
      </div>
    </md-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showImagesDialog: {
      default: false,
      type: Boolean,
    },
    images: {
      type: Array,
    },
  },

  data() {
    return {
      showDialog: false,
    };
  },

  watch: {
    showDialog(newV) {
      if (!newV) {
        this.$emit("closeShowDialog");
      }
    },
  },

  mounted() {
    this.showDialog = true;
  },
};
</script>

<style></style>
