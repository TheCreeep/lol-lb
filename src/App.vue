<template>
  <div class="page">
    <div class="header">
      <div class="header__logo">
        <img class="header__logo__icon" src="@/assets/ranks/challenger.png" alt="">
        <h1 class="header__logo__title">OnlyEgoChallenge Leaderboard</h1>
      </div>
      <div class="header__add">
        <div class="header__add__button">+ Ajouter un compte</div>
      </div>
    </div>
    <div class="main">
      <div class="main__ranks">
        <div class="main__ranks__title">
          <img class="main__ranks__title__icon" :src="getRankURL('grandmaster')">
          <h2 class="main__ranks__title__text">{{ 'GrandMaster' }}</h2>
        </div>
        <div class="main__ranks__players">
          <div class="main__ranks__players__player">
            <div class="player__rank">
              <img class="player__rank__avatar" :src="getAvatarURL(1269)" alt="">
              <div class="player__rank__details">
                <div class="player__rank__details__stats">
                  <div class="name">{{ "Creep" }} </div>
                  <div class="win">{{ 14 }}W</div>
                  <span> -</span>
                  <div class="lose">{{ 14 }}D </div>
                </div>
                <div class="player__rank__details__elobar">{{ 20 }}LP</div>
              </div>
            </div>
            <div class="player__lastgame">
              <div class="player__lastgame__header">
                <p class="player__lastgame__header__title">Dernière Ranked :</p>
                <p class="player__lastgame__header__date">{{ dateFormat(1684461977532) }}</p>
              </div>
              <div class="player__lastgame__score">
                <div class="player__lastgame__score__win" v-if="true">Victoire</div>
                <div class="player__lastgame__score__lose" v-else>Défaite</div>
                <div class="player__lastgame__score__champ">
                  <img class="player__lastgame__score__champ__icon" :src="getChampIconUrl('xerath')">
                  <p class="player__lastgame__score__champ__name">{{ 'Xerath' }}</p>
                </div>
                <div class="player__lastgame__score__kda"><span class="player__lastgame__score__kda__kills">{{ 15
                }}</span>/<span class="player__lastgame__score__kda__deaths">{{ 10
}}</span>/<span class="player__lastgame__score__kda__assists">{{ 5
}}</span></div>
              </div>
              <div class="player__lastgame__details">
                <div class="player__lastgame__details__lane">
                  <img class="player__lastgame__details__lane__icon" :src="getLaneURL('middle')">
                  <p class="player__lastgame__details__lane__text">{{ 'Middle Lane' }}</p>
                </div>
                <div class="player__lastgame__details__minions">
                  <img class="player__lastgame__details__minions__icon" src="@/assets/lanes/minions.png">
                  <p class="player__lastgame__details__minions__text">{{ 195 }}</p>
                </div>
                <div class="player__lastgame__details__gametime">{{ secondsToMinutes(2254) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      players: []
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
    }
  },
  computed: {

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
      padding: 6px 19px;
      background: #1A1717;
      border: 1px solid #DCB867;
      border-radius: 42px;

      &__button {
        font-size: 30px;
        color: #FFFFFF
      }
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    gap: 1em;
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
        gap: 0.3em;

        &__player {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
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

                background: linear-gradient(90deg, #EF7932 25%, #BE6EEA 25%);
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

                &__icon {
                  width: 32px;
                  height: 32px;
                }

                &__text {
                  font-weight: 400;
                  font-size: 20px;
                  color: #FFFFFF;
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