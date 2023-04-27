<template>
  <div class="ads">
    <div class="add-ad" @click="showNewAdd = !showNewAdd">
      <button>Add new +</button>
    </div>
    <div class="all-ads" v-if="allAds.length">
      <div class="ad" v-for="(ad, index) in allAds" :key="index">
        <div class="top">
          <div class="left">
            <p style="color: #fff">{{ index + 1 }}</p>
            <div class="image">
              <img :src="ad.image" alt="" />
            </div>
            <div class="description">
              <p>{{ ad.description }}</p>
            </div>
          </div>
          <div class="right">
            <div @click="showEdit(ad.id)">
              <md-icon class="ad-edit">edit</md-icon>
            </div>
            <div @click="deleteAd(ad.id, index)">
              <md-icon class="ad-delete">delete</md-icon>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="product" v-for="(product, i) in ad.products" :key="i">
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
    </div>
    <div v-else>
      No ads added
    </div>

    <div class="new-add" v-if="showNewAdd" v-on:click.self="showNewAdd = false">
      <div class="box">
        <div class="add-image">
          <label for="ads-input-img"
            ><img
              v-if="!tmpAdImageShow"
              src="@/assets/images/no-image.jpg"
              alt=""/><img v-else :src="tmpAdImageShow" alt=""
          /></label>
          <input type="file" id="ads-input-img" @change="handleImageUpload" />
        </div>

        <div class="textarea">
          <label for="textarea">Add description</label>
          <textarea
            name=""
            id="textarea"
            v-model="descritpion"
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

            <div class="products" v-if="selectedProducts.length">
              <div
                class="product"
                v-for="(product, index) in selectedProducts"
                :key="index"
              >
                <div class="delete" @click="removeSelectedProduct(product.id)">
                  <md-icon>delete</md-icon>
                </div>
                <img v-if="product.image" :src="product.image" alt="" />
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
        <button @click="add_ad">Add</button>
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
    <EditAds
      @hideEdit="showAdEdit = false"
      v-if="showAdEdit"
      :adId="adEditId"
      @closeAndRefresh="closeEdit"
    ></EditAds>
  </div>
</template>

<script>
import { AlertDialoge } from "@/components";
import EditAds from "./Ads/EditAds";

export default {
  name: "ads",
  data() {
    return {
      allAds: [],
      showNewAdd: false,
      adImageUpload: null,
      tmpAdImageShow: null,
      descritpion: "",
      searchProduct: "",
      filteredProducts: [],
      selectedProducts: [],
      adEditId: null,
      showAdEdit: false,
      timer: false,
    };
  },
  components: {
    // Pagination,
    AlertDialoge,
    EditAds,
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
          let selectedProductsIdPluct = this.selectedProducts.map(
            (sp) => sp["id"]
          );

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

    showNewAdd: function(newVal) {
      if (!newVal) {
        this.reset_inputs();
      }
    },
  },

  async mounted() {
    await this.getAllAds();
  },

  methods: {
    handleImageUpload(e) {
      this.adImageUpload = e.target.files[0];

      let i = new Image();

      i = URL.createObjectURL(this.adImageUpload);
      this.tmpAdImageShow = i;
    },

    addToSelected(id, image, name) {
      this.selectedProducts.push({ id, image, name });
      this.filteredProducts = this.filteredProducts.filter(
        (prd) => prd.id != id
      );
    },

    removeSelectedProduct(id) {
      this.selectedProducts = this.selectedProducts.filter(
        (prd) => prd.id != id
      );

      this.searchProduct = "";
    },

    reset_inputs() {
      this.adImageUpload = null;
      this.tmpAdImageShow = null;
      this.descritpion = "";
      this.searchProduct = "";
      this.selectedProducts = [];
    },

    async getAllAds() {
      await this.$store.dispatch("getAllAds");
      this.allAds = await this.$store.getters["getAllAds"];
    },

    async add_ad() {
      if (
        !this.adImageUpload ||
        !this.descritpion ||
        !this.selectedProducts.length
      ) {
        const alert = await this.$refs.showAlertDialog.response(
          "Error",
          "Please fill all required fields before adding",
          "inform"
        );

        return;
      }

      const formData = new FormData();
      this.selectedProducts = this.selectedProducts.map(
        (prdsId) => prdsId["id"]
      );

      formData.append("description", this.descritpion);
      formData.append("image", this.adImageUpload);
      formData.append("product_ids[]", this.selectedProducts);

      try {
        await this.$store.dispatch("storeAd", formData);

        await this.getAllAds();

        this.showNewAdd = false;
      } catch (e) {
        await this.$refs.showAlertDialog.response(
          "Error",
          "Please fill all required fields before adding",
          "inform"
        );
      }

      this.reset_inputs();
    },

    async deleteAd(id, index) {
      let alert = await this.$refs.showAlertDialog.response(
        "Delete",
        "Are you sure want to delete this Ad?",
        "delete"
      );

      if (!alert) return;

      await this.$store.dispatch("deleteAd", id);
      this.allAds.splice(index, 1);
    },

    showEdit(id) {
      this.adEditId = id;
      this.showAdEdit = true;
    },

    closeEdit() {
      this.showAdEdit = false;
      this.getAllAds();
    },
  },
};
</script>

<style lang="scss" scoped>
.ads {
  padding-left: 15px !important;
  position: relative;

  .all-ads {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    margin-block: 50px;

    .ad {
      display: flex;
      flex-direction: column;

      .top {
        display: flex;
        justify-content: space-between;
        padding-inline: 20px;
        height: 80px;
        width: 100%;
        background-color: rgb(81, 216, 81);

        .left {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: fit-content !important;
          gap: 20px;

          .image {
            width: 70px !important;
            height: 70px !important;

            img {
              height: 100% !important;
              width: 100% !important;
              border-radius: 50%;
            }
          }

          .description {
            p {
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              max-width: 220px;
              // word-break: break-all;
              color: #fff;
              white-space: nowrap;
              max-height: 1.5em;
              display: inline-block;
            }
          }
        }

        .right {
          display: flex;
          align-items: center;
          gap: 20px;

          .ad-edit {
            color: rgb(69, 69, 214) !important;
            cursor: pointer;
          }
          .ad-delete {
            cursor: pointer;
            color: red !important;
          }
        }
      }

      .bottom {
        display: flex;
        gap: 10px;
        height: auto;
        flex-wrap: wrap;
        // background-color: lightgreen;
        box-shadow: inset 5px -5px 30px rgb(93, 182, 93);

        .product {
          display: flex;
          flex-direction: column;
          width: 160px;
          height: 160px;
          align-items: center;
          justify-content: center;

          img {
            width: 90px;
            height: 90px;
            border-radius: 50%;
          }
        }
      }
    }
  }

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

  .add-ad {
    button {
      outline: transparent;
      border: transparent;
      background-color: green;
      color: #fff;
      padding: 8px 18px;
      cursor: pointer;
    }
  }
}
</style>
