<template>
  <div id="popup">
    <div class="pop-container" :class="{employee: isEmployee}">
      <p>{{ message }}</p>
      <br />
      <p>{{ message2 }}</p>
      <p>{{ message3 }}</p>
      <div class="form-btn" v-if="displayButtons">
        <ion-button color="danger" :disabled="isClicked" @click="confirmClicked()">Confirm</ion-button>
        <ion-button :color="isEmployee ? 'light' : 'warning'" @click="$emit('close')">Cancel</ion-button>
      </div>
    </div>
  </div>
</template>

<script>
import { IonButton } from "@ionic/vue";
export default {
  props: ["isEmployee", "message", "message2", "message3", "displayButtons"],

  data() {
    return {
      isClicked: false
    }
  },

  components: {
    IonButton,
  },

  methods: {
    confirmClicked() {
      this.isClicked = true
      this.$emit('confirm')
    }
  }
};
</script>

<style lang="scss">
#popup {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2;
  padding-top: 55%;

  .pop-container {
    width: 80%;
    height: auto;
    background-color: rgba(255, 213, 52);
    margin: auto;
    color: #000;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: rgba(255, 213, 52, 0.4) 0px 5px,
      rgba(255, 213, 52, 0.3) 0px 10px, rgba(255, 213, 52, 0.2) 0px 15px,
      rgba(255, 213, 52, 0.1) 0px 20px, rgba(255, 213, 52, 0.05) 0px 25px;

    p {
      text-align: center;
      font-size: 1.2rem;
    }

    .form-btn {
      display: flex;
      flex-direction: row;

      ion-button {
        width: 30vw;
      }
    }

    &.employee {
      background-color: #fff;
      box-shadow: rgba(255, 255, 255, 0.4) 0px 5px,
        rgba(255, 255, 255, 0.3) 0px 10px, rgba(255, 255, 255, 0.2) 0px 15px,
        rgba(255, 255, 255, 0.1) 0px 20px, rgba(255, 255, 255, 0.05) 0px 25px;
    }
  }
}
</style>