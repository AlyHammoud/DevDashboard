<template>
  <div v-if="user" class="md-layout md-gutter">
    <div class="md-layout-item md-size-66 md-small-size-100">
      <div class="md-layout-item md-size-100">
        <user-edit-card :user="user" v-if="user" />
      </div>
      <div class="md-layout-item md-size-100">
        <user-password-card :user="user" />
      </div>
    </div>

    <div class="md-layout-item md-size-33 md-small-size-100">
      <user-profile-card :user="user" @updateUser="updateUser" />
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
  }),

  mounted() {
    this.getProfile();
  },

  methods: {
    async getProfile() {
      await this.$store.dispatch("myUser");
      this.user = this.$store.getters.myUser;
    },

    updateUser(input) {
      this.user = input;
    },
  },
};
</script>
