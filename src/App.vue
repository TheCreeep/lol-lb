<template>
  <div class="page">
    <div class="header">
      <div class="header__logo">
          <img class="header__logo__icon" src="@/assets/ranks/challenger.png" alt="">
          <h1 class="header__logo__title">OnlyEgoChallenge Leaderboard</h1>
        </div>
        <div class="header__time">
          <div class="header__time__text" v-if="!getTimeLeft()">LE CHALLENGE COMMENCE DANS</div>
          <div class="header__time__text" v-else>TEMPS RESTANT (Nombre de joueurs : {{ getNumberOfPlayers() }})</div>
          <div class="header__time__timer">{{ timeLeft }}</div>
        </div>
        <div class="header__add" v-if="isAdmin">
          <input class="header__add__input" @keyup.enter="addPlayerToDB()" type="text" placeholder="Summoner name"
            v-model="nameToAdd">
          <div class="header__add__button" @click="addPlayerToDB()">Add</div>
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
              <div v-if="isAdmin" class="player__delete" @click="deletePlayerFromDB(player.name)"><svg
                  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#F85252"
                  height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 460.775 460.775" xml:space="preserve">
                  <path
                    d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z" />
                </svg></div>
              <div class="player__rank">
                <img class="player__rank__avatar" :src="getAvatarURL(player.avatarId)" alt="">
                <div class="player__rank__details">
                  <div class="player__rank__details__stats">
                    <div class="stats">
                      <div class="stats__name" @click="openOpGG(player.name)">{{ player.name }} </div>
                      <div class="stats__win">{{ player.ranked_info.wins }}W</div>
                      <span> -</span>
                      <div class="stats__lose">{{ player.ranked_info.losses }}L </div>
                    </div>
                    <div class="twitch" @click="openTwitch(player.twitch)" v-if="player.twitch.length > 0">
                      <div class="twitch__logo"><svg width="256px" height="268px" viewBox="0 0 256 268" version="1.1"
                          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                          preserveAspectRatio="xMidYMid">
                          <g>
                            <path
                              d="M17.4579119,0 L0,46.5559188 L0,232.757287 L63.9826001,232.757287 L63.9826001,267.690956 L98.9144853,267.690956 L133.811571,232.757287 L186.171922,232.757287 L256,162.954193 L256,0 L17.4579119,0 Z M40.7166868,23.2632364 L232.73141,23.2632364 L232.73141,151.29179 L191.992415,192.033461 L128,192.033461 L93.11273,226.918947 L93.11273,192.033461 L40.7166868,192.033461 L40.7166868,23.2632364 Z M104.724985,139.668381 L127.999822,139.668381 L127.999822,69.843872 L104.724985,69.843872 L104.724985,139.668381 Z M168.721862,139.668381 L191.992237,139.668381 L191.992237,69.843872 L168.721862,69.843872 L168.721862,139.668381 Z"
                              fill="#5A3E85"></path>
                          </g>
                        </svg></div>
                      <div class="twitch__link">{{ player.twitch }}</div>
                    </div>
                  </div>
                  <div class="player__rank__details__elobar"
                    :style="{ background: createBackgroundString(player.ranked_info.tier, player.ranked_info.lp) }">{{

                      player.ranked_info.tier == 'unranked' ? 'Unranked' :
                      player.ranked_info.lp + 'LP' }}</div>
                </div>
              </div>
              <div class="player__lastgame" v-if="player.last_match.game_duration != 0">
                <div class="player__lastgame__header">
                  <p class="player__lastgame__header__title">Last Ranked :</p>
                  <p class="player__lastgame__header__date">{{ dateFormat(player.last_match.game_creation) }}</p>
                </div>
                <div class="player__lastgame__score">
                  <div class="player__lastgame__score__win" v-if="player.last_match.win">Victory</div>
                  <div class="player__lastgame__score__lose" v-else>Defeat</div>
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
                    <img class="player__lastgame__details__lane__icon" :src="getLaneURL(player.last_match.role)">
                    <p class="player__lastgame__details__lane__text">{{ player.last_match.role.toLowerCase() }}</p>
                  </div>
                  <div class="player__lastgame__details__minions">
                    <img class="player__lastgame__details__minions__icon" src="@/assets/lanes/minions.png">
                    <p class="player__lastgame__details__minions__text">{{ player.last_match.minions_killed }}</p>
                  </div>
                  <div class="player__lastgame__details__gametime">{{ secondsToMinutes(player.last_match.game_duration) }}
                  </div>
                </div>
              </div>
              <div class="player__lastgame" v-else>
                <div class="player__lastgame__header">
                  <p class="player__lastgame__header__title">Last Ranked :</p>
                  <p class="player__lastgame__header__date">No ranked games</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="credits">Made by <a href="https://github.com/TheCreeep" target="_blank">Creep</a> - 2023</div>
    </div>
</template>


