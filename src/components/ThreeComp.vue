<template>
  <div class="threeScene"></div>
</template>

<script>
import ThreeScene from "../classes/ThreeCanvas";

export default {
  name: "ThreeComp",
  mounted() {
    ThreeScene.init();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus"></style>
