<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <!-- Table -->
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>assignment</md-icon>
          </div>
          <h4 class="title">Categories</h4>
        </md-card-header>
        <md-card-content>
          <div class="text-right">
            <md-button
              class="md-success md-dense"
              @click="showDialog_category = true"
            >
              Add Category
            </md-button>
          </div>
          <md-table
            v-model="searched"
            md-sort="name"
            md-sort-order="asc"
            class="paginated-table table-striped table-hover"
          >
            <md-table-toolbar>
              <div class="md-toolbar-section-start">
                <h1 class="md-title">Categories</h1>
              </div>

              <md-field md-clearable class="md-toolbar-section-end">
                <md-input
                  placeholder="Search by name..."
                  v-model="search"
                  @input="searchOnTable"
                />
              </md-field>
            </md-table-toolbar>

            <md-table-empty-state
              md-label="No categories found"
              :md-description="
                `No category found. Try a different search term or create a new category.`
              "
            >
              <md-button
                class="md-success md-raised"
                @click="showDialog_category = true"
                >Create New Category</md-button
              >
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="ID" md-sort-by="id"
                ><p class="pl-20">
                  {{ item.id }}
                </p></md-table-cell
              >
              <md-table-cell class="avatar" md-label="Avatar"
                ><img
                  :src="item.image_url"
                  style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-left: 20px;"
              /></md-table-cell>
              <md-table-cell md-label="Name" md-sort-by="name">
                <p class="pl-20">
                  {{ item.name }}
                </p>
              </md-table-cell>
              <md-table-cell md-label="Description" md-sort-by="description">
                <p class="pl-20">
                  {{ item.description }}
                  <!-- I am hassan mohammad shalhoub 4th  year university LIU student i work in web development -->
                </p>
              </md-table-cell>

              <md-table-cell md-label="Created At" md-sort-by="created_at">
                <p class="pl-20">
                  {{ item.created_at }}
                </p>
              </md-table-cell>
              <md-table-cell md-label="Available" md-sort-by="email">
                <p class="pl-20">
                  {{ item.is_available ? "yes" : "no" }}
                </p>
              </md-table-cell>
              <md-table-cell md-label="Categroy Actions">
                <div
                  class="md-layout md-alignment-center"
                  v-if="user.role == 'admin' || user.id == item.managed_by"
                >
                  <div
                    class="md-layout-item md-size-50"
                    style="margin: 0 !important; padding-right: 5px; text-align: right;"
                  >
                    <md-button
                      class="md-icon-button md-raised md-round md-info"
                      @click="editCategpory(item.id)"
                    >
                      <md-icon>edit</md-icon>
                    </md-button>
                  </div>
                  <div
                    class="md-layout-item md-size-50 md-layout md-alignment-left"
                    style="margin: 0 !important; padding-left: 5px;"
                  >
                    <md-button
                      class="md-icon-button md-raised md-round md-danger mr-2"
                      style="margin: 0 2px;"
                      @click="deleteCategory(item.id)"
                    >
                      <md-icon>delete</md-icon>
                    </md-button>
                  </div>

                  <!-- <div
                    class="md-layout-item md-size-50"
                    style="padding-left: 0;"
                  >
                    <md-badge :md-content="12">
                      <md-button
                        class="md-raised"
                        style="width: 100%; padding: 3px;"
                        @click="goToItems(item.id)"
                      >

                       
                        <md-icon
                          style="margin-right: 2px; margin-top: 4px; font-size: 21px !important;"
                          >visibility</md-icon
                        >
                        items
                      </md-button>
                    </md-badge>
                  </div> -->
                </div>
              </md-table-cell>
              <md-table-cell md-label="View Items">
                <div class=" md-layout md-alignment-center">
                  <div class="md-layout-item md-size-65" style="padding: 0;">
                    <md-badge :md-content="item.items_count">
                      <md-button
                        class="md-raised"
                        style="width: 100%; padding: 0 15px 0 0 !important;"
                        @click="goToItems(item.id)"
                      >
                        <md-icon
                          style="margin-right: 2px; margin-top: 4px; font-size: 21px !important;"
                          >visibility</md-icon
                        >
                        items
                      </md-button>
                    </md-badge>
                  </div>
                </div>
              </md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>

        <md-card-actions md-alignment="space-between">
          <Pagination
            :pageCount="categories_page_meta.last_page"
            :perPage="categories_page_meta.per_page"
            :total="categories_page_meta.total"
            :value="categories_page_meta.current_page"
            @input="getAllPaginatedCategories"
            type="success"
          ></Pagination>
        </md-card-actions>
      </md-card>
    </div>

    <md-dialog
      :md-active.sync="showDialog_category"
      :md-click-outside-to-close="false"
    >
      <md-dialog-title
        class="dialog-title "
        style=" background-color:#4caf50 !important"
        ><div class="md-layout">
          <div class="md-layout-item md-size-10"></div>
          <div class="md-layout-item md-size-80">Add Category</div>
          <div
            class="md-layout-item md-size-10 md-layout md-alignment-center"
            style="padding-right: 0;"
          >
            <div
              class="material-icons"
              style="font-size: 25px; cursor: pointer;"
              @click="showDialog_category = false"
            >
              close
            </div>
          </div>
        </div></md-dialog-title
      >
      <div class="md-layout" style="overflow-y: scroll;">
        <!-- <div class="md-layout-item md-layout md-size-100 md-alignment-center">
          <label for="avatar" class="user-avatar">
            Upload Image
            <input
              type="file"
              accept=".png,.jpeg,.jpg"
              name="browse"
              id="avatar"
              style="display: none;"
              @change="onUploadCategoryImage($event)"
            />
          </label>
          <img
            v-if="tmpCategoryImage"
            style="position: relative !important; height: 110px; width:110px; object-fit: cover; border-radius: 50%; margin-left: 1em;"
            :src="tmpCategoryImage"
          />
          <validation-error
            :errors="apiValidationErrors.image_url"
            style="color: red; "
          />
        </div> -->
        <div class="image-uploaders">
          <div class="image-uploaders-wrapper">
            <!-- <img :src="imgUrl('no-image.jpg')" alt="" /> -->
            <img
              :src="
                tmpCategoryImage ? tmpCategoryImage : imgUrl('no-image.jpg')
              "
              alt=""
            />
            <label for="avatar" class="user-avatar">
              Upload Image
              <input
                type="file"
                name="browse"
                id="avatar"
                accept=".png,.jpeg,.jpg"
                style="display: none;"
                @change="onUploadCategoryImage"
              />
              <md-icon class="img-icon">add</md-icon>
            </label>
          </div>
          <label for="" @click="removeTmpImage">
            <md-icon v-if="this.tmpCategoryImage" class="img-icon-delete"
              >delete</md-icon
            >
          </label>
        </div>
        <validation-error
          :errors="apiValidationErrors.image_url"
          style="color: red; "
        />
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Name</label>
            <md-input v-model="category_name"></md-input>
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
            <md-textarea v-model="category_description"></md-textarea>
            <md-icon>description</md-icon>
            <validation-error
              :errors="apiValidationErrors.description"
              style="color: red"
            />
          </md-field>
        </div>
        <div
          class="md-layout-item md-size-100 md-layout md-alignment-center"
          style="margin-top: 5px;"
        >
          <md-switch v-model="category_is_available">Is available</md-switch>
        </div>
      </div>
      <md-dialog-actions>
        <md-button
          class="md-dense md-success"
          @click="addCategory()"
          style="margin-right: 0;"
        >
          Add
        </md-button>
        <md-button
          @click="showDialog_category = false"
          class="md-dense md-raised "
          style="background-color: white !important; color: gray !important;"
        >
          Cancel
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Edit Dialog For Category -->
    <EditCategoryDialoge
      :categoryId="editCategoryId"
      :showEditDialog="showEditDialog"
      v-if="showEditDialog"
      @closeShowDialog="showEditDialog = false"
      @updateCategoryList="
        getAllPaginatedCategories(categories_page_meta.current_page)
      "
    ></EditCategoryDialoge>
    <!-- Edit Dialog For Category -->
    <!-- Category dialog ends -->
    <!-- " -->
    <LoaderFull v-if="isLoading"></LoaderFull>
    <AlertDialoge ref="showAlertDialog"></AlertDialoge>
  </div>
