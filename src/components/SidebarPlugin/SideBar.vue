<template>
  <div
    class="sidebar"
    :data-color="activeColor"
    :data-image="backgroundImage"
    :data-background-color="backgroundColor"
    :style="sidebarStyle"
  >
    <div class="logo">
      <a href="#" class="simple-text logo-mini">
        <div style="padding: 4px 0;">
          DB
        </div>
      </a>
      <a href="#" class="simple-text logo-normal" target="_blank">
        <template v-if="$route.meta.rtlActive">{{ rtlTitle }}</template>
        <template v-else>{{ title }}</template>
      </a>
      <div class="navbar-minimize xxx" style="width: 40px;">
        <md-button
          id="minimizeSidebar"
          class="md-round md-just-icon md-transparent"
          @click="minimizeSidebar"
        >
          <i class="material-icons text_align-center visible-on-sidebar-regular"
            >close</i
          >
          <i
            class="material-icons design_bullet-list-67 visible-on-sidebar-mini"
            >menu</i
          >
        </md-button>
      </div>
    </div>
    <div
      class="sidebar-wrapper"
      style="overflow-x: hidden !important;"
      ref="sidebarScrollArea"
    >
      <slot></slot>
      <md-list class="nav">
        <slot name="links">
          <sidebar-item
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :link="link"
          >
            <sidebar-item
              v-for="(subLink, index) in link.children"
              :key="subLink.name + index"
              :link="subLink"
            >
            </sidebar-item>
          </sidebar-item>
        </slot>
      </md-list>
    </div>
  </div>
</template>
<script>
export default {
  name: "sidebar",
  props: {
    title: {
      type: String,
      default: "Creative Tim",
    },
    rtlTitle: {
      type: String,
      default: "توقيت الإبداعية",
    },
    activeColor: {
      type: String,
      default: "green",
      validator: (value) => {
        let acceptedValues = [
          "",
          "purple",
          "azure",
          "green",
          "orange",
          "danger",
          "rose",
        ];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    backgroundImage: {
      type: String,
      default: `${process.env.VUE_APP_BASE_URL}/img/sidebar-2.jpg`,
    },
    backgroundColor: {
      type: String,
      default: "black",
      validator: (value) => {
        let acceptedValues = ["", "black", "white", "red"];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    logo: {
      type: String,
      default: `${process.env.VUE_APP_BASE_URL}/img/vue-logo.png`,
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.$sidebar.toggleMinimize();
    setTimeout(() => {
      this.minimizeSidebar();
    }, 200);
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  methods: {
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    },
  },
  computed: {
    sidebarStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`,
      };
    },
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  },
};
</script>
<style>
@media (min-width: 992px) {
  .navbar-search-form-mobile,
  .nav-mobile-menu {
    display: none;
  }
}

.xxx {
  position: fixed !important;
  left: 200px !important;
  top: 8px !important;
}
</style>
