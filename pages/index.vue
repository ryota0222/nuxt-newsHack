<template>
  <v-container>
    <h1 class="mb-6 ml-4">最新記事一覧</h1>
    <div class="text-center" v-if="getNewsContentList.length === 0">
      <template v-for="(contents, i) in getPostNumberPerPage" link>
        <v-col :key="i" cols="12" md="4">
          <v-card elevation="6">
            <v-skeleton-loader ref="skeleton" type="article" class="mx-auto"></v-skeleton-loader>
          </v-card>
        </v-col>
      </template>
    </div>
    <div v-else-if="getNewsContentList.length > 0">
      <template v-for="(contents, i) in getNewsContentList" link>
        <v-col :key="i" cols="12" md="4">
          <v-hover v-slot:default="{ hover }">
            <div class="card-wrapper" @click="toContentDetail(contents.id)">
              <v-card :elevation="hover ? 10 : 2" :class="{ 'on-hover': hover }">
                <v-card-title class="pb-0 d-flex justify-sm-space-between">
                  <span class="title">{{ contents.title }}</span>
                  <span style="font-size: 0.8rem;">{{contents.time | formatDate}}</span>
                </v-card-title>
                <v-card-text>
                  Link:
                  <a
                    href="javascript:void(0)"
                    @click.prevent="toPostingArticle(contents.url)"
                    v-if="contents.url"
                  >{{contents.url}}</a>
                  <span v-else>no link</span>
                </v-card-text>
              </v-card>
            </div>
          </v-hover>
        </v-col>
      </template>
      <v-pagination v-model="page" class="my-4" :length="getNewsIdList.length" total-visible="10"></v-pagination>
    </div>
    <v-fab-transition>
      <v-btn
        fixed
        dark
        fab
        bottom
        right
        color="pink"
        v-show="position < pageHeight*2/3"
        @click="scrollToBottom"
      >
        <!-- <v-icon color="white">mdi-expand_less</v-icon> -->
        <v-icon color="white">mdi-chevron-down</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import jQuery from "jquery";
let $ = jQuery;
// API
// 一覧のIDを取得する
const latest_news_id_url =
  "https://hacker-news.firebaseio.com/v0/newstories.json";
export default {
  data() {
    return {
      page: 1,
      position: 0,
      pageHeight: Number
    };
  },
  created() {
    this.page = this.getPageNo;
    if (this.getNewsIdList.length === 0) {
      console.log("zero");
      this.$store.dispatch("news/fetchNewsId", latest_news_id_url);
    }
  },
  computed: {
    ...mapGetters(["getPageNo"]),
    ...mapGetters("news", [
      "getNewsContentList",
      "getNewsIdList",
      "getPostNumberPerPage"
    ])
  },
  watch: {
    page() {
      // console.log("id: ", this.getNewsIdList[this.page][0]);
      // console.log("content: ", this.getNewsContentList[0].id);
      if (this.getNewsIdList[this.page][0] !== this.getNewsContentList[0].id) {
        this.$store.dispatch(
          "news/fetchContentsFromId",
          this.getNewsIdList[this.page]
        );
        window.scrollTo(0, 0);
      }
      // console.log(getContentLoadingState);
    }
  },
  head() {
    return {
      title: "最新記事一覧"
    };
  },
  // async fetch({ store, params }) {
  //   await store.dispatch("news/fetchNewsId", latest_news_id_url);
  // },
  mounted() {
    this.pageHeight = $(document).height();
    window.addEventListener("scroll", this.handleScroll);
    // console.log("pageHeight: ", this.pageHeight);
  },
  methods: {
    scrollToBottom() {
      this.pageHeight = $(document).height();
      $("html,body").animate({ scrollTop: this.pageHeight }, "slow");
    },
    handleScroll() {
      this.position = window.scrollY;
      // console.log("position: ", this.position);
    },
    toPostingArticle(link) {
      // location.href = link;
      window.open(link, "_blank");
    },
    toContentDetail(contentsId) {
      this.$store.commit("stashPageNo", this.page);
      this.$router.push({ name: "item-id", params: { id: contentsId } });
    }
  },
  filters: {
    formatDate(unixTime) {
      let dateTime = new Date(Number(unixTime) * 1000);
      return (
        dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString()
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.card-wrapper {
  &:hover {
    cursor: pointer;
  }
}
</style>