</template>
<script>
import { TableSearch } from "./TableAdmin.vue";
// import { Badge } from "@/components";
import { ValidationError } from "@/components";
import formMixin from "@/mixins/form-mixin";
import { LoaderFull } from "@/components";
import { Pagination } from "@/components";
import { AlertDialoge } from "@/components";
import EditCategoryDialoge from "./EditCategoryDialoge.vue";

var images = require.context("../../../assets/images", false, /\.jpg$/);

const toLower = (text) => {
  return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
  // if (term) {
  //   return items.filter((item) => toLower(item.name).includes(toLower(term)));
  // }
  // return items;
  // console.log(term);
};
export default {
  data() {
    return {
      // Category form Binding
      image_url: "",
      category_name: "",
      category_description: "",
      category_is_available: true,
      categoryImage: null,
      selected: [],
      showDialog_category: false,
      search: null,
      searched: [],
      categories: [],
      categories_page_meta: {
        current_page: 1,
      },
      tmpCategoryImage: null,
      editCategoryId: 1,
      showEditDialog: false,
      isLoading: false,
      timer: null,
      user: {},
    };
  },

  components: {
    ValidationError,
    LoaderFull,
    Pagination,
    EditCategoryDialoge,
    AlertDialoge,
    // Badge
  },

  mixins: [formMixin],
  watch: {
    showDialog_category(newv) {
      if (!newv) {
        this.closeCategoryDialog();
      }
    },
  },

  async mounted() {
    await this.$store.dispatch("myUser");
    this.user = await this.$store.getters.myUser;
  },
  methods: {
    imgUrl: function(path) {
      return images("./" + path);
    },

    goToItems(categoryId) {
      this.$router.push({
        name: "Items",
        params: { id: categoryId },
      });
    },

    onUploadCategoryImage(e) {
      this.categoryImage = e.target.files[0];
      if (this.categoryImage != undefined) {
        var fileReader = new FileReader();

        fileReader.onload = () => {
          this.tmpCategoryImage = fileReader.result;
        };
        fileReader.readAsDataURL(e.target.files[0]);
      }
    },

    // onUploadCategoryImage(e) {
    //   //set the backend image
    //   this.categoryImage = e.target.files[0];
    //   //set the tmpImg to show the image in the form
    //   var fileReader = new FileReader();
    //   fileReader.onload = () => {
    //     this.tmpCategoryImage = fileReader.result;
    //   };
    //   fileReader.readAsDataURL(e.target.files[0]);
    //   console.log(e.target.files[0]);

    // },

    removeTmpImage() {
      this.tmpCategoryImage = "";
      this.categoryImage = null;
    },

    getClass: ({ id }) => ({
      "table-success": id === 1,
      "table-info": id === 3,
      "table-danger": id === 5,
      "table-warning": id === 7,
    }),

    closeCategoryDialog(aVar) {
      this.showDialog_category = false;
      this.resetApiValidation();
      this.resetInputs();
    },

    resetInputs() {
      this.categoryImage = null;
      this.category_description = null;
      this.category_name = "";
      this.tmpCategoryImage = null;
      // this.image_url = "";
    },

    async addCategory() {
      var formData = new FormData();
      formData.append("is_available", this.category_is_available ? 1 : 0);
      formData.append("image_url", this.categoryImage);
      formData.append("name_translation[en]", this.category_name);
      formData.append(
        "description_translation[en]",
        this.category_description || "-"
      );

      // for (let x of formData.entries()) {
      //   console.log(x);
      // }
      // return;
      try {
        this.isLoading = true;
        await this.$store.dispatch("storeCategory", formData);
        this.isLoading = false;
        this.closeCategoryDialog(this.showDialog_category);
        await this.$store.dispatch("alerts/success", "Done!");

        await this.getAllPaginatedCategories(1);
      } catch (e) {
        this.isLoading = false;
        await this.$store.dispatch("alerts/error", "Error,Try Again");
        this.setApiValidation(e.data.errors);
      }
    },

    async searchOnTable() {
      clearTimeout(this.timer);

      try {
        this.timer = setTimeout(() => {
          this.isLoading = true;
          this.getAllPaginatedCategories(1, this.search);
          this.isLoading = false;
        }, 500);
      } catch (error) {}
    },

    async getAllPaginatedCategories(page, search = "") {
      await this.$store.dispatch("getAllCategories", { page, search });
      this.categories = this.$store.getters["getAllCategories"].data;
      this.categories_page_meta = this.$store.getters["getAllCategories"].meta;
      this.searched = this.categories;
    },

    async deleteCategory(categoryId) {
      const alert = await this.$refs.showAlertDialog.response(
        "Are you sure want to delete? Note that all items belong to this category will be deleted too!!"
      );

      if (alert) {
        await this.$store.dispatch("deleteCategory", categoryId);
        var goToPage = this.categories_page_meta.current_page;
        if (
          this.categories.length == 1 &&
          this.categories_page_meta.current_page != 1
        ) {
          goToPage = this.categories_page_meta.current_page - 1;
        }

        await this.getAllPaginatedCategories(goToPage);
      }
    },

    editCategpory(categoryId) {
      this.showEditDialog = true;
      this.editCategoryId = categoryId;
    },
  },

  created() {
    this.getAllPaginatedCategories(1, this.rowsPerPage);
  },
  // categoryImageHandler(e) {
  //   this.category.image_url = e.target.files[0];

  //   var fileReader = new FileReader();
  //   fileReader.onload = () => {
  //     this.category.image_url = fileReader.result;
  //   };
  //   fileReader.readAsDataURL(e.target.files[0]);
  // },
};
</script>
<style lang="scss">
.table-transparent {
  background-color: transparent !important;
}

