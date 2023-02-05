<template>
  <div>
    <LoaderFull v-if="isLoading"></LoaderFull>
    <!-- <md-dialog
      :md-active.sync="showEditDialog"
      style="margin:0 auto; z-index: 9999; "
      :md-click-outside-to-close="false"
    >
      <div class="dialog-content" style="overflow: hidden; overflow-y: auto;">
        <div style="margin: 0 auto; width: 550px;">
          <div>
            <div class="md-layout  " style="color: #fff;  ">
              <div
                class="md-layout-item header "
                style="background-color: #9124A3 !important; padding: 8px 10px; text-align: center;"
              >
                Update User
              </div>
            </div>
          </div>
          <div>
            <div class="md-layout text-center" style="color: white; ">
              <div class="md-layout-item">
                <md-field>
                  <label>Name</label>
                  <md-input v-model="user.name"></md-input>
                  <span class="md-helper-text">Name</span>
                </md-field>
                <validation-error
                  :errors="apiValidationErrors.name"
                  style="color: red"
                />
              </div>
            </div>
          </div>
          <div>
            <div class="md-layout text-center " style="color: white; ">
              <div class="md-layout-item">
                <md-field>
                  <label>Email</label>
                  <md-input v-model="user.email"></md-input>
                  <span class="md-helper-text">User Email</span>
                </md-field>
                <validation-error
                  :errors="apiValidationErrors.email"
                  style="color: red"
                />
              </div>
            </div>
          </div>
          <div>
            <div class="md-layout text-center " style="color: white; ">
              <div class="md-layout-item">
                <md-field>
                  <label>Username</label>
                  <md-input v-model="user.username"></md-input>
                  <span class="md-helper-text">User Name</span>
                </md-field>
                <validation-error
                  :errors="apiValidationErrors.username"
                  style="color: red"
                />
              </div>
            </div>
          </div>
          <div>
            <div class="md-layout text-center " style="color: white; ">
              <div class="md-layout-item">
                <md-field>
                  <label>Password</label>
                  <md-input v-model="user.password">Password</md-input>
                  <span class="md-helper-text">User Password</span>
                </md-field>
                <validation-error
                  :errors="apiValidationErrors.password"
                  style="color: red"
                />
              </div>
            </div>
          </div>
          <div>
            <div class="md-layout text-center " style="color: white; ">
              <div class="md-layout-item">
                <md-field>
                  <label>Password</label>
                  <md-input v-model="user.password_confirmation"
                    >Password</md-input
                  >
                  <span class="md-helper-text">User Password</span>
                </md-field>
              </div>
            </div>
          </div>
          <div class="md-layout  " style="color: white; ">
            <div
              class="md-layout-item  "
              style="color: black; text-align: center; font-weight: bold;"
            >
              Role
            </div>
          </div>
          <div>
            <div
              class="md-layout text-center info-text"
              style="color: white;margin: 20px 0; "
            >
              <div class="md-layout-item">
                <md-radio v-model="user.role_id" :value="1">Admin</md-radio>
              </div>
              <div class="md-layout-item">
                <md-radio v-model="user.role_id" :value="2">User</md-radio>
              </div>
              <label for="roleAdmin" style="color: gray; cursor: pointer;"
                >Admin
                <input
                  type="radio"
                  v-model="user.role_id"
                  :value="1"
                  name="role"
                  id="roleAdmin"
                  style="margin-right: 50px;accent-color: purple;"
              /></label>

              <label for="roleUser" style="color: gray; cursor: pointer;"
                >User
                <input
                  type="radio"
                  v-model="user.role_id"
                  :value="2"
                  style="accent-color: purple;"
                  name="role"
                  id="roleUser"
              /></label>
            </div>
            <validation-error
              :errors="apiValidationErrors.role_id"
              style="color: red"
            />
          </div>

          <div>
            <div
              class="md-layout text-center info-text"
              style="color: white; display: flex !important; gap: 50px; align-items: center; "
            >
              <label for="avatar" class="user-avatar">
                Upload Image
                <input
                  type="file"
                  name="browse"
                  id="avatar"
                  style="display: none;"
                  @change="userImageHandler"
                />
              </label>
              <img
                v-if="user.image"
                style="position: relative !important; height: 110px; object-fit: cover;"
                :src="user.image"
                width="110"
              />
            </div>
          </div>

          <div class="md-layout  md-right">
            <div class="md-layout-item" style="margin-left: 5px;">
              <div class="md-layout md-alignment-center-space-around">
                <div
                  class="md-layout-item md-size-50"
                  style="padding-right: 0; text-align: right;"
                >
                  <md-button
                    class="md-dense md-primary "
                    style=" margin-right: 1em; "
                    @click="updateUser()"
                    >Update User</md-button
                  >
                </div>
                <div class="md-layout-item md-size-50">
                  <md-button
                    @click="closeForm(true)"
                    class="md-dense md-raised "
                    style="background-color: white !important; color: gray !important;"
                    >Cancel</md-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </md-dialog> -->

    <md-dialog :md-active.sync="showEditDialog" :md-click-outside-to-close=false>
      <md-dialog-title class="dialog-title">
        <!-- Update User
        <span class="material-icons">
          close
        </span> -->
        <div class="md-layout">
          <div class="md-layout-item md-size-10"></div>
          <div class="md-layout-item md-size-80">Update User</div>
          <div class="md-layout-item md-size-10 md-layout md-alignment-center" style="padding-right: 0;">
            <div class="material-icons" style="font-size: 25px; cursor: pointer;" @click="closeForm(true)">
              close
            </div>
          </div>
        </div>
      </md-dialog-title>
      <div class="md-layout">
        <div
          class="md-layout-item md-layout md-size-100 md-alignment-center" style="margin-bottom: 10px;"
        >
          <label for="avatar" class="user-avatar">
            Upload Image
            <input
              type="file"
              name="browse"
              id="avatar"
              style="display: none;"
              @change="userImageHandler"
            />
          </label>
          <img
            v-if="user.image"
            style=" height: 110px; object-fit: cover; border-radius: 50%; margin-left: 10px;"
            :src="user.image"
            width="110"
          />
        </div>
        <div class="md-layout-item md-layout md-size-100">
          <div class="md-layout-item md-size-50">
            <md-field>
              <label>Name</label>
              <md-input v-model="user.name"></md-input>
              <span class="md-helper-text">Name</span>
            </md-field>
            <validation-error
              :errors="apiValidationErrors.name"
              style="color: red"
            />
          </div>
          <div class="md-layout-item md-size-50">
            <md-field>
              <label>Username</label>
              <md-input v-model="user.username"></md-input>
              <span class="md-helper-text">User Name</span>
            </md-field>
            <validation-error
              :errors="apiValidationErrors.username"
              style="color: red"
            />
          </div>
        </div>
        <div class="md-layout-item md-layout  md-size-100" style="margin: 10px 0;">
          <div class="md-layout-item md-size-100">
            <md-field>
              <label>Email</label>
              <md-input v-model="user.email"></md-input>
              <span class="md-helper-text">User Email</span>
            </md-field>
            <validation-error
              :errors="apiValidationErrors.email"
              style="color: red"
            />
          </div>
        </div>
        <div class="md-layout-item md-layout md-size-100">
          <div class="md-layout-item md-size-50">
            <md-field>
              <label>Password</label>
              <md-input v-model="user.password">Password</md-input>
              <span class="md-helper-text">User Password</span>
            </md-field>
            <validation-error
              :errors="apiValidationErrors.password"
              style="color: red"
            />
          </div>
          <div class="md-layout-item md-size-50">
            <md-field>
              <label>Password</label>
              <md-input v-model="user.password_confirmation">Password</md-input>
              <span class="md-helper-text">User Password</span>
            </md-field>
          </div>
        </div>
        <div class="md-layout-item md-size-100" style="text-align: center; margin-top: 10px;">
          Role
        </div>

        <div class="md-layout-item md-layout md-size-100 md-alignment-center">
          <div class="md-layout-item  md-size-50" style="text-align: right;">
            <label for="roleAdmin" style="cursor: pointer; "
              >Admin
              <input
                type="radio"
                v-model="user.role_id"
                :value="1"
                name="role"
                id="roleAdmin"
                style="margin-right: 0px;"
            /></label>
          </div>
          <div class="md-layout-item md-size-50">
            <label for="roleUser" style=" cursor: pointer;"
              >User
              <!-- style="accent-color: purple;" -->
              <input
                type="radio"
                v-model="user.role_id"
                :value="2"
                name="role"
                id="roleUser"
            /></label>
          </div>
        </div>
        <validation-error
          :errors="apiValidationErrors.role_id"
          style="color: red"
        />

       
      </div>
      <md-dialog-actions>
        <md-button
          class="md-dense md-blue "
          style=" margin-right: 0; "
          @click="updateUser()"
          >Update User</md-button
        >
        <md-button
          @click="closeForm(true)"
          class="md-dense md-raised "
          style="background-color: white !important; color: gray !important;"
        >
          Cancel
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { ValidationError } from "@/components";
import formMixin from "@/mixins/form-mixin";

