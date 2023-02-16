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
        :is="container.template"
        v-for="(container, i) in fields"
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
          :parent-name="'0.entities.formation.' + i + '.entity.'"
          :parent-child-name="'0.entities.formation.' + i + '.entities.'"
          namespace-store="storeForm"
        ></component>
      </component>
      <template #app-footer>
        <div class="w-100 d-flex justify-content-between">
          <router-link to="/experience">
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
            <hbk-button icon="save" variant="outline-info" icon-variant="">
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
import generateField from "components_h_vuejs/src/js/FormUttilities";
export default {
  name: "EtapeFormation",
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
      building_fields: (state) => state.building_fields,
      EntitiesForm: (state) => state.EntitiesForm,
      fields() {
        var fields = [];
        if (
          this.EntitiesForm &&
          this.EntitiesForm[0] &&
          this.EntitiesForm[0].entities &&
          this.EntitiesForm[0].entities.formation
        ) {
          generateField.generateFields(
            this.EntitiesForm[0].entities.formation,
            fields,
            ""
          );
        }
        return fields;
      },
      user: (state) => state.user,
      layout_paragraphs: (state) => state.layout_paragraphs,
    }),
    ...mapGetters(["etapes"]),
    nextStep() {
      // if (this.user && this.user.uid) return "/save-cv";
      // else return "/login";
      if (this.etapes.length) {
        return "/layouts-sections/" + this.etapes[0] + "/0";
      } else return "/login";
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
  },
};
</script>
