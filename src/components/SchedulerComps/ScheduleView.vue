<template>
    <b-tab-item :key="location.id" :label="location.name">
        <b-field position="is-centered">
            <p class="control">
                <b-button class="button is-primary" icon-left="chevron-left" @click="lastSchedule"></b-button>
            </p>
                <b-datepicker @input="buildCurrentDayList(dayListSize,date)" style="text-align-last: center" v-model="date" trap-focus></b-datepicker>
            <p class="control">
                <b-button class="button is-primary" icon-left="chevron-right" @click="nextSchedule"></b-button>
            </p>
        </b-field>
        
        <div class="columns is-centered">
            <div v-for="(day,idx) in currentDayList" v-bind:key="idx" class="column">
                <div class="panel">
                    <div class="panel-heading">
                        <div class="level is-mobile">
                            <div class='level-item has-text-centered'>{{formattedDateText(day.date,'dddd - M/D/YY')}}</div>
                            <WeatherObject :primary="true" :zip="location.zip" :date="formattedDateText(day.date,'YYYY-MM-DD')"></WeatherObject>
                        </div>
                    </div>
                </div>
                    <ShiftView v-for="(shift,idx) in day.shifts" v-bind:key="idx" :shift="shift" :date="formattedDateText(day.date,'YYYY-MM-DD')"></ShiftView>
            </div>
        </div>
        <b-loading :active="loading" :is-full-page="false"></b-loading>
    </b-tab-item>
</template>

<script>
import ShiftView from './ShiftView.vue';
import WeatherObject from './WeatherObject.vue';

import PMOLib from 'pmo-lib/PMOLib';
let pmoLib = new PMOLib.PMO();

import DayJS from 'dayjs';
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
DayJS.extend(tz);
DayJS.extend(utc);

export default {
    name: "ScheduleView",
    props: {
        location: Object
    },
    watch: {
        location() {
            this.getSchedule()
        }
    },
    data() {
        return {
            schedule: null,
            loading: false,
            date: DayJS().set('hour',0).set('minute',0).set('second', 0).toDate(),
            assignmentDays: new PMOLib.DayList(),
            currentDayList: [],
            mobileDayListSize: 1,
            tabletDayListSize: 2,
            desktopDayListSize: 3,
            dayListSize: 3,
            mobileBreakPoint: 768, // pixel size of when to set the dayListSize
            tabletBreakPoint: 1023
        }
    },
    created() {
        if (document.documentElement.clientWidth <= this.mobileBreakPoint) {
            this.dayListSize = this.mobileDayListSize;
        } else if (document.documentElement.clientWidth > this.mobileBreakPoint && document.documentElement.clientWidth <= this.tabletBreakPoint) {
            this.dayListSize = this.tabletDayListSize;
        } else {
            this.dayListSize = this.desktopDayListSize;
        }
    },
    methods: {
        getSchedule() {
            this.loading = true;
            pmoLib.getSchedule(this.location.id).then(r=>{
                this.schedule = r.data[0];
                this.assignmentDays = new PMOLib.DayList();
                this.schedule.assignmentDays.forEach(e => {
                    this.assignmentDays.setDayOfWeek(e.dayOfWeek,true,e.id,e.locId, e.assignmentShiftss);
                });
                this.buildCurrentDayList(this.dayListSize,this.date)
            }).catch(()=>{
                pmoLib.generalError(this, "There was an error loading the " + this.location.name + " schedule, please try again later");
            }).finally(()=>{
                this.loading = false;
            })
        },
        lastSchedule() {
            // Backwards in schedule (complicated... -_-)
            // Need to find date of first element - dayListSize
            let djs = DayJS(this.currentDayList[0].date);
            let currentDayCount = 0;
            while (currentDayCount < this.dayListSize) {
                djs = djs.add(-1,'day');
                if (this.assignmentDays.getDayOfWeekZeroStart(djs.day()).active) {
                    ++currentDayCount;
                }
            }
            // djs should now contain the start of the previous dayListSize
            this.date = djs.toDate();
            this.buildCurrentDayList(this.dayListSize, this.date);
        },
        nextSchedule() {
            // Advance to next schedule
            this.date = DayJS(this.currentDayList[this.currentDayList.length - 1].date).add(1,'day').toDate();
            this.buildCurrentDayList(this.dayListSize, this.date);
        },
        buildCurrentDayList(dayCount, startDate) {
            if (this.schedule.assignmentDays.length === 0) { 
                this.currentDayList = [];
                return; 
            }
            let djs = DayJS(startDate).set('hour',0).set('minute',0).set('second', 0);
            let currentDayCount = 0;
            let safety = 0;
            this.currentDayList = [];
            while (currentDayCount < dayCount && safety < 60) {
                if (this.assignmentDays.getDayOfWeekZeroStart(djs.day()).active) {
                    let pushDay = Object.assign({},this.assignmentDays.getDayOfWeekZeroStart(djs.day()));
                    pushDay.date = djs.toDate();
                    this.currentDayList.push(pushDay);
                    ++currentDayCount;
                }
                safety++;
                djs = djs.add(1,'day');
            }
        },
        formattedDateText(date, format) {
            return DayJS.utc(date).format(format).toString();
        },
        resizeEvent() {
            if (document.documentElement.clientWidth <= this.mobileBreakPoint) {
                if (this.dayListSize !== this.mobileDayListSize) {
                    this.dayListSize = this.mobileDayListSize;
                    this.getSchedule();
                } 
            } else if (document.documentElement.clientWidth > this.mobileBreakPoint && document.documentElement.clientWidth <= this.tabletBreakPoint) {
                if (this.dayListSize !== this.tabletDayListSize) {
                    this.dayListSize = this.tabletDayListSize;
                    this.getSchedule();
                } 
            } else {
                if (this.dayListSize !== this.desktopDayListSize) {
                    this.dayListSize = this.desktopDayListSize;
                    this.getSchedule();
                }
            }
        }
    },
    mounted() {
        this.getSchedule();
        window.addEventListener('resize', this.resizeEvent);
    },
    unmounted() {
        window.removeEventListener('resize', this.resizeEvent);
    },
    components: {
        ShiftView, WeatherObject
    }
}
</script>

<style>
.schedule-panel-header-container {
    display: flex;
    align-content: center;
    justify-content: center;
}
</style>