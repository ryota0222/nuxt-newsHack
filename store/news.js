export const state = () => ({
  // common
  category: [
    {
      name: "NEW",
      link: "/",
      api: "https://hacker-news.firebaseio.com/v0/newstories.json"
    },
    {
      name: "TOP",
      link: "/top",
      api: "https://hacker-news.firebaseio.com/v0/topstories.json"
    },
    {
      name: "BEST",
      link: "/best",
      api: "https://hacker-news.firebaseio.com/v0/beststories.json"
    },
    {
      name: "ASK",
      link: "/ask",
      api: "https://hacker-news.firebaseio.com/v0/askstories.json"
    },
    {
      name: "SHOW",
      link: "/show",
      api: "https://hacker-news.firebaseio.com/v0/showstories.json"
    },
    {
      name: "JOB",
      link: "/job",
      api: "https://hacker-news.firebaseio.com/v0/jobstories.json"
    }
  ],
  // 最新記事一覧

  // 記事詳細

  // ユーザー別記事一覧
  newsIdList: [],
  newsContentList: [],
  newsContent: Object,
  userPostInfo: Object,
  userPostIdList: [],
  postNumberPerPage: 20
});

export const getters = {
  getNewsIdList: state => state.newsIdList,
  getNewsContentList: state => state.newsContentList,
  getNewsContent: state => state.newsContent,
  getUserPostInfo: state => state.userPostInfo,
  getPostNumberPerPage: state => state.postNumberPerPage,
  getCategory: state => state.category
};
export const mutations = {
  setNewsIdList(state, list) {
    state.newsIdList = list;
  },
  setNewsContentList(state, list) {
    state.newsContentList = list;
  },
  setNewsContent(state, id) {
    state.newsContent = state.newsContentList.filter(
      content => content.id === id
    )[0];
    // console.log(state.newsContent);
  },
  clearNewsContentList(state) {
    state.newsContentList = [];
  },
  setUserPostInfo(state, data) {
    state.userPostInfo = data;
    // console.log(data.submitted[0]);
  },
  setUserPostIdList(state, data) {
    state.userPostIdList = data;
  }
};

export const actions = {
  async fetchNewsId({ dispatch, commit, state }, url) {
    const newsId = await this.$axios.$get(url);
    const shapedList = await dispatch("cutList", {
      list: newsId,
      sliceNumber: state.postNumberPerPage
    });
    commit("setNewsIdList", shapedList);
  },
  async fetchNewsContent({ dispatch, commit }, url) {
    const newsContent = await this.$axios.$get(url);
    return newsContent;
  },
  async cutList({ dispatch, commit }, payload) {
    const originalList = payload.list;
    const repeatNum = Math.ceil(payload.list.length / payload.sliceNumber);
    let shapedList = [];
    for (var i = 0; i < repeatNum; i++) {
      const tempList = originalList.splice(0, payload.sliceNumber);
      if (i === 0) await dispatch("fetchContentsFromId", tempList);
      shapedList.push(tempList);
    }
    return shapedList;
  },
  async fetchContentsFromId({ dispatch, commit }, idList) {
    // newsContentListの中身を空にする
    commit("clearNewsContentList");
    var newsContentList = [];
    for (var i = 0; i < idList.length; i++) {
      const url =
        "https://hacker-news.firebaseio.com/v0/item/" +
        idList[i] +
        ".json?print=pretty";
      const newsContent = await dispatch("fetchNewsContent", url);
      // console.log("newsContent: ", newsContent);
      if (newsContent !== null) newsContentList.push(newsContent);
    }
    // console.log(newsContentList[18]);
    commit("setNewsContentList", newsContentList);
    // console.log(state.newsContentList[0]);
  },
  async fetchUserPosting({ dispatch, commit, state }, url) {
    const userPostInfo = await this.$axios.$get(url);
    const tempSubmitted = userPostInfo.submitted.slice();
    let shapedSubmitted = tempSubmitted.slice();
    commit("setUserPostInfo", userPostInfo);

    console.log("temp:: ", tempSubmitted.length);
    if (tempSubmitted.length > 100) {
      shapedSubmitted = tempSubmitted.splice(0, 100);
    }
    const shapedList = await dispatch("cutList", {
      list: shapedSubmitted,
      sliceNumber: state.postNumberPerPage
    });
    commit("setUserPostIdList", shapedList);
  }
};
