<template>
  <router-view />
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("storeForm/loadForm");
    this.$store.dispatch("storeForm/checkStatusUser");
    this.$store.dispatch("storeForm/loadStrings");
  },
};
</script>