<script>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

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
        "unranked": "#010a13"
      },
      nameToAdd: '',
      timeLeft: 0,
    }
  },
  mounted() {
    this.startTimer()
    this.getAllPlayersInfo()
  },
  methods: {
    async deletePlayerFromDB(name) {
      this.$store.dispatch('deletePlayerFromDB', { name: name, key: this.RGAPIKEY })
    },
    async addPlayerToDB() {
      this.$store.dispatch('addPlayerToDB', { name: this.nameToAdd, key: this.RGAPIKEY })
    },
    async getAllPlayersInfo() {
      this.$store.dispatch('getNames', {
        'key': import.meta.env.VITE_RG_API_KEY
      })
    },
    async addName(name) {
      this.$store.dispatch('addName', name)
    }
    ,
    getAvatarURL(id) {
      return `https://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/${id}.png`;
    },
    getChampIconUrl(name) {
      return `https://cdn.mobalytics.gg/assets/lol/images/dd/champions/icons/${name.toLowerCase()}.png?V3`;
    },
    getRankURL(rank) {
      return new URL(`./assets/ranks/${rank}.png`, import.meta.url).href
    },
    getLaneURL(lane) {
      return new URL(`./assets/lanes/${lane.toLowerCase()}.png`, import.meta.url).href
    },
    dateFormat(timestamp) {
      return dayjs(timestamp).format('DD MMMM YYYY HH:mm:ss')
    },
    secondsToMinutes(seconds) {
      return `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' + seconds % 60 : seconds % 60}`
    },
    createBackgroundString(tier, lp) {
      if (tier === 'unranked') {
        return "#010a13";
      }

      const lpPercent = tier === 'challenger' || tier === 'grandmaster' || tier === 'master' ? 100 : lp;
      const color1 = this.rankColor[tier];

      const rankColorKeys = Object.keys(this.rankColor);
      const rankColorIndex = rankColorKeys.indexOf(tier);

      const color2 = this.rankColor[rankColorKeys[rankColorIndex + 1]];

      return `linear-gradient(90deg, ${color1} ${lpPercent}%, ${color2} ${lpPercent * 1.1}%)`;
    },
    startTimer() {
      setInterval(() => this.getTimeLeft(), 1000);
    },
    getTimeLeft() {
      const now = dayjs();
      const end = dayjs('2023-06-25 18:00:00');
      const diff = end.diff(now, 'second');

      const duree = dayjs.duration(diff, 'seconds');

      const monthLeft = duree.months();
      const dayLeft = duree.days();
      const hourLeft = duree.hours();
      const minuteLeft = duree.minutes();
      const secondLeft = duree.seconds()

      this.timeLeft = `${dayLeft > 0 ? dayLeft + " Jours" : ""} ${hourLeft > 0 ? hourLeft + " Heures" : ""} ${minuteLeft > 0 ? minuteLeft + " Minutes" : ""} ${secondLeft > 0 ? secondLeft + " Secondes" : ""}`;
      return !monthLeft
    },
    getTwitchUrl(name) {
      return `https://www.twitch.tv/${name}`;
    },
    openTwitch(name) {
      window.open(this.getTwitchUrl(name), '_blank');
    },
    openOpGG(name) {
      window.open(`https://euw.op.gg/summoner/userName=${name}`, '_blank');
    },
    getNumberOfPlayers() {
      return Object.values(this.data).reduce((acc, cur) => {
        if (Array.isArray(cur)) {
          return acc + cur.length;
        } else {
          return acc + 1;
        }
      }, 0);
    }
  },
  watch: {

  },
  computed: {
    filteredRanks() {
      return Object.entries(this.data).filter(([_, v]) => Array.isArray(v) ? v.length : v);
    },
    isAdmin() {
      return localStorage.getItem('token') === import.meta.env.VITE_ADMIN_TOKEN;
    },

    data() {
      /* Sort by LP inside all the tier */
      const data = this.$store.state.data;
      Object.entries(data).forEach(([_, v]) => {
        if (Array.isArray(v) && v.length != 0) {
          v.sort((a, b) => b.ranked_info.lp - a.ranked_info.lp)
        }
      });

      return data;
    }

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

::-webkit-scrollbar {
  width: 15px;
  background: #424242;
}

::-webkit-scrollbar-thumb {
  margin-right: 10px;
  background: #252525;
  border-radius: 10px;
  background-clip: padding-box;
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

    &__time {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.2em;

      &__text {
        font-size: 20px;
        color: #fff;
      }

      &__timer {
        color: #fff;
        font-size: 30px;
      }
    }

    &__add {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10px 15px;
      background: #1A1717;
      border: 1px solid #DCB867;
      border-radius: 42px;

      gap: 1em;

      &__input {
        background: transparent;
        border: none;
        outline: none;
        color: #fff;
        font-size: 15px;
        width: 200px;
      }

      &__button {
        text-align: center;
        font-size: 15px;
        cursor: pointer;
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
        gap: 1.2em;

        &__player {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 2em;

          .player__delete {
            cursor: pointer;

            svg {
              width: 50px;
              height: 50px;
            }
          }

          .player__rank {
            display: flex;
            min-width: 700px;
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
              width: 100%;
              gap: 2em;

              &__stats {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                .stats {
                  display: flex;
                  gap: 1em;

                  &__name {
                    font-size: 30px;
                    font-weight: 400;
                    color: #FFFFFF;
                    cursor: pointer;
                  }

                  &__win {
                    font-size: 30px;
                    font-weight: 400;
                    color: #31CF5D;
                  }

                  span {
                    font-size: 30px;
                    font-weight: 400;
                    color: #FFFFFF;
                  }

                  &__lose {
                    font-size: 30px;
                    font-weight: 400;
                    color: #FA3737;
                  }

                }


                .twitch {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  border: #5A3E85 2px solid;
                  border-radius: 25px;
                  background: #FFFFFF40;
                  padding: 0.5em;
                  cursor: pointer;

                  &__logo {
                    svg {
                      width: 20px;
                      height: 20px;
                    }
                  }

                  &__link {
                    font-size: 20px;
                    font-weight: 400;
                    color: #FFFFFF;
                    margin-bottom: 5px;
                  }
                }
              }

              &__elobar {
                width: 500px;
                height: 30px;
                border-radius: 25px;

                border: 2px grey solid;

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
            min-width: 450px;
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