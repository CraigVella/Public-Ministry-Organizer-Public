<template>
    <div class="slotview-wrapper">
        <div :class="signup.populated ? 'slotview-populated' : 'slotview'" @click="signup.populated ? panelOpen = !panelOpen : panelOpen">
            <span class="panel-icon">
                <b-icon :icon="signup.keyPersonSlot ? 'key' : 'account'"
                :type="signup.populated ? 'is-success' : ''"></b-icon>
            </span>
            <div v-if="signup.populated" class="slotview" >
                <span class="info-wrap">
                    <span :class="displayNameClass">{{displayName}}</span>
                    <span class="icon-wrap">
                        <b-field grouped>
                                <b-icon class="icon-color-note" v-if="signup.signupObject.note"
                                icon="note">
                                </b-icon>
                                <b-icon type="is-danger" v-if="signup.signupObject.publishers.congId !== userObj.congId"
                                icon="home">
                                </b-icon>
                                <b-icon :type="panelOpen ? 'is-primary' : ''" 
                                class="icon-color-grey" :icon="panelOpen ? 'chevron-up' : 'chevron-down'"></b-icon>
                        </b-field>
                    </span>
                </span>
            </div>
        </div>
        <b-collapse v-if="signup.populated" animation="slide" :open.sync="panelOpen" :aria-id="shiftId + '-' + idx">
            <span class="extra-content">
                <b-field>
                    <b-message class="mt-2" v-if="signup.signupObject.note" type="is-warning">
                        {{signup.signupObject.note}}
                    </b-message>
                </b-field>
                <b-field :position="this.$isMobile() ? '' : 'is-centered'" grouped group-multiline>
                    <p class="control">
                        <b-taglist attached @click.stop.native="smsClick(signup.signupObject.publishers.phone)">
                            <b-tag icon="message-processing" type="is-dark"></b-tag>
                            <b-tag type="is-primary">Send an SMS</b-tag>
                        </b-taglist>
                    </p>
                    <p class="control">
                        <b-taglist attached @click.stop.native="phoneClick(signup.signupObject.publishers.phone)">
                            <b-tag icon="phone" type="is-dark"></b-tag>
                            <b-tag type="is-primary">{{signup.signupObject.publishers.phone}}</b-tag>
                        </b-taglist>
                    </p>
                    <p class="control">
                        <b-taglist attached @click.stop.native="emailClick(signup.signupObject.publishers.email)">
                            <b-tag icon="email" type="is-dark"></b-tag>
                            <b-tag type="is-primary">{{signup.signupObject.publishers.email}}</b-tag>
                        </b-taglist>
                    </p>
                    <p class="control" v-if="signup.signupObject.publishers.congId !== userObj.congId">
                        <b-taglist attached>
                            <b-tag icon="home" type="is-dark"></b-tag>
                            <b-tag type="is-primary">{{signup.signupObject.publishers.congregation.congName}}</b-tag>
                        </b-taglist>
                    </p>
                </b-field>
            </span>
        </b-collapse>
    </div>
</template>

<script>
import libPN from 'libphonenumber-js';

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
        
    },
    methods: {
        phoneClick(phone) {
            const phoneNum = libPN(phone,'US');
            window.open(phoneNum.getURI(),'_top');
        },
        emailClick(email) {
            window.open("mailto:"+email,'_top')
        },
        smsClick(phone) {
            const phoneNum = libPN(phone,'US');
            window.open('sms://'+phoneNum.formatInternational(),'_top');
        }
    },
    computed: {
        displayName() {
            if (this.signup.populated) {
                return this.signup.signupObject.publishers.lastName + ', ' + this.signup.signupObject.publishers.firstName;
            } else {
                return '';
            }
        },
        displayNameClass() {
            if (this.displayName.length >= 25 && this.$isMobile()) {
                return 'name-wrap name-wrap-long ml-2';
            } else {
                return 'name-wrap ml-2';
            }
        }
    }
}
</script>

<style>
.slotview-wrapper {
    width: 100%;
}
.slotview {
    width: 100%;
}
.slotview-populated {
    width: 100%;
    display: flex;
}
.icon-wrap {
    width: 100%;
    justify-content: right;
    display: inline-flex;
}
.info-wrap {
    display: flex;
    width: 100%;
}
.name-wrap {
    display: inline-flex;
    width: inherit;
    min-inline-size: fit-content;
    align-items: center;
}
.name-wrap-long {
    font-size: small;
}
.extra-content {
    display: block;
}
.icon-color-grey {
    color:hsl(0deg, 0%, 48%);
}
.icon-color-note {
    color:rgb(255, 153, 0);
    /*outline-style: dotted;
    outline-color: black;
    outline-width: 2px;*/
}
</style>