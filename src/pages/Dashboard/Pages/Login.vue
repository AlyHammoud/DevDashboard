<template>
  <div class="md-layout text-center login-fix-page">
    <div class="md-layout-item md-size-100">
      <div class="text-center">
        <p>
          Welcome to our Dashboard
        </p>
        <br />
      </div>
    </div>

    <div
      class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100"
    >
      <form @submit.prevent="login">
        <login-card header-color="green">
          <h4 slot="title" class="title">Log in</h4>
          <!-- <md-button
            slot="buttons"
            ref="#facebook"
            class="md-just-icon md-simple md-white"
          >
            <i class="fab fa-facebook-square"></i>
          </md-button>
          <md-button
            slot="buttons"
            href="#twitter"
            class="md-just-icon md-simple md-white"
          >
            <i class="fab fa-twitter"></i>
          </md-button>
          <md-button
            slot="buttons"
            href="#google"
            class="md-just-icon md-simple md-white"
          >
            <i class="fab fa-google-plus-g"></i>
          </md-button>
          <p slot="description" class="description">Or Be Classical</p> -->
          <md-field
            class="form-group md-invalid"
            slot="inputs"
            style="margin-bottom: 40px"
          >
            <md-icon>email</md-icon>
            <label>Email...</label>
            <md-input v-model="email" type="email" />
            <validation-error :errors="apiValidationErrors.email" />
          </md-field>
          <md-field class="form-group md-invalid" slot="inputs">
            <md-icon>lock_outline</md-icon>
            <label>Password...</label>
            <md-input v-model="password" type="password" />
          </md-field>
          <md-button
            slot="footer"
            type="submit"
            class="md-simple md-success md-lg"
          >
            Lets Go
          </md-button>
        </login-card>
      </form>
    </div>
  </div>
</template>

<script>
import { LoginCard, ValidationError } from "@/components";
import formMixin from "@/mixins/form-mixin";

export default {
  components: {
    LoginCard,
    ValidationError,
  },

  mixins: [formMixin],

  data: () => ({
    email: "test@test.test",
    password: "password",
  }),

  methods: {
    async login() {
      const user = {
        email: this.email,
        password: this.password,
      };

      try {
        await this.$store.dispatch("login", user);
      } catch (e) {
        //console.log(e);
        await this.$store.dispatch("alerts/error", "Invalid credentials!");
        this.setApiValidation({ email: e.data.message });
      }
    },
  },
};
</script>
<style scoped>
.login-fix-page {
  padding-bottom: 7em;
  padding-top: 4em;
}
</style>
