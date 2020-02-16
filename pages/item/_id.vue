<template>
  <v-container>
    <h1 class="mb-6">記事詳細</h1>
    <v-card>
      <v-card-title>{{getNewsContent.title}}</v-card-title>
      <v-card-subtitle class="py-1">掲載時刻: {{getNewsContent.time | formatDate}}</v-card-subtitle>
      <v-card-subtitle class="py-1">記事ID: {{getNewsContent.id}}</v-card-subtitle>
      <v-card-subtitle class="py-1 d-flex align-center">
        <span class="mr-1">著者:</span>
        <v-btn
          @click="toUserPostList(getNewsContent.by)"
          text
          color="link"
          min-height="20"
          class="x-small post-link align-center d-flex"
        >
          <span class="text-left">{{getNewsContent.by}}</span>
        </v-btn>
      </v-card-subtitle>
      <v-card-subtitle class="py-1">ジャンル: {{getNewsContent.type}}</v-card-subtitle>
      <v-card-text class="py-1">テキスト: {{getNewsContent.text || "no-text"}}</v-card-text>
      <v-card-text class="py-1">コメント数: {{getNewsContent.descendants || "0"}}</v-card-text>
      <v-card-text class="py-1">スコア: {{getNewsContent.score || "no-score"}}</v-card-text>

      <!-- <v-card-text class="pb-3 pt-1">
        リンク:
        <a v-if="getNewsContent.url" :href="getNewsContent.url">{{getNewsContent.url}}</a>
        <span v-else>no link</span>
      </v-card-text>-->
      <v-card-text class="pb-3 pt-1 d-flex align-center" v-if="getNewsContent.url">
        <span class="mr-1">リンク:</span>
        <v-btn
          :href="getNewsContent.url"
          text
          link
          color="link"
          min-height="20"
          class="x-small post-link align-center py-1 px-2"
          style="max-width: calc(100% - 50px); !important"
        >
          <span class="text-left">{{getNewsContent.url}}</span>
        </v-btn>
      </v-card-text>
    </v-card>
    <v-btn @click="goBackList" color="primary" fixed right bottom class="mb-4 mr-4">一覧に戻る</v-btn>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  created() {
    this.$store.commit("news/setNewsContent", this.$route.params.id);
  },
  computed: {
    ...mapGetters("news", ["getNewsContent"])
  },
  methods: {
    goBackList() {
      this.$router.go(-1);
    },
    toUserPostList(link) {
      this.$store.commit("news/clearNewsContentList");
      this.$store.commit("resetPageNo");
      this.$router.push({ name: "user-id", params: { id: link } });
    }
  },
  filters: {
    formatDate(unixTime) {
      let dateTime = new Date(Number(unixTime) * 1000);
      return (
        dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString()
      );
    }
  },
  head() {
    return {
      title: "Detail"
    };
  }
};
</script>