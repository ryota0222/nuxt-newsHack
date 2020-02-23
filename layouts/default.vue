<template>
  <v-app>
    <v-app-bar color="header" dense dark class="header-sticky">
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-toolbar-title
        class="font-weight-black title-color"
        :class="{titleDarkColor: this.$vuetify.theme.dark === true}"
      >
        <span style="color: #ff4d61">H</span>acker News Clone
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn @click="changeTheme" text min-width="40" min-height="40" v-on="on">
            <LightModeSvg v-if="darkMode === true" alt="ライトモードに切替" class="btn-img-size"/>
            <DarkModeSvg v-if="darkMode === false" alt="ダークモードに切替" class="btn-img-size"/>
          </v-btn>
        </template>
        <span>{{darkMode ? "ライトモードに切替" : "ダークモードに切り替え"}}</span>
      </v-tooltip>
      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group color="primary">
            <v-list-item v-for="(category, i) in getCategory" :key="i" class="pa-0">
              <v-btn
                @click="linkToPage(category.link)"
                text
                class="text-center menu-link"
              >{{category.name}}</v-btn>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <nuxt/>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import DarkModeSvg from "~/assets/images/svg/dark-mode.svg";
import LightModeSvg from "~/assets/images/svg/light-mode.svg";
export default {
  data() {
    return {
      darkMode: false
    };
  },
  components: {
    DarkModeSvg,
    LightModeSvg
  },
  computed: {
    ...mapGetters("news", ["getCategory"])
  },
  methods: {
    changeTheme() {
      this.darkMode = !this.$vuetify.theme.dark;
      this.$vuetify.theme.dark = this.darkMode;
    },
    linkToPage(link) {
      this.$store.commit("resetPageNo");
      this.$store.commit("news/clearNewsContentList");
      this.$router.push(link);
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-img-size {
  width: 30px;
  height: 30px;
}
.header-sticky {
  position: sticky;
  top: 0;
  z-index: 100000;
  flex: none !important;
}
.title-color {
  color: black;
}
.titleDarkColor {
  color: white !important;
}
.menu-link {
  display: inline-block;
  width: 100%;
  height: inherit !important;
  padding: 1rem !important;
}
</style>
