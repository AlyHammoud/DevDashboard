<template>
  <div class="alert-dialoge" v-if="showAlert">
    <div class="the-alert">
      <p>{{ message }}</p>
      <div class="actions">
        <button @click="successPromiseFunc">yes</button>
        <button @click="rejectPromiseFunc">no</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "Are your sure",
      res: false,
      showAlert: false,
      successPromise: undefined,
      rejectPromise: undefined,
    };
  },

  methods: {
    async response(message) {
      this.message = message;
      this.isVisible();
      return new Promise((res, rej) => {
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
    min-height: 300px;
    width: 400px;
    border-radius: 8px;
    background-color: antiquewhite;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .actions {
      margin-top: 100px;
      display: flex;
      gap: 80px;

      button {
        border: none;
        outline-color: transparent;
        color: #fff;
        width: 80px;
        height: 40px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 17px;
        font-weight: 900;

        &:hover {
          opacity: 0.9;
        }

        &:first-child {
          background-color: rgb(33, 241, 33);
        }

        &:last-child {
          background-color: rgb(241, 36, 36);
        }
      }
    }
  }
}
</style>
