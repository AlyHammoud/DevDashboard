<template>
  <div style="display: flex; flex-direction: column;" class="all-products">
    <div>
      <div class="searchable">
        <SearchableCheckBox
          class="searcable"
          name="By categories:"
          :selectOptions="categoryNames"
          :resets="resetSearchableBoxForCategory"
          :isEnabled="searchableCategoryEnabled"
          style="max-width: 200px; "
          @filterItems="setCategoryFilterOption"
        />

        <SearchableCheckBox
          class="searcable"
          name="By Items:"
          :selectOptions="itemsNames"
          :resets="resetSearchableBoxForItems"
          :isEnabled="searchableItemEnabled"
          style="max-width: 200px;"
          @filterItems="setItemFilterOption"
        />

        <SearchableCheckBox
          class="searcable"
          name="By Sales:"
          placeholder="Sales"
          :selectOptions="salesList"
          :resets="resetSearchableBoxForSales"
          :isEnabled="searchableSalesEnabled"
          style="max-width: 90px;"
          @filterItems="setSaleFilterOption"
        />

        <label for="price" class="filter-price">
          <p>Filter between two prices:</p>
          <div>
            <input
              type="number"
              min="0"
              v-model="lowerPrice"
              @input="setPriceFilterOption"
              style="margin-left: 0 !important;"
            />
            <input
              type="number"
              min="0"
              v-model="higherPrice"
              @input="setPriceFilterOption"
              style="margin-left: 1px !important;"
            />
            <button @click="resetPrice">reset</button>
          </div>
        </label>
      </div>
    </div>

    <div class="item-search-field-wrapper" style="width: 75% ;">
      Search an item by name:
      <input
        type="text"
        class="item-search-field"
        v-model="searchProduct"
        @input="searchProducts"
        placeholder="Type here"
        style="margin-top: 0.7rem;  "
      />
      <div style="margin-top: -2px ;"></div>
    </div>

    <md-field>
      <div class="items-cards">
        <div v-for="product in products" :key="product.id">
          <ProductCard
            :product="product"
            :userRole="user.role == 'admin' ? true : false"
            :userId="user.id == product.managed_by ? true : false"
            @editProduct="editProduct"
            @deleteProduct="deleteProduct"
          />
        </div>
      </div>
    </md-field>

    <EditProductDialoge
      v-if="showEditProductDialog"
      :showEditDialog="showEditProductDialog"
      :productId="productIdInEdit"
      @closeShowDialog="showEditProductDialog = false"
      @updateProductList="getAllProducts((page = productsMeta.current_page))"
    />

    <Pagination
      style="margin-left:  50%; translate: -25%;"
      :pageCount="productsMeta.last_page"
      :perPage="productsMeta.per_page"
      :total="productsMeta.total"
      :value="productsMeta.current_page"
      @input="getAllProducts"
      type="success"
    />

    <LoaderFull v-if="isLoading" />
  </div>
</template>

<script>
// import ShowImages from "../ShowImages";
// import AddItem from "../ItemsManagement/AddItem";
import EditProductDialoge from "./ProductsManagement/EditProductDialoge";
import { Pagination } from "@/components";
import { LoaderFull } from "@/components";
import { SearchableCheckBox } from "@/components";
// import { PriceRange } from "@/components";
import { ProductCard } from "@/components";

