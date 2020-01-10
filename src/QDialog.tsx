import { createComponent, ref, watch } from '@vue/composition-api';
import { _doInstanceClose, _doPromiseInstanceClose } from './index';

export type Type = 'confirm' | 'cancel' | 'icon' | 'background';

export type Props = {
  btns: [];
};

export type Dictionary<T = any> = {
  [x: string]: T;
};

export type BtnsTrans = {
  value: string;
  color: string;
  loading: boolean;
};

const QDialog = createComponent({
  name: 'QDialog',
  setup(props, { parent, emit }) {
    const btnsTrans = ref<BtnsTrans[]>([]);

    // 完成回调
    const done = () => {
      if (parent) {
        emit('input', false);
      } else {
        _doInstanceClose();
      }
    };

    // 构造btns
    const generateBtnsTrans = () => {
      if (props.btns && props.btns.length) {
        btnsTrans.value = props.btns as BtnsTrans[];
      } else if (props.type === 'alert') {
        btnsTrans.value = [
          {
            value: props.confirmText,
            color: props.confirmTextColor,
            loading: false
          }
        ];
      } else if (props.type === 'confirm') {
        btnsTrans.value = [
          {
            value: props.cancelText,
            color: props.cancelTextColor,
            loading: false
          },
          {
            value: props.confirmText,
            color: props.confirmTextColor,
            loading: false
          }
        ];
      }
    };

    // 关闭前检查
    const beforeCloseCheck = (type: Type) => {
      if (typeof props.beforeClose === 'function') {
        props.beforeClose(type, done);
        return true;
      }
      return false;
    };

    // 按钮点击
    const doBtnClick = (v: BtnsTrans, type: Type) => {
      if (beforeCloseCheck(type)) {
        v.loading = true;
        return;
      }
      if (parent) {
        emit(type, v);
        emit('input', false);
      } else {
        _doPromiseInstanceClose(type, v);
      }
    };

    // 关闭icon点击
    const doCloseIconClick = () => {
      if (beforeCloseCheck('icon')) {
        return;
      }
      if (parent) {
        emit('input', false);
      } else {
        _doInstanceClose();
      }
    };

    // 背景点击
    const doBackgroundClick = () => {
      if (!props.lock) {
        if (beforeCloseCheck('background')) {
          return;
        }
        if (parent) {
          emit('input', false);
        } else {
          _doInstanceClose();
        }
      }
    };

    // 监听types
    watch(
      () => props.type,
      () => {
        generateBtnsTrans();
      }
    );

    // 监听btns
    watch(
      () => props.btns,
      () => {
        generateBtnsTrans();
      },
      {
        deep: true,
        lazy: true
      }
    );

    // 监听show
    watch(
      () => props.show,
      val => {
        if (!val) {
          emit('close');
          btnsTrans.value.forEach(v => (v.loading = false));
        } else {
          emit('open');
        }
      }
    );

    return {
      btnsTrans,
      done,
      generateBtnsTrans,
      beforeCloseCheck,
      doBtnClick,
      doCloseIconClick,
      doBackgroundClick
    };
  },
  model: {
    prop: 'show'
  },
  props: {
    // 展示
    show: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 详情
    details: {
      type: String,
      default: ''
    },
    // 富文本
    richText: {
      type: String,
      default: ''
    },
    // 类型
    type: {
      type: String,
      default: 'alert'
    },
    // 关闭文案
    cancelText: {
      type: String,
      default: '取消'
    },
    // 关闭文案颜色
    cancelTextColor: {
      type: String,
      default: '#999999'
    },
    // 确认文案
    confirmText: {
      type: String,
      default: '确认'
    },
    // 确认文案颜色
    confirmTextColor: {
      type: String,
      default: '#40A1FF'
    },
    // 按钮集合
    btns: {
      type: Array,
      default: () => []
    },
    // 是否展示关闭按钮
    closeIcon: {
      type: Boolean,
      default: false
    },
    // 是否禁止背景点击
    lock: {
      type: Boolean,
      default: false
    },
    // 关闭前的回调
    beforeClose: {
      type: [Function, String],
      default: ''
    }
  },
  render(this: any) {
    return (
      <div class='q-dialog'>
        <transition
          name='fade'
          enterActiveClass='animated fadeIn'
          leaveActiveClass='animated fadeOut'
        >
          <div
            class='q-dialog-background'
            v-show={this.show}
            onClick={this.doBackgroundClick}
          ></div>
        </transition>
        <transition
          name='zoom'
          enterActiveClass='animated zoomIn'
          leaveActiveClass='animated zoomOut'
        >
          <div class='q-dialog-core' v-show={this.show}>
            {this.title && <div class='q-dialog-core__title'>{this.title}</div>}
            {this.details && (
              <div class='q-dialog-core__details'>{this.details}</div>
            )}
            {this.richText && (
              <div
                class='q-dialog-core__details--richText'
                domPropsInnerHTML={this.richText}
              ></div>
            )}
            {this.$slots.details && (
              <div class='q-dialog-core__details--slot'>
                {this.$slots.details}
              </div>
            )}
            {this.btnsTrans && this.btnsTrans.length > 0 && (
              <div class='q-dialog-core-btns'>
                {(this.btnsTrans as BtnsTrans[]).map((v, i, arr) => {
                  const type =
                    arr.length === 2
                      ? i === 0
                        ? 'cancel'
                        : 'confirm'
                      : 'confirm';
                  let className = `q-dialog-core-btns-chunk--${type}`;
                  className += ' q-dialog-core-btns-chunk';
                  if (arr.length === 2 && type === 'confirm') {
                    className += ' q-dialog-core-btns-chunk--confirm--line';
                  }
                  const color = v.color;
                  return (
                    <div
                      class={className}
                      style={{ color }}
                      key={i}
                      onClick={this.doBtnClick.bind(this, v, type)}
                    >
                      {type === 'confirm' && this.$slots.confirm && (
                        <div class='q-dialog-core-btns-chunk--confirm-slot'>
                          {this.$slots.confirm}
                        </div>
                      )}
                      {type === 'cancel' && this.$slots.cancel && (
                        <div class='q-dialog-core-btns-chunk--cancel-slot'>
                          {this.$slots.cancel}
                        </div>
                      )}
                      {!v.loading &&
                        type === 'confirm' &&
                        !this.$slots.confirm && (
                          <div class='q-dialog-core-btns-chunk--confirm__value'>
                            {v.value}
                          </div>
                        )}
                      {!v.loading &&
                        type === 'cancel' &&
                        !this.$slots.cancel && (
                          <div class='q-dialog-core-btns-chunk--cancel__value'>
                            {v.value}
                          </div>
                        )}
                      {v.loading && type === 'confirm' && !this.$slots.confirm && (
                        <svg
                          class='q-dialog-core-btns-chunk-loading'
                          viewBox='25 25 50 50'
                        >
                          <circle
                            class='q-dialog-core-btns-chunk-loading__circle'
                            cx='50'
                            cy='50'
                            r='20'
                            fill='none'
                          />
                        </svg>
                      )}
                      {v.loading && type === 'cancel' && !this.$slots.cancel && (
                        <svg
                          class='q-dialog-core-btns-chunk-loading'
                          viewBox='25 25 50 50'
                        >
                          <circle
                            class='q-dialog-core-btns-chunk-loading__circle'
                            cx='50'
                            cy='50'
                            r='20'
                            fill='none'
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {this.closeIcon && (
              <div
                class='q-dialog-core__closeIcon'
                onClick={this.doCloseIconClick}
              ></div>
            )}
          </div>
        </transition>
      </div>
    );
  }
});

export default QDialog;
