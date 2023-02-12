<template>
  <div style="display: flex; flex-direction: column;" class="all_items">
    <div>
      <div class="searchable">
        <SearchableCheckBox
          class="searcable"
          name="By categories:"
          :selectOptions="categoryOptions"
          :isEnabled="true"
          :resets="resetSearchableBox"
          style="max-width: 200px;"
          @filterItems="getAllItemsFiltered"
        />
      </div>
    </div>

    <div class="item-search-field-wrapper" style="width: 75%;">
      Search an item by name:
      <input
        type="text"
        class="item-search-field"
        v-model="searchItem"
        @input="searchItems"
        placeholder="Type here"
        style="margin-top: 0.7rem; "
      />
      <div style="margin-top: -2px ;"></div>
    </div>

    <md-field>
      <div class="items-cards">
        <div v-for="item in items" :key="item.id">
          <ItemCard
            :item="item"
            :userRole="user.role == 'admin' ? true : false"
            :userId="user.id == item.managed_by ? true : false"
            @editCategory="editCategory"
            @deleteItem="deleteItem"
          />
        </div>
      </div>
    </md-field>

    <EditItemDialoge
      v-if="showEditItemDialog"
      :showEditDialog="showEditItemDialog"
      :itemId="itemIdInEdit"
      @closeShowDialog="showEditItemDialog = false"
      @updateItemList="getAllItemsAfterEdit"
    />
    <Pagination
      style="margin-left:  50%; translate: -25%;"
      :pageCount="itemsMeta.last_page"
      :perPage="itemsMeta.per_page"
      :total="itemsMeta.total"
      :value="itemsMeta.current_page"
      @input="getAllItems"
      v-if="items.length"
      type="success"
    />

    <LoaderFull v-if="isLoading" />
    <AlertDialoge ref="showAlertDialog"></AlertDialoge>
  </div>
</template>

<script>
// import ShowImages from "../ShowImages";
// import AddItem from "../ItemsManagement/AddItem";
import EditItemDialoge from "./ItemsManagement/EditItemDialoge";
import { Pagination } from "@/components";
import { LoaderFull } from "@/components";
import { SearchableCheckBox } from "@/components";
import { ItemCard } from "@/components";
import { AlertDialoge } from "@/components";

export default {
  name: "all-items",
  data() {
    return {
      items: [],
      filterCategoryNames: [],
      itemsMeta: {},
      enableFilter: false,
      categoryOptions: [],
      searchItem: [],
      showEditItemDialog: false,
      itemIdInEdit: null,
      isLoading: false,
      tmpCategoriesIdsInSearchable: [],
      resetSearchableBox: false,
      timer: null,
      user: {},
    };
  },
  components: {
    SearchableCheckBox,
    ItemCard,
    EditItemDialoge,
    LoaderFull,
    Pagination,
    AlertDialoge,
  },

  // watch: {
  //   async enableFilter(newV) {
  //     this.isLoading = true;
  //     if (newV) {
  //       if (!Object.keys(this.categoryOptions).length) {
  //         await this.$store.dispatch("getCategoriesNames");
  //         this.$store.getters.getCategoryNames.forEach((name) => {
  //           this.categoryOptions.push({
  //             value: name.id,
  //             text: name.name,
  //           });
  //         });
  //       }
  //     } else {
  //       this.categoryOptions = [];
  //       this.getAllItems(1);
  //     }
  //     this.isLoading = false;
  //   },
  // },
  async mounted() {
    this.getAllItems();

    if (!Object.keys(this.categoryOptions).length) {
      await this.$store.dispatch("getCategoriesNames");
      this.$store.getters.getCategoryNames.forEach((name) => {
        this.categoryOptions.push({
          value: name.id,
          text: name.name,
        });
      });
    }

    await this.$store.dispatch("myUser");
    this.user = await this.$store.getters.myUser;
  },

  methods: {
    async getAllItems(page = 1) {
      try {
        if (this.tmpCategoriesIdsInSearchable.length) {
          this.getAllItemsFiltered(this.tmpCategoriesIdsInSearchable, page);
          return;
        }

        this.isLoading = true;

        if (this.searchItem != "") {
          await this.$store.dispatch("getAllItems", {
            page: page,
            search: this.searchItem,
          });
          this.items = await this.$store.getters.getAllItems.data;
          this.itemsMeta = await this.$store.getters.getAllItems.meta;

          this.isLoading = false;
          return;
        }

        await this.$store.dispatch("getAllItems", { page: page, search: "" });
        this.items = await this.$store.getters.getAllItems.data;
        this.itemsMeta = await this.$store.getters.getAllItems.meta;
        this.isLoading = false;
        // console.log(this.items);
      } catch (error) {
        this.isLoading = false;
      }
    },

    async getAllItemsFiltered(categoriesId, page = 1) {
      this.tmpCategoriesIdsInSearchable = categoriesId;
      this.searchItem = "";

      if (!categoriesId.length) {
        this.getAllItems();
        return;
      }
      try {
        this.isLoading = true;
        await this.$store.dispatch("getAllItemsFiltered", {
          page: page,
          search: "",
          categoryId: categoriesId,
        });

        this.items = await this.$store.getters.getAllItems.data;
        this.itemsMeta = await this.$store.getters.getAllItems.meta;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        // console.log(error);
      }
    },

    async searchItems(input) {
      try {
        input = input.target.value;
        clearTimeout(this.timer);

        this.resetSearchableBox = !this.resetSearchableBox;
        this.tmpCategoriesIdsInSearchable = [];

        this.timer = setTimeout(async () => {
          this.isLoading = true;
          await this.$store.dispatch("getAllItems", { page: 1, search: input });
          this.items = await this.$store.getters.getAllItems.data;
          this.itemsMeta = await this.$store.getters.getAllItems.meta;

          this.tmpCategoriesIdsInSearchable = [];

          this.isLoading = false;
          // console.log(this.items);
        }, 500);
      } catch (error) {}
      // await $this.$store.dispatch("getA");
    },

    editCategory(id) {
      this.itemIdInEdit = id;
      this.showEditItemDialog = true;
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

          this.getAllItems(goToPage);
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

    getAllItemsAfterEdit() {
      this.getAllItems(1);
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1000px) {
  .all_items {
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
  width: 90%;
  margin-left: 30px;
  gap: 40px;

  > * {
    width: 100%;
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
    //   width: 95%;
    //   height: 1px;
    //   background-color: red;
    // }
    // &:not(:focus) ~ div {
    //   width: 0;
    //   height: 0.1px;
    // }
  }
  div {
    width: 0px;
    transition: all 0.3s;
    transform-origin: center center;
    align-self: center;
    // border-bottom: 5px solid red;
    // border-radius: 2rem;
  }
}
</style>