export default {
  name: "all-products",
  data() {
    return {
      user: {},
      products: [],
      productsMeta: {},
      categoryNames: [],
      resetSearchableBoxForItems: false,
      resetSearchableBoxForCategory: false,
      resetSearchableBoxForSales: false,
      filterOptions: {
        category: [],
        item: [],
        sales: [],
      },
      itemsNames: [],
      salesList: [],
      lowerPrice: 0,
      higherPrice: 0,
      searchProduct: null,
      timer: null,
      isLoading: false,

      showEditProductDialog: false,
      productIdInEdit: null,

      searchableCategoryEnabled: false,
      searchableItemEnabled: false,
      searchableSalesEnabled: false,
    };
  },
  components: {
    SearchableCheckBox,
    ProductCard,
    EditProductDialoge,
    Pagination,
    LoaderFull,
  },

  watch: {},
  async mounted() {
    this.getAllProducts();
    this.getCategoriesNamesFunc();
    this.getItemsNamesFunc();
    this.getSales();

    await this.$store.dispatch("myUser");
    this.user = await this.$store.getters.myUser;
  },

  methods: {
    async getAllProducts(page = 1, search = "") {
      try {
        if (
          this.filterOptions.category.length ||
          this.filterOptions.item.length ||
          this.filterOptions.sales.length ||
          this.searchProduct != null ||
          this.lowerPrice > 0 ||
          this.higherPrice > 0
        ) {
          this.getFilteredProducts({
            page: page,
            categoryIds: this.filterOptions.category.length
              ? this.filterOptions.category
              : null,
            itemIds: this.filterOptions.item.length
              ? this.filterOptions.item
              : null,
            prices:
              Number(this.lowerPrice) > 0 || Number(this.higherPrice) > 0
                ? [Number(this.lowerPrice), Number(this.higherPrice)].sort(
                    (a, b) => a - b
                  )
                : null,
            sales: this.filterOptions.sales.length
              ? this.filterOptions.sales
              : null,
            search: this.searchProduct,
          });
          // this.isLoading = false;

          return;
        }

        this.isLoading = true;
        await this.$store.dispatch("getAllIProducts", {
          page: page,
          search: search,
        });

        this.products = await this.$store.getters.getAllProducts.data;
        this.productsMeta = await this.$store.getters.getAllProducts.meta;

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },

    async getCategoriesNamesFunc() {
      try {
        await this.$store.dispatch("getCategoriesNames");
        this.$store.getters.getCategoryNames.forEach((name) => {
          this.categoryNames.push({
            value: name.id,
            text: name.name,
          });
        });

        this.searchableCategoryEnabled = true;
      } catch (error) {}
    },

    async getFilteredProducts({
      categoryIds = null,
      itemIds = null,
      page = 1,
      prices = null,
      sales = null,
      search = "",
    }) {
      try {
        this.isLoading = true;
        await this.$store.dispatch("getAllIProductsFiltered", {
          categoryIds,
          itemIds,
          page,
          prices,
          sales,
          search,
        });
        this.products = this.$store.getters.getAllProducts.data;
        this.productsMeta = this.$store.getters.getAllProducts.meta;

        this.isLoading = false;

        // console.log(this.products);
      } catch (error) {
        this.isLoading = false;
      }
    },

    async setCategoryFilterOption(categoryIds) {
      this.lowerPrice = 0;
      this.higherPrice = 0;
      this.filterOptions.category = categoryIds;
      this.searchProduct = "";

      await this.getFilteredProducts({
        categoryIds: categoryIds.length ? categoryIds : null,
        itemIds: null,
        prices: "",
        sales: null,
      });

      this.resetSearchableBoxForItems = !this.resetSearchableBoxForItems;
      this.resetSearchableBoxForSales = !this.resetSearchableBoxForSales;

      this.getItemsNamesFunc(categoryIds);
    },

    setItemFilterOption(itemIds) {
      this.lowerPrice = 0;
      this.higherPrice = 0;
      this.filterOptions.item = itemIds;
      this.resetSearchableBoxForSales = !this.resetSearchableBoxForSales;
      this.searchProduct = "";

      this.getFilteredProducts({
        categoryIds: this.filterOptions.category.length
          ? this.filterOptions.category
          : null,
        itemIds: itemIds.length ? itemIds : null,
        prices: "",
        sales: null,
      });
    },

    setPriceFilterOption(number) {
      this.searchProduct = "";

      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.getFilteredProducts({
          categoryIds: this.filterOptions.category.length
            ? this.filterOptions.category
            : null,
          itemIds: this.filterOptions.item.length
            ? this.filterOptions.item
            : null,
          prices: [Number(this.lowerPrice), Number(this.higherPrice)].sort(
            (a, b) => a - b
          ),
          sales: this.filterOptions.sales.length
            ? this.filterOptions.sales
            : null,
        });
      }, 700);
    },

    setSaleFilterOption(salesNumber) {
      this.searchProduct = "";
      this.filterOptions.sales = salesNumber;

      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.getFilteredProducts({
          categoryIds: this.filterOptions.category.length
            ? this.filterOptions.category
            : null,
          itemIds: this.filterOptions.item.length
            ? this.filterOptions.item
            : null,
          prices:
            Number(this.lowerPrice) > 0 || Number(this.higherPrice) > 0
              ? [Number(this.lowerPrice), Number(this.higherPrice)].sort(
                  (a, b) => a - b
                )
              : null,
          sales: salesNumber,
        });
      }, 700);
    },

    async getItemsNamesFunc(categoryIds = "") {
      try {
        this.itemsNames = [];
        await this.$store.dispatch("getItemsNames", { categoryIds });
        this.$store.getters.getItemsNames.forEach((name) => {
          this.itemsNames.push({
            value: name.id,
            text: name.name,
          });
        });
        this.searchableItemEnabled = true;
      } catch (error) {}
    },

    async getSales() {
      await this.$store.dispatch("getSales");
      this.$store.getters.getSales.forEach((sale) => {
        this.salesList.push({
          value: sale.sale,
          text: sale.sale + "%",
        });
      });
      this.searchableSalesEnabled = true;
    },

    async searchProducts(input) {
      input = input.target.value;
      clearTimeout(this.timer);

      this.resetSearchableBoxForItems = !this.resetSearchableBoxForItems;
      this.resetSearchableBoxForSales = !this.resetSearchableBoxForSales;
      this.resetSearchableBoxForCategory = !this.resetSearchableBoxForCategory;
      this.lowerPrice = 0;
      this.higherPrice = 0;

      this.timer = setTimeout(() => {
        this.getFilteredProducts({ search: input });
      }, 500);
    },

    editProduct(id) {
      this.productIdInEdit = id;
      this.showEditProductDialog = true;
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

          this.getAllProducts(goToPage);
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

    resetPrice() {
      this.lowerPrice = 0;
      this.higherPrice = 0;
      setTimeout(() => {
        this.getAllProducts(1);
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1000px) {
  .all-products {
    padding-inline: 20px !important;
    // display: none !important;
  }
}

.card-expansion {
  height: 480px;
}

.md-card {
  width: 320px;
  min-height: 220px !important;
  max-height: 220px !important;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
  overflow-y: auto;
}

// Full tutorial coming soon!

.card {
  --card-gradient: rgba(0, 0, 0, 0.8);
  --card-gradient: #5e9ad9, #e271ad;
  // --card-gradient: tomato, orange;
  --card-blend-mode: overlay;
  // --card-blend-mode: multiply;

  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0.05rem 0.1rem 0.3rem -0.03rem rgba(0, 0, 0, 0.45);
  padding-bottom: 1rem;
  background-image: linear-gradient(
    var(--card-gradient),
    white max(9.5rem, 27vh)
  );
  overflow: hidden;

  img {
    border-radius: 0.5rem 0.5rem 0 0;
    width: 100%;
    object-fit: cover;
    // height: max(10rem, 25vh);
    max-height: max(10rem, 30vh);
    aspect-ratio: 4/3;
    mix-blend-mode: var(--card-blend-mode);
    // filter: grayscale(100);

    ~ * {
      margin-left: 1rem;
      margin-right: 1rem;
    }
  }

  > :last-child {
    margin-bottom: 0;
  }

  &:hover,
  &:focus-within {
    --card-gradient: #24a9d5 max(8.5rem, 20vh);
  }
}

/* Additional demo display styles */
* {
  box-sizing: border-box;
}

body {
  display: grid;
  place-content: center;
  justify-items: center;
  min-height: 100vh;
  margin: 0;
  padding: 1rem;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir,
    helvetica neue, helvetica, Ubuntu, roboto, noto, segoe ui, arial, sans-serif;
  color: #444;
  background-color: #e1faf1;
}

.card h3 {
  margin-top: 1rem;
  font-size: 1.25rem;
}

.card a {
  color: inherit;
}

.card-wrapper {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30ch, 1fr));
  grid-gap: 1.5rem;
  max-width: 100vw;
  width: 120ch;
  padding-left: 1rem;
  padding-right: 1rem;
}

.items-cards {
  width: 100%;
  gap: 20px;
  margin-block: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  justify-content: center;
  align-items: center;

  div {
    height: 100%;
  }
}

.filtering {
  color: #303030a9;
  font-size: 1.3em;
  font-weight: 900;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;

  #enableFilters {
    cursor: pointer;
  }
}

