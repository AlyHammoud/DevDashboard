<template>
  <div style="display: flex; flex-direction: column;">
    <div style="display: flex; align-self: center;">
      <p
        style="text-align: center; cursor: pointer; padding: 10px 5px;"
        @click="$router.push({ name: 'Categories' })"
      >
        Back to categories
      </p>

      <p
        style="text-align: center; cursor: pointer; padding: 10px 5px;"
        @click="$router.push({ name: 'Items', params: { id: category.id } })"
      >
        / Back to <span style="color: red;">{{ category.name }}</span> Items
      </p>
    </div>
    <md-card
      class="md-primary"
      style="max-width: 60%; margin-inline: auto; margin-top: -12px"
    >
      <md-card-header>
        <md-card-header-text>
          <div class="md-title" style="font-size: 1.3em;">
            Category Name:
            <span style="font-size: 0.8em;">{{ category.name }}</span>
          </div>
          <div class="md-subhead">Description: {{ category.description }}</div>
        </md-card-header-text>
        <md-card-header-text>
          <div class="md-title" style="font-size: 1.3em;">
            Item Name: <span style="font-size: 0.8em;">{{ item.name }}</span>
          </div>
          <div class="md-subhead">Description: {{ item.description }}</div>
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
    <div
      style="align-self: center;"
      v-if="user.role == 'admin' || user.id == category.managed_by"
    >
      <md-button
        @click="showAddProductHandler(item.id)"
        class="md-raised md-primary"
        style="background-color: #5aaf45 !important;"
        >Add Product</md-button
      >
    </div>

    <!-- Product list Table -->
    <div class="md-layout-item md-size-100">
      <md-table v-model="searched" md-sort="name" md-sort-order="asc">
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title">Products</h1>
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
          md-label="No Product found"
          :md-description="
            `No Product found for this '${search}' query. Try a different search term or create a new Product.`
          "
        >
          <md-button
            class="md-primary md-raised"
            @click="() => ''"
            v-if="user.role == 'admin' || user.id == category.managed_by"
            >Add new Product</md-button
          >
        </md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{
            item.id
          }}</md-table-cell>
          <md-table-cell md-label="Name" md-sort-by="name"
            ><p style="margin-left: 15px;">{{ item.name }}</p></md-table-cell
          >
          <md-table-cell md-label="Qty" md-sort-by="quantity"
            ><p style="margin-left: 15px;">
              {{ item.quantity }}
            </p></md-table-cell
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
          <md-table-cell md-label="Price/sale" md-sort-by="price"
            ><p style="margin-left: 15px;">
              {{ item.price ? item.price : 0 }}$ / {{ item.sale }}% /
              <span style="color: red;">{{ item.final_price }}$</span>
            </p>
          </md-table-cell>
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
          <md-table-cell md-label="Colors">
            <p v-if="!item.color ? true : false">No Colors</p>
            <div
              v-else
              style="display: flex; gap: 2px; margin-left: 20px; flex-wrap: wrap;"
            >
              <div
                v-for="color in item.color"
                :key="color"
                :style="{ 'background-color': color }"
                style="width: 20px; height: 20px;"
              ></div>
            </div>
          </md-table-cell>
          <md-table-cell md-label="Sizes">
            <p v-if="!item.size ? true : false">No Sizes</p>
            <div
              v-else
              style="display: flex; gap: 2px; margin-left: 20px; flex-wrap: wrap;"
            >
              <div
                v-for="size in item.size"
                :key="size"
                style="border: 1px solid black;padding: 2px;"
              >
                {{ size }}
              </div>
            </div>
          </md-table-cell>

          <md-table-cell
            md-label="Product Actions"
            v-if="user.role == 'admin' || user.id == item.managed_by"
          >
            <div style="margin-left: 15px;">
              <md-button
                class="md-icon-button md-raised md-round md-info"
                @click="editProduct(item.id)"
                style="margin: 0.2rem"
              >
                <md-icon>edit</md-icon>
              </md-button>
              <md-button
                class="md-icon-button md-raised md-round md-danger mr-2"
                @click="deleteProduct(item.id)"
                style="margin-right: 38px;"
              >
                <md-icon>delete</md-icon>
              </md-button>
            </div>
          </md-table-cell>
          <md-table-cell md-label="Created at" md-sort-by="created_at"
            ><p style="margin-left: 15px;">
              {{ item.created_at }}
            </p></md-table-cell
          >
        </md-table-row>
      </md-table>

      <Pagination
        style="margin-left:  50%; translate: -25%;"
        :pageCount="productsMeta.last_page"
        :perPage="productsMeta.per_page"
        :total="productsMeta.total"
        :value="productsMeta.current_page"
        @input="getProducts"
        type="success"
      ></Pagination>
      <ShowImages
        v-if="showImagesDialog"
        @closeShowDialog="showImagesDialog = false"
        :images="viewImages"
      ></ShowImages>

      <AddProduct
        :showDialog="showAddProductDialog"
        :current_page="productsMeta.current_page"
        @closeShowDialog="showAddProductDialog = false"
        @updateProductList="getProducts"
        :itemId="itemIdInAdd"
        v-if="showAddProductDialog"
      ></AddProduct>

      <EditProductDialoge
        v-if="showEditProductDialog"
        :showEditDialog="showEditProductDialog"
        :productId="productIdInEdit"
        @closeShowDialog="showEditProductDialog = false"
        @updateProductList="getProducts(productsMeta.current_page)"
      >
      </EditProductDialoge>
    </div>
    <LoaderFull v-if="isLoading"></LoaderFull>
  </div>
