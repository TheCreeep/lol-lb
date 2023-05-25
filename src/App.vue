<template>
  <div class="page">
    <div class="header">
      <div class="header__logo">
        <img class="header__logo__icon" src="@/assets/ranks/challenger.png" alt="">
        <h1 class="header__logo__title">OnlyEgoChallenge Leaderboard</h1>
      </div>
                      <div class="header__add" v-if="isAdmin">
                        <div class="header__add__button">+ Ajouter un compte</div>
                      </div>
                    </div>
                    <div class="main">
                      <div v-for="rank in filteredRanks" :key="rank" class="main__ranks">
                        <div class="main__ranks__title" v-if="rank[1].length != 0">
                          <img class="main__ranks__title__icon" :src="getRankURL(rank[0].split(' ')[0].toLowerCase())">
                          <h2 class="main__ranks__title__text">{{ rank[0] }}</h2>
                        </div>
                        <div class="main__ranks__players" v-if="rank[1].length != 0">
                          <div class="main__ranks__players__player" v-for="player in rank[1]">
                            <div class="player__rank">
                              <img class="player__rank__avatar" :src="getAvatarURL(player.avatarId)" alt="">
                              <div class="player__rank__details">
                                <div class="player__rank__details__stats">
                                  <div class="name">{{ player.name }} </div>
                                  <div class="win">{{ player.ranked_info.wins }}W</div>
                                  <span> -</span>
                                  <div class="lose">{{ player.ranked_info.losses }}D </div>
                                </div>
                                <div class="player__rank__details__elobar"
                                  :style="{ background: createBackgroundString(player.ranked_info.tier, player.ranked_info.lp) }">{{
                                    player.ranked_info.lp }}LP</div>
                              </div>
                            </div>
                            <div class="player__lastgame">
                              <div class="player__lastgame__header">
                                <p class="player__lastgame__header__title">Dernière Ranked :</p>
                                <p class="player__lastgame__header__date">{{ dateFormat(player.last_match.game_creation) }}</p>
                              </div>
                              <div class="player__lastgame__score">
                                <div class="player__lastgame__score__win" v-if="player.last_match.win">Victoire</div>
                                <div class="player__lastgame__score__lose" v-else>Défaite</div>
                                <div class="player__lastgame__score__champ">
                                  <img class="player__lastgame__score__champ__icon"
                                    :src="getChampIconUrl(player.last_match.game_champion.toLowerCase())">
                                  <p class="player__lastgame__score__champ__name">{{ player.last_match.game_champion }}</p>
                                </div>
                                <div class="player__lastgame__score__kda"><span class="player__lastgame__score__kda__kills">{{
                                  player.last_match.game_kills
                                }}</span>/<span class="player__lastgame__score__kda__deaths">{{ player.last_match.game_deaths
}}</span>/<span class="player__lastgame__score__kda__assists">{{ player.last_match.game_assists
}}</span></div>
                              </div>
                              <div class="player__lastgame__details">
                                <div class="player__lastgame__details__lane">
                                  <img class="player__lastgame__details__lane__icon" :src="getLaneURL(player.last_match.lane)">
                                  <p class="player__lastgame__details__lane__text">{{ player.last_match.lane.toLowerCase() }}</p>
                                </div>
                                <div class="player__lastgame__details__minions">
                                  <img class="player__lastgame__details__minions__icon" src="@/assets/lanes/minions.png">
                                  <p class="player__lastgame__details__minions__text">{{ player.last_match.minions_killed }}</p>
                                </div>
                                <div class="player__lastgame__details__gametime">{{ secondsToMinutes(player.last_match.game_duration) }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="credits">Made by <a href="https://github.com/TheCreeep">Creep</a> - 2023</div>
    </div>
</template>


<script>
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/fr'
dayjs.locale('fr')

export default {
  name: 'App',
  data() {
    return {
      RGAPIKEY: import.meta.env.VITE_RG_API_KEY,
      rankColor: {
        "challenger": "#E4C88D",
        "grandmaster": "#A83126",
        "master": "#BE6EEA",
        "diamond": "#4D8ACC",
        "platinum": "#30827F",
        "gold": "#C4955E",
        "silver": "#67757D",
        "bronze": "#5A3E39",
        "iron": "#554542",
      },
      data: {
        "Challenger": [{
          name: 'Faker',
          avatarId: 1297,
          puuid: 'erN98l3vPtPsAdxii2vhl95eEkr1UAR19Z_j9HNocSUstxI15Sy1xfPR77axIBj8FZwO7JAOZ2Gn7w',
          id: 'Ni9BYoESEkrh77_525PL67K4CoRdrhi_zJ1Gml2Fp3f6u3fm-XPjHfM76A',
          last_match_id: '',
          ranked_info: {
            tier: 'challenger',
            lp: 15000,
            wins: 150,
            losses: 42,
          },
          last_match: {
            game_duration: 2355,
            game_creation: 1684461977532,
            game_champion: 'Yasuo',
            game_kills: 15,
            game_deaths: 0,
            game_assists: 5,
            win: true,
            lane: 'MIDDLE',
            minions_killed: 512,
          }
        }],
        "Grandmaster": [],
        "Master": [],
        "Diamond I": [],
        "Diamond II": [],
        "Diamond III": [],
        "Diamond IV": [],
        "Platinum I": [],
        "Platinum II": [],
        "Platinum III": [],
        "Platinum IV": [
          {
            name: 'Faker But Platinum',
            avatarId: 1545,
            puuid: 'erN98l3vPtPsAdxii2vhl95eEkr1UAR19Z_j9HNocSUstxI15Sy1xfPR77axIBj8FZwO7JAOZ2Gn7w',
            id: 'Ni9BYoESEkrh77_525PL67K4CoRdrhi_zJ1Gml2Fp3f6u3fm-XPjHfM76A',
            last_match_id: '',
            ranked_info: {
              tier: 'platinum',
              lp: 52,
              wins: 15,
              losses: 42,
            },
            last_match: {
              game_duration: 1525,
              game_creation: 1684461977532,
              game_champion: 'Heimerdinger',
              game_kills: 28,
              game_deaths: 45,
              game_assists: 8,
              win: false,
              lane: 'SUPPORT',
              minions_killed: 512,
            }
          }
        ],
        "Gold I": [],
        "Gold II": [],
        "Gold III": [],
        "Gold IV": [{
          name: 'Faker But Platinum',
          avatarId: 1545,
          puuid: 'erN98l3vPtPsAdxii2vhl95eEkr1UAR19Z_j9HNocSUstxI15Sy1xfPR77axIBj8FZwO7JAOZ2Gn7w',
          id: 'Ni9BYoESEkrh77_525PL67K4CoRdrhi_zJ1Gml2Fp3f6u3fm-XPjHfM76A',
          last_match_id: '',
          ranked_info: {
            tier: 'platinum',
            lp: 52,
            wins: 15,
            losses: 42,
          },
          last_match: {
            game_duration: 1525,
            game_creation: 1684461977532,
            game_champion: 'Heimerdinger',
            game_kills: 28,
            game_deaths: 45,
            game_assists: 8,
            win: false,
            lane: 'SUPPORT',
            minions_killed: 512,
          }
        }],
        "Silver I": [],
        "Silver II": [],
        "Silver III": [],
        "Silver IV": [],
        "Bronze I": [],
        "Bronze II": [],
        "Bronze III": [],
        "Bronze IV": [],
        "Iron I": [],
        "Iron II": [],
        "Iron III": [],
        "Iron IV": [],
      },
    }
  },
  mounted() {
  },
  methods: {
    async getLastMatchId(uuid) {
      await axios
        .get(
          `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${uuid}/ids?type=ranked&count=1&api_key=${this.RGAPIKEY}`
        )
        .then((res) => {
          return res.data[0]
        })
        .catch((err) => {
          console.log(err)
        })
    },

    async getPlayerInfo(name) {
      const player = {}
      await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${this.RGAPIKEY}`)
        .then(async (res) => {
          /* return player; */
        })
        .catch(err => {
          console.log(err);
        })
    },
    getAvatarURL(id) {
      return `https://ddragon.leagueoflegends.com/cdn/13.8.1/img/profileicon/${id}.png`;
    },
    getChampIconUrl(name) {
      return `https://cdn.mobalytics.gg/assets/lol/images/dd/champions/icons/${name.toLowerCase()}.png?V3`;
    },
    getRankURL(rank) {
      const path = new URL(`@/assets/ranks/`, import.meta.url)
      return `${path}/${rank}.png`
    },
    getLaneURL(lane) {
      const path = new URL(`@/assets/lanes/`, import.meta.url)
      return `${path}/${lane.toLowerCase()}.png`
    },
    dateFormat(timestamp) {
      return dayjs(timestamp).format('DD MMMM YYYY HH:mm:ss')
    },
    secondsToMinutes(seconds) {
      return `${Math.floor(seconds / 60)}:${seconds % 60}`
    },
    createBackgroundString(tier, lp) {
      const lpPercent = tier === 'challenger' || tier === 'grandmaster' || tier === 'master' ? 100 : lp;
      const color1 = this.rankColor[tier];

      const rankColorKeys = Object.keys(this.rankColor);
      const rankColorIndex = rankColorKeys.indexOf(tier);

      const color2 = this.rankColor[rankColorKeys[rankColorIndex + 1]];

      return `linear-gradient(90deg, ${color1} ${lpPercent}%, ${color2} ${lpPercent * 1.1}%)`;
    }
  },
  computed: {
    filteredRanks() {
      return Object.entries(this.data).filter(([_, v]) => Array.isArray(v) ? v.length : v);
    },
    isAdmin() {
      return localStorage.getItem('token') === '1524';
    },

  }
}
</script> 

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Inter;
}

