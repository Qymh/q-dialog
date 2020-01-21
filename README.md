# q-dialog

一个精致的移动端vue弹窗组件

[更新日志](https://github.com/Qymh/q-dialog/blob/master/CHANGELOG.md)

## Demo

[Demo演示](https://qymh.github.io/q-dialog/demoDist/index.html)

## 下载

- npm

```shell
npm install q-dialog
```

- cnpm

```shell
cnpm install q-dialog
```

- yarn

```shell
yarn add q-dialog
```

## 引用

```javascript
import QDialog from "q-dialog";
import "q-dialog/dist/q-dialog.css";
Vue.use(QDialog);
Vue.prototype.$dialog = QDialog;
```

引用后就可以通过两种方式唤醒弹窗

一种是组件`q-dialog`

一种是this实例调用`this.$dialog.show()`和`this.$dialog.close()`

如果更改调用实例的方式可以手动指定

```javascript
import QDialog from "q-dialog";
import "q-dialog/dist/q-dialog.css";
Vue.use(QDialog);
Vue.prototype.$dialog = QDialog.show
Vue.prototype.$dialog.close = QDialog.close
```

更改后的方法便是`this.$dialog()`和`this.$dialog.close()`

## Props

### 组件下的 props

| props            |   Type   | Required |       Default       |             Description |
| ---------------- | :------: | :------: | :-----------------: | ----------------------: |
| v-model          | Boolean  |   true   |        false        |      是否显示双向绑定值 |
| title            |  String  |  false   |         ''          |                    标题 |
| details          |  String  |  false   |         ''          |                    详情 |
| richText         |  String  |  false   |         ''          |              富文本详情 |
| type             |  String  |  false   |        alert        | 类型 alert 或者 confirm |
| cancelText       |  String  |  false   |        取消         |            取消按钮文案 |
| cancelTextColor  |  String  |  false   |       #999999       |        取消按钮文案颜色 |
| confirmText      |  String  |  false   |        确认         |            确认按钮文案 |
| confirmTextColor |  String  |  false   |       #40a1ff       |        确认按钮文案颜色 |
| btns             |  String  |  false   |         []          |                按钮数组 |
| closeIcon        | Boolean  |  false   |        false        |        是否展示关闭按钮 |
| lock             | Boolean  |  false   |        false        |      是否点击背景可关闭 |
| beforeClose      | Function |  false   | (type,done) => {} |            关闭前的回调 |

### 实例下的 options

#### 展示组件

实例通过 `this.$dialog.show(options)`调用,`options`是一个对象 有如下属性

| props            |   Type   | Required |       Default       |             Description |
| ---------------- | :------: | :------: | :-----------------: | ----------------------: |
| title            |  String  |  false   |         ''          |                    标题 |
| details          |  String  |  false   |         ''          |                    详情 |
| richText         |  String  |  false   |         ''          |              富文本详情 |
| type             |  String  |  false   |        alert        | 类型 alert 或者 confirm |
| cancelText       |  String  |  false   |        取消         |            取消按钮文案 |
| cancelTextColor  |  String  |  false   |       #999999       |        取消按钮文案颜色 |
| confirmText      |  String  |  false   |        确认         |            确认按钮文案 |
| confirmTextColor |  String  |  false   |       #40a1ff       |        确认按钮文案颜色 |
| btns             |  String  |  false   |         []          |                按钮数组 |
| closeIcon        | Boolean  |  false   |        false        |        是否展示关闭按钮 |
| lock             | Boolean  |  false   |        false        |      是否点击背景可关闭 |
| beforeClose      | Function |  false   | (type,done) => {} |            关闭前的回调 |

和组件的 props 相比属性完全一样 只是少了一个 v-model

this.\$dialog.show 在没有`beforeClose`方法下,返回为一个`promise`

```javascript
this.$dialog
  .show({})
  .then(() => {})
  .catch(() => {});
```

再点击确认按钮的情况下在`promise`的`then`回调执行

再点击取消按钮的情况下在`promise`的`catch`回调执行

**如果有`beforeClose`方法会优先调用 beforeClose this.\$dialog.show 不会返回 promise**

#### 关闭组件

`this.$dalog.close()`

### props 解析

#### btns 解析

btns的优先级高于其他设置按钮的props

- btns
  - value 按钮文案
  - color 按钮颜色

弹窗分两种 一种是提醒弹窗 只有一个确认按钮 一种是确认弹窗 有取消和确认两个按钮 如果仅改动按钮的部分内容 比如 只改变确认按钮文案可以使用 `confirmText`

但如果在高度自定义按钮的情况下,取消确认按钮的文案和颜色都需要更改,可以使用 btns,btns 是一个长度最大为 2 的数组,value 则代表按钮文案,color 代表按钮颜色

#### beforeClose 解析

默认情况下点击确认和取消这两个按钮 或者 背景 和 取消的 icon 弹窗会直接关闭,但如果在特定情况下点击以上 4 个内容不关闭弹窗可以使用`beforeClose`

这个函数有两个参数

第一个参数是`type`

- confirm 点击确认按钮
- cancel 点击取消按钮
- icon 点击关闭 icon
- background 点击背景

第二个参数是`done`

调用 done 方法后`done()`弹窗关闭,且在点击取消或者确认按钮的时候这两个按钮会出现一个`loading`加载的图案

## slots

### details

详情插槽

### confirm

确认按钮插槽 确认按钮插槽优先级高于 props `btns` 和 props `confirmBtn`

### cancel

取消按钮插槽 取消按钮插槽优先级高于 props `btns` 和 props `cancelBtn`

## events

### confirm

点击确认按钮触发

### cancel

点击取消按钮触发

### close

弹窗关闭触发

### open

弹窗打开触发
