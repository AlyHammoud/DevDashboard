<template>
  <div>
    <!-- <md-dialog-alert
      :md-active.sync="showDeleteDialog"
      md-content="Your post has been deleted!"
      md-confirm-text="Cool!" /> -->
    <md-dialog
      :md-active.sync="showDeleteDialog"
      :md-click-outside-to-close="false"
      class="md-dialog md-dialog-container"
    >
      <md-dialog-title>
        Delete!
      </md-dialog-title>
      <div class="md-layout">
        <div class="md-layout-item div.md-size-100"></div>
      </div>
      <md-dialog-actions>
        <md-button class="md-success">delete</md-button>
        <md-button @click="() => this.$emit('closeShowDialog')"
          >close</md-button
        >
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>
<script>
export default {
  name: "DialogAlert",
  props: {
    showDeleteDialog: { type: Boolean, default: false },
  },
  data() {
    return {
      mdshowDialog: false,
    };
  },

  watch: {
    mdshowDialog(newV) {
      if (!newV) {
        this.$emit("closeShowDialog");
      }
    },
  },
  mounted() {
    this.mdShowDialog = true;
  },
  methods: {
    onClose() {
      this.showDeleteDialog = false;
    },
  },
};
</script>
<style >
.md-dialog .md-dialog-container{
  /* width: 100px !important; */
  
}
</style>