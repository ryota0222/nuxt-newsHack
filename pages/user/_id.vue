<template>
  <v-container>
    <h1 class="mb-6 ml-4">
      {{$route.params.id}}の記事一覧
      <!-- <span
        style="font-size: 1.2rem"
      >(表示件数：{{getUserPostInfo.submitted.length > 100 ? getUserPostInfo.submitted.length+"件中100件" : getUserPostInfo.submitted.length+"件"}})</span>-->
    </h1>
    <p class="ml-4">ユーザー作成日: {{getUserPostInfo.created | formatDate}}</p>

    <v-btn @click="toLatestContentPage" color="primary" fixed right bottom class="mb-4 mr-4">一覧に戻る</v-btn>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  created() {
    // API
    // ユーザー別一覧のIDを取得する
    const user_posting_url =
      "https://hacker-news.firebaseio.com/v0/user/" +
      this.$route.params.id +
      ".json?print=pretty";
    this.$store.dispatch("news/fetchUserPosting", user_posting_url);
  },
  mounted() {
    // console.log(this.getUserPostInfo.submitted.length);
  },
  computed: {
    ...mapGetters("news", ["getUserPostInfo"])
  },
  methods: {
    toLatestContentPage() {
      this.$store.commit("news/clearNewsContentList");
      this.$router.push("/");
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
