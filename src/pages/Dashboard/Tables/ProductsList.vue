<template>
  <div style="display: flex; flex-direction: column;">
    <div style="display: flex; align-self: center;">
      <p
        style="text-align: center; cursor: pointer; padding: 10px 5px;"
        @click="$router.push({ name: 'Categories' })"
      >
        Back to
        <span style="color: #5aaf45; font-weight: 400;">Categories</span>
      </p>

      <p
        style="text-align: center; cursor: pointer; padding: 10px 5px;"
        @click="$router.push({ name: 'Items', params: { id: category.id } })"
      >
        / Back to
        <span style="color: #5aaf45; font-weight: 400;">{{
          category.name
        }}</span>
        Items
      </p>
    </div>

    <!-- <md-card
      class="md-primary"
      style="max-width: 60%; margin-inline: auto; margin-top: -12px; background-color: #00AEC5 !important;"
    >
      <md-card-header>
        <md-card-header-text>
          <div class="md-title" style="font-size: 1.3em; font-weight: bold;">
            {{ category.name }}
          </div>
          <div class="" style="color: white ; font-weight: 300 ;">
            Description: {{ category.description }}
          </div>
        </md-card-header-text>
        <md-card-header-text>
          <div class="md-title" style="font-size: 1.3em; font-weight: bold;">
            {{ item.name }}
          </div>
          <div class="" style="color: white ; font-weight: 300 ;">
            Description: {{ item.description }}
          </div>
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
      <div class="md-layout-item md-size-33 md-xsmall-size-50">
        <div class="md-title" style="font-size: 1.3em; font-weight: bold;">
          {{ category.name }}
        </div>
        <div class="md-subhead" style="color: white; font-weight: 300;">
          {{ category.description }}
        </div>
      </div>
      <div class="md-layout-item md-size-33 " style="text-align: center;">
        <div class="md-title" style="font-size: 1.3em; font-weight: bold;">
          {{ item.name }}
        </div>
        <div class="md-subhead" style="color: white; font-weight: 300;">
          {{ item.description }}
          <!-- Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
          sequi, placeat qui blanditiis ut earum illo excepturi? Asperiores
          voluptates nostrum facere, doloremque fugit amet ipsa explicabo
          necessitatibus, dolorem illo eum! -->
        </div>
      </div>
      <div
        class="md-layout-item md-size-33 md-xsmall-hide md-xsmall-size-50 md-layout md-alignment-center-center"
        style="text-align: center;"
      >
        <img
          :src="this.category.image_url"
          style="height: 100px; width: 100px; border-radius: 50%; object-fit: cover;"
          alt="Avatar"
        />
      </div>
    </div>

    <!-- Product list Table -->

    <div class="md-layout" :style="{ opacity: isLoading ? 0.6 : 1 }">
      <div class="md-layout-item md-size-100">
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-green">
            <div class="card-icon">
              <md-icon>assignment</md-icon>
            </div>
            <h4 class="title">Products</h4>
          </md-card-header>
          <md-card-content>
            <div class="text-right ">
              <md-button
                v-if="user.role == 'admin' || user.id == category.managed_by"
                @click="showAddProductHandler(item.id)"
                class="md-raised md-success md-dense"
                >Add Product
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
                v-if="!isLoading"
                md-label="No Products Found"
                :md-description="
                  `No Product found. Try a different search term or create a new Product.`
                "
              >
                <md-button
                  class="md-success md-raised"
                  @click="showAddProductHandler(item.id)"
                  v-if="user.role == 'admin' || user.id == category.managed_by"
                  >Add new Product</md-button
                >
              </md-table-empty-state>
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id"
                  ><p class="pl-20">
                    {{ item.id }}
                  </p></md-table-cell
                >
                <md-table-cell md-label="Name" md-sort-by="name"
                  ><p class="pl-20">
                    {{ item.name }}
                  </p></md-table-cell
                >
                <md-table-cell md-label="Qty" md-sort-by="quantity"
                  ><p class="pl-20">
                    {{ item.quantity }}
                  </p></md-table-cell
                >
                <md-table-cell
                  md-label="Description"
                  md-sort-by="description"
                  style="max-width: auto !important;"
                  ><p
                    class="pl-20"
                    style="min-width: auto !important; max-width: 200px; width:auto !important;"
                  >
                    {{
                      item.description && item.description.length > 150
                        ? item.description.substring(149, 0) + "..."
                        : item.description
                    }}
                  </p></md-table-cell
                >
                <md-table-cell md-label="Available"
                  ><p class="pl-20">
                    {{ item.is_available == 1 ? "Yes" : "No" }}
                  </p></md-table-cell
                >
                <md-table-cell md-label="Price/sale" md-sort-by="price"
                  ><p class="pl-20">
                    {{ item.price ? item.price : 0 }}$ / {{ item.sale }}% /
                    <span style="color: red;">{{ item.final_price }}$</span>
                  </p>
                </md-table-cell>
                <md-table-cell md-label="Images">
                  <p v-if="!item.images.length" class="pl-20">No Images</p>
                  <md-button
                    v-else
                    class="md-blue"
                    @click="viewImagesHandler(item.images)"
                    style="width: auto; padding: 0 !important; "
                    >View ({{ item.images.length }})</md-button
                  ></md-table-cell
                >
                <md-table-cell md-label="Colors">
                  <p v-if="!item.color ? true : false" class="pl-20">
                    No Colors
                  </p>
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
                  <p v-if="!item.size ? true : false" class="pl-20">No Sizes</p>
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
                  <div class="md-layout md-alignment-center">
                    <div
                      class="md-layout-item md-size-33"
                      style="padding-right: 0px !important;"
                    >
                      <md-button
                        class="md-icon-button md-raised md-round md-info"
                        @click="editProduct(item.id)"
                      >
                        <md-icon>edit</md-icon>
                      </md-button>
                    </div>
                    <div
                      class="md-layout-item md-size-33"
                      style="padding-left: 0px !important;"
                    >
                      <md-button
                        class="md-icon-button md-raised md-round md-danger mr-2"
                        @click="deleteProduct(item.id)"
                      >
                        <md-icon>delete</md-icon>
                      </md-button>
                    </div>
                  </div>
                </md-table-cell>
                <!-- <md-table-cell md-label="Created at" md-sort-by="created_at"
                  ><p style="margin-right: 8px !important;">
                    {{ item.created_at }}
                  </p></md-table-cell
                > -->
                <md-table-cell md-label="Created At" md-sort-by="created_at">
                  <div class="md-layout md-align-center">
                    <div
                      class="md-layout-item"
                      style="padding-left: 0 !important; text-align: center;"
                    >
                      {{ item.created_at }}
                    </div>
                  </div>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
          <md-card-actions md-alignment="space-between">
            <!--for pagination style="margin-left: 50%; translate: -25%;" -->

            <Pagination
              :pageCount="productsMeta.last_page"
              :perPage="productsMeta.per_page"
              :total="productsMeta.total"
              :value="productsMeta.current_page"
              @input="getProducts"
              type="success"
            ></Pagination>
          </md-card-actions>
        </md-card>
      </div>
    </div>

    <div class="md-layout-item md-size-100">
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
import AddProduct from "./ProductsManagement/AddProduct";
import EditProductDialoge from "./ProductsManagement/EditProductDialoge";
import { AlertDialoge } from "@/components";
import { Pagination } from "@/components";

export default {
  name: "products",
  components: {
    ShowImages,
    AddProduct,
    Pagination,
    EditProductDialoge,
    AlertDialoge,
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
        this.isLoading = true;
        await this.$store.dispatch("getAllIProductsByItem", {
          page: page,
          itemId: this.$route.params.item_id,
          search: search,
        });

        this.products = this.$store.getters.getAllProducts.data;
        this.productsMeta = this.$store.getters["getAllProducts"].meta;

        this.searched = this.products;
        this.isLoading = false;
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
        const alert = await this.$refs.showAlertDialog.response(
          "Delete Product",
          "Are you sure want to delete?"
        );
        if (alert) {
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
          // this.isLoading = false;
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
          // this.isLoading = true;
          this.getProducts(1, this.search);
          // this.isLoading = false;
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
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  background-color: #00aec5;
  padding: 5px 0;
  border-radius: 10px;
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
