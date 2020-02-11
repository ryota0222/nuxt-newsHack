<template>
  <v-container>
    <div class="text-center" v-if="getNewsContentList.length === 0">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>

      <v-progress-circular indeterminate color="red"></v-progress-circular>

      <v-progress-circular indeterminate color="purple"></v-progress-circular>

      <v-progress-circular indeterminate color="green"></v-progress-circular>

      <v-progress-circular indeterminate color="amber"></v-progress-circular>
    </div>
    <div v-else-if="getNewsContentList.length > 0">
      <v-list-item v-for="(contents, i) in getNewsContentList" :key="i">
        <v-list-item-content>
          <v-list-item-title>{{cotents.title}}</v-list-item-title>
          <a :href="contents.url">{{contents.url}}</a>
        </v-list-item-content>
      </v-list-item>
      <v-pagination v-model="page" class="my-4" :length="getNewsIdList.length" total-visible="10"></v-pagination>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
// API
// 一覧のIDを取得する
const latest_news_id_url =
  "https://hacker-news.firebaseio.com/v0/newstories.json";
export default {
  data() {
    return {
      page: 1
    };
  },
  computed: {
    ...mapGetters("news", [
      "getNewsContentList",
      "getNewsIdList",
      "getContentLoadingState"
    ])
  },
  watch: {
    page() {
      this.$store.dispatch(
        "news/fetchContentsFromId",
        this.getNewsIdList[this.page]
      );
      console.log(getContentLoadingState);
    }
  },
  head() {
    return {
      title: "Home"
    };
  },
  async fetch({ store, params }) {
    await store.dispatch("news/fetchNewsId", latest_news_id_url);
  },

  methods: {}
};
</script>
