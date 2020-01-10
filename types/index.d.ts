// eslint-disable-next-line no-unused-vars
import { PluginFunction } from 'vue';

export type CloseType = 'confirm' | 'cancel' | 'icon' | 'background';

export type BtnsOpt = {
  value: string;
  color?: string;
};

export interface BtnsTransOpt extends BtnsOpt {
  loading?: boolean;
}

export type ShowOptions = {
  title?: string;
  details?: string;
  richText: string;
  type?: 'alert' | 'confirm';
  cancelText?: string;
  cancelTextColor?: string;
  confirmText?: string;
  confirmTextColor?: string;
  btns?: BtnsOpt[];
  closeIcon?: boolean;
  lock?: boolean;
  beforeClose?: (type: CloseType, done: () => void) => void;
};

export type Instance = {
  show: (options?: ShowOptions) => Promise<BtnsTransOpt> | void;
  close: () => void;
};

declare module 'vue/types/vue' {
  interface Vue {
    $dialog: Instance;
  }
}
export interface QDialog {
  install: () => void;
}
declare const QDialog: QDialog;

export default QDialog;
