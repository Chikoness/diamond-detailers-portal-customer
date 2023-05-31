<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="authenticate">
        <div class="list">
          <form @submit.prevent="submitICNumber" class="dark">
            <div class="input-group">
              <p>Enter your IC Number to view employer/employee page</p>
              <ion-input
                fill="outline"
                pattern="\d{6}[\-]\d{2}[\-]\d{4}"
                v-model="icNumber"
                required
              ></ion-input>
            </div>
            <div class="form-btn">
              <ion-button type="submit" color="light">Submit</ion-button>
            </div>
            <p class="error">{{ message }}</p>
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
      icNumber: null,
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
    submitICNumber() {
      const data = {
        icNumber: this.icNumber,
      };

      axios
        .post(process.env.VUE_APP_BACKEND + "/api/employees/authenticate", data)
        .then((res) => {
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("icNumber", res.data.icNumber);
          localStorage.setItem("securityLvl", res.data.securityLvl);
          localStorage.setItem(
            "type",
            res.data.securityLvl == 1 ? "employer" : "employee"
          );

          window.location.href = "/employee";
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
      }
    }
  }
}
</style>
      