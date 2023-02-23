<template>
  <div>
    <md-dialog
      :md-active.sync="mdShowDialog"
      :md-click-outside-to-close="false"
    >
      <md-dialog-title
        class="dialog-title "
        style="background-color: #4caf50 !important;"
        ><div class="md-layout">
          <div class="md-layout-item md-size-10"></div>
          <div class="md-layout-item md-size-80">
            Add product
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
        style="overflow-y: scroll;"
        :style="{ opacity: isLoading ? '0.6' : '1' }"
      >
        <div class="md-layout-item md-layout md-size-100 md-alignment-center">
          <label for="avatar" class="user-avatar">
            Upload Image
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              name="browse"
              id="avatar"
              style="display: none;"
              @change="onUploadItemImages($event)"
              multiple
            />
          </label>
          <validation-error
            :errors="apiValidationErrors['images.0']"
            style="color: red;margin-left: 10px;"
          />
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
        </div>
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
        <div class="ma-layout-item md-layout md-size-100">
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
        </div>
        <div
          class="md-layout-item md-layout md-size-100"
          style="margin-top: 10px;"
        >
          <div class="md-layout-item md-size-50">
            <md-field>
              <label>Price</label>
              <span class="md-prefix">$</span>
              <md-input
                v-model="product.price"
                min="1"
                type="number"
              ></md-input>
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
              :errors="apiValidationErrors.sale"
              style="color: red"
            />
          </div>
        </div>
        <div class="md-layout-item md-layout md-size-100">
          <div class="md-layout-item md-size-100">
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
        </div>

        <!-- SIZES CONTROL -->
        <!-- SIZES CONTROL -->
        <!-- SIZES CONTROL -->
        <div
          class="md-layout-item  md-size-100"
          style="display: flex; margin-bottom: 5px; justify-content: space-around; padding-inline: 70px;min-height: 60px !important; align-items: center;"
        >
          <div class="sizes-options" style="width: 50% !important;">
            <label
              for="no-size"
              @click="setSelectOption('nosize')"
              :style="{
                'background-color':
                  selectOption == 'nosize' ? 'lightgreen' : 'white',
              }"
            >
              <span>no size</span>
            </label>

            <label
              for="no-size"
              @click="setSelectOption('xl')"
              :style="{
                'background-color':
                  selectOption == 'xl' ? 'lightgreen' : 'white',
              }"
            >
              <span>XL</span>
            </label>

            <label
              for="no-size"
              @click="setSelectOption('number')"
              :style="{
                'background-color':
                  selectOption == 'number' ? 'lightgreen' : 'white',
              }"
            >
              <span>Numbers</span>
            </label>
          </div>

          <div class="selected-options" style="width: 50%; ">
            <div v-if="selectOption == 'nosize'" style="text-align: center;">
              No size selected
            </div>
            <md-field v-if="selectOption == 'xl'">
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

            <div
              v-if="selectOption == 'number'"
              style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center;"
            >
              <div
                class="inputFieldNumber"
                v-for="(numberField, i) in sizeNumberFieldCounter"
                :key="i"
                :ref="'inputField' + i"
                :id="'inputFieldNumber' + i"
              >
                <input
                  v-model="sizeNumbermodel[i]"
                  type="text"
                  @input="addOrRemoveInputField($event, i)"
                />
                <div
                  v-if="
                    sizeNumberFieldCounter.length > 2 &&
                      i != sizeNumberFieldCounter.length - 1
                  "
                  @click="removeInputField(i)"
                >
                  X
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SIZES CONTROL -->
        <!-- SIZES CONTROL -->
        <!-- SIZES CONTROL -->

        <div
          class="md-layout-item md-layout md-size-100"
          style="display: flex; justify-content: center; "
        >
          <div
            class=""
            style="width: 50% !important; display: flex; align-items: center; justify-content: center;"
          >
            <input
              type="color"
              @change="colorHandler"
              style="margin-left: -160px;"
            />

            <validation-error
              :errors="apiValidationErrors.color"
              style="color: red"
            />
          </div>
          <div
            class=""
            style="width: 50% !important; display: flex; align-items: center; justify-content: center;"
          >
            <div
              v-if="!product.color.length"
              style="color: black;  margin-left: -60px;"
            >
              No Colors Selected
            </div>
            <!-- <div v-else style="display: flex; gap: 4px;  flex-wrap: wrap;">
              <div
                v-for="(color, index) in product.color"
                :key="index"
                :style="{ 'background-color': color }"
                @click="removeColorHandler(index)"
                style="height: 20px; width: 20px;"
              ></div>
            </div> -->
            <div v-else style="display: flex; gap: 4px; flex-wrap: wrap;">
              <div
                v-for="(color, index) in product.color"
                :key="index"
                :style="{ 'background-color': color }"
                @click="removeColorHandler(index)"
                style="height: 20px; width: 20px;"
                class="colorPicker"
              ></div>
            </div>
          </div>
        </div>
        <div class="md-layout-item md-layout md-size-100 md-alignment-center">
          <md-switch v-model="product.is_available">Is available</md-switch>
        </div>
      </div>
      <md-dialog-actions>
        <md-button class="md-dense md-success" @click="addProduct()"
          >Add</md-button
        >
        <md-button
          @click="() => this.$emit('closeShowDialog')"
          class="md-dense md-raised"
          style="background-color: white !important; color: gray !important; "
          >Cancel</md-button
        >
      </md-dialog-actions>
    </md-dialog>
    <AlertDialoge ref="showAlertDialog"></AlertDialoge>
  </div>