.searchable {
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  margin-left: 30px;
  row-gap: 10px;
  column-gap: 10px;

  > * {
    width: 200px;
  }

  .filter-price {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    // justify-content: start;
    height: 100%;

    p {
      margin-top: -1px;
      margin-left: 0px;
    }

    div {
      display: grid;
      grid-template-columns: 33px 33px 33px;
      gap: 20px;
      margin-top: -13px;
      // place-items: center;

      * {
        width: 50px;
        height: 32px;
        margin-left: 50%;
        border: 0.2px solid rgb(211, 200, 200);
        border-radius: 3px;
      }

      button {
        cursor: pointer;
        border: none;
        background-color: #fff;
        //box-shadow: 0 1px 5px rgb(59, 54, 54);
        box-shadow: 0 1px 3px 0px #3b3636;
      }
    }
  }
}

.item-search-field-wrapper {
  margin-top: 30px;
  display: flex;
  flex-direction: column;

  .item-search-field {
    border: none;
    height: 50px;
    width: 100%;
    border-bottom: 1.5px solid green;
    border-radius: 1.5rem;
    background-color: rgb(248, 247, 247);
    padding: 5px 10px;
    position: relative;

    &:focus {
      border-bottom: 1.5px solid red;
      border-radius: 2rem;
      transition: all 0.6s;
      transform-origin: center center;
      align-self: center;
    }

    // &:focus ~ div {
    //   width: 100%;
    //   height: 1px;
    //   background-color: red;
    // }
    // &:not(:focus) ~ div {
    //   width: 0;
    //   height: 1px;
    // }
  }
  div {
    width: 0px;
    transition: all 0.3s;
    transform-origin: center center;
    align-self: center;
  }
}
</style>
