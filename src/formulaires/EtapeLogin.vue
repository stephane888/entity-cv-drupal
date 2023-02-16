<template>
  <div>
    <ContainerPage :show-header="false">
      <div class="d-flex justify-content-center mt-5">
        <HCardIcon icon="exclamation-lg">
          <template #titre> Connexion / inscription </template>
          <div>
            veillez entrer vos identifints pour creer un compte ou vous
            connectez si vous en avez deja.
          </div>
        </HCardIcon>
      </div>

      <loginRegister
        actionAfterLogin="emit_even"
        modelRegisterForm="generate_password"
      >
        <template #condition_utilisation>
          <p class="text-secondary">
            En vous inscrivant, vous acceptez nos
            <a href="#"> Conditions d'utilisation </a>, de recevoir des emails
            et des MAJ de <strong> WB-HORISON </strong> et vous reconnaissez
            avoir lu notre <a href="#"> Politique de confidentialité </a>
          </p>
        </template>
      </loginRegister>
    </ContainerPage>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "EtapeLogin",
  components: {
    loginRegister: () => {
      return import("drupal-vuejs/src/App/components/LoginRegister.vue");
    },
  },
  computed: {
    ...mapState("storeForm", {
      user: (state) => state.user,
    }),
  },
  mounted() {
    this.check_if_user_connected();
    if (!this.user.uid) {
      // console.log(" user login : ", this.user);
      this.$store.dispatch("storeForm/checkStatusUser");
    } else {
      this.nextStep();
    }
  },

  methods: {
    ev_logingoogle(user) {
      console.log(user);
    },
    check_if_user_connected() {
      document.addEventListener(
        "login_rx_vuejs__user_is_login",
        () => {
          console.log("user login");
          this.nextStep();
        },
        false
      );
    },
    nextStep() {
      this.$router.push({ path: `/save-cv` });
    },
  },
};
</script>