.page {
  min-height: 100vh;
  background-color: #424242;
  padding: 1em;
  padding-bottom: 5em;

  .credits {
    color: #fff;
    position: fixed;
    bottom: 20px;
    background: #00000099;
    padding: 10px;
    border-radius: 1em;
    
    a {
      color: #fff;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__logo {
      display: flex;
      align-items: center;
      gap: 1em;

      &__icon {
        width: 100px;
        height: 100px;
      }

      &__title {
        background: linear-gradient(269.78deg, #FFC36F 1.75%, #62D3FF 101.6%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 30px;
      }
    }

    &__add {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 6px 10px;
      background: #1A1717;
      border: 1px solid #DCB867;
      border-radius: 42px;

      &__button {
        text-align: center;
        font-size: 30px;
        color: #FFFFFF;

        @media screen and (max-width: 768px) {
          font-size: 15px;
        }
      }
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    gap: 4em;
    align-items: center;
    justify-content: center;


    &__ranks {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
      align-items: center;
      justify-content: center;

      &__title {
        display: flex;
        align-items: center;
        gap: 1em;

        &__icon {
          width: 80px;
          height: 80px;
        }

        &__text {
          font-size: 30px;
          font-weight: 400;
          color: #FFFFFF;
        }
      }

      &__players {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3em;

        &__player {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 2em;

          .player__rank {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 2em;

            &__avatar {
              width: 120px;
              height: 120px;
              border-radius: 75px;
            }

            &__details {
              display: flex;
              flex-direction: column;
              justify-content: center;
              gap: 2em;

              &__stats {
                display: flex;
                flex-direction: row;
                gap: 1em;

                .name {
                  font-size: 30px;
                  font-weight: 400;
                  color: #FFFFFF;
                }

                .win {
                  font-size: 30px;
                  font-weight: 400;
                  color: #31CF5D;
                }

                span {
                  font-size: 30px;
                  font-weight: 400;
                  color: #FFFFFF;
                }

                .lose {
                  font-size: 30px;
                  font-weight: 400;
                  color: #FA3737;
                }
              }

              &__elobar {
                width: 500px;
                height: 30px;
                border-radius: 25px;

                display: flex;
                align-items: center;

                padding: 12px;
                gap: 10px;

                color: #F8F8FF;
                font-weight: 400;
                font-size: 20px;


              }
            }
          }

          .player__lastgame {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6em;


            &__header {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              gap: 1em;
              width: 100%;

              &__title {
                font-size: 20px;
                font-weight: 400;
                color: #FFFFFF;
              }

              &__date {
                font-size: 20px;
                font-weight: 400;
                color: #FFFFFF;
                text-transform: capitalize;
              }
            }

            &__score {
              display: flex;
              flex-direction: row;

              width: 100%;
              justify-content: space-between;

              align-items: center;
              gap: 1em;

              &__win {
                font-weight: 400;
                font-size: 30px;
                color: #35A22B;
              }

              &__lose {
                font-weight: 400;
                font-size: 30px;
                color: #FA3737;
              }

              &__champ {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1em;

                &__icon {
                  width: 32px;
                  height: 32px;
                  border-radius: 75px;
                }

                &__name {
                  font-weight: 400;
                  font-size: 20px;
                  color: #FFFFFF;
                  text-transform: capitalize;
                }
              }

              &__kda {
                display: flex;
                font-weight: 400;
                font-size: 30px;
                color: #FFFFFF;
                gap: 0.2em;

                &__kills {
                  font-weight: 400;
                  font-size: 30px;
                  color: #FFFFFF;
                }

                &__deaths {
                  font-weight: 400;
                  font-size: 30px;
                  color: #FFFFFF;
                }

                &__assists {
                  font-weight: 400;
                  font-size: 30px;
                  color: #FFFFFF;
                }
              }
            }

            &__details {
              display: flex;
              flex-direction: row;

              width: 100%;
              justify-content: space-between;

              align-items: center;
              gap: 1em;

              &__lane {
                display: flex;
                align-items: center;
                gap: 0.4em;
                text-transform: capitalize;

                &__icon {
                  width: 32px;
                  height: 32px;
                }

                &__text {
                  font-weight: 400;
                  font-size: 20px;
                  color: #FFFFFF;
                  text-transform: capitalize;
                }
              }

              &__minions {
                display: flex;
                align-items: center;
                gap: 0.4em;

                &__icon {
                  height: 32px;
                }

                &__text {
                  font-weight: 400;
                  font-size: 20px;
                  color: #FFFFFF;
                }
              }

              &__gametime {
                font-weight: 400;
                font-size: 20px;
                color: #FFFFFF;
              }
            }
          }
        }
      }
    }
  }
}
</style>