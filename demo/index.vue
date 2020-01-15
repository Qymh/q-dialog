<template>
  <div>
    <van-cell title="提醒弹窗">
      <van-switch v-model="show1" />
    </van-cell>
    <van-cell title="确认弹窗">
      <van-switch v-model="show2" />
    </van-cell>
    <van-cell title="自定义按钮">
      <van-switch v-model="show3" />
    </van-cell>
    <van-cell title="自定义btns按钮">
      <van-switch v-model="show4" />
    </van-cell>
    <van-cell title="展示关闭按钮">
      <van-switch v-model="show5" />
    </van-cell>
    <van-cell title="点击背景不能关闭">
      <van-switch v-model="show6" />
    </van-cell>
    <van-cell title="异步关闭">
      <van-switch v-model="show7" />
    </van-cell>
    <van-cell title="详情插槽">
      <van-switch v-model="show8" />
    </van-cell>
    <van-cell title="实例调用">
      <van-switch v-model="show9" @change="doShow9" />
    </van-cell>
    <van-cell title="异步实例调用">
      <van-switch v-model="show10" @change="doShow10" />
    </van-cell>
    <van-cell title="富文本">
      <van-switch v-model="show11" />
    </van-cell>
    <van-cell title="实例富文本">
      <van-switch v-model="show12" @change="doShow12" />
    </van-cell>
    <van-cell title="按钮插槽">
      <van-switch v-model="show13" />
    </van-cell>
    <van-cell title="无title">
      <van-switch v-model="show14" />
    </van-cell>
    <q-dialog v-model="show1" title="提醒弹窗" details="详情" />
    <q-dialog v-model="show2" title="确认弹窗" details="详情" type="confirm" />
    <q-dialog
      v-model="show3"
      title="自定义按钮"
      details="详情"
      type="confirm"
      confirmText="提交"
      confirmTextColor="deepskyblue"
      cancelText="驳回"
      cancelTextColor="deeppink"
    />
    <q-dialog v-model="show4" title="btns按钮" details="详情" :btns="btns4" />
    <q-dialog v-model="show5" title="关闭按钮" details="详情" closeIcon />
    <q-dialog v-model="show6" title="点击背景不能关闭" details="详情" lock />
    <q-dialog
      v-model="show7"
      title="异步关闭"
      details="详情"
      type="confirm"
      :beforeClose="beforeClose7"
    />
    <q-dialog v-model="show8" title="详情插槽">
      <div slot="details">
        我是一个插槽
      </div>
    </q-dialog>
    <q-dialog
      v-model="show11"
      title="富文本"
      richText="<div>我是富文本</div>"
    />
    <q-dialog
      v-model="show13"
      type="confirm"
      title="按钮插槽"
      details="详情"
      :beforeClose="beforeClose13"
      @close="doClose13"
    >
      <div slot="confirm" @click="doTimer13">
        {{ text13 }}
      </div>
    </q-dialog>
    <q-dialog v-model="show14" details="无标题" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      btns4: [
        {
          value: '驳回',
          color: 'deeppink'
        },
        {
          value: '提交',
          color: 'deepskyblue'
        }
      ],
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
      show7: false,
      show8: false,
      show9: false,
      show10: false,
      show11: false,
      show12: false,
      show13: false,
      show14: false,
      timer13: null,
      text13: '确认(5秒)'
    };
  },
  methods: {
    beforeClose7(type, done) {
      if (type === 'background') {
        done();
      } else {
        const timer = setTimeout(() => {
          done();
          clearTimeout(timer);
        }, 1000);
      }
    },
    doShow9(checked) {
      if (checked) {
        this.$dialog
          .show({
            title: '实例调用',
            details: '详情',
            type: 'confirm'
          })
          .then(() => {
            this.show9 = false;
          })
          .catch(() => {
            this.show9 = false;
          });
      }
    },
    doShow10(checked) {
      if (checked) {
        this.$dialog.show({
          title: '异步实例调用',
          details: '详情',
          type: 'confirm',
          closeIcon: true,
          beforeClose: (type, done) => {
            if (type === 'cancel' || type === 'confirm') {
              const timer = setTimeout(() => {
                done();
                clearTimeout(timer);
                this.show10 = false;
              }, 1000);
            } else {
              done();
              this.show10 = false;
            }
          }
        });
      }
    },
    doShow12(checked) {
      if (checked) {
        this.$dialog
          .show({
            title: '实例富文本',
            richText: '<div>我是实例富文本</div>'
          })
          .then(() => {
            this.show12 = false;
          });
      }
    },
    doTimer13() {},
    doClose13() {
      clearInterval(this.timer13);
      this.text13 = '确认(5秒)';
      this.timer13 = null;
    },
    beforeClose13(type, done) {
      if (type !== 'confirm') {
        done();
        return;
      }
      if (this.timer13 && this.timer13 !== 'finish') {
        return;
      }
      let time = 5;
      this.text13 = `确认(${time}秒)`;
      if (this.timer13 === 'finish') {
        done();
      } else {
        this.timer13 = setInterval(() => {
          time--;
          this.text13 = `确认(${time}秒)`;
          if (time === 0) {
            this.text13 = '确认';
            clearInterval(this.timer13);
            this.timer13 = 'finish';
          }
        }, 1000);
      }
    }
  }
};
</script>
