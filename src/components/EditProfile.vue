<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">My Profile</p>
            <button
                type="button"
                class="delete"
                @click="$emit('profileClose')"></button>
        </header>
        <section class="modal-card-body">
            <b-field label="First Name">
                <b-input
                    v-model="updatedUser.firstName"
                    required>
                </b-input>
            </b-field>
            <b-field label="Last Name">
                <b-input
                    v-model="updatedUser.lastName"
                    required>
                </b-input>
            </b-field>
            <b-field label="Phone">
                <b-input
                    v-model="updatedUser.phone"
                    required>
                </b-input>
            </b-field>
            <b-field label="Email">
                <b-input
                    type="email"
                    v-model="updatedUser.email"
                    required>
                </b-input>
            </b-field>
            <b-field label="Pin" message="Leave this field blank if you do not want to change your pin">
                <b-input
                    type="password"
                    v-model="pin"
                    password-reveal>
                </b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <b-button
                label="Cancel"
                @click="$emit('profileClose')" type='is-danger'></b-button>
            <b-button
                label="Update"
                type="is-primary" @click="update"></b-button>
        </footer>
        <b-loading :is-full-page="true" v-model="loading"></b-loading>
    </div>
</template>

<script>
import validator from 'validator';
import libPN from 'libphonenumber-js';
import PMOLib from 'pmo-lib/PMOLib';

let pmoLib = new PMOLib.PMO();

export default {
    name: "EditProfile",
    props: {
        user: Object
    },
    data() {
        return {
            updatedUser: Object.assign({},this.user),
            loading: false,
            pin: ''
        }
    },
    methods: {
        update() {
            if (!this.validate()) return;
            this.loading = true;
            pmoLib.updateProfile(
                this.updatedUser.firstName,
                this.updatedUser.lastName,
                this.updatedUser.email,
                this.updatedUser.phone,
                this.pin).then(r=> {
                    if (r.api.status.error) {
                        pmoLib.generalError(this,r.api.status.info);
                    } else {
                        this.$buefy.toast.open({
                            message: "Profile Updated",
                            type: 'is-success'
                        });
                        this.loading = false;
                        this.$emit('profileUpdated');
                    }
                }).catch(()=>{
                    pmoLib.generalError(this,"There was an error communicating with the server, please try again later");
                }).finally(()=>{
                    this.loading = false;
                })
        },
        validate() {
            if (!validator.isMobilePhone(this.updatedUser.phone)) {
                pmoLib.generalError(this, "Phone number must be populated and valid");
                return false;
            } else {
                let pn = libPN(this.updatedUser.phone,'US');
                this.updatedUser.phone = pn.formatNational();
            }
            if (!validator.isEmail(this.updatedUser.email)) {
                pmoLib.generalError(this, "Email address must be populated and valid");
                return false;
            }
            if (validator.isEmpty(this.updatedUser.firstName, { ignore_whitespace:true })) {
                pmoLib.generalError(this, "First name is a required field");
                return false;
            }
            if (validator.isEmpty(this.updatedUser.lastName, { ignore_whitespace:true })) {
                pmoLib.generalError(this, "Last name is a required field");
                return false;
            }
            return true;
        }
    }
}
</script>
