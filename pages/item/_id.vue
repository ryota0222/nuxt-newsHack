<template>
  <v-container>
    <h1 class="mb-6">記事詳細</h1>
    <v-card>
      <v-card-title>{{getNewsContent.title}}</v-card-title>
      <v-card-subtitle class="py-1">掲載時刻: {{getNewsContent.time | formatDate}}</v-card-subtitle>
      <v-card-subtitle class="py-1">記事ID: {{getNewsContent.id}}</v-card-subtitle>
      <v-card-subtitle class="py-1">
        著者:
        <nuxt-link :to="{name:'user-id',params:{id:getNewsContent.by}}">{{getNewsContent.by}}</nuxt-link>
      </v-card-subtitle>
      <v-card-subtitle class="py-1">ジャンル: {{getNewsContent.type}}</v-card-subtitle>
      <v-card-text>
        リンク:
        <a v-if="getNewsContent.url" :href="getNewsContent.url">{{getNewsContent.url}}</a>
        <span v-else>no link</span>
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
      this.$router.push("/");
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
