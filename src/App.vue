<template>
  <div id="app">
    <ThreeComp />
  </div>
</template>

<script>
import ThreeComp from "./components/ThreeComp.vue";

export default {
  name: "App",
  components: {
    ThreeComp
  }
};
</script>

<style lang="stylus">
body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

* {
  margin: 0;
  padding: 0;
}
</style>
