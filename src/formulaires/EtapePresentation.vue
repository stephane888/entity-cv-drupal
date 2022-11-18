<template>
  <div>
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
      <h4>Coordonnées</h4>
      <component
        :is="render.template"
        v-for="(render, k) in buildFields()"
        :key="k"
        :field="render.field"
        :model="render.model"
        :class_css="['mb-5']"
        namespace_store="storeForm/setValue"
      ></component>
      <template #app-footer>
        <div>
          <hbk-button icon="save" variant="outline-info" icon-variant="">
            Etape suivante
          </hbk-button>
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
import { mapState } from "vuex";
import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField";
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
  },
  methods: {
    buildFields() {
      const fields = [];
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
