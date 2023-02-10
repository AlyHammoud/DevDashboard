<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>assignment</md-icon>
          </div>
          <h4 class="title">Users List</h4>
        </md-card-header>
        <md-card-content>
          <div class="text-right">
            <md-button class="md-success md-dense" @click="showAddDialog">
              Add User
            </md-button>
          </div>
          <md-table
            :value="table"
            :md-sort.sync="sortation.field"
            :md-sort-order.sync="sortation.order"
            :md-sort-fn="customSort"
            class="paginated-table table-striped table-hover"
          >
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Role" md-sort-by="role">
                <p class="pl-20">
                  {{ item.role }}
                </p>
              </md-table-cell>
              <md-table-cell md-label="Name" md-sort-by="name"
                ><p class="pl-20">
                  {{ item.name }}
                </p></md-table-cell
              >
              <md-table-cell md-label="Email" md-sort-by="email"
                ><p class="pl-20">
                  {{ item.email }}
                </p></md-table-cell
              >

              <md-table-cell md-label="Avatar">
                <img
                  v-if="item.image"
                  :src="item.image"
                  style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-left: 20px;  "
                />

                <div
                  v-else
                  style="width: 50px; height: 50px; border-radius: 50%;margin-left: 20px; background-color: pink; display: grid; place-items: center; color: #fff; font-size: 1.8em; font-weight: 700;"
                  :style="{
                    'background-color':
                      '#' + Math.floor(Math.random() * 16777215).toString(16),
                  }"
                >
                  {{
                    item.name.split(" ").length > 1
                      ? item.name.split(" ")[0][0].toUpperCase() +
                        " " +
                        item.name.split(" ")[1][0].toUpperCase()
                      : item.name[0].toUpperCase() +
                        " " +
                        item.name[1].toUpperCase()
                  }}
                </div>
              </md-table-cell>

              <md-table-cell md-label="Created At" md-sort-by="created_at"
                ><p style="padding-left: 30px;">
                  {{ new Date(item.created_at).toLocaleDateString() }}
                </p></md-table-cell
              >
              <md-table-cell
                md-label="Actions"
                v-if="$store.getters.myUser.role == 'admin'"
              >
                <div style="text-align: center; margin-right: 26px !important;">
                  <md-button
                    class="md-icon-button md-raised md-round md-info"
                    @click="editUser(item.id)"
                    style="margin-right: 4px;"
                  >
                    <md-icon>edit</md-icon>
                  </md-button>
                  <md-button
                    class="md-icon-button md-raised md-round md-danger mr-2"
                    @click="deleteUser(item.id)"
                  >
                    <md-icon>delete</md-icon>
                  </md-button>
                </div>
              </md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>

        <md-card-actions md-alignment="space-between">
          <pagination
            v-if="userMeta"
            class="pagination-no-border pagination-success"
            :pageCount="userMeta.last_page"
            :perPage="userMeta.per_page"
            :total="userMeta.total"
            :value="userMeta.current_page"
            @input="getList"
          />
        </md-card-actions>
      </md-card>
    </div>
    <LoaderFull v-if="isLoading"></LoaderFull>
    <div>
      <EditUserDialoge
        v-if="showEditDialog"
        :showEditDialog="showEditDialog"
        :userId="userId"
        @closeEditDialog="showEditDialog = false"
        @getList="getList(userMeta.current_page)"
      ></EditUserDialoge>
    </div>

    <div>
      <md-dialog
        :md-active.sync="showDialog"
        :md-click-outside-to-close="false"
      >
        <md-dialog-title
          class="dialog-title"
          style="background-color: #4caf50 !important;"
        >
          <div class="md-layout">
            <div class="md-layout-item md-size-10"></div>
            <div class="md-layout-item md-size-80">Add User</div>
            <div
              class="md-layout-item md-size-10 md-layout md-alignment-center"
              style="padding-right: 0;"
            >
              <div
                class="material-icons"
                style="font-size: 25px; cursor: pointer;"
                @click="closeForm()"
              >
                close
              </div>
            </div>
          </div></md-dialog-title
        >

        <div class="md-layout" style="overflow-y: scroll;">
          <div class="image-uploaders">
            <div class="image-uploaders-wrapper">
              <img
                :src="
                  user.imageUserSrc ? user.imageUserSrc : imgUrl('no-image.jpg')
                "
                alt=""
              />
              <label for="avatar" class="user-avatar">
                Upload Image
                <input
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  name="browse"
                  id="avatar"
                  ref="userImageRef"
                  style="display: none;"
                  @change="userImageHandler"
                />
                <md-icon class="img-icon">add</md-icon>
              </label>
            </div>
            <label for="" @click="removeTmpImage">
              <md-icon v-if="user.imageUserSrc" class="img-icon-delete"
                >delete</md-icon
              >
            </label>
            <validation-error
              :errors="apiValidationErrors.image"
              style="color: red"
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
          <div class="md-layout-item md-layout md-size-100">
            <div class="md-layout-item md-size-50">
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
            <div class="md-layout-item md-size-50">
              <md-field>
                <label>Phone</label>
                <md-input v-model="user.mobileNumber">Phone number</md-input>
                <span class="md-helper-text">phone number</span>
              </md-field>
              <validation-error
                :errors="apiValidationErrors.mobile"
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
                <label>Confirm Password</label>
                <md-input v-model="user.password_confirmation"
                  >Password</md-input
                >
                <span class="md-helper-text">Confirm Password</span>
              </md-field>
              <validation-error
                :errors="apiValidationErrors.password"
                style="color: red"
              />
            </div>
          </div>
          <div
            class="md-layout-item md-layout md-size-100 md-alignment-center"
            style="margin-top: 10px;"
          >
            Role
          </div>
          <div class="md-layout-item md-layout md-size-100 md-alignment-center">
            <div
              class="md-layout-item md-size-50"
              style="text-align: right; padding-right:0 ;"
            >
              <md-radio v-model="user.role_id" :value="1">admin</md-radio>
            </div>
            <div class="md-layout-item md-size-50">
              <md-radio v-model="user.role_id" :value="2" class="md-primary"
                >user</md-radio
              >
            </div>
            <validation-error
              :errors="apiValidationErrors.role_id"
              style="color: red"
            />
          </div>
        </div>
        <md-dialog-actions>
          <md-button
            class="md-dense md-success"
            style=" margin-right: 0; "
            @click="createUser()"
            >Create User</md-button
          >
          <md-button
            @click="closeForm()"
            class="md-dense md-raised "
            style="background-color: white !important; color: gray !important;"
            >Cancel</md-button
          >
        </md-dialog-actions>
      </md-dialog>
    </div>
    <AlertDialoge ref="showAlertDialog"></AlertDialoge>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { ValidationError } from "@/components";
