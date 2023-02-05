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
            <md-button class="md-success md-dense" @click="showDialog = true">
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
                <p v-else class="pl-20">No Image</p>
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

          <!-- <div class="footer-table md-table">
            <table>
              <tfoot>
                <tr>
                  <th
                    v-for="item in footerTable"
                    :key="item.name"
                    class="md-table-head"
                  >
                    <div class="md-table-head-container md-ripple md-disabled">
                      <div class="md-table-head-label">
                        {{ item }}
                      </div>
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div> -->
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
    <!-- <div>
      <md-dialog
        :md-active.sync="showDialog"
        style="margin:0 auto; z-index: 9999;"
        :md-click-outside-to-close="false"
      >
        <div class="dialog-content" style="margin-bottom: 10px ;">
          <div style="margin: 0 auto; width: 550px;">
            <div>
              <div class="md-layout  " style="color: #fff;  ">
                <div
                  class="md-layout-item header "
                  style="background-color: #9124A3 !important; padding: 8px 10px; text-align: center;"
                >
                  New User
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
                    <label>Confirm Password</label>
                    <md-input v-model="user.password_confirmation"
                      >Password</md-input
                    >
                    <span class="md-helper-text">Confirm Password</span>
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
                style="color: white; "
              >
                <div class="md-layout-item">
                  <md-radio v-model="user.role_id" :value="1">admin</md-radio>
                </div>
                <div class="md-layout-item">
                  <md-radio v-model="user.role_id" :value="2" class="md-primary"
                    >user</md-radio
                  >
                </div>
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
                  v-if="user.imageUserSrc"
                  style="position: relative !important; height: 110px; border-radius: 50%;"
                  :src="user.imageUserSrc"
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
                      @click="createUser()"
                      >Create User</md-button
                    >
                  </div>
                  <div class="md-layout-item md-size-50">
                    <md-button
                      @click="closeForm()"
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
      </md-dialog>
    </div> -->
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

        <div class="md-layout">
          <div class="md-layout-item md-layout md-size-100 md-alignment-center">
            <label for="avatar" class="user-avatar">
              Upload Image
              <input
                type="file"
                accept=".png,.jpeg,.jpg"
                name="browse"
                id="avatar"
                style="display: none;"
                @change="userImageHandler"
              />
            </label>
            <img
              v-if="user.imageUserSrc"
              style="position: relative !important; height: 110px; border-radius: 50%; margin-left: 10px;"
              :src="user.imageUserSrc"
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { ValidationError } from "@/components";
import formMixin from "@/mixins/form-mixin";
import EditUserDialoge from "./EditUserDialoge";
import { LoaderFull } from "../../../../components";

export default {
  name: "DialogCustom",
  components: {
    pagination: Pagination,
    ValidationError,
    EditUserDialoge,
    LoaderFull,
  },
  mixins: [formMixin],

  data: () => ({
    user: {
      name: null,
      email: null,
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
        if (confirm("are you sure want to delete this user")) {
          this.isLoading = true;
          let deleteRes = await this.$store.dispatch("deleteUser", userId);

          await this.getList(this.userMeta.current_page);

          this.isLoading = false;
          await this.$store.dispatch("alerts/warning", "User Deleted");
        }
      } catch (e) {
        this.isLoading = false;
        await this.$store.dispatch("alerts/error", "Something went wrong");
      }
    },

    userImageHandler(e) {
      this.user.image = e.target.files[0];

      var fileReader = new FileReader();

      fileReader.onload = () => {
        this.user.imageUserSrc = fileReader.result;
      };
      fileReader.readAsDataURL(e.target.files[0]);
    },

    resetInputs() {
      this.user.name = null;
      this.user.email = null;
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

    closeForm() {
      this.resetInputs();
      this.showDialog = false;
      this.resetApiValidation();
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
</style>
