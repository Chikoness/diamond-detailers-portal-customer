<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="emp-new" class="container">
        <form
          @submit.prevent="submitForm"
          :class="{ dark: checkUserType !== 'customer' }"
        >
          <div class="input-group">
            <ion-input
              label="Name"
              label-placement="stacked"
              fill="outline"
              v-model="name"
              required
            ></ion-input>
            <ion-input
              label="IC Number"
              label-placement="stacked"
              fill="outline"
              pattern="\d{6}[\-]\d{2}[\-]\d{4}"
              v-model="icNumber"
              required
            ></ion-input>
            <ion-input
              label="Phone No."
              label-placement="stacked"
              fill="outline"
              v-model="phoneNo"
              required
              placeholder="012-3456789"
              pattern="\d{3}[\-]\d{7}"
            ></ion-input>
            <ion-input
              label="Email"
              label-placement="stacked"
              fill="outline"
              v-model="email"
              required
              type="email"
            ></ion-input>
            <ion-textarea
              label="Address"
              label-placement="stacked"
              fill="outline"
              :auto-grow="true"
              v-model="address"
            />
            <ion-input
              label="Position"
              label-placement="stacked"
              fill="outline"
              v-model="position"
              required
            ></ion-input>
            <ion-select
              label="Security Level"
              interface="popover"
              label-placement="stacked"
              fill="outline"
              required
              @ionChange="securityLvl = $event.target.value"
            >
              <ion-select-option value="1">1</ion-select-option>
              <ion-select-option value="2">2</ion-select-option>
            </ion-select>
          </div>

          <div class="form-btn">
            <ion-button @click="openPopUp = true">Submit</ion-button>
            <ion-button type="reset" color="light">Clear</ion-button>
          </div>

          <p class="error">{{ message }}</p>
        </form>
      </div>

      <popup-box
        v-if="openPopUp"
        :isEmployee="checkUserType !== 'customer'"
        message="Confirm registration?"
        :displayButtons="true"
        @close="openPopUp = false"
        @click="$event.target.id === 'popup' ? (openPopUp = false) : ''"
        @confirm="submitForm"
      />
    </ion-content>
  </ion-page>
</template>
  
  <script>
import {
  IonContent,
  IonPage,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from "@ionic/vue";
import axios from "axios";
import PopupBox from "../../components/PopupBox.vue";

export default {
  components: {
    IonContent,
    IonPage,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    PopupBox,
  },

  data() {
    return {
      name: null,
      icNumber: null,
      phoneNo: null,
      email: null,
      address: null,
      position: null,
      securityLvl: null,

      message: null,
      openPopUp: false,
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

  mounted() {
    if (this.checkUserType !== "employer") {
      window.location.href = "/employee";
      return;
    }
  },

  methods: {
    submitForm() {
      const data = {
        name: this.name,
        icNumber: this.icNumber,
        phoneNo: this.phoneNo,
        email: this.email,
        address: this.address,
        position: this.position,
        securityLvl: this.securityLvl,
      };

      axios
        .post(process.env.VUE_APP_BACKEND + "/api/employees/register", data)
        .then((res) => {
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
#emp-new {
  margin-top: 1.2rem;
}
</style>