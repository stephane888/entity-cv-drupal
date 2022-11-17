<template>
  <div>
    <ContainerPage>
      <template #entete>
        <hbk-button @click="openModal"> Conseils </hbk-button>
      </template>
    </ContainerPage>
    <modalForm :title-modal="titleModal"></modalForm>
  </div>
</template>

<script>
import modalForm from "./modalForm.vue";
export default {
  name: "EtapePresentation",
  components: {
    modalForm,
  },
  data() {
    return {
      titleModal: "",
    };
  },
  methods: {
    /**
     * --//
     */
    openModal() {
      console.log(" None !!! : ");
    },
  },
};
</script>
