<template>
  <div class="user">
    <div class="photo">
      <img
        v-if="image"
        :src="image"
        alt="avatar"
        style="width: 100%; height: 100%;"
      />
      <div
        v-else
        :style="{
          'background-color':
            '#' +
            Math.floor(Math.random() * 16777215).toString(16) +
            ' !important',
        }"
        style="display: grid; place-items: center; color: #fff; width: 100%; height: 100%;"
      >
        {{ imageAvatar }}
      </div>
    </div>
    <div class="user-info">
      <a
        data-toggle="collapse"
        :aria-expanded="!isClosed"
        @click.stop="toggleMenu"
        @click.capture="clicked"
      >
        <span v-if="$route.meta.rtlActive">
          {{ rtlTitle }}
          <b class="caret"></b>
        </span>
        <span v-else>
          {{ title }}
          <b class="caret"></b>
        </span>
      </a>

      <collapse-transition>
        <div v-show="!isClosed">
          <ul class="nav">
            <slot>
              <li>
                <a v-if="$route.meta.rtlActive" @click="goToProfile">
                  <span class="sidebar-mini">مع</span>
                  <span class="sidebar-normal">ملف</span>
                </a>
                <a v-else @click="goToProfile">
                  <span class="sidebar-mini">MP</span>
                  <span class="sidebar-normal">My Profile</span>
                </a>
              </li>
              <li>
                <a v-if="$route.meta.rtlActive" @click="logout">
                  <span class="sidebar-mini">و</span>
                  <span class="sidebar-normal">إعدادات</span>
                </a>
                <a v-else @click="logout">
                  <span class="sidebar-mini">L</span>
                  <span class="sidebar-normal">Logout</span>
                </a>
              </li>
            </slot>
          </ul>
        </div>
      </collapse-transition>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isClosed: true,
      title: "Profile",
      image: null,
      rtlTitle: "تانيا أندرو",
      avatar: process.env.VUE_APP_BASE_URL + "/img/faces/marc.jpg",
      imageAvatar: null,
    };
  },

  async created() {
    this.$store.watch(
      () => this.$store.getters["myUser"],
      (me) => {
        this.title = me.name;
        this.image = me.image;
      }
    );
    await this.$store.dispatch("myUser");
    if (!this.image) {
      var name = this.title.split(" ");
      name.length > 1
        ? (this.imageAvatar =
            name[0][0].toUpperCase() + " " + name[1][0].toUpperCase())
        : (this.imageAvatar = name[0][0].toUpperCase() + " T");
    }
  },

  methods: {
    clicked: function(e) {
      e.preventDefault();
    },
    toggleMenu: function() {
      this.isClosed = !this.isClosed;
    },
    goToProfile() {
      var path = this.$route.name;
      if (this.$route.name != "User Profile")
        this.$router.push({ name: "User Profile" });
    },
    async logout() {
      await this.$store.dispatch("logout");
    },
  },
};
</script>
<style>
.collapsed {
  transition: opacity 1s;
}
</style>
