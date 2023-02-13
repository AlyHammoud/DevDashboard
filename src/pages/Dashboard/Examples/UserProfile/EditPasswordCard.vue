<template>
  <form ref="password_form" @submit.prevent="changePassword">
    <md-card>
      <md-card-header class="md-card-header-icon">
        <div class="card-icon">
          <md-icon>perm_identity</md-icon>
        </div>
        <h4 class="title">
          Change Password
        </h4>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-size-100">
            <md-field class="md-invalid" style="margin-bottom: 40px;">
              <label>New Password</label>
              <md-input v-model="user.password" type="password" />
              <validation-error :errors="apiValidationErrors.password" />
            </md-field>
            <md-field class="md-invalid">
              <label>Confirm New Password</label>
              <md-input v-model="user.password_confirmation" type="password" />
              <validation-error
                :errors="apiValidationErrors.password_confirmation"
              />
            </md-field>
          </div>
        </div>
      </md-card-content>

      <md-card-actions>
        <md-button type="submit">
          Change Password
        </md-button>
      </md-card-actions>
    </md-card>
  </form>
</template>

<script>
import { ValidationError } from "@/components";
import formMixin from "@/mixins/form-mixin";
export default {
  name: "edit-password-card",

  props: {
    user: Object,
  },

  components: { ValidationError },

  mixins: [formMixin],

  data: () => ({
    password: null,
    password_confirmation: null,
  }),

  methods: {
    async changePassword() {
      if (["1"].includes(this.user.id)) {
        await this.$store.dispatch(
          "alerts/error",
          "You are not allowed not change data of default users."
        );
        return;
      }

      const user = {
        id: this.user.id,
        type: "users",
        password: this.password,
        password_confirmation: this.password_confirmation,
        deleteImage: 0,
      };

      try {
        await this.$store.dispatch("updateUser", {
          id: this.user.id,
          user: {
            password: this.user.password,
            password_confirmation: this.user.password_confirmation,
            deleteImage: 0,
          },
        });
        await this.$store.dispatch(
          "alerts/error",
          "Password changed successfully."
        );
        this.$refs["password_form"].reset();
      } catch (e) {
        await this.$store.dispatch(
          "alerts/error",
          "Oops, something went wrong!"
        );
        this.setApiValidation(e.data.errors);
      }
    },
  },
};
</script>
