<template>
    <div class="level-right" v-if="weatherForDay">
        <b-button :type="primary ? 'is-warning' : ''" :icon-left="weatherIcon" @click="detailOpen = true"></b-button>
        <b-modal v-model="detailOpen" width="400px">
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image">
                                <img :src="'https:'+this.weatherForDay.day.condition.icon" />
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class='title is-6'>Weather for {{dayFormatted}}</p>
                            <p class='subtitle'>{{weatherForDay.day.condition.text}}</p>
                        </div>
                    </div>
                    <div class="content">
                        <b-field grouped group-multiline class="pb-3">
                            <b-field label="Avg Temperature">
                                <p class="control">
                                    <b-icon icon="thermometer-lines"></b-icon>
                                    {{weatherForDay.day.avgtemp_f}}
                                </p>
                            </b-field>
                            <b-field label="Wind">
                                <p class="control">
                                    <b-icon icon="weather-windy"></b-icon>
                                    {{weatherForDay.day.maxwind_mph}}mph
                                </p>
                            </b-field>
                        </b-field>
                        <b-field grouped group-multiline>
                            <b-field label="High Temperature">
                                <p class="control">
                                    <b-icon icon="thermometer-high"></b-icon>
                                    {{weatherForDay.day.maxtemp_f}}
                                </p>
                            </b-field>
                            <b-field label="Low Temperature">
                                <p class="control">
                                    <b-icon icon="thermometer-low"></b-icon>
                                    {{weatherForDay.day.mintemp_f}}
                                </p>
                            </b-field>
                        </b-field>
                        <b-field grouped group-multiline class="pt-3 pb-2">
                            <b-field label="Chance of rain">
                                <p class="control">
                                    <b-icon icon="water"></b-icon>
                                    {{weatherForDay.day.daily_chance_of_rain}}%
                                </p>
                            </b-field>
                            <b-field v-if="weatherForDay.day.daily_will_it_snow" label="Chance of snow">
                                <p class="control">
                                    <b-icon icon="snowflake"></b-icon>
                                    {{weatherForDay.day.daily_chance_of_snow}}%
                                </p>
                            </b-field>
                        </b-field>
                    </div>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import DayJS from 'dayjs';
import PMOLib from 'pmo-lib/PMOLib';

export default {
    name: "WeatherObject",
    props: {
        date: String,
        zip: String,
        primary: Boolean
    },
    watch: {
        date() {
            this.getWeather();
        }
    },
    methods: {
        getWeather() {
            if (!this.zip) return;
            this.weatherForDay = null;
            let pmoLib = new PMOLib.PMO();
            pmoLib.getWeatherForZip(this.zip, this.date).then(r=>{
                if (!r.api.status.error) {
                    this.weatherForDay = r.data;
                } else {
                    this.weatherForDay = null;
                }
            }).catch(()=>{
                this.weatherForDay = null;
            });
        }
    },
    mounted() {
        this.getWeather();
    },
    data() {
        return {
            weatherForDay: null,
            detailOpen: false
        }
    },
    computed: {
        weatherIcon() {
            let returnIcon = 'weather-sunset-down';
            if (this.weatherForDay) {
                switch (this.weatherForDay.day.condition.code) {
                    case 1000:
                        returnIcon = 'white-balance-sunny';
                        break;
                    case 1183:
                    case 1189:
                    case 1030:
                    case 1063:
                    case 1153:
                    case 1186:
                        returnIcon = 'weather-rainy'
                        break;
                    case 1192:
                    case 1195:
                    case 1246:
                        returnIcon = 'weather-pouring'
                        break;
                    case 1003:
                        returnIcon = 'weather-partly-cloudy'
                        break;
                    case 1006:
                        returnIcon = 'weather-cloudy'
                        break;
                    case 1009:
                        returnIcon = 'weather-hazy'
                        break;
                    case 1066:
                    case 1213:
                    case 1216:
                    case 1255:
                        returnIcon = 'weather-snowy'
                        break;
                    case 1114:
                    case 1117:
                    case 1219:
                    case 1222:
                    case 1225:
                    case 1258:
                        returnIcon = 'weather-snowy-heavy'
                        break;
                    case 1069:
                    case 1072:
                    case 1168:
                    case 1171:
                    case 1198:
                    case 1201:
                    case 1204:
                    case 1207:
                        returnIcon = 'weather-snowy-rainy'
                        break;
                    case 1087:
                        returnIcon = 'weather-partly-lightning'
                        break;
                    case 1135:
                    case 1147:
                        returnIcon = 'weather-fog'
                        break;
                    case 1150:
                    case 1180:
                    case 1240:
                    case 1243:
                        returnIcon = 'weather-partly-rainy'
                        break;
                    case 1210:
                        returnIcon = 'weather-partly-snowy'
                        break;
                    case 1237:
                    case 1261:
                    case 1264:
                        returnIcon = 'weather-hail'
                        break;
                    case 1249:
                    case 1252:
                        returnIcon = 'weather-partly-snowy-rainy'
                        break;
                    case 1273:
                    case 1276:
                        returnIcon = 'weather-lightning-rainy'
                    break;
                    case 1279:
                    case 1282:
                        returnIcon = 'weather-lightning'
                        break;
                }
            }
            return returnIcon;
        },
        dayFormatted() {
            return DayJS(this.date).format("MM/DD/YY");
        }
    }
}
</script>
