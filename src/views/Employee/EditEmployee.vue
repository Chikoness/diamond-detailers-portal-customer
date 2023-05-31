<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="emp-edit" class="container" v-if="isLoaded">
        <form
          @submit.prevent="submitForm"
          :class="{ dark: checkUserType !== 'customer' }"
        >
          <div class="input-group">
            <ion-input
              label="Name"
              label-placement="stacked"
              fill="outline"
              v-model="formDetails.name"
              disabled
              required
            ></ion-input>
            <ion-input
              label="IC Number"
              label-placement="stacked"
              fill="outline"
              pattern="\d{6}[\-]\d{2}[\-]\d{4}"
              v-model="formDetails.icNumber"
              disabled
              required
            ></ion-input>
            <ion-input
              label="Phone No."
              label-placement="stacked"
              fill="outline"
              v-model="formDetails.phoneNo"
              required
              placeholder="012-3456789"
              pattern="\d{3}[\-]\d{7}"
            ></ion-input>
            <ion-input
              label="Email"
              label-placement="stacked"
              fill="outline"
              v-model="formDetails.email"
              required
              type="email"
            ></ion-input>
            <ion-textarea
              label="Address"
              label-placement="stacked"
              fill="outline"
              :auto-grow="true"
              v-model="formDetails.address"
            />
            <ion-input
              label="Position"
              label-placement="stacked"
              fill="outline"
              v-model="formDetails.position"
              required
            ></ion-input>
            <ion-select
              label="Security Level"
              interface="popover"
              label-placement="stacked"
              fill="outline"
              required
              v-model="formDetails.securityLvl"
              @ionChange="formDetails.securityLvl = $event.target.value"
            >
              <ion-select-option :value="1">1</ion-select-option>
              <ion-select-option :value="2">2</ion-select-option>
            </ion-select>
          </div>

          <div class="form-btn">
            <ion-button type="submit">Submit</ion-button>
            <ion-button @click="openPopUp = true" color="danger"
              >Delete</ion-button
            >
          </div>

          <p class="error">{{ message }}</p>
        </form>
      </div>

      <popup-box
        v-if="openPopUp"
        :isEmployee="checkUserType !== 'customer'"
        :message="'Are you sure you want to delete ' + formDetails.name + '?'"
        :displayButtons="true"
        @close="openPopUp = false"
        @click="$event.target.id === 'popup' ? (openPopUp = false) : ''"
        @confirm="confirmDelete"
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
      formDetails: null,
      isLoaded: false,
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

    axios
      .get(process.env.VUE_APP_BACKEND + "/api/employees/get", {
        params: { icNumber: this.$route.params.id },
      })
      .then((res) => {
        this.formDetails = res.data.user;
        this.isLoaded = true;
      })
      .catch((e) => {
        this.message =
          e.response === undefined
            ? "Cannot connect to backend. Please wait and try again"
            : e.response.data.message;
      });
  },

  methods: {
    submitForm() {
      axios
        .post(
          process.env.VUE_APP_BACKEND + "/api/employees/edit",
          this.formDetails
        )
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

    confirmDelete() {
      axios
        .post(
          process.env.VUE_APP_BACKEND + "/api/employees/delete",
          this.formDetails
        )
        .then(() => {
          console.log("success delete!");
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
#emp-edit {
  margin-top: 1.2rem;
}
</style>