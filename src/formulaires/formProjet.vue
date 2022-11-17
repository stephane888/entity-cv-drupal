<template>
  <div>
    <b-form v-if="show" @submit="onSubmit" @reset="onReset">
      <b-form-group
        id="input-group-1"
        label="Nom du projet "
        label-for="input-1"
        :description="!form.uuid ? idEntity : form.id"
      >
        <b-form-input
          id="input-1"
          v-model="form.label"
          placeholder="Nom du projet"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Breive description du projet"
        label-for="input-2"
      >
        <b-form-textarea
          id="textarea-rows"
          v-model="form.description"
          placeholder="Description du projet"
          rows="3"
        ></b-form-textarea>
      </b-form-group>

      <b-button v-if="showSubmit" type="submit" variant="outline-primary">
        Creer le projet
      </b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0"> {{ form }} </pre>
    </b-card>
  </div>
</template>

<script>
import request from "../request";
import { mapState } from "vuex";
export default {
  props: {
    showSubmit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: true,
    };
  },
  computed: {
    ...mapState({
      form: (state) => state.storeProject.currentProject,
    }),
    idEntity() {
      if (this.form.label !== "") {
        var id = request.generateIdEntityType(this.form.label);
        this.setId(id);
        return id;
      } else return "";
    },
  },
  methods: {
    /**
     * @private
     * @param {*} event
     */
    onSubmit(event) {
      event.preventDefault();
      this.submit();
    },
    /**
     * @public
     */
    submit() {
      return this.$store.dispatch("storeProject/saveEntity");
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.id = "";
      this.form.label = "";
      this.form.description = "";
      this.form.users = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    setId(id) {
      // Si l'uuid n'existe, alors c'est une creation de type, on peut generer l'id.
      if (!this.form.uuid) this.form.id = id;
    },
  },
};
</script>
