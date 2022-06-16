<template>
    <div class="section container" style="padding-top: 2em;">
        <h1 class="title">My Upcoming Schedule</h1>
        <b-loading :active="loading"></b-loading>
        <div v-if="!upcomingSchedule || upcomingSchedule.length === 0">
            <h1 class="subtitle">It looks like you don't have anything scheduled...</h1>
            <b-button @click="$emit('toScheduler')" icon-left="clock-outline" type="is-primary">Click here to go to the Scheduler</b-button>
        </div>
        <div v-else>
            <div v-for="(event,edx) in upcomingSchedule" :key="edx" class="content">
                <span class="title is-4">{{formattedDateText(event.date,"dddd - M/D/YY")}}</span>
                <hr class="mt-1 mb-2" />
                <div v-for="(location, ldx) in event.location" :key="ldx" class="content">
                    <span class="subtitle">{{location.name}}</span>
                    <div class="columns pt-3" style="flex-wrap: wrap;">
                        <div v-for="(shift, sdx) in location.shifts" :key="sdx" class="column is-4">
                            <ShiftView @onUnschedule="unscheduleEvent" :date="formattedDateText(event.date,'YYYY-MM-DD')" :shift="shift"></ShiftView>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ShiftView from './SchedulerComps/ShiftView.vue';
import DayJS from 'dayjs';
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
DayJS.extend(tz);
DayJS.extend(utc);

import PMOLib from 'pmo-lib/PMOLib';
let pmoLib = new PMOLib.PMO();

export default {
    name: "PublicUpcoming",
    props: {
        user: Object
    },
    data() {
        return {
            upcomingSchedule: null,
            loading: false
        }
    },
    methods: {
        formattedDateText(date, format) {
            return DayJS.utc(date).format(format).toString();
        },
        getUpcoming() {
            this.loading = true;
            pmoLib.getMyUpcoming(DayJS().format('YYYY-MM-DD').toString()).then(r=>{
                this.upcomingSchedule = r.data;
            }).catch(()=>{
                this.$buefy.toast.open({
                    message: "There was an issue contacting the server, Please try again later",
                    type: 'is-danger'
                })
            }).finally(()=>{
                this.loading = false;
            })
        },
        unscheduleEvent() {
            this.getUpcoming();
        }
    }, 
    mounted() {
        this.getUpcoming();
    },
    components: {
        ShiftView
    }, 
    metaInfo: {
        title: " :: My Upcoming Schedule"
    }
}
</script>