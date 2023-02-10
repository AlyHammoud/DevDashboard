<template>
  <md-card class="md-card-profile">
    <div class="md-card-avatar">
      <div class="image-wrapper">
        <img class="img" v-if="user.image && !isLoading" :src="user.image" />
        <!-- <img class="img" v-else-if="imgSrc" :src="imgSrc" /> -->
        <img
          class="img"
          v-if="!isLoading && !user.image"
          src="../../../../assets/images/d.jpg"
        />

        <div
          class="my-spinner"
          style="width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;"
          v-if="isLoading"
        >
          <md-progress-spinner
            class="md-accent"
            :md-diameter="30"
            md-mode="indeterminate"
          ></md-progress-spinner>
        </div>

        <label for="avatar" class="user-avatar1">
          <input
            type="file"
            accept=".png,.jpeg,.jpg"
            name="browse"
            id="avatar"
            style="display: none;"
            @change="userImageHandler"
          />
          <md-icon class="img-icon">edit</md-icon>
        </label>
      </div>
    </div>

    <md-card-content>
      <h6 class="category text-gray">{{ user.role }}</h6>
      <h4 class="card-title">{{ user.name }}</h4>
      <!-- <p class="card-description">
        Don't be scared of the truth because we need to restart the human
        foundation in truth And I love you like Kanye loves Kanye I love Rick
        Owens’ bed design but the back is...
      </p>
      <md-button class="md-round" :class="getColorButton(buttonColor)">
        Follow
      </md-button> -->
    </md-card-content>
  </md-card>
</template>

<script>
export default {
  name: "user-profile-card",
  props: {
    cardUserImage: {
      type: String,
      default: process.env.VUE_APP_BASE_URL + "/img/faces/marc.jpg",
    },
    buttonColor: {
      type: String,
      default: "",
    },
    user: {
      type: Object,
    },
  },
  data() {
    return {
      userDefaultPicture: "../../../../assets/images/d.jpg",
      imgSrc: "",
      userImage: "",
      isLoading: false,
    };
  },
  methods: {
    getColorButton: (buttonColor) => "md-" + buttonColor + "",

    async userImageHandler(e) {
      this.userImage = e.target.files[0];

      if (e.target.files[0] != undefined) {
        var fileReader = new FileReader();

        fileReader.onload = () => {
          this.imgSrc = fileReader.result;
        };
        fileReader.readAsDataURL(e.target.files[0]);
      }

      const formData = new FormData();

      if (this.userImage) {
        formData.append("image", this.userImage);
      } else {
        return;
      }

      try {
        this.isLoading = true;
        await this.$store.dispatch("updateUser", {
          id: this.user.id,
          user: formData,
        });
        await this.$store.dispatch(
          "alerts/success",
          "Image updated successfully"
        );

        this.$emit("updateUser", this.$store.getters.myUser);
        this.isLoading = false;

        // this.closeForm();
      } catch (e) {
        //console.log(e);
        await this.$store.dispatch("alerts/error", "error uploading image");
        // this.setApiValidation(e.data.errors);
      }
    },
  },
};
</script>

<style lang="scss">
.image-wrapper {
  position: relative;
  transition: all 1s ease !important;

  img {
    width: 120px !important;
    height: 120px !important;
  }

  .user-avatar1 {
    position: absolute;
    z-index: 1111;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(128, 128, 128, 0.6);
    cursor: pointer;
    transition: all 1s !important;

    &:hover {
      background-color: rgba(128, 128, 128, 1);
    }

    .img-icon {
      color: #fff !important;
      transition: all 2s !important;
    }
  }
}
</style>