.mt-0 {
  margin-top: 0 !important;
}

.add-item-form-header {
  margin: 0 0 5px 0;
  width: 100%;
  text-align: left;
  font-size: 20px;
  background-color: #588ac3 !important;
  padding: 8px 10px;
  text-align: center;
}

.md-active-button:hover {
  background-color: #91a865 !important;
}

.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
}

.mdb:hover {
  background-color: #5aaf45 !important;
}

.md-table-head-label {
  padding-left: 20px !important;
}

.md-table-head.md-sortable:first-of-type .md-table-sortable-icon,
.md-table-head.md-table-cell-selection + .md-sortable .md-table-sortable-icon {
  right: 0 !important;
  left: 0 !important;
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

.pl-20 {
  padding-left: 20px;
}

.dialog-content {
  overflow-y: auto;
  overflow-x: hidden;
}

.dialog-content::-webkit-scrollbar {
  width: 10px;
  background-color: transparent;
}

.dialog-content::-webkit-scrollbar-thumb {
  background-color: #30303099;
  border-radius: 60px;
}

.dialog-title {
  background-color: #4caf50;
  color: white;
  padding: 12px 8px 12px !important;
  text-align: center;
}

.md-badge-content {
  display: inline !important;
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
      background-color: rgba(52, 216, 30, 0.6);
      color: white !important;
      transition: all 0.6s;

      &:hover {
        height: 40%;
        background-color: rgba(52, 216, 30, 0.9);
      }
    }
  }

  .img-icon-delete {
    position: absolute;
    top: 10px;
    right: 5px;
    cursor: pointer;
    width: 100%;
    color: red !important;
    font-size: 2em !important;
    z-index: 333;
    pointer-events: all !important;
  }
}

.md-table-row {
  position: relative !important;

  .Actions {
    position: sticky !important;
    top: 0 !important;
  }
}
</style>
