import { createLocalVue, mount } from '@vue/test-utils';
import QDialog from '../../src/index';
import assert from 'assert';
import { Type } from 'src/QDialog';

const localVue = createLocalVue();
localVue.use(QDialog);
localVue.prototype.$dialog = QDialog;

describe('q-dialog', () => {
  describe('props', () => {
    it('show', done => {
      const wrapper = mount(
        {
          template: '<q-dialog title="测试" v-model="show"></q-dialog>'
        },
        {
          localVue,
          data() {
            return {
              show: false
            };
          }
        }
      );
      wrapper.setData({ show: true });
      setTimeout(() => {
        assert.strictEqual(
          wrapper.find('.q-dialog-background').element.style.display,
          ''
        );
        done();
      }, 400);
    });

    it('title', () => {
      const wrapper = mount(
        {
          template: '<q-dialog title="测试"></q-dialog>'
        },
        {
          localVue
        }
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core__title').element.innerText,
        '测试'
      );
    });

    it('details', () => {
      const wrapper = mount(
        {
          template: '<q-dialog title="测试" details="测试详情"></q-dialog>'
        },
        {
          localVue
        }
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core__details').element.innerText,
        '测试详情'
      );
    });

    it('richText', () => {
      const wrapper = mount(
        {
          template:
            '<q-dialog title="测试" richText="<div>123</div>"></q-dialog>'
        },
        {
          localVue
        }
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core__details--richText').element.innerHTML,
        '<div>123</div>'
      );
    });

    it('type', () => {
      const wrapper = mount(
        {
          template: '<q-dialog title="测试" type="confirm"></q-dialog>'
        },
        {
          localVue
        }
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core-btns-chunk--confirm').element.innerText,
        '确认'
      );
    });

    it('diy options', () => {
      const wrapper = mount(
        {
          template:
            '<q-dialog title="测试" type="confirm" cancelText="测试取消" cancelTextColor="deeppink" confirmText="测试确认" confirmTextColor="deepskyblue"></q-dialog>'
        },
        {
          localVue
        }
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core-btns-chunk--confirm').element.innerText,
        '测试确认'
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core-btns-chunk--confirm').element.style.color,
        'deepskyblue'
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core-btns-chunk--cancel').element.innerText,
        '测试取消'
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core-btns-chunk--cancel').element.style.color,
        'deeppink'
      );
    });

    it('diy btns', () => {
      const wrapper = mount(
        {
          template: '<q-dialog title="测试" :btns="btns"></q-dialog>'
        },
        {
          localVue,
          data() {
            return {
              btns: [
                {
                  value: '测试取消',
                  color: 'deeppink'
                },
                {
                  value: '测试确认',
                  color: 'deepskyblue'
                }
              ]
            };
          }
        }
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core-btns-chunk--confirm').element.innerText,
        '测试确认'
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core-btns-chunk--confirm').element.style.color,
        'deepskyblue'
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core-btns-chunk--cancel').element.innerText,
        '测试取消'
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core-btns-chunk--cancel').element.style.color,
        'deeppink'
      );
    });

    it('closeIcon', () => {
      const wrapper = mount(
        {
          template: '<q-dialog closeIcon></q-dialog>'
        },
        {
          localVue
        }
      );
      assert.ok(wrapper.find('.q-dialog-core__closeIcon').element);
    });

    describe('beforeClose', () => {
      it('btn', done => {
        const wrapper = mount(
          {
            template:
              '<q-dialog title="测试" type="confirm" :beforeClose="beforeClose" v-model="show"></q-dialog>'
          },
          {
            localVue,
            data() {
              return {
                show: true
              };
            },
            methods: {
              beforeClose: (action, done) => {
                setTimeout(() => {
                  done();
                }, 1000);
              }
            }
          }
        );
        wrapper.find('.q-dialog-core-btns-chunk--confirm').trigger('click');
        const timer = setTimeout(() => {
          assert.ok(wrapper.find('.q-dialog-core-btns-chunk-loading').exists());
          const innerTimer = setTimeout(() => {
            assert.ok(
              !wrapper.find('.q-dialog-core-btns-chunk-loading').exists()
            );
            clearTimeout(innerTimer);
            done();
          }, 1100);
          clearTimeout(timer);
        });
      });

      it('icon', done => {
        const wrapper: any = mount(
          {
            template:
              '<q-dialog title="测试" closeIcon :beforeClose="beforeClose" v-model="show"></q-dialog>'
          },
          {
            localVue,
            data() {
              return {
                show: true
              };
            },
            methods: {
              beforeClose: (action, done) => {
                setTimeout(() => {
                  done();
                }, 1000);
              }
            }
          }
        );
        wrapper.find('.q-dialog-core__closeIcon').trigger('click');
        const timer = setTimeout(() => {
          assert.ok(wrapper.vm.show);
          const innerTimer = setTimeout(() => {
            assert.ok(!wrapper.vm.show);
            clearTimeout(innerTimer);
            done();
          }, 1100);
          clearTimeout(timer);
        });
      });

      it('background', done => {
        const wrapper: any = mount(
          {
            template:
              '<q-dialog title="测试" closeIcon :beforeClose="beforeClose" v-model="show"></q-dialog>'
          },
          {
            localVue,
            data() {
              return {
                show: true
              };
            },
            methods: {
              beforeClose: (action, done) => {
                setTimeout(() => {
                  done();
                }, 1000);
              }
            }
          }
        );
        wrapper.find('.q-dialog-background').trigger('click');
        const timer = setTimeout(() => {
          assert.ok(wrapper.vm.show);
          const innerTimer = setTimeout(() => {
            assert.ok(!wrapper.vm.show);
            clearTimeout(innerTimer);
            done();
          }, 1100);
          clearTimeout(timer);
        });
      });
    });
  });

  describe('events', () => {
    it('alert btn click', done => {
      const wrapper = mount(
        {
          template:
            '<q-dialog title="测试" details="测试" v-model="show"></q-dialog>'
        },
        {
          localVue,
          data() {
            return {
              show: true
            };
          }
        }
      );
      const timer = setTimeout(() => {
        wrapper.find('.q-dialog-core-btns-chunk--confirm').trigger('click');
        // assert.ok(wrapper.emitted().confirm);
        clearTimeout(timer);
        done();
      }, 200);
    });

    it('confirm btn click', done => {
      const wrapper = mount(
        {
          template:
            '<q-dialog title="测试" details="测试" type="confirm" v-model="show"></q-dialog>'
        },
        {
          localVue,
          data() {
            return {
              show: true
            };
          }
        }
      );
      const timer = setTimeout(() => {
        wrapper.find('.q-dialog-core-btns-chunk--confirm').trigger('click');
        // assert.ok(wrapper.emitted().confirm);
        clearTimeout(timer);
        done();
      }, 200);
    });

    it('cancel btn click', done => {
      const wrapper = mount(
        {
          template:
            '<q-dialog title="测试" details="测试" type="confirm" v-model="show"></q-dialog>'
        },
        {
          localVue,
          data() {
            return {
              show: true
            };
          }
        }
      );
      const timer = setTimeout(() => {
        wrapper.find('.q-dialog-core-btns-chunk--cancel').trigger('click');
        // assert.ok(wrapper.emitted().cancel);
        clearTimeout(timer);
        done();
      }, 200);
    });

    it('closeIcon', done => {
      const wrapper: any = mount(
        {
          template:
            '<q-dialog title="测试" details="测试" v-model="show" closeIcon></q-dialog>'
        },
        {
          localVue,
          data() {
            return {
              show: true
            };
          }
        }
      );
      wrapper.find('.q-dialog-core__closeIcon').trigger('click');
      const timer = setTimeout(() => {
        assert.strictEqual(wrapper.vm.show, false);
        clearTimeout(timer);
        done();
      }, 200);
    });

    it('lock', done => {
      const wrapper: any = mount(
        {
          template:
            '<q-dialog title="测试" details="测试" v-model="show" lock></q-dialog>'
        },
        {
          localVue,
          data() {
            return {
              show: true
            };
          }
        }
      );
      wrapper.find('.q-dialog-background').trigger('click');
      const timer = setTimeout(() => {
        assert.strictEqual(wrapper.vm.show, true);
        clearTimeout(timer);
        done();
      }, 200);
    });

    it('click background', done => {
      const wrapper: any = mount(
        {
          template:
            '<q-dialog title="测试" details="测试" v-model="show"></q-dialog>'
        },
        {
          localVue,
          data() {
            return {
              show: true
            };
          }
        }
      );
      const timer = setTimeout(() => {
        wrapper.find('.q-dialog-background').trigger('click');
        const innerTimer = setTimeout(() => {
          clearTimeout(innerTimer);
          assert.ok(!wrapper.vm.show);
          done();
        }, 200);
        clearTimeout(timer);
      }, 200);
    });
  });

  describe('slots', () => {
    it('details', () => {
      const wrapper = mount(
        {
          template:
            '<q-dialog title="测试"><div slot="details">123</div></q-dialog>'
        },
        {
          localVue
        }
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core__details--slot').element.innerHTML,
        '<div>123</div>'
      );
    });

    it('cancel', () => {
      const wrapper = mount(
        {
          template:
            '<q-dialog title="测试" type="confirm"><div slot="cancel">测试取消</div></q-dialog>'
        },
        {
          localVue
        }
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core-btns-chunk--cancel-slot').element
          .innerHTML,
        '<div>测试取消</div>'
      );
    });

    it('confirm', () => {
      const wrapper = mount(
        {
          template:
            '<q-dialog title="测试"><div slot="confirm">测试确认</div></q-dialog>'
        },
        {
          localVue
        }
      );
      assert.strictEqual(
        wrapper.find('.q-dialog-core-btns-chunk--confirm-slot').element
          .innerHTML,
        '<div>测试确认</div>'
      );
    });
  });

  describe('instance', () => {
    it('confirm', done => {
      const localVue = createLocalVue();
      localVue.use(QDialog);
      localVue.prototype.$dialog = QDialog;
      const wrapper: any = mount(
        {
          template: '<div>123</div>'
        },
        {
          localVue
        }
      );
      wrapper.vm.$dialog.show(
        {
          title: '123'
        },
        localVue
      );
      const timer = setTimeout(() => {
        const $item: any = document.getElementsByClassName(
          'q-dialog-core-btns-chunk--confirm'
        )[0];
        $item.click();
        const innerTimer = setTimeout(() => {
          const $dialog: any = document.getElementsByClassName(
            'q-dialog-core'
          )[0];
          assert.strictEqual($dialog.style.display, 'none');
          clearTimeout(innerTimer);
          done();
        }, 300);
        clearTimeout(timer);
      }, 200);
    });

    it('cancel', done => {
      const localVue = createLocalVue();
      localVue.use(QDialog);
      localVue.prototype.$dialog = QDialog;
      const wrapper: any = mount(
        {
          template: '<div>123</div>'
        },
        {
          localVue
        }
      );
      wrapper.vm.$dialog.show(
        {
          title: '123',
          type: 'confirm'
        },
        localVue
      );
      const timer = setTimeout(() => {
        const $item: any = document.getElementsByClassName(
          'q-dialog-core-btns-chunk--cancel'
        )[0];
        $item.click();
        const innerTimer = setTimeout(() => {
          const $dialog: any = document.getElementsByClassName(
            'q-dialog-core'
          )[0];
          assert.strictEqual($dialog.style.display, 'none');
          clearTimeout(innerTimer);
          done();
        }, 300);
        clearTimeout(timer);
      }, 200);
    });

    it('close by icon', done => {
      const wrapper: any = mount(
        {
          template: '<div>123</div>'
        },
        {
          localVue
        }
      );
      wrapper.vm.$dialog.show(
        {
          title: '123',
          type: 'confirm',
          closeIcon: true
        },
        localVue
      );
      const timer = setTimeout(() => {
        const $item: any = document.getElementsByClassName(
          'q-dialog-core__closeIcon'
        )[0];
        $item.click();
        const innerTimer = setTimeout(() => {
          const $dialog: any = document.getElementsByClassName(
            'q-dialog-core'
          )[0];
          assert.strictEqual($dialog.style.display, 'none');
          clearTimeout(innerTimer);
          done();
        }, 300);
        clearTimeout(timer);
      }, 200);
    });

    it('close by background', done => {
      const localVue = createLocalVue();
      localVue.use(QDialog);
      localVue.prototype.$dialog = QDialog;
      const wrapper: any = mount(
        {
          template: '<div>123</div>'
        },
        {
          localVue
        }
      );
      wrapper.vm.$dialog.show(
        {
          title: '123',
          type: 'confirm'
        },
        localVue
      );
      const timer = setTimeout(() => {
        const $item: any = document.getElementsByClassName(
          'q-dialog-background'
        )[0];
        $item.click();
        const innerTimer = setTimeout(() => {
          const $dialog: any = document.getElementsByClassName(
            'q-dialog-core'
          )[0];
          assert.strictEqual($dialog.style.display, 'none');
          clearTimeout(innerTimer);
          done();
        }, 300);
        clearTimeout(timer);
      }, 200);
    });

    it('beforeClose by icon', done => {
      const wrapper: any = mount(
        {
          template: '<div>123</div>'
        },
        {
          localVue
        }
      );
      wrapper.vm.$dialog.show(
        {
          title: '123',
          type: 'confirm',
          closeIcon: true,
          beforeClose: (type: Type, done: Function) => {
            done();
          }
        },
        localVue
      );
      const timer = setTimeout(() => {
        const $item: any = document.getElementsByClassName(
          'q-dialog-core__closeIcon'
        )[0];
        $item.click();
        const innerTimer = setTimeout(() => {
          const $dialog: any = document.getElementsByClassName(
            'q-dialog-core'
          )[0];
          assert.strictEqual($dialog.style.display, 'none');
          clearTimeout(innerTimer);
          done();
        }, 300);
        clearTimeout(timer);
      }, 200);
    });

    it('beforeClose by background', done => {
      const localVue = createLocalVue();
      localVue.use(QDialog);
      localVue.prototype.$dialog = QDialog;
      const wrapper: any = mount(
        {
          template: '<div>123</div>'
        },
        {
          localVue
        }
      );
      wrapper.vm.$dialog.show(
        {
          title: '123',
          type: 'confirm',
          beforeClose: (type: Type, done: Function) => {
            done();
          }
        },
        localVue
      );
      const timer = setTimeout(() => {
        const $item: any = document.getElementsByClassName(
          'q-dialog-background'
        )[0];
        $item.click();
        const innerTimer = setTimeout(() => {
          const $dialog: any = document.getElementsByClassName(
            'q-dialog-core'
          )[0];
          assert.strictEqual($dialog.style.display, 'none');
          clearTimeout(innerTimer);
          done();
        }, 300);
        clearTimeout(timer);
      }, 200);
    });

    it('instance close', done => {
      const localVue = createLocalVue();
      localVue.use(QDialog);
      localVue.prototype.$dialog = QDialog;
      const wrapper: any = mount(
        {
          template: '<div>123</div>'
        },
        {
          localVue
        }
      );
      wrapper.vm.$dialog.show(
        {
          title: '123',
          type: 'confirm'
        },
        localVue
      );
      const timer = setTimeout(() => {
        wrapper.vm.$dialog.close();
        const innerTimer = setTimeout(() => {
          const $dialog: any = document.getElementsByClassName(
            'q-dialog-core'
          )[0];
          assert.strictEqual($dialog.style.display, 'none');
          clearTimeout(innerTimer);
          done();
        }, 300);
        clearTimeout(timer);
      }, 200);
    });
  });
});
