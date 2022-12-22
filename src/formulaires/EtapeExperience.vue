<template>
  <div>
    <ContainerPage>
      <template #entete>
        <hbk-button @click="openModal"> Conseils </hbk-button>
      </template>
      <HCardIcon icon="exclamation-lg">
        <template #titre> Expérience professionnelle </template>
        <div>
          Commencez par votre poste actuel et remontez dans le passé. Si vous
          avez beaucoup d'expérience, n'ajoutez que les postes les plus récents
          et pertinents.
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
        @array_move="array_move($event, render)"
      ></component>
      <template #app-footer>
        <div class="w-100 d-flex justify-content-between">
          <router-link to="/presentation">
            <hbk-button
              icon="arrow-left"
              variant="outline-light"
              icon-variant=""
              class="mr-4 text-muted"
            >
              Etape precedente
            </hbk-button>
          </router-link>
          <router-link to="/formation">
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
import { mapState } from "vuex";
import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField";
import request from "../request";
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
    ...mapState("storeForm", {
      form: (state) => state.experience.form,
      model: (state) => state.experience.model,
      form_sort: (state) => state.experience.form_sort,
    }),
    currentRoute() {
      return this.$router.history.current.path;
    },
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
      this.model[render.field.name].push(value);
    },
    removeField(index, render) {
      this.model[render.field.name].splice(index, 1);
    },
    array_move(evt, render) {
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
