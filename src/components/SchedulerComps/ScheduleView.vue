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
        
        <div class="columns is-centered">
            <div class="column">
                <div class="panel">
                    <p class="panel-heading">
                        Wednesday 6/10/2022
                    </p>
                    <p class="panel-block">
                        Data - 1
                    </p>
                    <p class="panel-block">
                        Data - 2
                    </p>
                    <p class="panel-block">
                        Data - 3
                    </p>
                    <p class="panel-block">
                        Data - 4
                    </p>
                </div>
            </div>
            <div class="column">
                <div class="panel">
                    <p class="panel-heading">
                        Thurday 6/11/2022
                    </p>
                    <p class="panel-block">
                        Data - 1
                    </p>
                    <p class="panel-block">
                        Data - 2
                    </p>
                    <p class="panel-block">
                        Data - 3
                    </p>
                </div>
            </div>
            <div class="column">
                <div class="panel">
                    <p class="panel-heading">
                        Friday 6/12/2022
                    </p>
                    <p class="panel-block">
                        Data - 1
                    </p>
                    <p class="panel-block">
                        Data - 2
                    </p>
                    <p class="panel-block">
                        Data - 3
                    </p>
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
