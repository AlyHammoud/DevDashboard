<template>
  <div>
    <!-- <md-dialog
      :md-active.sync="mdShowDialog"
      style="margin-left: auto; margin-right: auto;  border-radius: 10px;"
    >
      <div
        style="margin-left: auto; margin-right: auto; width: 400px ; overflow-x: hidden;overflow-y: auto;"
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
              Edit Item (<span
                style="text-overflow: ellipsis;white-space: nowrap; overflow: hidden;"
                >{{ product.name }}</span
              >)
            </div>
          </div>
        </div>
        <div>
          <div class="md-layout text-center " style="color: white; ">
            <div class="md-layout-item">
              <md-field>
                <label>Name</label>
                <md-input v-model="product.name"></md-input>
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
                <md-textarea v-model="product.description"></md-textarea>
                <md-icon>description</md-icon>
                <validation-error
                  :errors="apiValidationErrors.description"
                  style="color: red"
                />
              </md-field>
            </div>
          </div>
          <md-switch
            v-model="product.is_available"
            style="margin-left: 50%; translate: -25%;"
            >Is available</md-switch
          >

          <div>
            <div class="md-layout text-center " style="color: white; ">
              <div class="md-layout-item">
                <md-field>
                  <label>Price</label>
                  <md-input v-model="product.price" type="number"></md-input>
                  <span class="md-helper-text">Price</span>
                </md-field>
                <validation-error
                  :errors="apiValidationErrors.price"
                  style="color: red"
                />
              </div>
            </div>

            <div class="md-layout-item">
              <md-field>
                <label>Quantity</label>
                <md-input
                  v-model="product.quantity"
                  min="0"
                  type="number"
                ></md-input>
                <span class="md-prefix">#</span>
              </md-field>
              <validation-error
                :errors="apiValidationErrors.quantity"
                style="color: red"
              />
            </div>

            <div class="md-layout-item">
              <md-field>
                <label>Sale</label>
                <span class="md-prefix">%</span>
                <md-input
                  v-model="product.sale"
                  min="0"
                  max="100"
                  type="number"
                ></md-input>
              </md-field>
              <validation-error
                :errors="apiValidationErrors.price"
                style="color: red"
              />
            </div>

            <div class="md-layout-item">
              <md-field>
                <label for="movie">No size selected</label>
                <md-select
                  v-model="product.size"
                  multiple
                  name="movie"
                  id="movie"
                >
                  <md-option
                    v-for="(size, i) in sizeOptions"
                    :key="i"
                    :value="size"
                    >{{ size }}</md-option
                  >
                </md-select>
              </md-field>
            </div>

            <div style="display: flex; width: 100% !important;">
              <div
                class="md-layout-item"
                style="display: flex; align-items: center; justify-content: space-around;"
              >
                <input type="color" @change="colorHandler" />

                <validation-error
                  :errors="apiValidationErrors.color"
                  style="color: red"
                />
              </div>
              <div class="md-layout-item">
                <div v-if="!product.color ? true : false" style="color: black">
                  No Colors Selected
                </div>
                <div v-else style="display: flex; gap: 4px;  flex-wrap: wrap;">
                  <div
                    v-for="(color, index) in product.color"
                    :key="index"
                    :style="{ 'background-color': color }"
                    @click="removeColorHandler(index)"
                    style="height: 20px; width: 20px;"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="md-layout text-center " style="color: white; ">
            <div class="md-layout-item">
              <md-field>
                <label>Add Images</label>

                <md-file multiple @md-change="onUploadProductImages($event)" />
              </md-field>
              <validation-error
                :errors="apiValidationErrors.image_url"
                style="color: red"
              />
            </div>
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
                    @change="onUploadProductImages($event)"
                    multiple
                  />
                </label>

                <md-list v-if="tmpImages.length" style="margin-top: -50px;">
                  <md-list-item md-expand>
                    <md-icon>images</md-icon>
                    <span
                      class="md-list-item-text"
                      style="margin-left: 40px; margin-top: 15px;"
                      >New Images</span
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
          <md-list>
            <md-list-item md-expand>
              <md-icon>images</md-icon>
              <span
                class="md-list-item-text"
                style="margin-left: 40px; margin-top: 15px;"
                >Old Images</span
              >

              <md-list slot="md-expand">
                <md-list-item
                  class="md-inset"
                  v-for="image in product.images"
                  :key="image.id"
                  style="width: 100%;"
                >
                  <img
                    :src="image.image_url"
                    style="height: 200px; width: 100%;object-fit: cover; filter: contrast(0.7);"
                  />
                  <md-button
                    class="md-icon-button delete-button"
                    @click="onDeleteImages(image.id)"
                  >
                    <md-icon>delete</md-icon>
                  </md-button>
                </md-list-item>
              </md-list>
            </md-list-item>
          </md-list>
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
                @click="editProduct()"
                >Edit</md-button
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
      <md-dialog-title class="dialog-title" style="background-color: #00aec5;">
        <div class="md-layout">
          <div class="md-layout-item md-size-10"></div>
          <div class="md-layout-item md-size-80">
            Edit Product - {{ product.name }}
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
        </div>
      </md-dialog-title>
      <div class="md-layout" style="overflow-y: scroll;">
        <div class="md-layout-item md-size-100 md-layout md-alignment-center">
          <label for="avatar" class="user-avatar">
            Upload Image
            <input
              type="file"
              name="browse"
              id="avatar"
              style="display: none;"
              @change="onUploadProductImages($event)"
              multiple
            />
          </label>
          <validation-error
            :errors="apiValidationErrors.image_url"
            style="color: red; "
          />
        </div>
        <div class="md-layout-item md-size-100" v-if="product.images.length">
          <md-list>
            <md-list-item md-expand>
              <md-icon>images</md-icon>
              <span
                class="md-list-item-text"
                style="margin-left: 40px; margin-top: 15px;"
                >Old Images</span
              >

              <md-list slot="md-expand">
                <md-list-item
                  class="md-inset"
                  v-for="image in product.images"
                  :key="image.id"
                  style="width: 100%;"
                >
                  <img :src="image.image_url" class="images" />
                  <md-button
                    class="md-icon-button delete-button"
                    @click="onDeleteImages(image.id)"
                  >
                    <md-icon>delete</md-icon>
                  </md-button>
                </md-list-item>
              </md-list>
            </md-list-item>
          </md-list>
        </div>
        <!-- <div class="md-layout-item md-size-100">
          <div class="md-layout-item md-size-100" v-if="tmpImages.length">
            <md-list>
              <md-list-item md-expand>
                <md-icon>images</md-icon>
                <span
                  class="md-list-item-text"
                  style="margin-left: 40px; margin-top: 15px;"
                  >New Images</span
                >

                <md-list slot="md-expand">
                  <md-list-item
                    class="md-inset"
                    v-for="(image, index) in tmpImages"
                    :key="index"
                    style="width: 100%;"
                  >
                    <img :src="image" class="images" />
                    <md-button
                      class="md-icon-button delete-button"
                      @click="onDeleteNewImages(index)"
                    >
                      <md-icon>delete</md-icon>
                    </md-button>
                  </md-list-item>
                </md-list>
              </md-list-item>
            </md-list>
          </div>
        </div> -->
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Name</label>
            <md-input v-model="product.name"></md-input>
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
            <md-textarea v-model="product.description"></md-textarea>
            <md-icon>description</md-icon>
            <validation-error
              :errors="apiValidationErrors.description"
              style="color: red"
            />
          </md-field>
        </div>
        <div class="md-layout-item md-layout md-size-100">
          <div class="md-layout-item md-size-50">
            <md-field>
              <label>Price</label>
              <md-input v-model="product.price" type="number"></md-input>
              <span class="md-helper-text">Price</span>
            </md-field>
            <validation-error
              :errors="apiValidationErrors.price"
              style="color: red"
            />
          </div>
          <div class="md-layout-item md-size-50">
            <md-field>
              <label>Sale</label>
              <span class="md-prefix">%</span>
              <md-input
                v-model="product.sale"
                min="0"
                max="100"
                type="number"
              ></md-input>
            </md-field>
            <validation-error
              :errors="apiValidationErrors.price"
              style="color: red"
            />
          </div>
        </div>
        <div class="md-layout-item md-layout md-size-100">
          <div class="md-layout-item md-size-50">
            <md-field>
              <label>Quantity</label>
              <md-input
                v-model="product.quantity"
                min="0"
                type="number"
              ></md-input>
              <span class="md-prefix">#</span>
            </md-field>
            <validation-error
              :errors="apiValidationErrors.quantity"
              style="color: red"
            />
          </div>
          <div class="md-layout-item md-size-50">
            <md-field>
              <label for="movie">No size selected</label>
              <md-select
                v-model="product.size"
                multiple
                name="movie"
                id="movie"
              >
                <md-option
                  v-for="(size, i) in sizeOptions"
                  :key="i"
                  :value="size"
                  >{{ size }}</md-option
                >
              </md-select>
            </md-field>
          </div>
        </div>
        <div class="md-layout-item md-layout md-size-100">
          <div class="md-layout-item md-size-50">
            <input type="color" @change="colorHandler" />

            <validation-error
              :errors="apiValidationErrors.color"
              style="color: red"
            />
          </div>
          <div class="md-layout-item md-size-50">
            <div v-if="!product.color ? true : false" style="color: black">
              No Colors Selected
            </div>
            <div v-else style="display: flex; gap: 4px;  flex-wrap: wrap;">
              <div
                v-for="(color, index) in product.color"
                :key="index"
                :style="{ 'background-color': color }"
                @click="removeColorHandler(index)"
                style="height: 20px; width: 20px;"
              ></div>
            </div>
          </div>
        </div>
        <div class="md-layout-item md-layout md-alignment-center md-size-100">
          <md-switch v-model="product.is_available">Is available</md-switch>
        </div>
      </div>
      <md-dialog-actions>
        <md-button class="md-dense md-blue" @click="editProduct()"
          >Edit</md-button
        >
        <md-button
          @click="() => this.$emit('closeShowDialog')"
          class="md-dense md-raised"
          style="background-color: white !important; color: gray !important; "
          >Cancel</md-button
        >
      </md-dialog-actions>
    </md-dialog>
    <LoaderFull v-if="isLoading"></LoaderFull>
  </div>
