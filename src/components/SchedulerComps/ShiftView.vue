<template>
    <div class="panel">
        <p class="panel-tabs mb-0">
            <b>{{shiftTimes}}</b>
        </p>
        <a class="panel-block" v-for="x in shift.slots" :key="x">
            <SlotView v-if="!loading" :idx="x-1" :signup="sortedSignups ? sortedSignups.signups[x-1] : {}" :userObj="userObj" :shiftId="shift.id"></SlotView>
            <div v-if="loading" class="loading-slot">
                <span class="panel-icon">
                    <b-icon :icon="signup.keyPersonSlot ? 'key' : 'account'"
                    :type="signup.populated ? 'is-success' : ''"></b-icon>
                </span>
                <b-skeleton ></b-skeleton>
            </div>
        </a>
        <p class="panel-block">
            <b-field v-if="!loading && !hasCurrentDatePassed" grouped position="is-centered" style="width: 100%">
                <p class="control" v-if="!amIScheduled && canISchedule">
                    <b-button :loading="scheduling" @click="signup(false)" type='is-primary is-small' icon-left="pencil">Signup</b-button>
                </p>
                <p class="control" v-if="amIScheduled">
                    <b-button :loading="scheduling" @click="updateNote" type='is-warning is-small' icon-left="pencil">{{myNote ? 'Edit' : 'Add'}} Note</b-button>
                </p>
                <p class="control" v-if="amIScheduled">
                    <b-button :loading="scheduling" @click="unschedule" type='is-danger is-small' icon-left="cancel">Unschedule</b-button>
                </p>
                <p class="control" v-if="!amIScheduled && canIScheduleAsAKeyMan">
                    <b-button :loading="scheduling" @click="signup(true)" type='is-warning is-small' icon-left="key">Signup as Keyman</b-button>
                </p>
                <p class="control" v-if="!amIScheduled && !canISchedule && !canIScheduleAsAKeyMan">
                    <b-button disabled type='is-danger is-small' icon-left="cancel">Schedule is full</b-button>
                </p>
            </b-field>
            <b-field v-if="hasCurrentDatePassed" grouped position="is-centered" style="width: 100%">
                <p class="control">
                    <b-button disabled type='is-small' icon-left="cancel">Date has passed</b-button>
                </p>
            </b-field>
            <b-field v-if="loading" grouped position="is-centered" style="width: 100%">
                <p class="control">
                    <b-icon type='is-small' icon="loading" custom-class="mdi-spin"></b-icon>
                </p>
            </b-field>
        </p>
        <b-modal v-model="noteModalOpen"  trap-focus aria-role="dialog" 
            aria-modal :can-cancel="false" :full-screen="this.$isMobile()">
            <AddEditNote :note="myNote" @onNoteReturn="onNoteReturn" @cancel="noteModalOpen = false"></AddEditNote>
        </b-modal>
    </div>
</template>

