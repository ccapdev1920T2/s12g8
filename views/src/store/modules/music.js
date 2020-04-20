const state = {
  toggleMusicPlayer: false,
  searchResults: null,
  playlist: null,
};

const getters = {
  getSearchResults(state) {
    return state.searchResults;
  },
  getToggleStatus(state) {
    return state.toggleMusicPlayer;
  },
};

const actions = {};

const mutations = {
  togglePlayer(state, decision) {
    state.toggleMusicPlayer = decision;
  },
  retrieveSearchResults(state, results) {
    state.searchResults = results;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
