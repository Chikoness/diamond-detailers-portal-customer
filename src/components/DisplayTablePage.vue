<template>
  <div class="tbl-view" :class="{ popup: popupSize }" v-if="data">
    <div class="row" v-if="data.length == 0">
      <p>No data available to display</p>
    </div>

    <template v-for="d in data" :key="d">
      <div
        class="row"
        :class="[{ finished: d.status == 'Finished' }, { popup: popupSize }]"
      >
        <ion-button
          class="row-info"
          :color="d.status == 'Finished' || d.securityLvl == 1 ? 'light' : 'dark'"
          :href="isEmployee ? '/employee/edit/' + d.icNumber : '/appointment/edit/' + d.id"
          >{{ isEmployee ? d.icNumber : d.id }}</ion-button
        >
        <div class="row-email">{{ isEmployee ? d.name : d.email }}</div>
      </div>
    </template>
  </div>
</template>

<script>
import { IonButton } from "@ionic/vue";

export default {
  props: ["data", "isEmployee", "popupSize"],

  components: {
    IonButton,
  },

  data() {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss">
.tbl-view {
  height: 80%;
  width: 86.5vw;
  overflow-y: auto;

  &.popup {
    width: 100%;
  }

  .row {
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid #fff;

    &.popup {
      border: 1px solid #000;
    }

    &.finished {
      background: #fff;
      color: #000;
    }

    p {
      text-align: center;
      width: 100%;
      padding: 1rem 0;
      border: 1px solid #000;
    }

    .row-info {
      padding: 0.1rem 0.5rem;
      width: 12rem;
      margin: 0.3rem 0 !important;
      box-shadow: none !important;
    }

    .row-email {
      padding: 0.3rem 1rem;
      font-size: 0.9rem;
      text-align: right;
      margin: auto 0;
      overflow-x: auto;
    }
  }
}
</style>