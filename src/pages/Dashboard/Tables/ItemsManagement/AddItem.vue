<template>
  <div>
    <!-- <md-dialog
      :md-active.sync="mdShowDialog"
      style="margin-left: auto; margin-right: auto; overflow: auto; border-radius: 10px;"
    >
      <div
        style="margin-left: auto; margin-right: auto; width: 400px ; overflow: hidden; overflow-y: auto;"
      >
        <div>
          <div class="md-layout " style="color: white; text-align: center; ">
            <div
              class="md-layout-item "
              style="background-color: #5aaf45 !important; padding: 8px 10px; background-color: #5aaf45 ;
                margin: 0 0 5px 0;
                width: 100%;
                text-align: center;
                font-size: 20px;"
            >
              Add Item
            </div>
          </div>
        </div>
        <div>
          <div class="md-layout text-center " style="color: white; ">
            <div class="md-layout-item">
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
          </div>
        </div>
        <div>
          <div class="md-layout text-center " style="color: white; ">
            <div class="md-layout-item">
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
          </div>
          <div>
            <div class="md-layout text-center " style="color: white; ">
              <div class="md-layout-item">
                <md-field>
                  <label>Price</label>
                  <md-input v-model="item.price" type="number"></md-input>
                  <span class="md-helper-text">Price</span>
                </md-field>
                <validation-error
                  :errors="apiValidationErrors.price"
                  style="color: red"
                />
              </div>
            </div>
          </div>

          <md-switch
            v-model="item.is_available"
            style="margin-left: 50%; translate: -25%;"
            >Is available</md-switch
          >
        </div>

        <div>
          <div
            style="display: flex; flex-direction: column; align-items: center; justify-content: center;"
          >
            <div
              class="md-layout text-center info-text"
              style="color: white; display: flex !important; gap: 50px; align-items: center; margin-top: 10px;"
            >
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

              <md-list v-if="tmpImages.length" style="margin-top: -50px;">
                <md-list-item md-expand>
                  <md-icon>images</md-icon>
                  <span
                    class="md-list-item-text"
                    style="margin-left: 40px; margin-top: 15px;"
                    >Images</span
                  >

                  <md-list slot="md-expand" v-if="tmpImages.length">
                    <md-list-item
                      class="md-inset"
                      v-for="(image, index) in tmpImages"
                      :key="index"
                      style="width: 100%;"
                    >
                      <img
                        :src="image"
                        style="height: 150px; height: 150px;width: 100%;object-fit: cover; filter: contrast(0.7);"
                      />
                    </md-list-item>
                  </md-list>
                </md-list-item>
              </md-list>
            </div>
            <validation-error
              :errors="apiValidationErrors.image_url"
              style="color: red; "
            />
          </div>
        </div>

        <div class="md-layout-item">
          <div
            class="md-layout md-gutter md-alignment-center-space-around"
            style="padding: 10px 0; "
          >
            <div class="md-layout-item md-size-45 " style="text-align: right;">
              <md-button
                class="md-dense md-primary"
                style="width: 40%; margin-right: 1em; background-color: #5aaf45 !important; "
                @click="addItem()"
                >Add</md-button
              >
            </div>
            <div class="md-layout-item md-size-45" style="text-align: left;">
              <md-button
                @click="() => this.$emit('closeShowDialog')"
                class="md-dense md-raised"
                style="background-color: white !important; color: gray !important; "
                >Cancel</md-button
              >
            </div>
          </div>
        </div>
      </div>
    </md-dialog> -->
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
      <div class="md-layout" style="overflow-y:scroll">
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
                >Images</span
              >

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
    <LoaderFull v-if="isLoading"></LoaderFull>
  </div>
</template>

<script>
import { ValidationError, LoaderFull } from "@/components";
import formMixin from "@/mixins/form-mixin";

export default {
  name: "AddItemDialog",

  components: {
    ValidationError,
    LoaderFull,
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
        console.log(error)
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
