<template>
  <v-container>
    <h1 class="my-6 ml-4">
      {{$route.params.id}}の記事一覧
      <span
        class="ml-6"
        style="font-size: 1.2rem"
        v-if="this.isEmpty(getUserPostInfo) !== true"
      >(表示件数：{{getUserPostInfo.submitted.length > 100 ? getUserPostInfo.submitted.length+"件中100件" : getUserPostInfo.submitted.length+"件"}})</span>
    </h1>
    <p
      class="ml-4"
      v-if="this.isEmpty(getUserPostInfo) !== true"
    >ユーザー作成日: {{getUserPostInfo.created | formatDate }}</p>
    <!-- ローディング中 -->
    <div class="text-center d-flex flex-wrap" v-if="getNewsContentList.length === 0">
      <template v-for="(contents, i) in getPostNumberPerPage" link>
        <v-col :key="i" cols="12" md="4">
          <v-card elevation="6">
            <v-skeleton-loader ref="skeleton" type="article" class="mx-auto"></v-skeleton-loader>
          </v-card>
        </v-col>
      </template>
    </div>
    <!-- 記事一覧 -->
    <div v-else-if="getNewsContentList.length > 0" class="d-flex flex-wrap">
      <template v-for="(contents, i) in getNewsContentList" link>
        <v-col :key="i" cols="12" md="4">
          <v-hover v-slot:default="{ hover }">
            <div class="card-wrapper" @click="toContentDetail(contents.id)">
              <v-card
                :elevation="hover ? 10 : 2"
                :class="{ 'on-hover': hover }"
                class="d-flex flex-column justify-space-between"
              >
                <v-card-title class="pb-0 d-flex flex-column align-start">
                  <span class="title">{{ contents.title || "no-title" }}</span>
                  <span style="font-size: 0.8rem;">{{contents.time | formatDate}}</span>
                </v-card-title>
                <v-card-text class="d-flex align-center">
                  <span class="mr-1">Link:</span>
                  <v-btn
                    v-if="contents.url"
                    @click.prevent.stop="toPostingArticle(contents.url)"
                    text
                    color="link"
                    min-height="20"
                    class="x-small post-link align-center py-1 px-2"
                  >
                    <span class="text-left">{{contents.url}}</span>
                  </v-btn>
                  <span v-else>no-link</span>
                </v-card-text>
              </v-card>
            </div>
          </v-hover>
        </v-col>
      </template>
      <v-pagination
        v-model="page"
        class="my-4"
        :length="getUserPostIdList.length"
        total-visible="5"
      ></v-pagination>
    </div>
    <!-- ページ最下部に移動するボタン -->
    <page-scroll-button></page-scroll-button>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import PageScrollButton from "~/components/PageScrollButton";
export default {
  components: {
    PageScrollButton
  },
  data() {
    return {
      page: 1
    };
  },
  created() {
    console.log(this.getUserPostInfo.submmited);
    // ページを離れる前のページネーションを取得
    this.page = this.getPageNo;
    // API
    // ユーザー別一覧のIDを取得する
    const user_posting_url =
      "https://hacker-news.firebaseio.com/v0/user/" +
      this.$route.params.id +
      ".json?print=pretty";
    if (this.getNewsContentList.length === 0) {
      this.$store.dispatch("news/fetchUserPosting", user_posting_url);
    }
  },
  computed: {
    ...mapGetters(["getPageNo"]),
    ...mapGetters("news", [
      "getUserPostInfo",
      "getNewsContentList",
      "getPostNumberPerPage",
      "getUserPostIdList"
    ])
  },
  watch: {
    page() {
      // ページの切り替えをトリガーに次のコンテンツを取得しにいく
      if (
        this.getUserPostIdList[this.page - 1][0] !==
        this.getNewsContentList[0].id
      ) {
        this.$store.dispatch(
          "news/fetchContentsFromId",
          this.getUserPostIdList[this.page - 1]
        );
        window.scrollTo(0, 0);
      }
    }
  },
  methods: {
    toPostingArticle(link) {
      window.open(link, "_blank");
    },
    toContentDetail(contentsId) {
      this.$store.commit("stashPageNo", this.page);
      this.$router.push({ name: "item-id", params: { id: contentsId } });
    },
    isEmpty(obj) {
      return !Object.keys(obj).length;
    }
  },
  head() {
    return {
      title: "ユーザー別記事一覧"
    };
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