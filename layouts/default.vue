<template>
  <v-app>
    <v-app-bar color="header" dense dark class="header-sticky">
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-toolbar-title
        class="font-weight-black title-color"
        :class="{titleDarkColor: darkMode === true}"
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
            <v-list-item v-for="(category, i) in getCategory" :key="i">
              <nuxt-link :to="category.link" class="pa-3 text-center menu-link">{{category.name}}</nuxt-link>
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
  color: white;
}
.menu-link {
  display: inline-block;
  width: 100%;
  height: 100%;
  text-decoration: none;
}
</style>
