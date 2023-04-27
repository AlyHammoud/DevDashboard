<template>
  <div>
    <div class="new-add" v-on:click.self="$emit('hideEdit', false)">
      <div class="box">
        <div class="add-image">
          <label for="ads-input-img">
            <img v-if="!tmpNewHandledImage" :src="ad.image" alt="" />
            <img v-else :src="tmpNewHandledImage" alt="" />
          </label>
          <div
            class="restore-image"
            @click="(tmpNewHandledImage = null), (newHandledImage = null)"
            v-if="tmpNewHandledImage"
          >
            <md-icon>delete</md-icon>
          </div>
          <input type="file" id="ads-input-img" @change="handleImageUpload" />
        </div>

        <div class="textarea">
          <label for="textarea">Add description</label>
          <textarea
            name=""
            id="textarea"
            v-model="ad.description"
            placeholder="Add your description here..."
          ></textarea>
        </div>

        <div class="ads-product">
          <div class="input">
            <input
              type="text"
              placeholder="Search for a product"
              v-model="searchProduct"
            />
            <div class="line"></div>
          </div>
          <div class="selected-products">
            <p>you have added these products</p>

            <div class="products" v-if="ad.products">
              <div
                class="product"
                v-for="(product, index) in ad.products"
                :key="index"
              >
                <div class="delete" @click="deleteSelectedProduct(product.id)">
                  <md-icon>delete</md-icon>
                </div>
                <img
                  v-if="product.images.length"
                  :src="product.images[0].image_url"
                  alt=""
                />
                <img v-else src="@/assets/images/no-image.jpg" alt="" />
                <p>{{ product.name }}</p>
              </div>
            </div>

            <div class="products" v-else>
              <p
                style="text-align: center; width: 100%; background-color: #fff;"
              >
                no product were selected
              </p>
            </div>
          </div>
        </div>
        <button @click="edit_ad">Edit</button>
      </div>

      <div class="filtered-products" v-if="filteredProducts.length">
        <div class="close-fp" @click="searchProduct = ''">x</div>
        <div
          class="filtered-product"
          v-for="(product, index) in filteredProducts"
          :key="index"
          @click="
            addToSelected(
              product.id,
              product.images.length ? product.images[0].image_url : null,
              product.name
            )
          "
        >
          <img
            v-if="product.images.length"
            :src="product.images[0].image_url"
            alt=""
          />
          <img v-else src="@/assets/images/no-image.jpg" alt="" />

          <p>{{ product.name }}</p>
        </div>
      </div>
    </div>

    <AlertDialoge ref="showAlertDialog"></AlertDialoge>
  </div>
</template>

<script>
import { AlertDialoge } from "@/components";
export default {
  name: "edit-ad",
  props: {
    adId: {
      type: Number,
    },
  },

  components: {
    // Pagination,
    AlertDialoge,
  },

  data() {
    return {
      ad: {
        image: null,
        description: "",
        products: [],
      },
      searchProduct: "",
      filteredProducts: [],
      showRestoreImageIcon: false,
      newHandledImage: null,
      tmpNewHandledImage: null,
      timer: null,
    };
  },

  watch: {
    searchProduct: function(newV) {
      clearTimeout(this.timer);
      if (newV) {
        this.timer = setTimeout(async () => {
          await this.$store.dispatch("getAllIProductsFiltered", {
            categoryIds: null,
            itemIds: null,
            page: 1,
            prices: null,
            sales: null,
            search: newV,
          });

          let selectedProductsIdPluct = this.ad.products.map((sp) => sp["id"]);
          this.filteredProducts = this.$store.getters.getAllProducts.data;
          this.filteredProducts = this.filteredProducts.filter(
            (prd, i) => !selectedProductsIdPluct?.includes(prd.id)
          );
          // this.productsMeta = this.$store.getters.getAllProducts.meta;
        }, 200);
      } else {
        this.filteredProducts = [];
      }
    },
  },

  async created() {
    await this.$store
      .dispatch("getSingleAd", this.adId)
      .catch((e) => console.log("e", e));
    this.ad = await this.$store.getters.getSingleAd;
  },

  methods: {
    handleImageUpload(e) {
      if (e.target.files.length !== 0) {
        let i = new Image();
        this.newHandledImage = e.target.files[0];
        i = URL.createObjectURL(this.newHandledImage);

        this.tmpNewHandledImage = i;
      }
    },

    addToSelected(id, image, name) {
      let newObj = {
        id,
        name,
        images: image ? [{ image_url: image }] : [],
      };
      this.ad.products = [...this.ad.products, newObj];

      this.filteredProducts = this.filteredProducts.filter(
        (prd) => prd.id != id
      );
    },
    deleteSelectedProduct(id) {
      this.ad.products = this.ad.products.filter((prd) => prd.id != id);
      this.searchProduct = "";
    },

    async edit_ad() {
      if (!this.ad.description || !this.ad.products.length || !this.ad.image) {
        const alert = await this.$refs.showAlertDialog.response(
          "Error",
          "Please fill all required fields before adding",
          "inform"
        );

        return;
      }

      const formData = new FormData();

      if (this.newHandledImage) {
        formData.append("image", this.newHandledImage);
      }

      let selectedProduct_ids = this.ad.products.map((prd) => prd["id"]);

      formData.append("description", this.ad.description);
      formData.append("product_ids[]", selectedProduct_ids);

      await this.$store
        .dispatch("updateAd", { id: this.adId, formData })
        .then((data) => {
          this.$emit("closeAndRefresh");
        });
    },
  },
};
</script>

