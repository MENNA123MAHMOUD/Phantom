import axios from "axios";

const state = {
  user: [],
  isFollowed: ""
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setIsFollowed(state, isFollowed) {
    state.isFollowed = isFollowed == "true";
  },
  updateFollowers(state, value) {
    state.user.followers = state.user.followers + value;
  }
};

const actions = {
 async getUser({ commit }, userId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    try{
      let response= await axios.get("user/" + userId)
      commit("setUser", response.data);
      return response.data
    }
    catch(error){
        console.log(error);
      
    };
  },
  async isFollowed({ commit }, userId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    await axios
      .get("me/follow-user/" + userId)
      .then(response => {
        commit("setIsFollowed", response.data.follow);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  user: state => state.user,
  isFollowed: state => state.isFollowed
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
