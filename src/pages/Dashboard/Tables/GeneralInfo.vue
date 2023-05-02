<template>
  <div class="general-info">
    <div class="general">
      <h2>General</h2>
      <div class="content">
        <div class="logo1">
          <label for="logo1">
            <span>Add logo</span>
            <img
              v-if="!tmpLogoImage"
              src="../../../assets/images/no-image.jpg"
              alt=""
            />
            <img v-else :src="tmpLogoImage" alt="" />
            <md-icon class="ed-icon">add</md-icon>
          </label>
          <input type="file" name="" id="logo1" @change="handleLogoImage" />
        </div>

        <div class="general-field">
          <label for="address">Address</label>
          <input
            type="text"
            v-model="address"
            placeholder="address"
            name=""
            id="address"
          />
        </div>

        <div class="general-field">
          <label for="mobile">Mobile</label>
          <input
            type="text"
            v-model="mobile"
            placeholder="mobile"
            name=""
            id="mobile"
          />
        </div>

        <div class="general-field">
          <label for="fb">Facebook</label>
          <input
            type="text"
            v-model="facebook"
            placeholder="facebook"
            name=""
            id="fb"
          />
        </div>

        <div class="general-field">
          <label for="insta">Instagram</label>
          <input
            type="text"
            v-model="instagram"
            placeholder="instagram"
            name=""
            id="insta"
          />
        </div>
      </div>
    </div>

    <div class="about-us">
      <h2>About us</h2>

      <div class="content">
        <div class="iimages">
          <div class="iimage">
            <label for="lcompany">
              <span>Large Company image</span>
              <img
                v-if="!tmpLargeCompanyImage"
                src="../../../assets/images/no-image.jpg"
                alt=""
              />
              <img v-else :src="tmpLargeCompanyImage" alt="" />
              <md-icon class="ed-icon">add</md-icon>
            </label>
            <input
              type="file"
              name=""
              id="lcompany"
              @change="handleLargeCompanyImage"
            />
          </div>

          <div class="iimage">
            <label for="scompany">
              <span>Small Company image</span>
              <img
                v-if="!tmpSmallCompanyImage"
                src="../../../assets/images/no-image.jpg"
                alt=""
              />
              <img v-else :src="tmpSmallCompanyImage" alt="" />
              <md-icon class="ed-icon">add</md-icon>
            </label>
            <input
              type="file"
              name=""
              id="scompany"
              @change="handleSmallCompanyImage"
            />
          </div>
        </div>

        <div class="about-us-fields">
          <div class="about-us-field">
            <label for="cname">Company Name</label>
            <input
              type="text"
              v-model="company_name"
              placeholder="company name"
              name=""
              id="cname"
            />
          </div>

          <div class="about-us-field">
            <label for="moto">Moto</label>
            <input
              type="text"
              v-model="moto"
              placeholder="moto"
              name=""
              id="moto"
            />
          </div>
        </div>
      </div>
    </div>
    <button @click="addOrUpdate">Submit</button>

    <AlertDialoge ref="showAlertDialog"></AlertDialoge>
  </div>
</template>