export default {
  name: "EditUserDialoge",
  components: {
    ValidationError,
  },
  mixins: [formMixin],

  props: {
    showEditDialog: Boolean,
    userId: Number,
  },

  data: () => ({
    user: {
      name: null,
      email: null,
      username: null,
      password: "",
      password_confirmation: "",
      role_id: null,
      image: null,
    },
    tmpUploadImage: null,
    isLoading: false,
  }),

  mounted() {
    let tempUser = this.$store.getters.allUsers.data.filter(
      (userID) => userID.id == this.userId
    );
    tempUser[0].role == "admin"
      ? (tempUser[0].role_id = 1)
      : (tempUser[0].role_id = 2);

    // delete tempUser[0].role;

    this.user = tempUser[0];
    this.user.password = "";
    this.user.password_confirmation = "";
  },

  methods: {
    async updateUser() {
      const formData = new FormData();

      formData.append("email", this.user.email);
      formData.append("name", this.user.name);
      formData.append("username", this.user.username);

      if (this.user.password != "" || this.user.password_confirmation != "") {
        formData.append("password", this.user.password);
        formData.append(
          "password_confirmation",
          this.user.password_confirmation
        );
      }

      formData.append("role_id", this.user.role_id);

      if (this.tmpUploadImage) {
        formData.append("image", this.tmpUploadImage);
      }

      try {
        this.isLoading = true;
        await this.$store.dispatch("updateOtherUser", {
          id: this.userId,
          user: formData,
        });
        this.isLoading = false;
        await this.$store.dispatch("alerts/success", "User updated successfully");
        this.closeForm();
      } catch (e) {
        this.isLoading = false;
        // console.log(e);
        await this.$store.dispatch("alerts/error", "error, try again");
        this.setApiValidation(e.data.errors);
      }
    },

    userImageHandler(e) {
      this.tmpUploadImage = e.target.files[0];

      var fileReader = new FileReader();

      fileReader.onload = () => {
        this.user.image = fileReader.result;
      };
      fileReader.readAsDataURL(e.target.files[0]);
    },

    closeForm(cancel = false) {
      this.resetApiValidation();
      this.$emit("closeEditDialog", false);
      if (!cancel) {
        this.$emit("getList");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.user-avatar {
  width: 150px;
  height: 40px;
  border: 1px dashed rgb(97, 92, 92);
  color: black;
  padding: 4px 2px;
  margin-block: 10px;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.dialog-title {
  background-color: #00aec5;
  color: white;
  padding: 12px 8px 12px !important;
  text-align: center;
}
</style>
