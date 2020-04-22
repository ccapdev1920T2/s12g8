const state = {
  toggleMusicPlayer: false,
  searchResults: null
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
  togglePlayerWithDecision(state, decision) {
    state.toggleMusicPlayer = decision;
  },
  togglePlayer(state) {
    state.toggleMusicPlayer = !state.toggleMusicPlayer;
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