import formMixin from "@/mixins/form-mixin";
import EditUserDialoge from "./EditUserDialoge";
import { LoaderFull } from "../../../../components";
import { AlertDialoge } from "@/components";

var images = require.context("../../../../assets/images/", false, /\.jpg$/);

export default {
  name: "DialogCustom",
  components: {
    pagination: Pagination,
    ValidationError,
    EditUserDialoge,
    LoaderFull,
    AlertDialoge,
  },
  mixins: [formMixin],

  data: () => ({
    user: {
      name: "",
      email: null,
      mobileNumber: "",
      username: null,
      password: null,
      password_confirmation: null,
      role_id: 2,
      image: null,
      imageUserSrc: "",
    },

    userMeta: null,
    showDialog: false,
    table: [],
    footerTable: ["Role", "Name", "Email", "Created At", "Actions"],
    showEditDialog: false,
    userId: null,
    isLoading: false,

    query: null,
    sortation: {
      field: "created_at",
      order: "asc",
    },
    total: 1,
  }),

  computed: {
    sort() {
      if (this.sortation.order === "desc") {
        return `-${this.sortation.field}`;
      }

      return this.sortation.field;
    },
  },

  created() {
    this.getList();
  },

  methods: {
    avatarName() {},

    imgUrl: function(path) {
      return images("./" + path);
    },

    removeTmpImage() {
      this.user.image = "";
      this.user.imageUserSrc = "";
    },

    async getList(page = 1) {
      this.isLoading = true;
      await this.$store.dispatch("getAllUsers", page);
      this.table = await this.$store.getters.allUsers.data;
      this.userMeta = this.$store.getters.allUsers.meta;
      this.isLoading = false;
    },

    async createUser() {
      const formData = new FormData();

      formData.append("email", this.user.email);
      formData.append("name", this.user.name);
      formData.append("username", this.user.username);
      formData.append("mobile", this.user.mobileNumber);
      formData.append("password", this.user.password);
      formData.append("password_confirmation", this.user.password_confirmation);
      formData.append("role_id", Number(this.user.role_id));
      if (this.user.image) {
        formData.append("image", this.user.image);
      }
      // for (let x of formData.entries()) {
      //   console.log(x);
      // }
      // return;
      try {
        this.isLoading = true;
        await this.$store.dispatch("createUser", formData); //this.user

        this.isLoading = false;
        await this.getList(1);
        this.closeForm();
        await this.$store.dispatch("alerts/success", "User added successfully");
      } catch (e) {
        // console.log(e);
        this.isLoading = false;
        await this.$store.dispatch("alerts/error", "error, try again");
        this.setApiValidation(e.data.errors);
      }
    },

    editUser(userIdd) {
      this.showEditDialog = !this.showEditDialog;
      this.userId = userIdd;
    },

    async deleteUser(userId) {
      try {
        if (userId == 1) {
          await this.$store.dispatch("alerts/error", "can't delete Super user");

          return;
        }
        const alert = await this.$refs.showAlertDialog.response("Delete User",
          "Are you sure want to delete? "
        );
        if (alert) {
          this.isLoading = true;
          let deleteRes = await this.$store.dispatch("deleteUser", userId);

          await this.getList(this.userMeta.current_page);

          this.isLoading = false;
          await this.$store.dispatch("alerts/success", "User Deleted");
        }
      } catch (e) {
        this.isLoading = false;
        await this.$store.dispatch("alerts/error", "Something went wrong");
      }
    },

    userImageHandler(e) {
      this.user.image = e.target.files[0];

      if (this.user.image != undefined) {
        var fileReader = new FileReader();

        fileReader.onload = () => {
          this.user.imageUserSrc = fileReader.result;
        };
        fileReader.readAsDataURL(e.target.files[0]);
      }
    },

    resetInputs() {
      this.user.name = null;
      this.user.email = null;
      this.user.mobileNumber = "";
      this.user.username = null;
      this.user.password = null;
      this.user.password_confirmation = null;
      this.user.role_id = 2;
      this.user.image = null;
      this.user.imageUserSrc = "";
    },

    customSort() {
      if (this.sort[0] == "-") {
        let xx = this.sort.substring(1);

        function compare(a, b) {
          if (a[xx] < b[xx]) {
            return 1;
          }
          if (a[xx] > b[xx]) {
            return -1;
          }
          return 0;
        }
        this.table.sort(compare);

        return;
      }

      this.table.sort((a, b) =>
        a[this.sort] > b[this.sort] ? 1 : b[this.sort] > a[this.sort] ? -1 : 0
      );
    },

    showAddDialog() {
      this.showDialog = true;
    },

    closeForm() {
      this.resetInputs();
      this.showDialog = false;
      this.resetApiValidation();
    },

    randomColorGenerator() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
  },
};
</script>
<style lang="scss">
.md-dialog .md-dialog-container {
  max-width: 900px !important;
  width: 900px !important;
  border-radius: 5px !important;
}
#pro-feature {
  font-weight: bold;
}

