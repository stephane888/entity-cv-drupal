<!-- Ce fichier permet de gerer tous edition de cntenu quii doit se faire via un model. -->
<template>
  <b-modal
    id="b-modal-manage-project"
    v-model="openModel"
    title="BootstrapVue"
    size="lg"
    footer-bg-variant="light"
    header-bg-variant="light"
    :hide-footer="false"
    :no-close-on-backdrop="false"
    @ok="handleOk"
  >
    <template #modal-header>
      <slot name="header"></slot>
    </template>
    <template #default>
      <slot>
        <h4>Conseils</h4>
        <ul class="puce-check">
          <li data-qa="contact-information-tips-1" class="sc-1qcv85o-2 gEfbim">
            <p class="sc-2wh0z1-0 eQnuyS tips-text">
              Gardez à l'esprit que votre adresse e-mail et votre site Web
              devraient être professionnels car ils seront vus et utilisés par
              des employeurs potentiels.
            </p>
          </li>
          <li data-qa="contact-information-tips-2" class="sc-1qcv85o-2 gEfbim">
            <p class="sc-2wh0z1-0 eQnuyS tips-text">
              Le format d'adresse e-mail utilisé de manière standard par la
              majorité des candidats est prénom.nomdefamille@email.com
            </p>
          </li>
          <li data-qa="contact-information-tips-3" class="sc-1qcv85o-2 gEfbim">
            <p class="sc-2wh0z1-0 eQnuyS tips-text">
              Votre profil LinkedIn devrait être à jour et correspondre le plus
              possible aux informations figurant dans votre CV.
            </p>
          </li>
          <li data-qa="contact-information-tips-4" class="sc-1qcv85o-2 gEfbim">
            <p class="sc-2wh0z1-0 eQnuyS tips-text">
              Si vous postulez à un emploi en Europe, il est pratiquement
              obligatoire d'ajouter une photo professionnelle à votre CV.
            </p>
          </li>
          <li data-qa="contact-information-tips-5" class="sc-1qcv85o-2 gEfbim">
            <p class="sc-2wh0z1-0 eQnuyS tips-text">
              Votre photo devrait ressembler à celle d'un passeport, ne montrant
              que la tête et les épaules et non le reste de votre corps, avec un
              bon éclairage et une apparence professionnelle.
            </p>
          </li>
          <li data-qa="contact-information-tips-6" class="sc-1qcv85o-2 gEfbim">
            <p class="sc-2wh0z1-0 eQnuyS tips-text">
              N'oubliez pas que c'est la première impression que vous ferez à un
              employeur potentiel - assurez-vous qu'elle soit bonne !
            </p>
          </li>
        </ul>
      </slot>
    </template>
    <template #modal-footer="{ cancel }">
      <b-button size="md" variant="success" @click="handleOk">
        J'ai compris
      </b-button>
      <b-button
        class="d-none"
        size="md"
        variant="outline-warning"
        @click="cancel()"
      >
        Annuler
      </b-button>
    </template>
  </b-modal>
</template>
<script>
export default {
  props: {
    manageModal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    openModel: {
      get() {
        if (this.manageModal) return true;
        return false;
      },
      set(value) {
        this.$emit("closeModal", value);
      },
    },
  },
  methods: {
    handleOk() {
      this.$bvModal.hide("b-modal-manage-project");
    },
  },
};
</script>
