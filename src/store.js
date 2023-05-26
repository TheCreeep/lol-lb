import Vuex from 'vuex'
import axios from 'axios'
import { capitalize } from 'vue'

const store = new Vuex.Store({
  state: {
    player_loading: false,
    data: {
      Challenger: [],
      Grandmaster: [],
      Master: [],
      'Diamond I': [],
      'Diamond II': [],
      'Diamond III': [],
      'Diamond IV': [],
      'Platinum I': [],
      'Platinum II': [],
      'Platinum III': [],
      'Platinum IV': [],
      'Gold I': [],
      'Gold II': [],
      'Gold III': [],
      'Gold IV': [],
      'Silver I': [],
      'Silver II': [],
      'Silver III': [],
      'Silver IV': [],
      'Bronze I': [],
      'Bronze II': [],
      'Bronze III': [],
      'Bronze IV': [],
      'Iron I': [],
      'Iron II': [],
      'Iron III': [],
      'Iron IV': []
    },
    player: {
      name: '',
      avatarId: 0,
      puuid: '',
      id: '',
      ranked_info: {
        tier: '',
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
        role: '',
        minions_killed: 0
      }
    }
  },
  mutations: {
    /*  */
  },
  actions: {
    async addPlayerToData({ dispatch }) {
      this.state.data[this.state.player.ranked_info.rank].push(this.state.player)
    },

    async getAllPlayersInfo({ dispatch }, data) {
      const { players, key: RGAPIKEY } = data
      for (const player of players) {
        if (!this.state.player_loading) {
          this.state.player = {}
          this.state.player_loading = true
          await dispatch('getPlayerInfo', { name: player, key: RGAPIKEY })
          await dispatch('addPlayerToData')
          this.state.player_loading = false
        }
      }
    },
    async getPlayerInfo({ dispatch }, data) {
      const { name, key: RGAPIKEY } = data
      await axios
        .get(
          `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${RGAPIKEY}`
        )
        .then(async (res) => {
          this.state.player.name = res.data.name
          this.state.player.avatarId = res.data.profileIconId
          this.state.player.puuid = res.data.puuid
          this.state.player.id = res.data.id
          this.state.player.ranked_info = {}
          this.state.player.last_match = {}

          await dispatch('getLastMatchId', {
            uuid: res.data.puuid,
            key: RGAPIKEY
          })

          await dispatch('getRankedInfo', {
            id: res.data.id,
            key: RGAPIKEY
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async getRankedInfo(_, data) {
      const { id, key: RGAPIKEY } = data
      await axios
        .get(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${RGAPIKEY}`
        )
        .then((res) => {
          const data = res.data[0]
          this.state.player.ranked_info.lp = data.leaguePoints
          this.state.player.ranked_info.wins = data.wins
          this.state.player.ranked_info.losses = data.losses

          const capitalize = (s) => {
            return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
          }

          this.state.player.ranked_info.rank = capitalize(data.tier) + ' ' + data.rank

          this.state.player.ranked_info.tier = data.tier.toLowerCase()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async getLastMatchId({ dispatch }, data) {
      const { uuid, key: RGAPIKEY } = data
      await axios
        .get(
          `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${uuid}/ids?type=ranked&count=1&api_key=${RGAPIKEY}`
        )
        .then(async (res) => {
          await dispatch('getMatchDetails', { uuid, matchId: res.data[0], key: RGAPIKEY })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async getMatchDetails(_, data) {
      const { uuid, matchId, key: RGAPIKEY } = data
      await axios
        .get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RGAPIKEY}`)
        .then((res) => {
          const playerIndex = res.data.metadata.participants.findIndex((player) => {
            return player === uuid
          })

          const playerStats = res.data.info.participants[playerIndex]

          this.state.player.last_match.game_duration = res.data.info.gameDuration
          this.state.player.last_match.game_creation = res.data.info.gameCreation
          this.state.player.last_match.game_champion = playerStats.championName
          this.state.player.last_match.game_kills = playerStats.kills
          this.state.player.last_match.game_deaths = playerStats.deaths
          this.state.player.last_match.game_assists = playerStats.assists
          this.state.player.last_match.win = playerStats.win
          this.state.player.last_match.role =
            playerStats.individualPosition == 'UTILITY' ? 'SUPPORT' : playerStats.individualPosition
          this.state.player.last_match.minions_killed = playerStats.totalMinionsKilled
        })
        .then(() => {
          this.state.data[this.state.player.ranked_info.rank].push(this.state.player)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
})

export default store
