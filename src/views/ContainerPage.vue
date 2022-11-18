<template>
  <div class="app-builder-cv">
    <b-container>
      <header
        class="entete d-flex justify-content-center align-items-start mb-4"
      >
        <slot name="entete">
          <hbk-button @click="openModal"> Conseils </hbk-button>
        </slot>
      </header>
      <main class="row">
        <div class="col-md-6">
          <slot></slot>
        </div>
        <div class="col-md-6"><slot name="right"></slot></div>
      </main>
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
