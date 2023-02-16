<template>
  <div>
    <ContainerPage>
      <template #entete>
        <hbk-button @click="openModal"> Conseils </hbk-button>
      </template>
      <HCardIcon icon="exclamation-lg">
        <template #titre> {{ headerBlock.title }} </template>
        <div v-html="headerBlock.text"></div>
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
// import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField";
// import request from "../request";
import generateField from "components_h_vuejs/src/js/FormUttilities";
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
      building_fields: (state) => state.building_fields,
      EntitiesForm: (state) => state.EntitiesForm,
      fields() {
        var fields = [];
        if (
          this.keySections &&
          this.EntitiesForm &&
          this.EntitiesForm[0] &&
          this.EntitiesForm[0].entities &&
          this.EntitiesForm[0].entities.layout_paragraphs
        ) {
          //
          console.log(" EntitiesForm : ", this.EntitiesForm);

          var keySections = 0;
          if (
            this.$router.history.current.params &&
            this.$router.history.current.params.keySections
          ) {
            keySections = this.$router.history.current.params.keySections;
          }
          generateField.generateFields(
            [this.EntitiesForm[0].entities.layout_paragraphs[keySections]],
            fields,
            ""
          );
        }
        return fields;
      },
      user: (state) => state.user,
    }),
    ...mapGetters(["etapes"]),
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
    headerBlock() {
      const datas = { title: "", text: "" };
      switch (this.keySections) {
        case "competences_et_langues_cv_":
          datas.title = "Compétences et langues";
          datas.text =
            "<p> Les compétences que vous ajoutez devraient correspondre aux prérequis du poste auquel vous postulez. </p> <p>Vous pouvez remplir la section langue si vous parlez plus d'une langue.</p> ";
          break;
        case "loisir_cv_":
          datas.title = "Centres d'intérêt ou Loisirs";
          datas.text =
            "<p> Demandez-vous si l’activité que vous pratiquez vous donne une bonne image, si ce hobby peut vous distinguer des autres candidats et si c’est une passion dont vous pourrez parler avec enthousiasme lors de l’entretien. Evitez les platitudes, les clichés et les lieux communs. </p>";
          break;
        default:
          break;
      }
      return datas;
    },
    // rebuildFields() {
    //   if (this.keySections) {
    //     console.log(" Maj du lien keySections : ", this.keySections);
    //     this.$store.dispatch("storeForm/buildFieldsDynamiqueStep");
    //     return this.keySections;
    //   } else return 0;
    // },
  },
  // watch: {
  //   keySections() {
  //     console.log(" Maj du lien keySections : ", this.keySections);
  //     //this.$store.dispatch("storeForm/buildFieldsDynamiqueStep");
  //   },
  // },
  mounted() {
    //
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
