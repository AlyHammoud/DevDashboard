<template>
  <div>
    <md-dialog
      :md-active.sync="mdShowDialog"
      style="margin-left: auto; margin-right: auto; overflow: auto; border-radius: 10px;"
    >
      <div style="margin-left: auto; margin-right: auto; width: 400px ;">
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
              Edit CATEGORY (<span
                style="text-overflow: ellipsis;white-space: nowrap; overflow: hidden;"
                >{{ category.name }}</span
              >)
            </div>
          </div>
        </div>
        <div>
          <div class="md-layout text-center " style="color: white; ">
            <div class="md-layout-item">
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
          </div>
        </div>
        <div>
          <div class="md-layout text-center " style="color: white; ">
            <div class="md-layout-item">
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
          </div>
          <md-switch
            v-model="category.is_available"
            style="margin-left: 50%; translate: -25%;"
            >Is available</md-switch
          >
          <!-- <div class="md-layout text-center " style="color: white; ">
            <div class="md-layout-item">
              <md-field>
                <label>Image</label>

                <md-file
                  v-model="category.image_url"
                  @md-change="onUploadCategoryImage($event)"
                />
              </md-field>
              <validation-error
                :errors="apiValidationErrors.image_url"
                style="color: red"
              />
            </div>
          </div> -->
        </div>

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
                @change="onUploadCategoryImage($event)"
              />
            </label>
            <img
              v-if="category.image_url"
              style="position: relative !important; height: 110px; object-fit: cover;"
              :src="category.image_url"
              width="110"
            />
          </div>
          <validation-error
            :errors="apiValidationErrors.image_url"
            style="color: red; "
          />
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
                @click="editCategory()"
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
    </md-dialog>
    <LoaderFull v-if="isLoading"></LoaderFull>
  </div>
</template>

<script>
import { ValidationError, LoaderFull } from "@/components";
import formMixin from "@/mixins/form-mixin";

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
    async getCategory(id) {
      await this.$store.dispatch("getSingleCategory", id);
      this.category = this.$store.getters["getSingleCategory"];

      if (this.category.is_available === 1) {
        this.category.is_available = true;
      } else {
        this.category.is_available = false;
      }
    },

    onUploadCategoryImage(e) {
      this.categoryImage = e.target.files[0];

      const reader = new FileReader();

      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        this.category.image_url = reader.result;
      };
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
