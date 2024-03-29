"use strict";
((typeof self !== 'undefined' ? self : this)["webpackChunkBuilderCv"] = (typeof self !== 'undefined' ? self : this)["webpackChunkBuilderCv"] || []).push([[883],{

/***/ 5883:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ SaveForms; }
});

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/formulaires/SaveForms.vue?vue&type=template&id=10b8f300&
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', [_c('ContainerPage', {
    attrs: {
      "strings_steps": _vm.strings_steps
    },
    scopedSlots: _vm._u([{
      key: "entete",
      fn: function () {
        return [_c('hbk-button', {
          on: {
            "click": _vm.openModal
          }
        }, [_vm._v(" " + _vm._s(_vm.string_modal.title_button_modal) + " ")])];
      },
      proxy: true
    }])
  }, [_c('HCardIcon', {
    attrs: {
      "icon": "exclamation-lg"
    },
    scopedSlots: _vm._u([{
      key: "titre",
      fn: function () {
        return [_vm._v(" " + _vm._s(_vm.strings_createpage.title_box) + " ")];
      },
      proxy: true
    }])
  }, [_c('div', {
    domProps: {
      "innerHTML": _vm._s(_vm.strings_createpage.desc_box.value)
    }
  })]), _vm.errorMessages.length ? _c('div', {
    staticClass: "content-save-text mx-auto mt-5"
  }, _vm._l(_vm.errorMessages, function (msg, i) {
    return _c('b-alert', {
      key: i,
      attrs: {
        "show": "",
        "dismissible": "",
        "variant": "danger"
      }
    }, [_c('div', {
      domProps: {
        "innerHTML": _vm._s(msg)
      }
    })]);
  }), 1) : _vm._e(), _vm.warningMessages.length ? _c('div', {
    staticClass: "content-save-text mx-auto mt-5"
  }, _vm._l(_vm.warningMessages, function (msg, i) {
    return _c('b-alert', {
      key: i,
      attrs: {
        "show": "",
        "dismissible": "",
        "variant": "warning"
      }
    }, [_c('div', {
      domProps: {
        "innerHTML": _vm._s(msg)
      }
    })]);
  }), 1) : _vm._e(), _c('div', {
    staticClass: "text-left mx-auto content-save-text"
  }, [_c('ul', {
    staticClass: "puce-step-vertical step-build"
  }, _vm._l(_vm.build_steps, function (item, i) {
    return _c('li', {
      key: i,
      class: [item.status == 'ok' ? 'active' : '', item.status == 'error' ? 'text-danger' : '']
    }, [_vm._v(" " + _vm._s(item.titre) + " "), item.status == 'run' ? _c('b-icon', {
      staticClass: "ml-auto",
      attrs: {
        "icon": "three-dots",
        "font-scale": "1.3",
        "animation": "cylon",
        "variant": "primary",
        "v": ""
      }
    }) : _vm._e(), item.status == 'ok' ? _c('b-icon', {
      staticClass: "ml-auto",
      attrs: {
        "icon": "check2",
        "font-scale": "1.5",
        "variant": "primary"
      }
    }) : _vm._e()], 1);
  }), 0)]), _vm.finish_status ? _c('div', {
    staticClass: "action d-flex flex-column"
  }, [_c('b-button', {
    on: {
      "click": _vm.open_new_site
    }
  }, [_vm._v(" " + _vm._s(_vm.string_actions.admin_cv) + " "), _c('b-icon', {
    staticClass: "float-right",
    attrs: {
      "icon": "award",
      "font-scale": "1.3"
    }
  })], 1), _c('b-button', {
    on: {
      "click": _vm.open_new_site_admin
    }
  }, [_vm._v(" " + _vm._s(_vm.string_actions.see_cv) + " "), _c('b-icon', {
    staticClass: "float-right",
    attrs: {
      "icon": "folder-symlink",
      "font-scale": "1.3"
    }
  })], 1)], 1) : _vm._e(), _vm.finish_status ? _c('div', {
    staticClass: "my-5 h3"
  }, [_vm._v(" " + _vm._s(_vm.string_actions.see_cv) + " "), _c('a', {
    on: {
      "click": _vm.open_new_site
    }
  }, [_c('b', [_vm._v(" " + _vm._s(_vm.new_hostname) + " ")])])]) : _vm._e(), _c('div', {
    staticClass: "w-100 d-flex justify-content-between align-items-baseline mt-5"
  }, [_c('router-link', {
    attrs: {
      "to": "/formation"
    }
  }, [_c('hbk-button', {
    staticClass: "mr-4 text-muted",
    attrs: {
      "icon": "arrow-left",
      "variant": "outline-light",
      "icon-variant": "",
      "disabled": _vm.running || _vm.finish_status
    }
  }, [_vm._v(" " + _vm._s(_vm.string_actions.buttons_previews) + " ")])], 1), _c('hbk-button', {
    attrs: {
      "icon": "save",
      "variant": "info",
      "icon-variant": "",
      "size": "lg",
      "disabled": _vm.running || _vm.finish_status
    },
    on: {
      "click": _vm.saveCv
    }
  }, [_vm._v(" " + _vm._s(_vm.string_actions.create_cv) + " ")])], 1)], 1), _c('modalForm', {
    attrs: {
      "title-modal": _vm.titleModal,
      "manage-modal": _vm.manageModal
    },
    on: {
      "closeModal": _vm.closeModal
    },
    scopedSlots: _vm._u([{
      key: "header",
      fn: function () {
        return [_c('HCardIcon', {
          attrs: {
            "with-mb": false
          },
          scopedSlots: _vm._u([{
            key: "titre",
            fn: function () {
              return [_vm._v(" " + _vm._s(_vm.string_modal.button) + " ")];
            },
            proxy: true
          }])
        }, [[_c('div', [_vm._v(_vm._s(_vm.string_modal.desc_header))])]], 2)];
      },
      proxy: true
    }])
  })], 1);
};
var staticRenderFns = [];

