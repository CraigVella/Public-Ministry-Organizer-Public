<template>
  <div id="pmo-public">
    <b-loading :active="loading"></b-loading>
    <PageLogin v-if="!logged_in" v-on:logged-in="loginComplete"></PageLogin>
    <div v-if="logged_in">
      <PublicNavbar v-on:logout="logout" v-on:menuselect="menuSelect"></PublicNavbar>
      <!--<AdminPublishers v-if="pageSelect === 'publishers'" :user='userObj'></AdminPublishers>
      <AdminLocations v-if="pageSelect === 'locations'" :user="userObj"></AdminLocations>-->
    </div>
    <PageFooter></PageFooter>
  </div>
</template>

<script>
import PageLogin from './components/PageLogin.vue'
import PageFooter from './components/PageFooter.vue'
import PublicNavbar from './components/PublicNavbar.vue'

import PMOLib from 'pmo-lib/PMOLib'
let adminLib = new PMOLib.PMO(true);

export default {
  name: 'PMOPublic',
  metaInfo: {
    titleTemplate: "Public Ministry Organizer %s"
  },
  components: {
    PageLogin, PageFooter, PublicNavbar
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
      pageSelect: 'publishers'
    }
  },
  methods: {
    menuSelect(item) {
      this.pageSelect = item;
    },
    loginComplete() {
      this.loading = true;
      adminLib.getUserObject().then(r => {
        this.loading = false;
        this.userObj = r.data.api.user;
        this.logged_in = true;
      }).catch( () => {
        adminLib.generalError(this, 'There was an error loading Public Ministry Organizer - Please try again later');
      });
    },
    logout() {
      this.loading = true;
      adminLib.logout().then(() => {
        this.userObj = {};
        this.loading = false;
        this.logged_in = false;
      }).catch( () => {
        adminLib.generalError(this,'There was an error logging out - Please try again later');
      });
    }
  },
  mounted() {
    adminLib.isLoggedIn().then( r=> {
      this.logged_in = r;
      if (this.logged_in) {
        this.loginComplete();
      } else {
        this.loading = false;
      }
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
