<template>
  <div>
    <md-dialog
      :md-active.sync="mdShowDialog"
      :md-click-outside-to-close="false"
    >
      <md-dialog-title
        class="dialog-title "
        style="background-color: #00aec5 !important;"
        ><div class="md-layout">
          <div class="md-layout-item md-size-10"></div>
          <div class="md-layout-item md-size-80">
            Edit Item - {{ item.name }}
          </div>
          <div
            class="md-layout-item md-size-10 md-layout md-alignment-center"
            style="padding-right: 0;"
          >
            <div
              class="material-icons"
              style="font-size: 25px; cursor: pointer;"
              @click="() => this.$emit('closeShowDialog')"
            >
              close
            </div>
          </div>
        </div></md-dialog-title
      >
      <div
        class="my-spinner"
        style="background-color:transparent; z-index: 99; width: 100% ;margin-top: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; height: 100%; position: absolute; "
        v-if="isLoading"
      >
        <md-progress-spinner
          class="md-accent"
          :md-diameter="30"
          md-mode="indeterminate"
        ></md-progress-spinner>
      </div>
      <div
        class="md-layout"
        :style="{ opacity: isLoading ? '0.6' : '1' }"
        style="overflow-y:scroll;"
      >
        <div class="md-layout-item md-layout md-size-100 md-alignment-center">
          <label for="avatar" class="user-avatar">
            Upload Image
            <input
              type="file"
              name="browse"
              id="avatar"
              style="display: none;"
              @change="onUploadItemImages($event)"
              multiple
            />
          </label>
        </div>
        <div class="md-layout-item md-size-100" v-if="item.images.length">
          <md-list>
            <md-list-item md-expand>
              <md-icon style="color: #00aec5;">images</md-icon>
              <span
                class="md-list-item-text"
                style="margin-left: 40px; margin-top: 15px;"
                >Old Images</span
              >
              <md-list slot="md-expand">
                <md-list-item class="md-inset" style="width: 100%;">
                  <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    <div
                      v-for="image in item.images"
                      :key="image.id"
                      class="new-upload-image"
                    >
                      <img :src="image.image_url" class="images" />
                      <md-button
                        class="md-icon-button delete-button delete-new-image"
                        @click="onDeleteImages(image.id)"
                      >
                        <md-icon>delete</md-icon>
                      </md-button>
                    </div>
                  </div>
                </md-list-item>
              </md-list>
            </md-list-item>
          </md-list>
        </div>
        <div class="md-layout-item md-size-100">
          <md-list v-if="tmpImages.length">
            <md-list-item md-expand>
              <md-icon style="color: #00aec5;"> images </md-icon>

              <span
                class="md-list-item-text"
                style="margin-left: 40px; margin-top: 15px;"
              >
                New Images
              </span>

              <md-list slot="md-expand" v-if="tmpImages.length">
                <md-list-item class="md-inset">
                  <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    <div
                      v-for="(image, index) in tmpImages"
                      :key="index"
                      class="new-upload-image"
                    >
                      <img :src="image" class="images" />
                      <md-button
                        class="md-icon-button delete-button delete-new-image"
                        @click="onDeleteNewImages(image.id)"
                      >
                        <md-icon>delete</md-icon>
                      </md-button>
                    </div>
                  </div>
                </md-list-item>
              </md-list>
            </md-list-item>
            <validation-error
              :errors="apiValidationErrors['images.0']"
              style="color: red"
            />
          </md-list>
        </div>
        <div class="md-layout-item  md-size-100">
          <md-field>
            <label>Name</label>
            <md-input v-model="item.name"></md-input>
            <span class="md-helper-text">Name</span>
          </md-field>
          <validation-error
            :errors="apiValidationErrors['name_translation.en']"
            style="color: red"
          />
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Description</label>
            <md-textarea v-model="item.description"></md-textarea>
            <md-icon>description</md-icon>
            <validation-error
              :errors="apiValidationErrors.description"
              style="color: red"
            />
          </md-field>
        </div>
        <div class="md-layout-item md-layout md-size-100 md-alignment-center">
          <md-switch v-model="item.is_available">Is available</md-switch>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Price</label>
            <md-input v-model="item.price" type="number" min="0"></md-input>
            <span class="md-helper-text">Price</span>
          </md-field>
          <validation-error
            :errors="apiValidationErrors.price"
            style="color: red"
          />
        </div>
      </div>
      <md-dialog-actions>
        <md-button class="md-dense md-blue" @click="editItem()">Edit</md-button>
        <md-button
          @click="() => this.$emit('closeShowDialog')"
          class="md-dense md-raised"
          style="background-color: white !important; color: gray !important; "
          >Cancel</md-button
        >
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { ValidationError } from "@/components";
import formMixin from "@/mixins/form-mixin";