// EXTERNAL MODULE: ./src/formulaires/modalForm.vue + 3 modules
var modalForm = __webpack_require__(2781);
// EXTERNAL MODULE: ./node_modules/vuex/dist/vuex.esm.js
var vuex_esm = __webpack_require__(5340);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/formulaires/SaveForms.vue?vue&type=script&lang=js&


/* harmony default export */ var SaveFormsvue_type_script_lang_js_ = ({
  name: "EtapeExperience",
  components: {
    modalForm: modalForm/* default */.Z
  },
  data() {
    return {
      titleModal: "",
      manageModal: false
    };
  },
  computed: {
    ...(0,vuex_esm/* mapState */.rn)({
      build_steps: state => state.build_steps,
      creation_running: state => state.creation_running,
      finish_status: state => state.finish_status,
      new_hostname: state => state.new_hostname,
      strings: state => state.strings,
      messages: state => state.messages,
      running: state => state.running
    }),
    ...(0,vuex_esm/* mapGetters */.Se)(["string_modal", "string_actions", "strings_createpage", "strings_steps"]),
    warningMessages() {
      if (this.messages.warnings && this.messages.warnings.length) {
        return this.messages.warnings;
      } else {
        return [];
      }
    },
    errorMessages() {
      if (this.messages.errors && this.messages.errors.length) {
        return this.messages.errors;
      } else {
        return [];
      }
    }
  },
  methods: {
    openModal() {
      if (this.manageModal) this.manageModal = false;else this.manageModal = true;
    },
    closeModal() {
      this.manageModal = false;
    },
    saveCv() {
      this.$store.dispatch("create_site_cv");
    },
    open_new_site() {
      window.open(this.new_hostname, "_blank");
    },
    open_new_site_admin() {
      window.open(this.new_hostname + "/user", "_blank");
    }
  }
});
;// CONCATENATED MODULE: ./src/formulaires/SaveForms.vue?vue&type=script&lang=js&
 /* harmony default export */ var formulaires_SaveFormsvue_type_script_lang_js_ = (SaveFormsvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1001);
;// CONCATENATED MODULE: ./src/formulaires/SaveForms.vue





/* normalize component */
;
var component = (0,componentNormalizer/* default */.Z)(
  formulaires_SaveFormsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var SaveForms = (component.exports);

/***/ }),

/***/ 2781:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ modalForm; }
});

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/formulaires/modalForm.vue?vue&type=template&id=66a18a96&
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('b-modal', {
    attrs: {
      "id": "b-modal-manage-project",
      "title": "BootstrapVue",
      "size": "lg",
      "footer-bg-variant": "light",
      "header-bg-variant": "light",
      "hide-footer": false,
      "no-close-on-backdrop": false
    },
    on: {
      "ok": _vm.handleOk
    },
    scopedSlots: _vm._u([{
      key: "modal-header",
      fn: function () {
        return [_vm._t("header")];
      },
      proxy: true
    }, {
      key: "default",
      fn: function () {
        return [_vm._t("default", function () {
          return [_c('h4', [_vm._v(_vm._s(_vm.string_modal.title_button_modal))]), _c('div', {
            domProps: {
              "innerHTML": _vm._s(_vm.string_modal.desc_modal.valuex)
            }
          })];
        })];
      },
      proxy: true
    }, {
      key: "modal-footer",
      fn: function ({
        cancel
      }) {
        return [_c('b-button', {
          attrs: {
            "size": "md",
            "variant": "success"
          },
          on: {
            "click": _vm.handleOk
          }
        }, [_vm._v(" " + _vm._s(_vm.string_modal.button) + " ")]), _c('b-button', {
          staticClass: "d-none",
          attrs: {
            "size": "md",
            "variant": "outline-warning"
          },
          on: {
            "click": function ($event) {
              return cancel();
            }
          }
        }, [_vm._v(" Cancel ")])];
      }
    }], null, true),
    model: {
      value: _vm.openModel,
      callback: function ($$v) {
        _vm.openModel = $$v;
      },
      expression: "openModel"
    }
  });
};
var staticRenderFns = [];

// EXTERNAL MODULE: ./node_modules/vuex/dist/vuex.esm.js
var vuex_esm = __webpack_require__(5340);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/formulaires/modalForm.vue?vue&type=script&lang=js&

/* harmony default export */ var modalFormvue_type_script_lang_js_ = ({
  props: {
    manageModal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    openModel: {
      get() {
        if (this.manageModal) return true;
        return false;
      },
      set(value) {
        this.$emit("closeModal", value);
      }
    },
    ...(0,vuex_esm/* mapGetters */.Se)(["string_modal"])
  },
  methods: {
    handleOk() {
      this.$bvModal.hide("b-modal-manage-project");
    }
  }
});
;// CONCATENATED MODULE: ./src/formulaires/modalForm.vue?vue&type=script&lang=js&
 /* harmony default export */ var formulaires_modalFormvue_type_script_lang_js_ = (modalFormvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1001);
;// CONCATENATED MODULE: ./src/formulaires/modalForm.vue





/* normalize component */
;
var component = (0,componentNormalizer/* default */.Z)(
  formulaires_modalFormvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var modalForm = (component.exports);

/***/ })

}]);
//# sourceMappingURL=BuilderCv.umd.883.js.map