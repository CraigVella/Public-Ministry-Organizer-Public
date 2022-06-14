<template>
    <span class="slotview" @click="panelOpen = !panelOpen">
        <span class="panel-icon">
            <b-icon :icon="signup.keyPersonSlot ? 'key' : 'account'"
            :type="signup.populated ? 'is-success' : ''"></b-icon>
        </span>
        <span v-if="signup.populated" >
            <span class="ml-2">{{signup.signupObject.publishers.lastName + ', ' + signup.signupObject.publishers.firstName}}</span>
            <b-collapse animation="slide" :open.sync="panelOpen" :aria-id="shiftId + '-' + idx">
                <span>
                    Test Content
                </span>
            </b-collapse>
        </span>
    </span>
</template>

<script>
export default {
    name: "SlotView",
    props: {
        idx: Number,
        signup: Object,
        userObj: Object,
        shiftId: Number
    },
    data() {
        return {
            panelOpen: false
        }
    },
    mounted() {
        
    }
}
</script>

<style>
.slotview {
    width: 100%;
}
</style>