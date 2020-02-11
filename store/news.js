export const state = () => ({
  newsIdList: [],
  newsContentList: [],
  isContentsLoading: false
});

export const getters = {
  getNewsIdList(state) {
    return state.newsIdList;
  },
  getNewsContentList(state) {
    return state.newsContentList;
  },
  getContentLoadingState(state) {
    return state.isContentsLoading;
  }
};
export const mutations = {
  setNewsIdList(state, list) {
    state.newsIdList = list;
  },
  setNewsContentList(state, list) {
    state.newsContentList = list;
  },
  setContentLoadingState(state, loadingState) {
    state.isContentsLoading = loadingState;
    console.log(state.isContentsLoading);
  },
  clearNewsContentList(state) {
    state.newsContentList = [];
  }
};

export const actions = {
  async fetchNewsId({ dispatch, commit }, url) {
    const newsId = await this.$axios.$get(url);
    const shapedList = await dispatch("cutList", {
      list: newsId,
      sliceNumber: 20
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
      if (i === 0) dispatch("fetchContentsFromId", tempList);
      shapedList.push(tempList);
    }
    return shapedList;
  },
  async fetchContentsFromId({ dispatch, commit, state }, idList) {
    // 状態をコンテンツ読み込み中にする
    commit("setContentLoadingState", true);
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
      newsContentList.push(newsContent);
    }
    // console.log(newsContentList[18]);
    commit("setNewsContentList", newsContentList);
    console.log(state.newsContentList);
    // 状態をコンテンツ読み込み終了にする
    commit("setContentLoadingState", false);
  }
};