</template>

<script>
import { ValidationError, LoaderFull } from "@/components";
import formMixin from "@/mixins/form-mixin";

export default {
  name: "EditProductDialoge",

  components: {
    ValidationError,
    LoaderFull,
  },
  mixins: [formMixin],

  props: {
    showEditDialog: { type: Boolean, default: false },
    productId: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      product: {
        name: null,
        description: null,
        images: [],
        is_vailable: true,
        price: 0,
        color: [],
        quantity: 0,
        sale: 0,
        size: [],
      },
      newImages: [],
      tmpImages: [],
      deleted_images: [],
      mdShowDialog: false,
      isLoading: false,
      sizeOptions: ["XS", "S", "M", "L", "XL", "XXL"],
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
    this.getProduct(this.productId);
    this.mdShowDialog = true;
  },

  methods: {
    async getProduct(id) {
      await this.$store.dispatch("getSingleProduct", id);
      this.product = this.$store.getters["getSingleProduct"];

      if (this.product.is_available === 1) {
        this.product.is_available = true;
      } else {
        this.product.is_available = false;
      }

      if (this.product.color == null) {
        this.product.color = [];
      }
    },

    onUploadProductImages(e) {
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
      let imageIndex = this.product.images.findIndex(
        (image) => image.id === id
      );
      this.product.images.splice(imageIndex, 1);
    },

    onDeleteNewImages(index) {
      this.deleted_images.push(index);
      let newImgIndex = this.tmpImages.findIndex(
        (image) => image.index === index
      );
      this.tmpImages.splice(newImgIndex, 1);
    },

    async editProduct() {
      if (
        this.product.price < 0 ||
        this.product.quantity < 0 ||
        this.product.sale < 0
      ) {
        alert("Price, quantity or sale must be greater than zero!");
        return;
      }

      this.isLoading = true;
      const formData = new FormData();
      formData.append("is_available", this.product.is_available ? 1 : 0);
      formData.append("price", this.product.price);

      formData.append("quantity", Number(this.product.quantity));
      formData.append("sale", Number(this.product.sale));

      if (this.product.color.length) {
        this.product.color.forEach((color) => {
          formData.append("color[]", color);
        });
      } else {
        formData.append("color", []);
      }

      if (this.product.size.length) {
        this.product.size.forEach((size) => formData.append("size[]", size));
      } else {
        formData.append("size", []);
      }

      if (this.newImages.length) {
        this.newImages.forEach((image) => {
          formData.append("images[]", image);
        });
      } else {
        formData.append("images", []);
      }

      formData.append("name_translation[en]", this.product.name);

      formData.append(
        "description_translation[en]",
        this.product.description || "-"
      );

      if (this.deleted_images.length) {
        this.deleted_images.forEach((image) => {
          formData.append("deleted_images[]", image);
        });
      } else {
        formData.append("deleted_images", []);
      }

      try {
        await this.$store.dispatch("updateProduct", {
          id: this.productId,
          product: formData,
        });

        this.$emit("updateProductList");
        this.onClose();
        this.isLoading = false;
        this.$store.dispatch("alerts/success", "Done!");
      } catch (error) {
        await this.$store.dispatch("alerts/error", "error, try again");
        this.setApiValidation(error.data.errors);
        this.isLoading = false;
      }
    },

    colorHandler(e) {
      this.product.color.push(e.target.value);
    },

    removeColorHandler(index) {
      this.product.color.splice(index, 1);
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
</style>
