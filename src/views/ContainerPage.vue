<template>
  <div class="app-builder-cv">
    <b-container>
      <header
        v-if="showHeader"
        class="entete d-flex justify-content-center align-items-start mb-4"
      >
        <slot name="entete">
          <hbk-button @click="openModal">
            {{ string_modal.title_button_modal }}
          </hbk-button>
        </slot>
      </header>
      <main class="row justify-content-center">
        <div class="col-md-6">
          <vue-custom-scrollbar
            class="scroll-area app-builder-cv__content"
            :settings="settings"
          >
            <div class="pr-3"><slot></slot></div>
          </vue-custom-scrollbar>
          <div class="form-footer-app d-flex">
            <div class="container">
              <b-row class="justify-content-center">
                <b-col md="12">
                  <div
                    class="form-footer-app__content d-flex justify-content-end"
                  >
                    <slot name="app-footer"></slot>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
        <div v-if="showRight" class="col-md-6"><slot name="right"></slot></div>
      </main>
    </b-container>
  </div>
</template>

<script>
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import { mapState, mapGetters } from "vuex";
export default {
  name: "ContainerPage",
  components: {
    vueCustomScrollbar,
  },
  props: {
    showRight: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      settings: {
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: false,
      },
    };
  },
  computed: {
    ...mapGetters(["string_modal"]),
  },
  methods: {
    /**
     * --//
     */
    openModal(e) {
      console.log("none : ", e);
    },
  },
};
</script>
