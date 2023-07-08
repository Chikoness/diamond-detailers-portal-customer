<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="customer" class="container customer-employee">
        <div class="logo small"></div>
        <p class="title">Welcome, {{ customerName }}!</p>
        <div class="list">
          <ion-button color="warning" href="/appointment"
            >Appointment</ion-button
          >
          <ion-button color="warning" href="/history">History</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage, IonButton } from "@ionic/vue";

export default {
  components: {
    IonContent,
    IonPage,
    IonButton,
  },

  mounted() {
    if (localStorage.getItem("id") !== null) {
      localStorage.removeItem('id');
    }
  },

  computed: {
    customerName() {
      return localStorage.getItem("name")
        ? localStorage.getItem("name")
        : "customer";
    },
  },
};
</script>
  
<style lang="scss">
#customer {
  height: 60%;
  
  .title {
    text-align: center;
    color: #fff;
  }

  .list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    width: 100%;

    ion-button {
      width: 18rem;
      margin-bottom: 1.2rem;
      box-shadow: rgba(255, 213, 52, 0.4) 0px 5px,
        rgba(255, 213, 52, 0.3) 0px 10px, rgba(255, 213, 52, 0.2) 0px 15px,
        rgba(255, 213, 52, 0.1) 0px 20px, rgba(255, 213, 52, 0.05) 0px 25px;
    }
  }

  @media screen and (max-width: 700px) {
    .list {
      ion-button {
        width: 55vw;
      }
    }
  }
}
</style>
    