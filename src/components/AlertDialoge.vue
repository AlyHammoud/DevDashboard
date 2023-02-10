<template>
  <!-- <div class="alert-dialoge" v-if="showAlert">
    <div class="the-alert">
      <p>{{ message }}</p>
      <div class="actions">
        <button @click="successPromiseFunc">yes</button>
        <button @click="rejectPromiseFunc">no</button>
      </div>
    </div>
  </div> -->
  <div class="alert-dialoge" v-if="showAlert">
    <div class="md-layout the-alert">
      <div
        class="md-layout-item md-size-100 md-layout md-alignment-center-center top-section"
      >
        <div class="md-layout md-alignment-center-center top-section-child">
          ?
        </div>
      </div>
      <div
        class="md-layout-item md-size-100 md-layout md-alignment-center-center second-section"
      >
        {{ title }}
      </div>
      <div
        class="md-layout-item md-size-100 md-layout md-alignment-center-center third-section"
      >
        {{ message }}
      </div>
      <div class="md-layout-item md-layout md-size-100 fourth-section">
        <div class="md-layout-item md-layout md-alignment-center md-size-50">
          <md-button
            class=" md-dense"
            style="background-color: #ff8200 !important; border-radius: 20px;"
            @click="successPromiseFunc"
            >Okay</md-button
          >
        </div>
        <div class="md-layout-item md-layout md-alignment-center md-size-50">
          <md-button
            class="md-dense md-default "
            @click="rejectPromiseFunc"
            style="border-radius: 20px; background-color: none !important; color: gray;"
            >Cancel</md-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      message: "Are your sure",
      res: false,
      showAlert: false,
      successPromise: undefined,
      rejectPromise: undefined,
    };
  },

  methods: {
    async response(title, message) {
      this.title = title;
      this.message = message;
      this.isVisible();
      return new Promise((res, rej) => {
        //assign the promise resolve into successPromise so the function if ok then true not is false
        this.successPromise = res;
        this.rejectPromise = rej;
      });
    },

    isVisible() {
      this.showAlert = true;
    },

    isInVisible() {
      this.showAlert = false;
    },

    successPromiseFunc() {
      this.successPromise(true);
      this.isInVisible();
    },

    rejectPromiseFunc() {
      this.successPromise(false);
      this.isInVisible();
    },
  },
};
</script>

<style lang="scss">
.alert-dialoge {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #30303030;
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size: 1.4rem;
  }

  .the-alert {
    max-width: 300px;
    background-color: white;
    border-radius: 1.5rem;

    .top-section {
      height: 200px;
      background-color: #ff8200;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;

      .top-section-child {
        max-width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 4px solid white;
        font-size: 50px;
        color: white;
      }
    }

    .second-section {
      font-size: 20px;
      font-weight: bold;
      padding-top: 20px;
      padding-bottom: 10px;
    }

    .third-section {
      padding-top: 10px;
      padding-bottom: 10px;
    }

    .fourth-section {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
}
</style>
