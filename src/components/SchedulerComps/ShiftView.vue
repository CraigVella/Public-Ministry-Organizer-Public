<template>
    <div class="panel">
        <p class="panel-tabs">
            {{shiftTimes}}
        </p>
        <a class="panel-block" v-for="x in shift.slots" :key="x">
            <SlotView v-if="!loading" :idx="x-1" :signup="sortedSignups ? sortedSignups.signups[x-1] : {}" :userObj="userObj" :shiftId="shift.id"></SlotView>
            <b-skeleton :active="loading"></b-skeleton>
        </a>
        <p class="panel-block">
            <b-field grouped position="is-centered" style="width: 100%">
                <p class="control">
                    <b-button :loading='loading' type='is-primary is-small' icon-left="pencil">Signup</b-button>
                </p>
            </b-field>
        </p>
    </div>
</template>

<script>
import SlotView from './SlotView.vue';

import DayJS from 'dayjs'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
DayJS.extend(utc);
DayJS.extend(tz);

import PMOLib from 'pmo-lib/PMOLib';
let pmoLib = new PMOLib.PMO();

export default {
    name: 'ShiftView',
    props: {
        shift: Object,
        date: String
    },
    watch: {
        date() {
            this.getSignups();
        }
    },
    data() {
        return {
            loading: false,
            userObj: null,
            signups: [],
            sortedSignups: null
        }
    },
    methods: {
        getSignups() {
            this. loading = true;
            pmoLib.getSignupsForShift(this.shift.id,this.date).then(r => {
                this.userObj = r.api.user;
                this.signups = r.data;
                this.sortedSignups = new PMOLib.Signups(this.shift.slots, this.shift.hasKeyPerson, this.shift.id);
                this.sortedSignups.populate(this.signups);
            }).catch(()=>{
                console.log("Error Loading Shift Info - " + this.shift.id)
            }).finally(()=>{
                this.loading = false;
            });
        },
        getNameForSlot(slot, hasKeyPerson) {
            console.log(hasKeyPerson)
            if (slot < this.signups.length) {
                return this.signups[slot].publishers.lastName + ', ' + this.signups[slot].publishers.firstName;
            } else {
                return "Open";
            }
        }
    },
    mounted() {
        this.getSignups();
    },
    computed: {
        shiftTimes() {
            return DayJS.utc(this.shift.shiftStart).format("H:mma") + " - " + DayJS.utc(this.shift.shiftEnd).format("H:mma");
        }
    },
    components: {
        SlotView
    }
}
</script>

<style>
.last {
    border-bottom: 1px solid black;
}
</style>