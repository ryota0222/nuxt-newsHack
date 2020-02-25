export const state = () => ({
  // common
  category: [
    {
      id: 0,
      name: "NEW",
      link: "/",
      api: "https://hacker-news.firebaseio.com/v0/newstories.json"
    },
    {
      id: 1,
      name: "TOP",
      link: "/top",
      api: "https://hacker-news.firebaseio.com/v0/topstories.json"
    },
    {
      id: 2,
      name: "BEST",
      link: "/best",
      api: "https://hacker-news.firebaseio.com/v0/beststories.json"
    },
    {
      id: 3,
      name: "Ask, Show and Job Stories",
      link: "/otherStories/ask",
      api: ""
    }
  ],
  otherStoriesCategory: [
    {
      id: 0,
      name: "ASK",
      link: "/otherStories/ask",
      api: "https://hacker-news.firebaseio.com/v0/askstories.json"
    },
    {
      id: 1,
      name: "SHOW",
      link: "/otherStories/show",
      api: "https://hacker-news.firebaseio.com/v0/showstories.json"
    },
    {
      id: 2,
      name: "JOB",
      link: "/otherStories/job",
      api: "https://hacker-news.firebaseio.com/v0/jobstories.json"
    }
  ],
  postNumberPerPage: 20,
  selectedApiInfo: Object,
  // 種別ごと記事一覧
  newsIdList: [],
  newsContentList: [],
  newsContent: Object,
  // ユーザー別記事一覧
  userPostInfo: Object,
  userPostIdList: [],
  maxNumberToGet: 100
});

export const getters = {
  getNewsIdList: state => state.newsIdList,
  getNewsContentList: state => state.newsContentList,
  getNewsContent: state => state.newsContent,
  getUserPostInfo: state => state.userPostInfo,
  getUserPostIdList: state => state.userPostIdList,
  getPostNumberPerPage: state => state.postNumberPerPage,
  getCategory: state => state.category,
  getOtherStoriesCategory: state => state.otherStoriesCategory
};
export const mutations = {
  setNewsIdList(state, list) {
    state.newsIdList = list;
  },
  setContentList(state, list) {
    state.newsContentList = list;
  },
  setNewsContent(state, id) {
    state.newsContent = state.newsContentList.filter(
      content => content.id === id
    )[0];
  },
  clearNewsContentList(state) {
    state.newsContentList = [];
  },
  setUserPostInfo(state, data) {
    state.userPostInfo = data;
  },
  setUserPostIdList(state, list) {
    state.userPostIdList = list;
  },
  filterPostTypeApi(state, type) {
    let selectedApiInfo = state.category.filter(list => list.name === type)[0];
    if (undefined === selectedApiInfo) {
      selectedApiInfo = state.otherStoriesCategory.filter(
        list => list.name === type
      )[0];
    }
    state.selectedApiInfo = selectedApiInfo;
  }
};

export const actions = {
  // ニュース情報を取得する
  async fetchContentFromAPI({ dispatch, commit, state }, type) {
    // typeと合ったURLを取得
    commit("filterPostTypeApi", type);
    // IDの取得
    const idList = await dispatch("fetchIdFromAPI", state.selectedApiInfo.api);
    // 1ページに表示する数に分け、
    // 最初のページに表示するIDはコンテンツも取得する
    const sliceIdList = await dispatch("sliceIdList", idList);
    commit("setNewsIdList", sliceIdList);
  },
  // ユーザー別のニュース情報を取得する
  async fetchUserPosting({ dispatch, commit, state }, url) {
    // ユーザー情報の取得
    const userPostInfo = await dispatch("fetchIdFromAPI", url);
    commit("setUserPostInfo", userPostInfo);
    // IDの取得
    const userPostIdList = userPostInfo.submitted;
    const tempSubmitted = userPostIdList.slice();
    let shapedSubmitted = tempSubmitted.slice();
    // 取得上限数まで取得する
    if (tempSubmitted.length > state.maxNumberToGet) {
      shapedSubmitted = tempSubmitted.splice(0, state.maxNumberToGet);
    }
    const shapedList = await dispatch("sliceIdList", shapedSubmitted);
    commit("setUserPostIdList", shapedList);
  },
  // IDを取得する
  async fetchIdFromAPI({ dispatch, commit, state }, url) {
    return await this.$axios.$get(url);
  },
  async fetchNewsContentFromAPI({ dispatch, commit }, url) {
    return await this.$axios.$get(url);
  },
  // 1ページに表示する数に分ける
  async sliceIdList({ dispatch, commit, state }, list) {
    const originalList = list;
    const repeatNum = Math.ceil(list.length / state.postNumberPerPage);
    let sliceIdList = [];
    for (var i = 0; i < repeatNum; i++) {
      const tempList = originalList.splice(0, state.postNumberPerPage);
      // 1ページ目のIDのみ、コンテンツを取得する
      if (i === 0) await dispatch("fetchContentsFromId", tempList);
      sliceIdList.push(tempList);
    }
    return sliceIdList;
  },
  async fetchContentsFromId({ dispatch, commit, state }, idList) {
    // newsContentListの中身を空にする
    commit("clearNewsContentList");
    var newsContentList = [];
    for (var i = 0; i < idList.length; i++) {
      const url =
        "https://hacker-news.firebaseio.com/v0/item/" +
        idList[i] +
        ".json?print=pretty";
      const newsContent = await dispatch("fetchNewsContentFromAPI", url);
      // 取得できなかったコンテンツは無視する
      if (newsContent !== null) newsContentList.push(newsContent);
    }
    commit("setContentList", newsContentList);
  }
};
