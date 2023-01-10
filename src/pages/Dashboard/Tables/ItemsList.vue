<template>
  <div style="display: flex; flex-direction: column;">
    <p
      style="text-align: center; cursor: pointer; padding: 10px 5px;"
      @click="$router.push({ name: 'Categories' })"
    >
      Back to categories
    </p>
    <md-card
      class="md-primary"
      style="max-width: 60%; margin-inline: auto; margin-top: -12px"
    >
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Category Name: {{ category.name }}</div>
          <div class="md-subhead">Description: {{ category.description }}</div>
        </md-card-header-text>

        <md-card-media style="margin-top: 20px; ">
          <img
            :src="category.image_url"
            style="height: 80px; object-fit: cover;"
            alt="Avatar"
          />
        </md-card-media>
      </md-card-header>
    </md-card>
    <div style="align-self: center;">
      <md-button
        v-if="user.role == 'admin' || user.id == category.managed_by"
        @click="showAddItemHandler(category.id)"
        class="md-raised md-primary"
        style="background-color: #5aaf45 !important;"
        >Add Item</md-button
      >
    </div>

    <!-- Items list Table -->
    <div class="md-layout-item md-size-100">
      <md-table v-model="searched" md-sort="name" md-sort-order="asc">
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
          md-label="No users found"
          :md-description="
            `No item found for this '${search}' query. Try a different search term or create a new Item.`
          "
        >
          <md-button
            class="md-primary md-raised"
            @click="() => ''"
            v-if="user.role == 'admin' || user.id == category.managed_by"
            >Add new Item</md-button
          >
        </md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{
            item.id
          }}</md-table-cell>
          <md-table-cell md-label="Name" md-sort-by="name"
            ><p style="margin-left: 15px;">{{ item.name }}</p></md-table-cell
          >
          <md-table-cell md-label="Description" md-sort-by="description"
            ><p style="margin-left: 15px;">
              {{ item.description }}
            </p></md-table-cell
          >
          <md-table-cell md-label="Available"
            ><p style="margin-left: 15px;">
              {{ item.is_available == 1 ? "Yes" : "No" }}
            </p></md-table-cell
          >
          <md-table-cell md-label="Created at" md-sort-by="created_at"
            ><p style="margin-left: 15px;">
              {{ item.created_at }}
            </p></md-table-cell
          >
          <md-table-cell md-label="Price" md-sort-by="price"
            ><p style="margin-left: 15px;">
              {{ item.price ? item.price : 0 }}$
            </p></md-table-cell
          >
          <md-table-cell md-label="Images">
            <p v-if="!item.images.length">No Images</p>
            <md-button
              v-else
              class="md-primary"
              @click="viewImagesHandler(item.images)"
              style="width: auto; padding: 0 !important"
              >View ({{ item.images.length }})</md-button
            ></md-table-cell
          >

          <md-table-cell md-label="Item Actions">
            <div style="margin-left: 15px;">
              <md-button
                v-if="user.role == 'admin' || user.id == item.managed_by"
                class="md-icon-button md-raised md-round md-info"
                @click="editItem(item.id)"
                style="margin: 0.2rem"
              >
                <md-icon>edit</md-icon>
              </md-button>
              <md-button
                v-if="user.role == 'admin' || user.id == item.managed_by"
                class="md-icon-button md-raised md-round md-danger mr-2"
                @click="deleteItem(item.id)"
                style="margin-right: 38px;"
              >
                <md-icon>delete</md-icon> </md-button
              ><br />
              <button
                class="md-raised"
                style="cursor: pointer; border: none; box-shadow: 0 2px 20px #30303090;padding:5px 15px; border-radius: 10px;"
                @click="goToProducts(item.id)"
              >
                Products({{ item.products_count }})
              </button>
            </div>
          </md-table-cell>
        </md-table-row>
      </md-table>

      <Pagination
        style="margin-left:  50%; translate: -25%;"
        :pageCount="itemsMeta.last_page"
        :perPage="itemsMeta.per_page"
        :total="itemsMeta.total"
        :value="itemsMeta.current_page"
        @input="getItems"
        type="success"
      ></Pagination>
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
    <LoaderFull v-if="isLoading"></LoaderFull>
  </div>
</template>

<script>
import ShowImages from "./ShowImages";
import AddItem from "./ItemsManagement/AddItem";
import EditItemDialoge from "./ItemsManagement/EditItemDialoge";
import { Pagination } from "@/components";
import { LoaderFull } from "@/components";

export default {
  name: "items",
  components: { ShowImages, AddItem, Pagination, LoaderFull, EditItemDialoge },
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
        await this.$store.dispatch("getAllItemsByCategory", {
          page: page,
          categoryId: this.$route.params.id,
          search: search,
        });

        this.items = this.$store.getters.getAllItems.data;
        this.itemsMeta = this.$store.getters["getAllItems"].meta;

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
        if (
          confirm(
            "are you sure want to delete this item? \n All products related to this item will be deleted too!"
          )
        ) {
          this.isLoading = true;
          await this.$store.dispatch("deleteItem", id);

          var goToPage = this.itemsMeta.current_page;
          if (this.items.length == 1 && this.itemsMeta.current_page != 1) {
            goToPage--;
          }

          this.getItems(goToPage);
          this.isLoading = false;
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
          this.isLoading = true;
          this.getItems(1, this.search);
          this.isLoading = false;
        }, 500);
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss" scoped></style>
