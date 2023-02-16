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

      <h4 class="font-weight-bold">Coordonnées</h4>
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
          :parent-name="i + '.entity.'"
          :parent-child-name="i + '.entities.'"
          namespace-store="storeForm"
          @array_move="array_move($event, render)"
        ></component>
      </component>
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
import { mapState } from "vuex";
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
      fields: (state) => state.EntitiesForm[0].entities.presentation,
      building_fields: (state) => state.building_fields,
    }),
  },
  methods: {
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
