<template>
  <div>
    <ContainerPage>
      <template #entete>
        <hbk-button @click="openModal"> Conseils </hbk-button>
      </template>
      <HCardIcon icon="exclamation-lg">
        <template #titre> Vos diplomes / formations </template>
        <div>
          Commencez par vos études les plus récentes et remontez dans le passé.
          Si vous avez suivi de nombreuses études, n'ajoutez que les plus
          récentes et pertinentes.
        </div>
      </HCardIcon>
      <component
        :is="render.template"
        v-for="(render, k) in buildFields()"
        :key="k"
        :field="render.field"
        :model="render.model"
        :class-css="['mb-5']"
        namespace-store="storeForm"
        @addNewValue="addNewValue($event, render)"
        @removeField="removeField($event, render)"
      ></component>
      <template #app-footer>
        <div class="w-100 d-flex justify-content-between">
          <router-link :to="previewStep">
            <hbk-button
              icon="arrow-left"
              variant="outline-light"
              icon-variant=""
              class="mr-4 text-muted"
            >
              Etape precedente
            </hbk-button>
          </router-link>
          <router-link :to="nextStep">
            <hbk-button
              icon="save"
              variant="outline-info"
              icon-variant=""
              @click="$store.dispatch('storeForm/updateLocalStorage')"
            >
              Etape suivante
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
import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField";
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
    };
  },
  computed: {
    ...mapState("storeForm", {
      layout_paragraphs: (state) => state.layout_paragraphs,
      user: (state) => state.user,
    }),
    ...mapGetters(["etapes"]),
    nextStep() {
      const idEtape = parseInt(this.idEtape) + 1;
      const length = this.etapes.length;
      if (idEtape < length) {
        if (length) {
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
        return "/layouts-sections/" + this.etapes[idEtape] + "/" + idEtape;
      } else return "/formation";
    },
    form() {
      if (this.keySections) {
        const fr = this.layout_paragraphs[this.keySections].form;
        return fr;
      } else return {};
    },
    model() {
      if (this.keySections) {
        const md = this.layout_paragraphs[this.keySections].model;
        return md;
      } else return {};
    },
  },
  mounted() {
    //
  },
  methods: {
    buildFields() {
      const fields = [];
      loadField.getConfig(request);
      for (const i in this.form) {
        fields.push({
          template: loadField.getField(this.form[i]),
          field: this.form[i],
          model: this.model,
        });
      }
      return fields;
    },
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
    addNewValue(value, render) {
      this.model[render.field.name].push(value);
    },
    removeField(index, render) {
      this.model[render.field.name].splice(index, 1);
    },
  },
};
</script>
