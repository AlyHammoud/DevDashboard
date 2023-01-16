<template>
  <div style="display: flex; flex-direction: column;" class="all-products">
    <div>
      <!-- <md-checkbox v-model="enableFilter" class="md-primary"
        ><span class="filtering">Enable filters</span></md-checkbox
      > -->

      <div class="searchable">
        <SearchableCheckBox
          class="searcable"
          name="By categories:"
          :selectOptions="categoryNames"
          :resets="resetSearchableBoxForCategory"
          style="max-width: 200px;"
          @filterItems="setCategoryFilterOption"
        />

        <SearchableCheckBox
          class="searcable"
          name="By Items:"
          :selectOptions="itemsNames"
          :resets="resetSearchableBoxForItems"
          style="max-width: 200px;"
          @filterItems="setItemFilterOption"
        />

        <label for="price" class="filter-price">
          <p>Filter between two prices:</p>
          <div>
            <input
              type="number"
              min="0"
              v-model="lowerPrice"
              @input="setPriceFilterOption"
            />
            <input
              type="number"
              min="0"
              v-model="higherPrice"
              @input="setPriceFilterOption"
            />
          </div>
        </label>
      </div>
    </div>

    <div class="item-search-field-wrapper">
      Search an item by name:
      <!-- <input
        type="text"
        class="item-search-field"
        v-model="searchItem"
        @input="searchItems"
        placeholder="Search here"
      />
      <div></div> -->
    </div>

    <md-field>
      <div class="items-cards">
        <!-- <div v-for="item in items" :key="item.id"> -->
        <!-- <ItemCard
            :item="item"
            @editCategory="editCategory"
            @deleteItem="deleteItem"
          /> -->
        <!-- </div> -->
      </div>
    </md-field>

    <!-- <EditItemDialoge
      v-if="showEditItemDialog"
      :showEditDialog="showEditItemDialog"
      :itemId="itemIdInEdit"
      @closeShowDialog="showEditItemDialog = false"
      @updateItemList="getAllItemsAfterEdit"
    /> -->
    <!-- <Pagination
      style="margin-left:  50%; translate: -25%;"
      :pageCount="itemsMeta.last_page"
      :perPage="itemsMeta.per_page"
      :total="itemsMeta.total"
      :value="itemsMeta.current_page"
      @input="getAllItems"
      v-if="items.length"
      type="success"
    /> -->

    <!-- <LoaderFull v-if="isLoading" /> -->
  </div>
</template>

<script>
// import ShowImages from "../ShowImages";
// import AddItem from "../ItemsManagement/AddItem";
// import EditItemDialoge from "./ItemsManagement/EditItemDialoge";
// import { Pagination } from "@/components";
// import { LoaderFull } from "@/components";
import { SearchableCheckBox } from "@/components";
// import { ItemCard } from "@/components";

export default {
  name: "all-products",
  data() {
    return {
      products: [],
      productsMeta: {},
      categoryNames: [],
      resetSearchableBoxForItems: false,
      resetSearchableBoxForCategory: false,
      filterOptions: {
        category: [],
        item: [],
      },
      itemsNames: [],
      lowerPrice: 0,
      higherPrice: 0,
      timer: null,
    };
  },
  components: { SearchableCheckBox },

  watch: {},
  mounted() {
    this.getAllProducts();
    this.getCategoriesNamesFunc();
    this.getItemsNamesFunc();
  },

  methods: {
    async getAllProducts(page = 1, search = "") {
      try {
        await this.$store.dispatch("getAllIProducts", {
          page: page,
          search: search,
        });

        this.products = await this.$store.getters.getAllProducts.data;
        this.productsMeta = await this.$store.getters.getAllProducts.meta;
        // console.log(this.products);
      } catch (error) {}
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
      } catch (error) {}
    },

    async getFilteredProducts({
      categoryIds = null,
      itemIds = null,
      page = 1,
      prices = null,
    }) {
      try {
        await this.$store.dispatch("getAllIProductsFiltered", {
          categoryIds,
          itemIds,
          page,
          prices,
        });
        this.products = this.$store.getters.getAllProducts.data;
        this.productsMeta = this.$store.getters.getAllProducts.meta;

        // console.log(this.products);
      } catch (error) {}
    },

    async setCategoryFilterOption(categoryIds) {
      this.lowerPrice = 0;
      this.higherPrice = 0;
      this.filterOptions.category = categoryIds;

      await this.getFilteredProducts({
        categoryIds: categoryIds.length ? categoryIds : null,
        itemIds: null,
        prices: "",
      });

      this.resetSearchableBoxForItems = !this.resetSearchableBoxForItems;

      this.itemsNames = [];
      this.products.map((product) => {
        this.itemsNames.push({
          value: product.item.id,
          text: product.item.name,
        });
      });
    },

    setItemFilterOption(itemIds) {
      this.lowerPrice = 0;
      this.higherPrice = 0;
      this.filterOptions.item = itemIds;

      this.getFilteredProducts({
        categoryIds: this.filterOptions.category.length
          ? this.filterOptions.category
          : null,
        itemIds: itemIds.length ? itemIds : null,
        prices: "",
      });
    },

    setPriceFilterOption(number) {
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
        });
      }, 700);
    },

    async getItemsNamesFunc() {
      try {
        await this.$store.dispatch("getItemsNames");
        this.$store.getters.getItemsNames.forEach((name) => {
          this.itemsNames.push({
            value: name.id,
            text: name.name,
          });
        });
      } catch (error) {}
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 20px;
  margin-block: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);

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
    }

    div {
      display: grid;
      grid-template-columns: 50px 50px;
      gap: 10px;
      margin-top: -13px;
      // place-items: center;

      * {
        width: 50px;
        height: 32px;
        margin-left: 50%;
        border: 0.2px solid rgb(211, 200, 200);
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
    border-bottom: 1px solid rgb(223, 111, 223);
    background-color: rgb(248, 247, 247);
    padding: 5px 10px;
    position: relative;

    &:focus {
      border-bottom: none;
    }

    &:focus ~ div {
      width: 100%;
      height: 1px;
      background-color: red;
    }
    &:not(:focus) ~ div {
      width: 0;
      height: 1px;
    }
  }
  div {
    width: 0px;
    transition: all 0.3s;
    transform-origin: center center;
    align-self: center;
  }
}
</style>