<script>
import { AlertDialoge } from "@/components";
export default {
  name: "general-info",
  components: {
    AlertDialoge,
  },
  data() {
    return {
      logoImage: null,
      tmpLogoImage: null,

      largeCompanyImage: null,
      tmpLargeCompanyImage: null,

      smallCompanyImage: null,
      tmpSmallCompanyImage: null,

      address: null,
      facebook: null,
      instagram: null,
      moto: null,
      mobile: null,
      company_name: null,

      generalInfo: {},
    };
  },

  async mounted() {
    await this.$store.dispatch("getAllGeneralInfo");
    this.generalInfo = await this.$store.getters.getGeneralInfo;

    if (this.generalInfo) {
      this.logoImage = this.generalInfo.logo;
      this.tmpLogoImage = this.generalInfo.logo;

      this.largeCompanyImage = this.generalInfo.company_image;
      this.tmpLargeCompanyImage = this.generalInfo.company_image;

      this.smallCompanyImage = this.generalInfo.company_simage;
      this.tmpSmallCompanyImage = this.generalInfo.company_simage;

      this.address = this.generalInfo.address;
      this.moto = this.generalInfo.moto;
      this.company_name = this.generalInfo.company_name;
      this.instagram = this.generalInfo.insta;
      this.facebook = this.generalInfo.facebook;
      this.mobile = this.generalInfo.phone_number;
    }
  },

  methods: {
    handleLogoImage(e) {
      let tmpImage = "";
      this.logoImage = e.target.files[0];

      let i = new Image();
      i = URL.createObjectURL(e.target.files[0]);
      this.tmpLogoImage = i;
    },
    handleLargeCompanyImage(e) {
      let tmpImage = "";
      this.largeCompanyImage = e.target.files[0];

      let i = new Image();
      i = URL.createObjectURL(e.target.files[0]);
      this.tmpLargeCompanyImage = i;
    },

    handleSmallCompanyImage(e) {
      let tmpImage = "";
      this.smallCompanyImage = e.target.files[0];

      let i = new Image();
      i = URL.createObjectURL(e.target.files[0]);
      this.tmpSmallCompanyImage = i;
    },

    async addOrUpdate() {
      if (!this.checkEmptyFields()) {
        const alert = await this.$refs.showAlertDialog.response(
          "Warning",
          "All fields are required",
          "inform"
        );

        return;
      }

      // For add
      if (!this.generalInfo) {
        const formData = new FormData();
        formData.append("phone_number", this.mobile);
        formData.append("moto", this.moto);
        formData.append("facebook", this.facebook);
        formData.append("insta", this.instagram);
        formData.append("company_name", this.company_name);
        formData.append("address", this.address);
        formData.append("logo", this.logoImage);
        formData.append("company_image", this.largeCompanyImage);
        formData.append("company_simage", this.smallCompanyImage);

        try {
          await this.$store.dispatch("storeGeneralInfo", formData);
          await this.$refs.showAlertDialog.response(
            "Done",
            "your data imported correctly",
            "inform"
          );

          return;
        } catch (e) {
          await this.$refs.showAlertDialog.response(
            "Warning",
            "All fields are required",
            "inform"
          );
        }
      }

      // for update
      const formData = new FormData();
      formData.append("phone_number", this.mobile);
      formData.append("moto", this.moto);
      formData.append("facebook", this.facebook);
      formData.append("insta", this.instagram);
      formData.append("company_name", this.company_name);
      formData.append("address", this.address);

      if (this.logoImage != this.tmpLogoImage) {
        formData.append("logo", this.logoImage);
      }

      if (this.largeCompanyImage != this.tmpLargeCompanyImage) {
        formData.append("company_image", this.largeCompanyImage);
      }

      if (this.smallCompanyImage != this.tmpSmallCompanyImage) {
        formData.append("company_simage", this.smallCompanyImage);
      }

      try {
        await this.$store.dispatch("updateGeneralInfo", {
          id: this.generalInfo.id,
          formData: formData,
        });
        await this.$refs.showAlertDialog.response(
          "Updated",
          "your data updated correctly",
          "inform"
        );
      } catch (error) {
        await this.$refs.showAlertDialog.response(
          "Warning",
          "All fields are required",
          "inform"
        );
      }
    },

    checkEmptyFields() {
      if (
        !this.logoImage ||
        !this.largeCompanyImage ||
        !this.smallCompanyImage ||
        !this.smallCompanyImage ||
        !this.address ||
        !this.moto ||
        !this.company_name ||
        !this.instagram ||
        !this.facebook ||
        !this.mobile
      ) {
        return false;
      }

      return true;
    },
  },
};
</script>

<style lang="scss">
.general-info {
  width: 95%;

  .general {
    h2 {
      font-weight: 700;
    }

    .content {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .general-field {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        input {
          border: transparent;
          outline: transparent;
          padding-inline: 4px;
          height: 30px;
          width: 220px;

          &::placeholder {
            opacity: 0.3;
          }
        }
      }

      .logo1 {
        all: unset !important;
        display: flex;
        flex-direction: column;
        width: 150px;
        margin-right: 40px !important;
        // justify-content: center;
        // align-items: center;
        label {
          width: 150px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          position: relative;

          img {
            width: 150px;
            height: 150px;
            object-fit: cover;
          }

          .ed-icon {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 20px;
            background-color: rgb(136, 207, 136);
            opacity: 0.8;
            transition: all 0.2s;

            &:hover {
              height: 30px;
            }
          }

          span {
            text-align: center;
          }
        }

        input {
          display: none;
        }
      }
    }
  }

  .about-us {
    width: 100% !important;
    h2 {
      font-weight: 900;
    }

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;

      .about-us-fields {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 60px;
        margin-top: 40px;

        .about-us-field {
          display: flex !important;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          input {
            border: transparent;
            outline: transparent;
            padding-inline: 4px;
            height: 30px;
            width: 280px;

            &::placeholder {
              opacity: 0.3;
            }
          }
        }
      }

      .iimages {
        display: flex !important;
        align-items: center;
        justify-content: center;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 100% !important;
        height: fit-content;
        flex-direction: row !important;
        gap: 80px;

        .iimage {
          width: 250px;

          img {
            width: 250px;
            height: 250px;
            object-fit: cover;
          }

          label {
            width: 250px;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            position: relative;

            .ed-icon {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 20px;
              background-color: rgb(136, 207, 136);
              opacity: 0.8;
              transition: all 0.2s;

              &:hover {
                height: 30px;
              }
            }

            span {
              text-align: center;
            }
          }
          input {
            display: none;
          }
        }
      }
    }
  }
}
</style>
