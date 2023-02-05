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
                `No categories found . Try a different search term or create a new category.`
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
                <div class="md-layout md-alignment-center">
                  <div
                    class="md-layout-item md-size-50"
                    style="padding-right: 2px;"
                    v-if="user.role == 'admin' || user.id == item.managed_by"
                  >
                    <md-button
                      class="md-icon-button md-raised md-round md-info"
                      @click="editCategpory(item.id)"
                      style="margin-right: 1px"
                    >
                      <md-icon>edit</md-icon>
                    </md-button>
                    <md-button
                      class="md-icon-button md-raised md-round md-danger mr-2"
                      style="margin: 0 2px;"
                      @click="deleteCategory(item.id)"
                    >
                      <md-icon>delete</md-icon>
                    </md-button>
                  </div>
                  <div
                    class="md-layout-item md-size-50"
                    style="padding-left: 0;"
                  >
                    <md-button
                      class="md-raised"
                      style="width: 100%; padding: 3px;"
                      @click="goToItems(item.id)"
                    >
                      <!-- <md-badge class="md-primary md-square" md-content="{}" /> -->

                      <span
                        class="material-icons"
                        style="margin-right: 4px;
                        font-size: 21px;
                        margin-bottom: 2px;"
                        >visibility</span
                      >
                      items
                    </md-button>
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
      <div class="md-layout">
        <div class="md-layout-item md-layout md-size-100 md-alignment-center">
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
        </div>
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
    <!-- <md-button @click="confirmDelete()">
      click me
    </md-button> -->
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

    <DialogAlert
      :showDeleteDialog="showDeleteDialog"
      v-if="showDeleteDialog"
      @closeShowDialog="showDeleteDialog = false"
      @confirmDelete="deleteCategory(item.id)"
    >
    </DialogAlert>

    <LoaderFull v-if="isLoading"></LoaderFull>
  </div>
</template>
<script>
import { TableSearch } from "./TableAdmin.vue";
// import { Badge } from "@/components";
import { ValidationError } from "@/components";
import formMixin from "@/mixins/form-mixin";
import { LoaderFull } from "@/components";
import { Pagination } from "@/components";
import EditCategoryDialoge from "./EditCategoryDialoge.vue";
import DialogAlert from "./DialogAlert.vue";
import { resolve } from "path";

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
      category_name: "",
      category_description: "",
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
      showDeleteDialog: false,
      isLoading: false,
      timer: null,
      user: {},
      image_url: "",
    };
  },

  components: {
    ValidationError,
    LoaderFull,
    Pagination,
    EditCategoryDialoge,
    DialogAlert,
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
    goToItems(categoryId) {
      this.$router.push({
        name: "Items",
        params: { id: categoryId },
      });
    },
    onUploadCategoryImage(e) {
      this.categoryImage = e.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.tmpCategoryImage = reader.result;
      };
      reader.readAsDataURL(e.target.files[0]);
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
      this.category_name = null;
      this.tmpCategoryImage = null;
    },

    async addCategory() {
      var formData = new FormData();
      formData.append("is_available", 1);
      formData.append("image_url", this.categoryImage);
      formData.append("name_translation[en]", this.category_name);
      formData.append(
        "description_translation[en]",
        this.category_description || "-"
      );

      try {
        this.isLoading = true;
        await this.$store.dispatch("storeCategory", formData);
        this.isLoading = false;
        this.closeCategoryDialog(this.showDialog_category);
        await this.$store.dispatch("alerts/success", "Done!");

        await this.getAllPaginatedCategories(1);
      } catch (e) {
        this.isLoading = false;
        await this.$store.dispatch("alerts/error", "Error,Try again");
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

    // async deleteCategory(categoryId) {
    //   if (
    //     confirm(
    //       "Are you sure want to delete?\n\nNote that all items belong to this category will be deleted too!!"
    //     )
    //   ) {
    //     await this.$store.dispatch("deleteCategory", categoryId);
    //     var goToPage = this.categories_page_meta.current_page;
    //     if (
    //       this.categories.length == 1 &&
    //       this.categories_page_meta.current_page != 1
    //     ) {
    //       goToPage = this.categories_page_meta.current_page - 1;
    //     }

    //     await this.getAllPaginatedCategories(goToPage);
    //   }
    // },

    async deleteCategory(categoryId) {
      if (await this.$confirm("Are You Sure You Want To Delete","DELETE",'question')) {
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
    showConfirmDeleteDialog() {
      this.showDeleteDialog = true;
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
<style>
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
</style>
<!-- dialog Category Start -->

<!-- <md-dialog
      :md-active.sync="showDialog_category"
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
              ADD CATEGORY
            </div>
          </div>
        </div>
        <div>
          <div class="md-layout text-center " style="color: white; ">
            <div class="md-layout-item">
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
          </div>
        </div>
        <div>
          <div class="md-layout text-center " style="color: white; ">
            <div class="md-layout-item">
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
          </div>
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
              v-if="tmpCategoryImage"
              style="position: relative !important; height: 110px; object-fit: cover;"
              :src="tmpCategoryImage"
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
                @click="addCategory()"
                >ADD</md-button
              >
            </div>
            <div class="md-layout-item md-size-45" style="text-align: left;">
              <md-button
                @click="showDialog_category = false"
                class="md-dense md-raised"
                style="background-color: white !important; color: gray !important; "
                >Cancel</md-button
              >
            </div>
          </div>
        </div>
      </div>
    </md-dialog> -->
