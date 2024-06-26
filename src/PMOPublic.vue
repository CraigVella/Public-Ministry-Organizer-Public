<template>
  <div id="pmo-public">
    <b-loading :active="loading"></b-loading>
    <PageLogin v-if="!logged_in" v-on:logged-in="loginComplete"></PageLogin>
    <div v-if="logged_in">
      <PublicNavbar ref="navbar" @openProfile="editProfileModal = true" v-on:logout="logout" :user="userObj" v-on:menuselect="menuSelect"></PublicNavbar>
      <PublicScheduler @loginIssue='attemptAutoLogin' v-if="pageSelect === 'scheduler'" :user="userObj" ref="scheduler"></PublicScheduler>
      <PublicUpcoming @loginIssue='attemptAutoLogin' v-if="pageSelect === 'upcoming'" @toScheduler="$refs.navbar.menuSelect('scheduler')" :user="userObj" ref="upcoming"></PublicUpcoming>
      <b-modal v-model="editProfileModal"  trap-focus aria-role="dialog" 
            aria-modal :can-cancel="false" :full-screen="this.$isMobile()">
            <EditProfile :user="userObj" @profileUpdated="profileUpdated" @profileClose="editProfileModal = false"></EditProfile>
      </b-modal>
    </div>
    <PageFooter></PageFooter>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

import PageLogin from './components/PageLogin.vue'
import PageFooter from './components/PageFooter.vue'
import PublicNavbar from './components/PublicNavbar.vue'
import PublicScheduler from './components/PublicScheduler.vue';
import PublicUpcoming from './components/PublicUpcoming.vue';
import EditProfile from './components/EditProfile.vue';

import PMOLib from 'pmo-lib/PMOLib'
let pmoLib = new PMOLib.PMO();

export default {
  name: 'PMOPublic',
  metaInfo: {
    titleTemplate: "Public Ministry Organizer %s"
  },
  components: {
    PageLogin, PageFooter, PublicNavbar,
    PublicScheduler, PublicUpcoming, EditProfile
  }, 
  data() {
    return {
      logged_in: false,
      loading: true,
      userObj: {
        congregation: {
          congName: ''
        }
      },
      pageSelect: 'upcoming',
      editProfileModal: false
    }
  },
  methods: {
    menuSelect(item) {
      this.pageSelect = item;
    },
    loginComplete() {
      this.loading = true;
      pmoLib.getUserObject().then(r => {
        this.loading = false;
        this.userObj = r.data.api.user;
        this.logged_in = true;
      }).catch( () => {
        pmoLib.generalError(this, 'There was an error loading Public Ministry Organizer - Please try again later');
      });
    },
    logout() {
      this.loading = true;
      pmoLib.logout().then(() => {
        Cookies.remove('deviceId');
        this.userObj = {};
        this.loading = false;
        this.logged_in = false;
      }).catch( () => {
        pmoLib.generalError(this,'There was an error logging out - Please try again later');
      });
    },
    profileUpdated() {
      this.loginComplete();
      this.visibilityChange(); // Force a refresh on pages that are open
      this.editProfileModal = false;
    }, 
    attemptAutoLogin() {
      pmoLib.isLoggedIn().then( r=> {
        this.logged_in = r;
        if (this.logged_in) {
          this.loginComplete();
        } else {
          // attempt to see if we have a device ID
          if (Cookies.get('deviceId')) {
            // We have a cookie
            pmoLib.deviceLogin(Cookies.get('deviceId')).then(r=> {
              this.logged_in = r.api.logged_in;
              if (this.logged_in) {
                // rewrite cookie for longer time
                Cookies.set('deviceId', Cookies.get('deviceId'),{expires: 365});
                this.loginComplete();
              } else {
                this.loading = false; // we have failed the device Id lets drop it
                Cookies.remove('deviceId');
              }
            })
          } else {
            this.loading = false; // No cookie no login
          }
        }
      })
    },
    visibilityChange() {
      if (document.visibilityState === 'visible') {
          if (this.logged_in) {
            switch(this.pageSelect) {
              case 'scheduler':
                this.$refs.scheduler.pageVisibleTrigger();
                break;
              case 'upcoming':
                this.$refs.upcoming.pageVisibleTrigger();
                break;
            }
          }
      }
    }
  },
  mounted() {
    this.attemptAutoLogin();
  },
  created() { // This is really for PWA to refresh data if you minimize it
    document.addEventListener("visibilitychange",this.visibilityChange)
  }
}
</script>

<style>
body {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

#pmo-public {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
