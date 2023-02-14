<template>
  <div style="display: flex; flex-direction: column;">
    <p
      style="text-align: center; cursor: pointer; padding: 10px 5px; font-size: 1.5em;"
      @click="$router.push({ name: 'Categories' })"
    >
      Back to <span style="color:#5aaf45; font-weight: 400;">Categories</span>
    </p>
    <!-- <md-card
      class="md-primary"
      style="max-width: 60%; margin-inline: auto; margin-top: -12px;background-color: #00AEC5 !important;"
    >
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">{{ category.name }}</div>
          <div class="md-subhead">{{ category.description }}</div>
        </md-card-header-text>

        <md-card-media style="margin-top: 20px; ">
          <img
            :src="category.image_url"
            style="height: 80px; width: 80px; border-radius: 50%; object-fit: cover;"
            alt="Avatar"
          />
        </md-card-media>
      </md-card-header>
    </md-card> -->
    <div class="md-layout parent">
      <div class="md-layout-item md-size-50">
        <div class="md-title">{{ category.name }}</div>
        <div class="md-subhead" style="font-size: 0.9rem; padding: 1px 2px ;">
          {{ category.description }}
        </div>
      </div>
      <div
        class="md-layout-item md-size-50 md-layout md-alignment-center-right"
        style="text-align: right ;"
      >
        <img
          :src="category.image_url"
          style="height: 80px; width: 80px; border-radius: 50%; object-fit: cover; margin: 5px 0;"
          alt="Avatar"
        />
      </div>
    </div>

    <!-- Items list Table -->
    <md-card :style="{ opacity: isLoading ? 0.6 : 1 }">
      <md-card-header class="md-card-header-icon md-card-header-green">
        <div class="card-icon">
          <md-icon>assignment</md-icon>
        </div>
        <h4 class="title">Items</h4>
      </md-card-header>
      <md-card-content>
        <div class="text-right">
          <md-button
            v-if="user.role == 'admin' || user.id == category.managed_by"
            @click="showAddItemHandler(category.id)"
            class="md-dense md-success"
            >Add Item</md-button
          >
        </div>
        <md-table
          v-model="searched"
          md-sort="name"
          md-sort-order="asc"
          class="paginated-table table-striped table-hover"
        >
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h1 class="md-title">Items</h1>
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
            v-if="!isLoading"
            md-label="No Items found"
            :md-description="
              `No items Found. Try a different search term or create a new Item`
            "
          >
            <md-button
              class="md-success md-raised"
              @click="showAddItemHandler(category.id)"
              v-if="user.role == 'admin' || user.id == category.managed_by"
              >Add new Item</md-button
            >
          </md-table-empty-state>
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="ID" md-sort-by="id"
              ><p class="pl-20">{{ item.id }}</p></md-table-cell
            >
            <md-table-cell md-label="Name" md-sort-by="name"
              ><p class="pl-20">{{ item.name }}</p></md-table-cell
            >
            <md-table-cell md-label="Description" md-sort-by="description">
              <p
                class="pl-20"
                v-if="item.description.length > 50"
                title="open edit dialog to see full description"
              >
                {{ item.description.substring(0, 50) + "..." }}
              </p>
              <p class="pl-20" v-else>
                {{ item.description }}
              </p></md-table-cell
            >
            <md-table-cell md-label="Available"
              ><p class="pl-20">
                {{ item.is_available == 1 ? "Yes" : "No" }}
              </p></md-table-cell
            >
            <md-table-cell md-label="Created at" md-sort-by="created_at"
              ><p class="pl-20">
                {{ item.created_at }}
              </p></md-table-cell
            >
            <md-table-cell md-label="Price" md-sort-by="price"
              ><p class="pl-20">
                {{ item.price ? item.price : 0 }}$
              </p></md-table-cell
            >
            <md-table-cell md-label="Images">
              <p v-if="!item.images.length" class="pl-20">No Images</p>
              <md-button
                v-else
                class="md-blue"
                @click="viewImagesHandler(item.images)"
                style="width: auto; padding: 0 !important;"
                >View ({{ item.images.length }})</md-button
              ></md-table-cell
            >

            <md-table-cell
              md-label="Item Actions"
              v-if="user.role == 'admin' || user.id == item.managed_by"
            >
              <div class="md-layout md-alignment-center">
                <div
                  class="md-layout-item md-size-60"
                  style="padding-right: 2px; padding-left: 0;"
                >
                  <div class="md-layout">
                    <div
                      class="md-layout-item md-size-50"
                      style="padding-right: 1px; padding-left: 5px;"
                    >
                      <md-button
                        class="md-icon-button md-raised md-round md-info"
                        @click="editItem(item.id)"
                        style="margin:0 3px"
                      >
                        <md-icon>edit</md-icon>
                      </md-button>
                    </div>
                    <div
                      class="md-layout-item md-size-50"
                      style="padding-left: 1px;"
                    >
                      <md-button
                        class="md-icon-button md-raised md-round md-danger mr-2"
                        style="margin: 0 3px;"
                        @click="deleteItem(item.id)"
                      >
                        <md-icon>delete</md-icon>
                      </md-button>
                    </div>
                  </div>
                </div>
              </div>
            </md-table-cell>
            <md-table-cell md-label="View Products">
              <div class="md-layout md-alignment-center">
                <div class="md-layout-item md-size-75" style="padding: 0;">
                  <md-badge :md-content="item.products_count">
                    <md-button
                      class="md-raised"
                      style="width: 100%; padding: 0 5px 0 0 !important;"
                      @click="goToProducts(item.id)"
                    >
                      <!-- <span
                      class="material-icons"
                      style="margin-right: 4px;
                      font-size: 21px;
                      margin-bottom: 2px;"
                      >visibility</span
                    > -->
                      <md-icon
                        style="margin-right: 2px; margin-top: 4px; font-size: 21px !important;"
                        >visibility</md-icon
                      >

                      products
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
          :pageCount="itemsMeta.last_page"
          :perPage="itemsMeta.per_page"
          :total="itemsMeta.total"
          :value="itemsMeta.current_page"
          @input="getItems"
          type="success"
        ></Pagination>
      </md-card-actions>
    </md-card>
    <!-- Items list Table -->
    <div class="md-layout-item md-size-100">
      <ShowImages
        v-if="showImagesDialog"
        @closeShowDialog="showImagesDialog = false"
        :images="viewImages"
      ></ShowImages>

      <AddItem
        :showDialog="showAddItemDialog"
        :current_page="itemsMeta.current_page"
        @closeShowDialog="showAddItemDialog = false"
        @updateItemList="getItems"
        :categoryId="categoryIdInAdd"
        v-if="showAddItemDialog"
      ></AddItem>

      <EditItemDialoge
        v-if="showEditItemDialog"
        :showEditDialog="showEditItemDialog"
        :itemId="itemIdInEdit"
        @closeShowDialog="showEditItemDialog = false"
        @updateItemList="getItems(itemsMeta.current_page)"
      >
      </EditItemDialoge>
    </div>
    <div
      class="my-spinner"
      style="margin-top: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; height: 100%; width: 100%; position: fixed !important; top:0; left:0; z-index: 1100000000;"
      v-if="isLoading"
    >
      <md-progress-spinner
        class="md-accent"
        :md-diameter="30"
        md-mode="indeterminate"
      ></md-progress-spinner>
    </div>
    <AlertDialoge ref="showAlertDialog"></AlertDialoge>
  </div>
