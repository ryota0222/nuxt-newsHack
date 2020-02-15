<template>
  <v-fab-transition>
    <v-btn
      fixed
      dark
      fab
      bottom
      right
      color="pink"
      v-show="position < pageHeight-windowHeight"
      @click="scrollToBottom"
    >
      <v-icon color="white">mdi-chevron-down</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
import jQuery from "jquery";
let $ = jQuery;
export default {
  data() {
    return {
      position: 0,
      pageHeight: Number,
      windowHeight: Number
    };
  },
  mounted() {
    // ブラウザ内の表示域取得
    this.setWindowHeight();
    // ページ全体の高さ取得
    this.setDocumentHeight();
    // スクロールを監視
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    setWindowHeight() {
      this.windowHeight = window.innerHeight;
    },
    setDocumentHeight() {
      this.pageHeight = $(document).height();
    },
    scrollToBottom() {
      this.pageHeight = $(document).height();
      // console.log("pageHeight: ", this.pageHeight);
      $("html,body").animate({ scrollTop: this.pageHeight }, "slow");
    },
    handleScroll() {
      this.position = window.scrollY;
    }
  }
};
</script>