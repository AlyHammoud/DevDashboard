<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-size-66 md-small-size-100">
      <div class="md-layout-item md-size-100">
        <user-edit-card :user="user" v-if="!isLoading && user" />
        <div
          class="my-spinner"
          style=" display: flex; align-items: center; justify-content: center;"
          v-if="isLoading"
        >
          <md-progress-spinner
            class="md-accent"
            :md-diameter="30"
            md-mode="indeterminate"
          ></md-progress-spinner>
        </div>
      </div>
      <div class="md-layout-item md-size-100">
        <user-password-card :user="user" v-if="!isLoading && user" />
      </div>
    </div>

    <div class="md-layout-item md-size-33 md-small-size-100">
      <user-profile-card
        :user="user"
        v-if="!isLoading && user"
        @updateUser="updateUser"
      />
    </div>
  </div>
</template>

<script>
import UserEditCard from "@/pages/Dashboard/Examples/UserProfile/EditProfileCard.vue";
import UserPasswordCard from "@/pages/Dashboard/Examples/UserProfile/EditPasswordCard.vue";
import UserProfileCard from "@/pages/Dashboard/Examples/UserProfile/UserProfileCard.vue";

export default {
  name: "user-profile-example",

  components: {
    "user-profile-card": UserProfileCard,
    "user-edit-card": UserEditCard,
    "user-password-card": UserPasswordCard,
  },

  data: () => ({
    user: null,
    isLoading: false,
  }),

  mounted() {
    this.getProfile();
  },

  methods: {
    async getProfile() {
      this.isLoading = true;
      await this.$store.dispatch("myUser");
      this.user = this.$store.getters.myUser;
      this.isLoading = false;
    },

    updateUser(input) {
      this.user = input;
    },
  },
};
</script>
