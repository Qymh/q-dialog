import Vue from 'vue';
import QDialog from '../src/index';
import Index from './index.vue';
import 'normalize.css';

import { Cell, Switch } from 'vant';
Vue.use(Cell).use(Switch);

Vue.use(QDialog);

Vue.prototype.$dialog = QDialog;

export default new Vue({
  el: '#app',
  render: h => h(Index)
});
