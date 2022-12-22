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
        :is="render.template"
        v-for="(render, k) in buildFields()"
        :key="k"
        :field="render.field"
        :model="render.model"
        :class-css="['mb-5']"
        namespace-store="storeForm"
        @addNewValue="addNewValue($event, render)"
        @removeField="removeField($event, render)"
        @array_move="array_move($event, render)"
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
    ...mapGetters(["etapes", "modelDynamique"]),
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
    form_sort() {
      if (this.keySections) {
        const fr = this.layout_paragraphs[this.keySections].form_sort;
        return fr;
      } else return {};
    },
    model() {
      if (
        this.keySections &&
        this.layout_paragraphs[this.keySections] &&
        this.layout_paragraphs[this.keySections].model
      ) {
        const md = this.layout_paragraphs[this.keySections].model;
        return md;
      } else return {};
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
  },
  mounted() {
    //
  },
  methods: {
    buildFields() {
      const fields = [];
      loadField.getConfig(request);
      if (this.form_sort)
        this.form_sort.forEach((field) => {
          fields.push({
            template: loadField.getField(field),
            field: field,
            model: this.model,
          });
        });
      return fields;
    },
    buildFieldsOld() {
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
      //console.log("addNewValue : ", render, "\n", value);
      const vals =
        this.layout_paragraphs[this.keySections].model[render.field.name];
      // Specifiquement à cette environnement, on ne peut pas mettre à jour le computed, this.model
      // On met à jour directement, la donnée present dans le layout.
      vals.push(value);
      this.$store.dispatch("storeForm/setValue", {
        value: vals,
        fieldName: render.field.name,
      });
    },
    removeField(index, render) {
      this.model[render.field.name].splice(index, 1);
    },
    array_move(evt, render) {
      console.log(" Evt : ", evt, "\n Render : ", render);
      //if (evt.oldIndex == null || evt.newIndex == null) return;
      const moveItem = (arr, fromIndex, toIndex) => {
        let itemRemoved = arr.splice(fromIndex, 1); // assign the removed item as an array
        arr.splice(toIndex, 0, itemRemoved[0]); // insert itemRemoved into the target index
        return arr;
      };
      const vals = moveItem(
        this.model[render.field.name],
        evt.oldIndex,
        evt.newIndex
      );
      this.$store.dispatch("storeForm/setValue", {
        value: vals,
        fieldName: render.field.name,
      });
    },
  },
};
</script>