<style lang="scss">
.new-add {
  position: fixed;
  inset: 0;
  background-color: #303030aa;
  backdrop-filter: blur(10px);
  overflow: auto;
  z-index: 999;

  button {
    border-color: transparent;
    outline: transparent;
    background-color: rgb(207, 41, 41);
    color: #fff;
    font-size: 1.2em;
    padding: 10px 50px;
    border-radius: 5px;
    cursor: pointer;
  }

  .box {
    width: 75%;
    min-height: 500px;
    background-color: #e0d9d9;
    margin: 0 auto;
    padding: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 40px;

    .add-image {
      position: relative;
      cursor: pointer;
      z-index: 1;

      .restore-image {
        position: absolute;
        top: 0;
        right: -20px;

        * {
          color: red !important;
        }
      }

      &:hover {
        &::before {
          height: 60px;
        }
      }
      &::before {
        content: "+";
        display: grid;
        place-items: center;
        width: 100%;
        background-color: rgb(81, 216, 81);
        height: 40px;
        position: absolute;
        bottom: 0;
        color: #fff;
        font-size: 2rem;
        transition: all 1s;
        pointer-events: none;
      }
      input {
        display: none;
      }

      label {
        width: 400px !important;
        height: 200px !important;
        cursor: pointer;

        img {
          height: 200px !important;
          width: 400px !important;
          object-fit: cover;
        }
      }
    }

    .textarea {
      display: flex;
      flex-direction: column;
      width: 400px;
      margin-block: 30px;

      textarea {
        width: 100% !important;
        min-height: 150px;
        border: transparent;
        outline: transparent;
        padding: 20px;
      }
    }

    .ads-product {
      display: flex;
      flex-direction: column;
      width: 400px;
      margin-bottom: 30px;
      gap: 20px;

      .input {
        width: 100%;
        position: relative;

        input {
          border-color: transparent;
          outline: transparent;
          height: 40px;
          padding-inline: 20px;
          width: 100%;

          &:focus + .line {
            transform: scaleX(1);
          }
        }

        .line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 1px;
          width: 100%;
          background-color: rgb(81, 216, 81);
          transform-origin: left;
          transform: scaleX(0);
          transition: all 0.3s;
        }
      }

      .selected-products {
        width: 100%;

        .products {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;

          .product {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;

            .delete {
              position: absolute;
              top: 0;
              right: -5px;
              color: red !important;
              z-index: 99999;
              cursor: pointer;

              * {
                color: red !important;
                z-index: 99999;
              }
            }

            img {
              width: 80px;
              height: 80px;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }

  .filtered-products {
    position: fixed;
    top: 80px;
    right: 80px;
    z-index: 99;
    width: 400px;
    height: 400px;
    max-height: 600px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    padding: 10px 15px;
    background-color: #fff;
    gap: 30px;
    box-shadow: 1px 2px 34px black;

    .close-fp {
      position: absolute;
      top: -3px;
      right: 0;
      z-index: 999;
      padding: 0px 4px;
      border: 1px solid gray;
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;
    }

    .filtered-product {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 130px;
      width: 100px;

      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }
  }
}
</style>