</template>

<script>
import ShowImages from "./ShowImages";
import AddProduct from "./ProductsManagement/AddProduct";
import EditProductDialoge from "./ProductsManagement/EditProductDialoge";
import { Pagination } from "@/components";
import { LoaderFull } from "@/components";

export default {
  name: "products",
  components: {
    ShowImages,
    AddProduct,
    Pagination,
    LoaderFull,
    EditProductDialoge,
  },
  data() {
    return {
      category: {},
      item: {},
      products: [],
      searched: [],
      search: null,
      viewImages: [],
      showImagesDialog: false,
      showAddProductDialog: false,
      itemIdInAdd: null,
      productsMeta: {},
      isLoading: false,
      showEditProductDialog: false,
      productIdInEdit: null,
      timer: null,
      user: {},
    };
  },

  created() {
    this.getCategory();
    this.getItem();
    this.getProducts(1);
  },

  async mounted() {
    await this.$store.dispatch("myUser");
    this.user = await this.$store.getters.myUser;
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

    async getItem() {
      try {
        await this.$store.dispatch("getSingleItem", this.$route.params.item_id);
        this.item = this.$store.getters.getSingleItem;
      } catch (error) {
        this.$router.push({ name: "Categories" });
      }
    },

    async getProducts(page = 1, search = "") {
      try {
        await this.$store.dispatch("getAllIProductsByItem", {
          page: page,
          itemId: this.$route.params.item_id,
          search: search,
        });

        this.products = this.$store.getters.getAllProducts.data;
        this.productsMeta = this.$store.getters["getAllProducts"].meta;

        this.searched = this.products;
      } catch (error) {}
    },

    viewImagesHandler(productImages) {
      this.viewImages = productImages;
      this.showImagesDialog = true;
    },

    showAddProductHandler(itemId) {
      this.showAddProductDialog = true;
      this.itemIdInAdd = itemId;
    },

    editProduct(id) {
      this.showEditProductDialog = true;
      this.productIdInEdit = id;
    },

    async deleteProduct(id) {
      try {
        if (
          confirm(
            "are you sure want to delete this item? \n All products related to this item will be deleted too!"
          )
        ) {
          this.isLoading = true;
          await this.$store.dispatch("deleteProduct", id);

          var goToPage = this.productsMeta.current_page;
          if (
            this.products.length == 1 &&
            this.productsMeta.current_page != 1
          ) {
            goToPage--;
          }

          this.getProducts(goToPage);
          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
        await this.$store.dispatch(
          "alerts/error",
          "error deleting this product! try again"
        );
      }
    },

    async searchOnTable() {
      clearTimeout(this.timer);

      try {
        this.timer = setTimeout(() => {
          this.isLoading = true;
          this.getProducts(1, this.search);
          this.isLoading = false;
        }, 500);
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss" scoped></style>
