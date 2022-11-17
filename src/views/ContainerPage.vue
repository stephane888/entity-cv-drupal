<template>
  <div class="app-builder-cv">
    <b-container>
      <header class="entete d-flex justify-content-center align-items-start">
        <slot name="entete">
          <hbk-button @click="openModal"> Conseils </hbk-button>
        </slot>
      </header>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "ContainerPage",
  methods: {
    /**
     * --//
     */
    openModal(e) {
      console.log("none : ", e);
    },
  },
};
</script>
