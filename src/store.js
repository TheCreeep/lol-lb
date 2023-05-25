import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    player: {
      name: '',
      avatarId: 0,
      puuid: '',
      id: '',
      last_match_id: '',
      ranked_info: {
        lp: 0,
        wins: 0,
        losses: 0
      },
      last_match: {
        game_duration: 0,
        game_creation: 0,
        game_champion: '',
        game_kills: 0,
        game_deaths: 0,
        game_assists: 0,
        win: false,
        lane: '',
        minions_killed: 0
      }
    }
  },
  mutations: {},
  actions: {
    increment(context) {
      context.commit('increment')
    }
  }
})

export default store
