<template>
    <div class="section container" style="padding-top: 1em;">
        <b-tabs type="is-centered" :destroy-on-hide='true' expanded class="block" multiline :animated="false">
            <ScheduleView v-for="location in locations" :location="location.assignmentLocations" :key="location.assignmentLocations.id"></ScheduleView>
        </b-tabs>
        <b-loading :active="loading"></b-loading>
    </div>
</template>

<script>
import ScheduleView from './SchedulerComps/ScheduleView.vue';

import PMOLib from 'pmo-lib/PMOLib';
let pmoLib = new PMOLib.PMO();

export default {
    name: "PublicScheduler",
    props: {
        user: Object
    },
    data() {
        return {
            loading: false,
            locations: null
        }
    },
    methods: {
        getLocations() {
            this.loading = true;
            pmoLib.getLocations().then(r=>{
                if (!r.api.logged_in) {
                    this.$emit('loginIssue')
                }
                this.locations = r.data;
            }).catch(()=>{
                pmoLib.generalError(this,"There was an error retrieving locations, please try again later");
            }).finally(()=>{
                this.loading = false;
            })
        },
        pageVisibleTrigger() {
            this.getLocations();
        }
    },
    mounted() {
        this.getLocations();
    },
    components: {
        ScheduleView
    },
    metaInfo: {
        title: " :: Scheduler"
    }
}
</script>

<style lang='scss'>
.tabs li.is-active a span {
    font-weight: 500; // Not sure how i feel about this, it moves the text
}
</style>
