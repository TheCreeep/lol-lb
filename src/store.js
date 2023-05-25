import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    player: {
      name: '',
      avatarUrl: '',
      puuid: '',
      id: '',
      last_match_id: '',
      ranked_info: {
        tier: '',
        rank: '',
        lp: '',
        wins: '',
        losses: '',
      },
      last_match: {
        game_duration: '',
        game_creation: '',
        game_champion: '',
        game_kills: '',
        game_deaths: '',
        game_assists: '',
        win: '',
        lane: '',
        minions_killed: '',
      }
    }
  },
  mutations: {
    
  },
  actions: {
    increment(context) {
      context.commit('increment')
    }
  }
})

export default store
