<template>
    <b-navbar shadow>
        <template #brand>
            <b-navbar-item @click="menuSelect('upcoming')">
                <img
                    src="@/assets/pmo-nav.png"
                    alt="Public Ministry Organizer"
                >
            </b-navbar-item>
        </template>
        <template #start>
            <b-navbar-item :active="activeItem == 'upcoming'" @click="menuSelect('upcoming')">
                <b-icon icon='account'></b-icon>&nbsp; Upcoming
            </b-navbar-item>
            <b-navbar-item :active="activeItem=='scheduler'" @click="menuSelect('scheduler')">
                <b-icon icon='clock'></b-icon>&nbsp; Scheduler
            </b-navbar-item>
            
        </template>
        <template #end>
            <b-navbar-item v-if="user.congAdmin === 1" @click="goAdmin">
                <b-icon icon='application-cog'></b-icon>&nbsp; Admin Panel
            </b-navbar-item>
            <b-navbar-item @click="$emit('openProfile')">
                <b-icon icon='cog'></b-icon>&nbsp; My Profile
            </b-navbar-item>
            <b-navbar-item @click="menuLogout" tag="div">
                <div class="buttons">
                    <a class="button is-light">
                        Log out
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
export default {
    name: "PublicNavbar",
    data() {
        return {
            activeItem: "upcoming"
        }
    },
    props: {
        user: Object // if you add the active item here from root it will fix the bug of being re-logged in after
    },               // session time out and the wrong page being selected in the navbar, but i have to test it
    methods: {
        menuLogout() {
            this.$emit('logout')
        },
        menuSelect(item) {
            this.activeItem = item;
            this.$emit('menuselect',item);
        },
        goAdmin() {
            window.open('/admin','_self');
        }
    }
}
</script>