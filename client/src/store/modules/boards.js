import axios from "axios";

const state = {
  userBoards: [],
  chosenBoardName: "Select",
  chosenBoardId: ""
};

const mutations = {
  addNewBoard(state, board) {
    state.userBoards.push(board);
  },
  setBoards(state, boards) {
    state.userBoards = boards;
  },
  chooseBoard(state, { name, id }) {
    (state.chosenBoardName = name), (state.chosenBoardId = id);
  }
};

const actions = {
    createBoard({ dispatch,state }, boardData) {
       // localStorage.setItem("x-auth-token", token);
        state.chosenBoardName = boardData.name;
        let token =localStorage.getItem("userToken");
        console.log(token);
        axios.defaults.headers.common["Authorization"] =token
        axios
          .post("me/boards", 
          boardData
          )
          .then((response) => {
            dispatch("userBoards");
            state.chosenBoardId = response.data._id
          })
          .catch(error => {
            console.log(error)
          });
      },
      userBoards({ commit }) {
        let token =localStorage.getItem("userToken");
        console.log(token);
        axios.defaults.headers.common["Authorization"] =token
        axios
          .get("me/boards")
          .then((response) => {
            commit("setBoards", response.data);
          })
          .catch(error => {
            console.log(error)
          });
      },
      sortAz({dispatch}){
        axios.put("me/boards/sortAZ")
        .then(()=>{
          dispatch("userBoards");
        })
        .catch(error => {
          console.log(error)
        });
      },
      sortDate({dispatch}){
        axios.put("me/boards/sortDate")
        .then(()=>{
          dispatch("userBoards");
        })
        .catch(error => {
          console.log(error)
        });
      }
};

const getters = {
  userBoards: state => state.userBoards,
  chosenBoardName: state => state.chosenBoardName,
  chosenBoardId: state => state.chosenBoardId
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