.header {
  background-color: #aa35ff;
  margin: 0 0 5px 0;
  text-align: left;
  font-size: 20px;
  font-weight: bold;
}
.md-checkbox {
  display: flex;
}

.border-radius {
  border-radius: 100px !important;
}

.dialog-content {
  overflow-y: auto;
  overflow-x: hidden;
}

.dialog-content::-webkit-scrollbar {
  width: 10px;
  background-color: transparent;
}

.dialog-content::-webkit-scrollbar-thumb {
  background-color: #30303099;
  border-radius: 60px;
}

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

.pl-20 {
  padding-left: 20px;
}

.dialog-title {
  background-color: #4caf50;
  color: white;
  padding: 12px 8px 12px !important;
  text-align: center;
}

.image-uploaders {
  margin: 0 auto;
  height: 150px;
  width: 150px;
  position: relative;
  &-wrapper {
    width: 100% !important;
    height: 100% !important;
    overflow: hidden;
    border-radius: 50%;
    margin-bottom: 30px;
    position: relative;

    img {
      width: 100% !important;
      height: 100% !important;
    }
    .img-icon {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      cursor: pointer;
      background-color: rgba(52, 216, 30, 0.6);
      color: white !important;
      transition: all 0.6s;

      &:hover {
        height: 40%;
        background-color: rgba(52, 216, 30, 0.9);
      }
    }
  }

  .img-icon-delete {
    position: absolute;
    top: 10px;
    right: 5px;
    cursor: pointer;
    width: 24px !important;
    height: 24px;
    color: red;
    font-size: 2em;
    z-index: 333;
    pointer-events: all;
  }
}
</style>
