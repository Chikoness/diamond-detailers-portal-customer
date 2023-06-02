<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="authenticate">
        <div class="list">
          <form @submit.prevent="submitEmail" class="dark">
            <div class="input-group">
              <p>Enter your Email to login</p>
              <ion-input
                fill="outline"
                type="email"
                v-model="email"
                required
              ></ion-input>
            </div>
            <div class="form-btn">
              <ion-button type="submit" color="light">Submit</ion-button>
            </div>
            <p class="error">{{ message }}</p>
            <p class="to-customer" @click="toCustomerPage()">Log me in anonymously</p>
          </form>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
  
<script>
import { IonContent, IonPage, IonButton, IonInput } from "@ionic/vue";
import axios from "axios";

export default {
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonInput,
  },

  data() {
    return {
      email: null,
      message: null,
    };
  },

  computed: {
    checkUserType() {
      const type = localStorage.getItem("type");

      if (type == null) {
        return "customer";
      }

      return type;
    },
  },

  methods: {
    toCustomerPage() {
      window.location.href = "/customer"
    },

    submitEmail() {
      const data = {
        email: this.email,
      };

      axios
        .post(process.env.VUE_APP_BACKEND + "/api/customer/get", data)
        .then((res) => {
          localStorage.setItem("name", res.data.data.name);
          localStorage.setItem("email", res.data.data.email);

          window.location.href = "/customer";
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
#authenticate {
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title {
    margin: auto;
    text-align: center;
  }

  .list {
    padding-top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;

    form {
      height: 100%;
      
      p {
        margin-bottom: 1rem;

        &.to-customer {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
      