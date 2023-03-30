<template>
  <div :fieldsWaiter="fieldsWaiter">
    <ContainerPage>
      <HCardIcon icon="exclamation-lg">
        <template #titre> '' </template>
        <div></div>
      </HCardIcon>
      <component
        :is="container.template"
        v-for="(container, i) in fieldsInterne"
        :key="i"
        :entity="container.entity"
        :class-entity="['pt-1']"
      >
        <component
          :is="render.template"
          v-for="(render, k) in container.fields"
          :key="k"
          :field="render.field"
          :model="render.model"
          :entities="render.entities"
          :class-css="['mb-5']"
          :parent-name="'0.entities.layout_paragraphs.' + i + '.entity.'"
          :parent-child-name="
            '0.entities.layout_paragraphs.' + i + '.entities.'
          "
          namespace-store="storeForm"
        ></component>
      </component>
      <template #app-footer>
        <div class="w-100 d-flex justify-content-between">
          <router-link :to="previewStep">
            <hbk-button
              icon="arrow-left"
              variant="outline-light"
              icon-variant=""
              class="mr-4 text-muted"
            >
              {{ string_actions.buttons_previews }}
            </hbk-button>
          </router-link>
          <router-link :to="nextStep">
            <hbk-button icon="save" variant="outline-info" icon-variant="">
              {{ string_actions.buttons_next }}
            </hbk-button>
          </router-link>
        </div>
      </template>
    </ContainerPage>
    <modalForm
      :title-modal="titleModal"
      :manage-modal="manageModal"
      @closeModal="closeModal"
    >
      <template #header>
        <HCardIcon :with-mb="false"></HCardIcon>
      </template>
    </modalForm>
  </div>
</template>

<script>
import modalForm from "./modalForm.vue";
import { mapState, mapGetters } from "vuex";
import generateField from "components_h_vuejs/src/js/FormUttilities";
import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField.js";
import request from "../request";
export default {
  name: "EtapeDynamiqueSection",
  components: {
    modalForm,
  },
  props: {
    keySections: {
      type: String,
      default: "",
    },
    idEtape: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      titleModal: "",
      manageModal: false,
      fieldsInterne: [],
    };
  },

  computed: {
    ...mapState("storeForm", {
      building_fields: (state) => state.building_fields,
      entities(state) {
        if (state.EntitiesForm[0] && state.EntitiesForm[0].entities) {
          return state.EntitiesForm[0].entities.layout_paragraphs;
        } else return [];
      },
      fieldsWaiter() {
        if (this.keySections && this.entities.length > 0) {
          this.generateFields(this.keySections);
          return this.keySections;
        } else return null;
      },
      user: (state) => state.user,
    }),
    ...mapGetters(["etapes", "string_actions"]),
    nextStep() {
      const idEtape = parseInt(this.idEtape) + 1;
      const length = this.etapes.length;
      if (idEtape < length) {
        if (length) {
          console.log("NEXT Dynamique build computed");
          return "/layouts-sections/" + this.etapes[idEtape] + "/" + idEtape;
        } else return "/login";
      } else {
        if (this.user && this.user.uid) return "/save-cv";
        else return "/login";
      }
    },
    previewStep() {
      const idEtape = parseInt(this.idEtape) - 1;
      if (idEtape >= 0) {
        console.log("PREVIEW Dynamique build computed");
        return "/layouts-sections/" + this.etapes[idEtape] + "/" + idEtape;
      } else return "/formation";
    },
  },

  methods: {
    /**
     * --//
     */
    openModal() {
      if (this.manageModal) this.manageModal = false;
      else this.manageModal = true;
    },
    closeModal() {
      this.manageModal = false;
    },
    generateFields(keySections) {
      keySections = parseInt(keySections);
      loadField.setConfig(request);
      var fields = [];
      if (this.entities) {
        generateField.generateFields([this.entities[keySections]], fields, "");
        this.fieldsInterne = [];
        // on doit vider le champs pendant un laps de temps, sinon cela ne fonctionne pas.
        setTimeout(() => {
          this.fieldsInterne = fields;
        }, 300);
      }
    },
  },
};
</script>
