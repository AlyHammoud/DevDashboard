<template>
  <div>
    <md-dialog
      :md-active.sync="mdShowDialog"
      :md-click-outside-to-close="false"
    >
      <md-dialog-title class="dialog-title"
        ><div class="md-layout">
          <div class="md-layout-item md-size-10"></div>
          <div class="md-layout-item md-size-80">Add Item</div>
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
        style="overflow-y:scroll"
        :style="{ opacity: isLoading ? '0.6' : '1' }"
      >
        <div class="md-layout-item md-size-100 md-layout md-alignment-center">
          <label for="avatar" class="user-avatar">
            Upload Image
            <input
              type="file"
              name="browse"
              accept=".jpg,.jpeg,.png"
              id="avatar"
              style="display: none;"
              @change="onUploadItemImages($event)"
              multiple
            />
          </label>
        </div>
        <div class="md-layout-item md-size-100">
          <md-list v-if="tmpImages.length">
            <md-list-item md-expand>
              <md-icon style="color: #4caf50;">images</md-icon>
              <span
                class="md-list-item-text"
                style="margin-left: 40px; margin-top: 15px;"
                >New Images</span
              >
              <!-- 
              <md-list
                slot="md-expand"
                v-if="tmpImages.length"
                style="text-align: center;"
              >
                <md-list-item
                  class="md-inset"
                  v-for="(image, index) in tmpImages"
                  :key="index"
                  style="width: 100%;"
                >
                  <img :src="image" class="images" />
                  <md-button
                    class="md-icon-button delete-button"
                    @click="onDeleteNewImages(image.id)"
                  >
                    <md-icon>delete</md-icon>
                  </md-button>
                </md-list-item>
              </md-list> -->
              <md-list slot="md-expand" v-if="tmpImages.length">
                <md-list-item class="md-inset">
                  <div style="display:flex; flex-wrap: wrap; gap: 10px;">
                    <div
                      v-for="(image, index) in tmpImages"
                      :key="index"
                      class="new-upload-image"
                    >
                      <img class="images" :src="image" />
                      <md-button
                        class="md-icon-button delete-button  delete-new-image"
                        @click="onDeleteNewImages(index)"
                      >
                        <md-icon>delete</md-icon>
                      </md-button>
                    </div>
                  </div>
                </md-list-item>
              </md-list>
            </md-list-item>
          </md-list>
          <validation-error
            :errors="apiValidationErrors['images.0']"
            style="color: red; "
          />
        </div>
        <div class="md-layout-item md-size-100">
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
        <div class="md-layout-item md-size-100" style="margin-top:10px ;">
          <md-field>
            <label>Price</label>
            <md-input v-model="item.price" type="number" min="1"></md-input>
            <span class="md-helper-text">Price</span>
          </md-field>
          <validation-error
            :errors="apiValidationErrors.price"
            style="color: red"
          />
        </div>
        <div class="md-layout-item md-layout md-alignment-center">
          <md-switch v-model="item.is_available">Is available</md-switch>
        </div>
      </div>
      <md-dialog-actions>
        <md-button class="md-dense md-success" @click="addItem()">
          Add
        </md-button>
        <md-button
          @click="() => this.$emit('closeShowDialog')"
          class="md-dense md-raised"
          style="background-color: white !important; color: gray !important; "
        >
          Cancel
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { ValidationError } from "@/components";
import formMixin from "@/mixins/form-mixin";

export default {
  name: "AddItemDialog",

  components: {
    ValidationError,
  },
  mixins: [formMixin],

  props: {
    showDialog: { type: Boolean, default: false },
    categoryId: { default: null },
  },

  data() {
    return {
      item: {
        name: "",
        description: "",
        images: [],
        is_vailable: true,
        price: 0,
      },
      mdShowDialog: false,
      itemImages: [],
      tmpImages: [],
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
    this.mdShowDialog = true;
  },

  methods: {
    onUploadItemImages(e) {
      this.itemImages = e.target.files;
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

    onDeleteNewImages(id) {
      // let imageIndex = this.tmpImages.findIndex((image) => image.id === id);
      // this.tmpImages.splice(imageIndex, 1);
      this.tmpImages.splice(id, 1);
      this.itemImages = Array.from(this.itemImages);
      this.itemImages.splice(id, 1);
    },

    async addItem() {
      this.isLoading = true;
      const formData = new FormData();
      formData.append("is_available", this.item.is_available ? 1 : 0);

      if (this.itemImages.length) {
        this.itemImages.forEach((image) => {
          formData.append("images[]", image);
        });
      } else {
        formData.append("images[]", []);
      }

      formData.append("name_translation[en]", this.item.name);
      formData.append(
        "description_translation[en]",
        this.item.description || "-"
      );
      formData.append("price", Number(this.item.price));
      formData.append("category_id", this.categoryId);

      try {
        await this.$store.dispatch("storeItem", formData);

        this.$emit("updateItemList");
        this.onClose();
        this.isLoading = false;
        await this.$store.dispatch("alerts/success", "Done!");
      } catch (error) {
        await this.$store.dispatch("alerts/error", "error, try again");
        //console.log(error);
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
<style>
.images {
  height: 150px;
  width: 150px;
  border-radius: 50% !important;
  object-fit: cover;
  filter: contrast(0.7);
  margin-left: auto;
  margin-right: auto;
}
</style>
