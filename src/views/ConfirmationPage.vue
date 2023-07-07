<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="confirmation" class="container">
        <div class="msg-content">
          <p class="explain">{{ confirmMessageType }}</p>
          <br />
          <p v-if="getPageType == 'makeAppt' || getPageType == 'editAppt'">
            {{ getPageType == "editAppt" ? "New" : "" }} Price : RM
            {{ price.toFixed(2) }}
            <br />
            {{ getPageType == "editAppt" ? "New" : "" }} Estimated Time:
            {{ numOfServices }} hour{{ numOfServices > 1 ? "s" : "" }}
            <br /><br />
            Please bank in to either one of the following bank accounts:
            <br /><br />
            CIMB Bank<br />
            Name: Diamond Detailers Plt<br />
            Account Number: 123456789<br />
            <br />
            Maybank<br />
            Name: Diamond Detailers Plt<br />
            Account Number: 123456789<br />
            <br />
            Once the payment has been made, a confirmation will be sent to you
            shortly. Please wait within 1 - 3 hours.
            <br /><br />
            Thank you for choosing Diamond Detailers!
          </p>
          <p v-else>
            We're sorry to see you go, we hope to see you again in the future!
          </p>
        </div>

        <ion-button
          color="warning"
          href="/customer"
          @click="registerCustomer"
        >
          &lt; Back to Home
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage, IonButton } from "@ionic/vue";
import axios from "axios";

export default {
  props: ["status"],

  components: {
    IonContent,
    IonPage,
    IonButton,
  },

  data() {
    return {
      formDetails: null,
      price: 0,
      numOfServices: null,
    };
  },

  mounted() {
    if (this.getPageType !== "deleteAppt") {
      axios
        .get(process.env.VUE_APP_BACKEND + "/api/appointment/get", {
          params: {
            id: localStorage.getItem("id"),
          },
        })
        .then((res) => {
          this.formDetails = res.data.data;

          this.getFullPrice();

          this.numOfServices = this.formDetails.services.length;
        })
        .catch(() => {
          window.location.href = "/appointment";
        });
    } else {
      if (localStorage.getItem("id") === null) {
        window.location.href = "/appointment";
      }
    }
  },

  computed: {
    getPageType() {
      return this.$route.params.id;
    },

    confirmMessageType() {
      switch (this.getPageType) {
        case "makeAppt":
          return "Appointment successfully registered!";
        case "editAppt":
          return "Appointment successfully changed!";
        case "deleteAppt":
          return "Appointment successfully cancelled.";
        default:
          return "Appointment";
      }
    },
  },

  methods: {
    getFullPrice() {
      axios
        .post(
          process.env.VUE_APP_BACKEND + "/api/appointment/new/getFullPrice",
          { services: this.formDetails.services }
        )
        .then((res) => {
          this.price = res.data.price;
        })
        .catch((e) => {
          this.message =
            e.response === undefined
              ? "Cannot connect to backend. Please wait and try again"
              : e.response.data.message;
        });
    },
  },
};
</script>

<style lang="scss">
#confirmation {
  margin-top: 5rem;

  .msg-content {
    height: auto;
    margin-bottom: 2rem;

    p {
      font: 1.1rem "Gotham-Book";
      margin-bottom: 0.8rem;

      &.explain {
        font: 1.2rem "Gotham-Black";
      }
    }
  }
}
</style>