export default {
  name: "EditCategoryDialoge",

  components: {
    ValidationError,
  },
  mixins: [formMixin],

  props: {
    showEditDialog: { type: Boolean, default: false },
    itemId: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      item: {
        name: null,
        description: null,
        images: [],
        is_vailable: true,
        price: 0,
      },
      newImages: [],
      tmpImages: [],
      deleted_images: [],
      mdShowDialog: false,
      isLoading: false,
    };
  },

  watch: {
    mdShowDialog(newV) {
      if (!newV) {
        this.$emit("closeShowDialog");
      }
    },
  },

  mounted() {
    this.getItem(this.itemId);
    this.mdShowDialog = true;
  },

  methods: {
    async getItem(id) {
      this.isLoading = true;
      await this.$store.dispatch("getSingleItem", id);
      this.item = this.$store.getters["getSingleItem"];

      if (this.item.is_available === 1) {
        this.item.is_available = true;
      } else {
        this.item.is_available = false;
      }
      this.isLoading = false;
    },

    onUploadItemImages(e) {
      this.newImages = e.target.files;

      let y = [];
      Array.prototype.forEach.call(e.target.files, function(file) {
        if (file.type.indexOf("image/" === 0)) {
          let i = new Image();
          i = URL.createObjectURL(file); // creates a blobURI
          y.push(i);
        }
      });
      this.tmpImages.push(...y);
    },

    onDeleteImages(id) {
      this.deleted_images.push(id);
      let imageIndex = this.item.images.findIndex((image) => image.id === id);
      this.item.images.splice(imageIndex, 1);
    },

    onDeleteNewImages(index) {
      this.tmpImages.splice(index, 1);
      this.newImages = Array.from(this.tmpImages);
      this.newImages.splice(index, 1);
    },

    async editItem() {
      this.isLoading = true;
      const formData = new FormData();
      formData.append("is_available", this.item.is_available ? 1 : 0);

      if (this.newImages.length) {
        this.newImages.forEach((image) => {
          formData.append("images[]", image);
        });
      } else {
        formData.append("images", []);
      }

      formData.append("name_translation[en]", this.item.name);
      formData.append("price", Number(this.item.price));

      formData.append(
        "description_translation[en]",
        this.item.description || "-"
      );

      if (this.deleted_images.length) {
        this.deleted_images.forEach((image) => {
          formData.append("deleted_images[]", image);
        });
      } else {
        formData.append("deleted_images", []);
      }

      try {
        await this.$store.dispatch("updateItem", {
          id: this.itemId,
          item: formData,
        });

        this.$emit("updateItemList");
        this.onClose();
        this.isLoading = false;
        await this.$store.dispatch("alerts/success", "Done!");
      } catch (error) {
        await this.$store.dispatch("alerts/error", "error, try again");
        this.setApiValidation(error.data.errors);
        this.isLoading = false;
      }
    },

    onClose() {
      this.$emit("closeShowDialog");
      this.resetApiValidation();
    },
  },
};
</script>

<style lang="scss">
.delete-button {
  position: absolute !important;
  top: 10px !important;
  right: 20px !important;

  & > * {
    background-color: red !important;
  }
}

.image {
  height: 150px !important;
  width: 150px !important;
  border-radius: 50% !important;
  margin-left: auto;
  margin-right: auto;
  object-fit: cover;
  filter: contrast(0.7);
}
</style>