</template>

<script>
import { ValidationError } from "@/components";
import formMixin from "@/mixins/form-mixin";
import { AlertDialoge } from "@/components";

export default {
  name: "AddProductDialog",

  components: {
    ValidationError,
    AlertDialoge,
  },
  mixins: [formMixin],

  props: {
    showDialog: { type: Boolean, default: false },
    itemId: { default: null },
  },

  data() {
    return {
      product: {
        name: "",
        description: "",
        images: [],
        is_available: true,
        price: 0,
        quantity: 0,
        color: [],
        size: [],
        sale: 0,
      },
      mdShowDialog: false,
      productImages: [],
      tmpImages: [],
      isLoading: false,
      sizeOptions: ["XS", "S", "M", "L", "XL", "XXL"],
      selectOption: "nosize",
      sizeNumberFieldCounter: [0],
      sizeNumbermodel: [],
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
    setSelectOption(select) {
      if (this.selectOption != select || this.selectOption == "nosize") {
        this.product.size = [];
        this.sizeNumberFieldCounter = [""];
        this.sizeNumbermodel = [];
      }
      this.selectOption = select;
    },

    addOrRemoveInputField(e, index) {
      this.sizeNumbermodel[index] = e.target.value;
      this.sizeNumberFieldCounter[index] = e.target.value;
      if (
        e.target.value.length == 1 &&
        index == this.sizeNumberFieldCounter.length - 1
      ) {
        this.sizeNumberFieldCounter.push("");
      }

      if (
        e.target.value.length == 0 &&
        this.sizeNumberFieldCounter.length > 1
      ) {
        if (index == this.sizeNumberFieldCounter.length - 2) {
          this.sizeNumberFieldCounter.pop();
        }
      }
    },

    removeInputField(index) {
      this.sizeNumberFieldCounter.splice(index, 1);
      this.sizeNumbermodel.splice(index, 1);
    },

    onUploadItemImages(e) {
      this.productImages = e.target.files;

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
      this.tmpImages.splice(id, 1);
      this.productImages = Array.from(this.productImages);
      this.productImages.splice(id, 1);
    },

    colorHandler(e) {
      this.product.color.push(e.target.value);
    },

    removeColorHandler(index) {
      this.product.color.splice(index, 1);
    },

    async addProduct() {
      this.isLoading = true;
      const formData = new FormData();
      formData.append("is_available", this.product.is_available ? 1 : 0);

      if (this.productImages.length) {
        this.productImages.forEach((image) => {
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

      formData.append("price", Number(this.product.price));
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
      } else if (this.sizeNumbermodel.length) {
        this.sizeNumbermodel.forEach((size) => {
          if (size) formData.append("size[]", size);
        });
      } else {
        formData.append("size", []);
      }

      formData.append("item_id", this.itemId);

      try {
        await this.$store.dispatch("storeProduct", formData);

        this.$emit("updateProductList");
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
.images {
  height: 150px !important;
  width: 150px !important;
  border-radius: 50% !important;
  object-fit: cover;
  filter: contrast(0.7);
  margin-left: auto;
  margin-right: auto;
}

.colorPicker {
  position: relative;
  border: 0.2px solid rgb(205, 205, 216);

  &::before {
    content: "X";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 1rem;
    opacity: 0;
    transition: all 0.3s ease;
    cursor: pointer;
    font-size: 20px !important;
  }
  &:hover::before {
    opacity: 1;
    color: white !important;
  }
}

.new-upload-image {
  position: relative;

  .delete-new-image {
    position: absolute;
    top: 0;
    left: 120px !important;
    font-size: 5px !important;
    width: 5px !important;
    // height: 10px;
    transform: scale(0.8);
    border-radius: 50%;
    * {
      font-size: 18px !important;
    }
  }
}

.sizes-options {
  display: flex;
  align-items: center;

  label {
    display: flex;
    margin-right: 10px;
    padding: 2px;
    border: 1px solid rgb(165, 154, 154);
    cursor: pointer;
  }

  .selected-options {
    // width: 10px !important;
    // align-self: flex-end;
    // justify-self: flex-end;
    display: flex;
    flex-wrap: wrap;
  }
}

.inputFieldNumber {
  max-width: 80px !important;
  margin-left: 3px;
  position: relative !important;
  // margin: 0 auto;

  input {
    width: 100%;
    padding-right: 12px;
  }

  div {
    content: "X";
    position: absolute !important;
    top: 2px !important;
    right: -10px !important;
    color: red !important;
    font-size: 16px !important;
    width: 22px !important;
    height: 22px !important;
    z-index: 99;
    cursor: pointer;
  }
}
</style>
