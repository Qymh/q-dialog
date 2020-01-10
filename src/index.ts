// eslint-disable-next-line no-unused-vars
import { VueConstructor } from 'vue';
// eslint-disable-next-line no-unused-vars
import QDialog, { Type, BtnsTrans, Dictionary } from './QDialog';
import VueCompositionApi from '@vue/composition-api';

import './index.scss';

let QDialogVueConstructor: VueConstructor;

let instance: any = '';
let _resolve: (value?: BtnsTrans) => void,
  _reject: (reason?: BtnsTrans) => void,
  _promise: Promise<BtnsTrans>;

// 重置
export function _resetInstance() {
  const props = instance.$options.props;
  for (const key in props) {
    let defaultValue = props[key].default;
    if (typeof defaultValue === 'function') {
      defaultValue = defaultValue();
    }
    instance[key] = defaultValue;
  }
}

// promise关闭
export function _doPromiseInstanceClose(type: Type, v: BtnsTrans) {
  if (type === 'confirm') {
    _resolve(v);
  } else if (type === 'cancel') {
    _reject(v);
  }
  instance.show = false;
}

export function _doInstanceClose() {
  instance.show = false;
}

export default {
  install(Vue: VueConstructor) {
    Vue.use(VueCompositionApi);
    Vue.component(QDialog.name, QDialog);
    QDialogVueConstructor = Vue.extend(QDialog);
  },
  show(opts: Dictionary = {}, Vue: VueConstructor) {
    _promise = new Promise((resolve, reject) => {
      if (!instance) {
        // for unit test
        if (Vue) {
          QDialogVueConstructor = Vue.extend(QDialog);
        }
        instance = new QDialogVueConstructor();
        instance.$mount();
        document.body.appendChild(instance.$el);
      } else {
        _resetInstance();
      }
      _resolve = resolve;
      _reject = reject;
      instance.show = true;
      instance._doPromiseInstanceClose = _doPromiseInstanceClose;
      instance._doInstanceClose = _doInstanceClose;
      for (const key in opts) {
        instance[key] = opts[key];
      }
    });
    if (opts.beforeClose) {
      return '';
    }
    return _promise;
  },
  close() {
    instance.show = false;
  }
};
