<template>
  <div>
    <ContainerPage :strings_steps="strings_steps">
      <template #entete>
        <hbk-button @click="openModal">
          {{ string_modal.title_button_modal }}
        </hbk-button>
      </template>
      <HCardIcon icon="exclamation-lg">
        <template #titre> {{ strings_createpage.title_box }} </template>
        <div v-html="strings_createpage.desc_box.value"></div>
      </HCardIcon>

      <div v-if="errorMessages.length" class="content-save-text mx-auto mt-5">
        <b-alert
          v-for="(msg, i) in errorMessages"
          :key="i"
          show
          dismissible
          variant="danger"
        >
          <div v-html="msg"></div>
        </b-alert>
      </div>
      <div v-if="warningMessages.length" class="content-save-text mx-auto mt-5">
        <b-alert
          v-for="(msg, i) in warningMessages"
          :key="i"
          show
          dismissible
          variant="warning"
        >
          <div v-html="msg"></div>
        </b-alert>
      </div>

      <div class="text-left mx-auto content-save-text">
        <ul class="puce-step-vertical step-build">
          <li
            v-for="(item, i) in build_steps"
            :key="i"
            :class="[
              item.status == 'ok' ? 'active' : '',
              item.status == 'error' ? 'text-danger' : '',
            ]"
          >
            {{ item.titre }}
            <b-icon
              v-if="item.status == 'run'"
              icon="three-dots"
              font-scale="1.3"
              animation="cylon"
              class="ml-auto"
              variant="primary"
              v
            ></b-icon>
            <b-icon
              v-if="item.status == 'ok'"
              icon="check2"
              font-scale="1.5"
              class="ml-auto"
              variant="primary"
            ></b-icon>
          </li>
        </ul>
      </div>

      <div v-if="finish_status" class="action d-flex flex-column">
        <b-button @click="open_new_site">
          {{ string_actions.admin_cv }}
          <b-icon icon="award" font-scale="1.3" class="float-right"></b-icon>
        </b-button>
        <b-button @click="open_new_site_admin">
          {{ string_actions.see_cv }}
          <b-icon
            icon="folder-symlink"
            font-scale="1.3"
            class="float-right"
          ></b-icon>
        </b-button>
      </div>
      <div v-if="finish_status" class="my-5 h3">
        {{ string_actions.see_cv }}
        <a @click="open_new_site">
          <b> {{ new_hostname }} </b>
        </a>
      </div>

      <div
        class="w-100 d-flex justify-content-between align-items-baseline mt-5"
      >
        <router-link to="/formation">
          <hbk-button
            icon="arrow-left"
            variant="outline-light"
            icon-variant=""
            class="mr-4 text-muted"
          >
            {{ string_actions.buttons_previews }}
          </hbk-button>
        </router-link>
        <hbk-button
          icon="save"
          variant="info"
          icon-variant=""
          size="lg"
          @click="saveCv"
        >
          {{ string_actions.create_cv }}
        </hbk-button>
      </div>
    </ContainerPage>
    <modalForm
      :title-modal="titleModal"
      :manage-modal="manageModal"
      @closeModal="closeModal"
    >
      <template #header>
        <HCardIcon :with-mb="false">
          <template #titre> {{ string_modal.button }} </template>
          <template>
            <div>{{ string_modal.desc_header }}</div>
          </template>
        </HCardIcon>
      </template>
    </modalForm>
  </div>
</template>

<script>
import modalForm from "./modalForm.vue";
import { mapState, mapGetters } from "vuex";
export default {
  name: "EtapeExperience",
  components: {
    modalForm,
  },
  data() {
    return {
      titleModal: "",
      manageModal: false,
    };
  },
  computed: {
    ...mapState({
      build_steps: (state) => state.build_steps,
      creation_running: (state) => state.creation_running,
      finish_status: (state) => state.finish_status,
      new_hostname: (state) => state.new_hostname,
      strings: (state) => state.strings,
      messages: (state) => state.messages,
    }),
    ...mapGetters([
      "string_modal",
      "string_actions",
      "strings_createpage",
      "strings_steps",
    ]),
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
    },
  },
  methods: {
    openModal() {
      if (this.manageModal) this.manageModal = false;
      else this.manageModal = true;
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
    },
  },
};
</script>
