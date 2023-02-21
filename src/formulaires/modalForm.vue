<!-- Ce fichier permet de gerer tous edition de cntenu quii doit se faire via un model. -->
<template>
  <b-modal
    id="b-modal-manage-project"
    v-model="openModel"
    title="BootstrapVue"
    size="lg"
    footer-bg-variant="light"
    header-bg-variant="light"
    :hide-footer="false"
    :no-close-on-backdrop="false"
    @ok="handleOk"
  >
    <template #modal-header>
      <slot name="header"></slot>
    </template>
    <template #default>
      <slot>
        <h4>{{ string_modal.title_button_modal }}</h4>
        <div v-html="string_modal.desc_modal.valuex"></div>
      </slot>
    </template>
    <template #modal-footer="{ cancel }">
      <b-button size="md" variant="success" @click="handleOk">
        {{ string_modal.button }}
      </b-button>
      <b-button
        class="d-none"
        size="md"
        variant="outline-warning"
        @click="cancel()"
      >
        Cancel
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    manageModal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    openModel: {
      get() {
        if (this.manageModal) return true;
        return false;
      },
      set(value) {
        this.$emit("closeModal", value);
      },
    },
    ...mapGetters(["string_modal"]),
  },
  methods: {
    handleOk() {
      this.$bvModal.hide("b-modal-manage-project");
    },
  },
};
</script>
