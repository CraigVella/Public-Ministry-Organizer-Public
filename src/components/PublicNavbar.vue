<template>
    <b-navbar shadow>
        <template #brand>
            <b-navbar-item>
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
    name: "AdminNavbar",
    data() {
        return {
            activeItem: "upcoming"
        }
    },
    methods: {
        menuLogout() {
            this.$emit('logout')
        },
        menuSelect(item) {
            this.activeItem = item;
            this.$emit('menuselect',item);
        }
    }
}
</script>