</template>

<script>
import ShowImages from "./ShowImages";
import AddItem from "./ItemsManagement/AddItem";
import EditItemDialoge from "./ItemsManagement/EditItemDialoge";
import { Pagination } from "@/components";
import { AlertDialoge } from "@/components";

export default {
  name: "items",
  components: {
    ShowImages,
    AddItem,
    Pagination,
    EditItemDialoge,
    AlertDialoge,
  },
  data() {
    return {
      category: {},
      items: [],
      searched: [],
      search: null,
      viewImages: [],
      showImagesDialog: false,
      showAddItemDialog: false,
      categoryIdInAdd: null,
      itemsMeta: {},
      isLoading: false,
      showEditItemDialog: false,
      itemIdInEdit: null,
      timer: null,
      user: {},
    };
  },

  async mounted() {
    await this.$store.dispatch("myUser");
    this.user = await this.$store.getters.myUser;
  },

  created() {
    this.getCategory();
    this.getItems(1);
  },

  methods: {
    async getCategory() {
      try {
        await this.$store.dispatch("getSingleCategory", this.$route.params.id);
        this.category = this.$store.getters.getSingleCategory;
      } catch (error) {
        this.$router.push({ name: "Categories" });
      }
    },

    async getItems(page = 1, search = "") {
      try {
        this.isLoading = true;
        await this.$store.dispatch("getAllItemsByCategory", {
          page: page,
          categoryId: this.$route.params.id,
          search: search,
        });

        this.items = this.$store.getters.getAllItems.data;
        this.itemsMeta = this.$store.getters["getAllItems"].meta;
        this.isLoading = false;
        // console.log(this.items)
        this.searched = this.items;
      } catch (error) {}
    },

    viewImagesHandler(itemsImages) {
      this.viewImages = itemsImages;
      this.showImagesDialog = true;
    },

    showAddItemHandler(categoryId) {
      this.showAddItemDialog = true;
      this.categoryIdInAdd = categoryId;
    },

    editItem(id) {
      this.showEditItemDialog = true;
      this.itemIdInEdit = id;
    },

    async deleteItem(id) {
      try {
        const alert = await this.$refs.showAlertDialog.response(
          "Delete Item",
          "Are you sure want to delete? Note that all products belong to this item will be deleted too!!"
        );
        if (alert) {
          this.isLoading = true;
          await this.$store.dispatch("deleteItem", id);

          var goToPage = this.itemsMeta.current_page;
          if (this.items.length == 1 && this.itemsMeta.current_page != 1) {
            goToPage--;
          }

          this.getItems(goToPage);
          // this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
        await this.$store.dispatch(
          "alerts/error",
          "error deleting this item! try again"
        );
      }
    },

    goToProducts(id) {
      this.$router.push({
        name: "Products",
        params: { id: this.category.id, item_id: id },
      });
    },

    searchOnTable() {
      clearTimeout(this.timer);

      try {
        this.timer = setTimeout(() => {
          this.getItems(1, this.search);
        }, 500);
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss" scoped>
.pl-20 {
  padding-left: 20px;
}

.parent {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  background-color: #00aec5;
  padding: 5px 0;
  border-radius: 10px;
}

.md-badge-content {
  display: inline;
}

.md-title {
  color: white !important;
  padding: 2px !important;
}

.md-subhead {
  font-size: 0.9rem;
  padding: 1px 2px;
  color: white;
}
</style>
