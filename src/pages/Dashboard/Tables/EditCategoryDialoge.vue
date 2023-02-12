<template>
  <div>
    <md-dialog
      :md-active.sync="mdShowDialog"
      :md-click-outside-to-close="false"
    >
      <md-dialog-title class="dialog-title" style="background-color: #00aec5;">
        <div class="md-layout">
          <div class="md-layout-item md-size-10"></div>
          <div class="md-layout-item md-size-80">
            Edit Category - {{ category.name }}
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
        <!-- <div class="md-layout-item md-layout md-size-100 md-alignment-center">
          <label for="avatar" class="user-avatar">
            Upload Image
            <input
              type="file"
              name="browse"
              id="avatar"
              style="display: none;"
              @change="onUploadCategoryImage($event)"
            />
          </label>
          <img
            v-if="category.image_url"
            style="position: relative !important; height: 110px; width:110px; object-fit: cover; border-radius: 50%; margin-left: 1em;"
            :src="category.image_url"
          />
        </div> -->
        <div class="image-uploaders" style="position: relative;">
          <div class="image-uploaders-wrapper">
            <img
              :src="
                category.image_url
                  ? category.image_url
                  : imgUrl('defaultProfilePicture.jpg')
              "
              alt=""
            />
            <label for="avatar" class="user-avatar">
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                name="browse"
                id="avatar"
                style="display: none;"
                @change="categoryImageHandler"
              />
              <md-icon class="img-icon">edit</md-icon>
            </label>
          </div>
          <validation-error
            :errors="apiValidationErrors.image_url"
            style="color: red; "
          />
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Name</label>
            <md-input v-model="category.name"></md-input>
            <span class="md-helper-text">Name</span>
          </md-field>
          <validation-error
            :errors="apiValidationErrors['name_translation.en']"
            style="color: red"
          />
        </div>
        <div class="md-layout-item md-layout md-size-100">
          <md-field>
            <label>Description</label>
            <md-textarea v-model="category.description"></md-textarea>
            <md-icon>description</md-icon>
            <validation-error
              :errors="apiValidationErrors.description"
              style="color: red"
            />
          </md-field>
        </div>
        <div class="md-layout-item md-layout md-size-100">
          <md-switch
            v-model="category.is_available"
            style="margin-left: 50%; translate: -25%;"
            >Is available</md-switch
          >
        </div>
      </div>
      <md-dialog-actions>
        <md-button class="md-dense md-blue" @click="editCategory()"
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

var images = require.context("../../../assets/images", false, /\.jpg$/);

export default {
  name: "EditCategoryDialoge",

  components: {
    ValidationError,
    LoaderFull,
  },
  mixins: [formMixin],

  props: {
    showEditDialog: { type: Boolean, default: false },
    categoryId: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      category: {
        name: null,
        description: null,
        image_url: null,
        is_vailable: true,
      },
      tmpCategoryImage: null,
      mdShowDialog: false,
      categoryImage: null,
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
    this.getCategory(this.categoryId);
    this.mdShowDialog = true;
  },

  methods: {
    imgUrl: function(path) {
      return images("./" + path);
    },

    categoryImageHandler(e) {
      this.categoryImage = e.target.files[0];
      var fileReader = new FileReader();
      fileReader.onload = () => {
        this.category.image_url = fileReader.result;
      };
      fileReader.readAsDataURL(e.target.files[0]);
    },
    removeTmpImage() {
      this.categoryImage = null;
      this.category.image_url = null;
    },
    // onUploadCategoryImage(e) {
    //   this.categoryImage = e.target.files[0];

    //   const reader = new FileReader();

    //   reader.readAsDataURL(e.target.files[0]);
    //   reader.onload = () => {
    //     this.category.image_url = reader.result;
    //   };
    // },
    async getCategory(id) {
      await this.$store.dispatch("getSingleCategory", id);
      this.category = this.$store.getters["getSingleCategory"];

      if (this.category.is_available === 1) {
        this.category.is_available = true;
      } else {
        this.category.is_available = false;
      }
    },

    async editCategory() {
      this.isLoading = true;
      const formData = new FormData();
      formData.append("is_available", this.category.is_available ? 1 : 0);
      if (this.categoryImage) {
        formData.append("image_url", this.categoryImage);
      }
      formData.append("name_translation[en]", this.category.name);
      formData.append(
        "description_translation[en]",
        this.category.description || "-"
      );

      try {
        await this.$store.dispatch("updateCategory", {
          id: this.categoryId,
          category: formData,
        });

        this.$emit("updateCategoryList");
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
<style lang="scss" scoped>
.dialog-title {
  background-color: #00aec5;
  color: white;
  padding: 12px 8px 12px !important;
  text-align: center;
}

.user-avatar {
  width: 150px;
  height: 40px;
  border: 1px dashed rgb(97, 92, 92);
  color: black;
  padding: 4px 2px;
  margin-block: 10px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.image-uploaders {
  margin: 0 auto;
  height: 150px;
  width: 150px;
  position: relative;
  &-wrapper {
    width: 100% !important;
    height: 100% !important;
    overflow: hidden;
    border-radius: 50%;
    margin-bottom: 30px;
    position: relative;

    img {
      width: 100% !important;
      height: 100% !important;
    }
    .img-icon {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      cursor: pointer;
      // background-color: rgba(52, 216, 30, 0.6);
      background-color: #00aec596;
      color: white !important;
      transition: all 0.6s;

      &:hover {
        height: 40%;
        // background-color: rgba(52, 216, 30, 0.9);
        background-color: #00aec5c9;
      }
    }
  }

  .img-icon-delete {
    position: absolute;
    top: 10px;
    right: 5px;
    cursor: pointer;
    width: 24px !important;
    height: 24px;
    color: red;
    font-size: 2em;
    z-index: 333;
    pointer-events: all;
  }
}
</style>
