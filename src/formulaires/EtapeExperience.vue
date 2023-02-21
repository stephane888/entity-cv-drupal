<template>
  <div>
    <ContainerPage>
      <template #entete>
        <hbk-button @click="openModal">
          {{ string_modal.title_button_modal }}
        </hbk-button>
      </template>
      <HCardIcon icon="exclamation-lg">
        <template #titre> {{ strings_experience.title_box }} </template>
        <div v-html="strings_experience.desc_box.value"></div>
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
          :parent-name="'0.entities.experience.' + i + '.entity.'"
          :parent-child-name="'0.entities.experience.' + i + '.entities.'"
          namespace-store="storeForm"
        ></component>
      </component>
      <template #app-footer>
        <div class="w-100 d-flex justify-content-between">
          <router-link to="/presentation">
            <hbk-button
              icon="arrow-left"
              variant="outline-light"
              icon-variant=""
              class="mr-4 text-muted"
            >
              {{ string_actions.buttons_previews }}
            </hbk-button>
          </router-link>
          <router-link to="/formation">
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
      building_fields: (state) => state.building_fields,
      EntitiesForm: (state) => state.EntitiesForm,
      fields() {
        var fields = [];
        if (
          this.EntitiesForm &&
          this.EntitiesForm[0] &&
          this.EntitiesForm[0].entities &&
          this.EntitiesForm[0].entities.experience
        ) {
          generateField.generateFields(
            this.EntitiesForm[0].entities.experience,
            fields,
            ""
          );
        }
        return fields;
      },
    }),
    ...mapGetters(["string_modal", "string_actions", "strings_experience"]),
    currentRoute() {
      return this.$router.history.current.path;
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
