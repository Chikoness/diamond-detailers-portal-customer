<template>
  <div id="display-emp">
    <div class="emp-container">
      <display-table-page :data="data" :isEmployee="display == 'appointments' ? false : true" :popupSize="true"/>
    </div>
  </div>
</template>

<script>
import DisplayTablePage from "./DisplayTablePage.vue";

export default {
  props: ["data", "display"],
  components: { DisplayTablePage },
};
</script>

<style lang="scss">
#display-emp {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2;
  padding-top: 55%;

  .emp-container {
    width: 80%;
    height: auto;
    background-color: #fff;
    margin: auto;
    color: #000;
    padding: 0.5rem;
    border-radius: 0.5rem;
    box-shadow: rgba(255, 255, 255, 0.4) 0px 5px,
      rgba(255, 255, 255, 0.3) 0px 10px, rgba(255, 255, 255, 0.2) 0px 15px,
      rgba(255, 255, 255, 0.1) 0px 20px, rgba(255, 255, 255, 0.05) 0px 25px;
  }
}
</style>