<script>
import SlotView from './SlotView.vue';
import AddEditNote from './AddEditNote.vue';

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
        },
        shift() {
            this.getSignups();
        }
    },
    data() {
        return {
            loading: false,
            userObj: null,
            signups: [],
            sortedSignups: null,
            scheduling: false,
            noteModalOpen: false
        }
    },
    methods: {
        getSignups() {
            this.loading = true;
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
        signup(asKeyMan) {
            let keyManString = asKeyMan ? 'Y' : 'N';
            this.scheduling = true;
            pmoLib.signUpForShift(this.shift.id,this.date,'',keyManString).then(r => {
                if (r.api.status.error) {
                    pmoLib.generalError(this,r.api.status.info);
                } else {
                    this.$buefy.toast.open({
                        type: 'is-success',
                        message: "You have been succesfully scheduled"
                    });
                }
                this.getSignups();
            }).finally(()=>{
                this.scheduling = false;
            }).catch(()=>{
                pmoLib.generalError(this, "There was an error communicating with the server, please try again later");
            })
        },
        unschedule() {
            this.$buefy.dialog.confirm({
                    title: 'Unschedule',
                    message: 'Are you sure you want to <b>unschedule</b> yourself?',
                    confirmText: 'Unschedule',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        this.scheduling = true;
                        pmoLib.removeFromShift(this.assignmentPersonId).then(r => {
                            if (r.api.status.error) {
                                pmoLib.generalError(this,r.api.status.info);
                            } else {
                                this.$buefy.toast.open({
                                    type: 'is-danger',
                                    message: "You have been succesfully unscheduled"
                                });
                            }
                            this.$emit('onUnschedule');
                            this.getSignups();
                        }).finally(()=>{
                            this.scheduling = false;
                        }).catch(()=>{
                            pmoLib.generalError(this, "There was an error communicating with the server, please try again later");
                        })
                    }
                })
        },
        updateNote() {
            this.noteModalOpen = true;
        },
        onNoteReturn(note) {
            pmoLib.updateNote(this.assignmentPersonId, note ? note : '').then(r => {
                if (r.api.status.error) {
                    pmoLib.generalError(this,r.api.status.info);
                } else {
                    this.$buefy.toast.open({
                        type: 'is-warning',
                        message: "Note updated"
                    });
                }
                this.getSignups();
            }).finally(()=>{
                this.noteModalOpen = false;
            }).catch(()=>{
                pmoLib.generalError(this, "There was an error communicating with the server, please try again later");
            })
        }
    },
    mounted() {
        this.getSignups();
    },
    computed: {
        shiftTimes() {
            return DayJS.utc(this.shift.shiftStart).format("h:mma") + " - " + DayJS.utc(this.shift.shiftEnd).format("h:mma");
        },
        amIScheduled(){
            let signedUp = false;
            if (this.sortedSignups) {
                this.sortedSignups.signups.forEach(e => {
                    if (e.populated && e.signupObject.pubId === this.userObj.id) {
                        signedUp = true;
                    }
                });
            }
            return signedUp;
        },
        amIScheduledAsKeyMan() {
            let scheduledAsKeyMan = false;
            if (this.sortedSignups && this.sortedSignups.hasKeyPerson ) {
                this.sortedSignups.signups.forEach(e => {
                    if (e.keyPersonSlot && e.populated && e.signupObject.pubId === this.userObj.id) {
                        scheduledAsKeyMan = true;
                    }
                });
            } 
            return scheduledAsKeyMan;
        },
        canIScheduleAsAKeyMan() {
            if (this.sortedSignups) {
                if (this.userObj.keyPerson === 'Y' && !this.amIScheduled && this.sortedSignups.keyPersonSlotsLeft > 0) {
                    return true;
                }
            }
            return false;
        },
        canISchedule() {
            if (this.sortedSignups) {
                if (!this.amIScheduled && this.sortedSignups.slotsLeft > 0) {
                    return true;
                }
            }
            return false;
        },
        hasCurrentDatePassed() {
            return DayJS(this.date).isBefore(DayJS().add(-1,'day').toDate());
        },
        assignmentPersonId() {
            let aId = null;
            if (this.sortedSignups && this.amIScheduled) {
                this.sortedSignups.signups.forEach(e => {
                    if (e.populated && e.signupObject.pubId === this.userObj.id) {
                        aId = e.signupObject.id;
                    }
                });
            }
            return aId;
        },
        myNote() {
            let note = null;
            if (this.sortedSignups && this.amIScheduled) {
                this.sortedSignups.signups.forEach(e => {
                    if (e.populated && e.signupObject.pubId === this.userObj.id) {
                        note = e.signupObject.note;
                    }
                });
            }
            return note;
        }
    },
    components: {
        SlotView, AddEditNote
    }
}
</script>

<style>
.last {
    border-bottom: 1px solid black;
}
.loading-slot{
    width: 100%; 
    display: flex; 
    height: 24px;
}
</style>