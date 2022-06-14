<template>
    <b-tab-item :key="location.id" :label="location.name">
        <b-field position="is-centered">
            <p class="control">
                <b-button class="button is-primary" icon-left="chevron-left" @click="lastSchedule"></b-button>
            </p>
                <b-datepicker style="text-align-last: center" v-model="date" trap-focus></b-datepicker>
            <p class="control">
                <b-button class="button is-primary" icon-left="chevron-right" @click="nextSchedule"></b-button>
            </p>
        </b-field>
        
        <div class="columns is-centered is-gapless">
            <div class="column">
                <div class="column day-header">
                    <p class="has-text-centered">Wednesday - 6/13/2022</p>
                </div>
                <div class="column">
                    Day 1 Data 1
                </div>
                <div class="column">
                    Day 1 Data 2
                </div>
                <div class="column">
                    Day 1 Data 3
                </div>
                <div class="column">
                    Day 1 Data 4
                </div>
            </div>
            <div class="column">
                <div class="column day-header">
                    <p class="has-text-centered">Thursday - 6/28/2022</p>
                </div>
                <div class="column">
                    Day 2 Data 2
                </div>
                <div class="column">
                    Day 2 Data 2
                </div>
            </div>
            <div class="column">
                <div class="column day-header">
                    <p class="has-text-centered">Friday - 6/31/2022</p>
                </div>
                <div class="column">
                    Day 3 Data 3
                </div>
                <div class="column">
                    Day 3 Data 2
                </div>
                <div class="column">
                    Day 3 Data 3
                </div>
            </div>
        </div>
        <b-loading :active="loading" :is-full-page="false"></b-loading>
    </b-tab-item>
</template>

<script>
import PMOLib from 'pmo-lib/PMOLib';
let pmoLib = new PMOLib.PMO();

import DayJS from 'dayjs';

export default {
    name: "ScheduleView",
    props: {
        location: Object
    },
    data() {
        return {
            schedule: null,
            loading: false,
            date: DayJS().toDate()
        }
    },
    methods: {
        getSchedule() {
            this.loading = true;
            pmoLib.getSchedule(this.location.id).then(r=>{
                this.schedule = r.data;
            }).catch(()=>{
                pmoLib.generalError(this, "There was an error loading the " + this.location.name + " schedule, please try again later");
            }).finally(()=>{
                this.loading = false;
            })
        },
        lastSchedule() {

        },
        nextSchedule() {

        }
    },
    mounted() {
        this.getSchedule();
    }
}
</script>

<style lang="scss">

@import '@/scss/custom.scss';

.day-header {
    border: solid 1px $primary;
    border-collapse: collapse;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    
    background-color: $primary-light;
    margin-left: 1px;
    margin-right: 1px;
}

</style>