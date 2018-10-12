import Vue from 'vue';
import Vuex from 'vuex';

import admin from './admin';
import event from './event';
import list from './list';
import presence from './presence';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    admin,
    event,
    list,
    presence,
  },
});

export default store;
