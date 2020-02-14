export const state = () => ({
  page: 1
});

export const getters = {
  getPageNo: state => state.page
};

export const mutations = {
  stashPageNo(state, number) {
    state.page = number;
    console.log(number);
  }
};
