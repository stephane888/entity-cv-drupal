<template>
  <div :SubDomain="SubDomain">
    <ContainerPage>
      <template #entete>
        <hbk-button @click="openModal"> Conseils </hbk-button>
      </template>
      <HCardIcon icon="exclamation-lg">
        <template #titre>Dites-nous en plus sur vous </template>
        <div>
          Dites-nous qui vous êtes, comment les employeurs peuvent vous
          contacter et quelle est votre profession
        </div>
      </HCardIcon>

      <h4 class="font-weight-bold">Coordonnées</h4>
      <component
        :is="render.template"
        v-for="(render, k) in buildFields()"
        :key="k"
        :field="render.field"
        :model="render.model"
        :class-css="['mb-5']"
        namespace-store="storeForm"
      ></component>
      <template #app-footer>
        <div>
          <router-link to="/experience">
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
  name: "EtapePresentation",
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
    ...mapState("storeForm", {
      form: (state) => state.presentaton.form,
      model: (state) => state.presentaton.model,
    }),
    // ...mapGetters({
    //   testGet: "storeForm/testGet",
    //   SubDomain: "storeForm/SubDomain",
    // }),
    // ...mapGetters("storeForm", ["testGet", "SubDomain"]),
    // ...mapGetters("storeForm", {
    //   testGet: "testGet",
    //   SubDomain: "SubDomain",
    // }),
    ...mapGetters(["SubDomain"]),
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
  },
};
</script>
