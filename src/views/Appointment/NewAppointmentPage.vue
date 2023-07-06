<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="appt-new" class="container">
        <form @submit.prevent="submitForm">
          <div class="input-group">
            <ion-input
              label="Name"
              label-placement="stacked"
              fill="outline"
              v-model="name"
              required
            ></ion-input>
            <ion-input
              label="Email"
              label-placement="stacked"
              fill="outline"
              v-model="email"
              required
              type="email"
            ></ion-input>
            <ion-select
              label="Select Car Type"
              interface="popover"
              label-placement="stacked"
              fill="outline"
              required
              @ionChange="carType = $event.target.value"
            >
              <ion-select-option
                v-for="(car, id) in cars"
                :key="car"
                :value="id"
              >
                {{ car }}
              </ion-select-option>
            </ion-select>
            <ion-select
              label="Select services needed"
              label-placement="stacked"
              interface="popover"
              :multiple="true"
              fill="outline"
              required
              @ionChange="services = $event.target.value"
            >
              <ion-select-option
                v-for="service in availableServices"
                :key="service.name"
                :value="service.name"
              >
                {{ service.display }}
              </ion-select-option>
            </ion-select>
            <div class="date-div">
              <fieldset class="customer">
                <legend>Date</legend>
                <input
                  :placeholder="dateToString"
                  class="date-input"
                  v-model="dateToString"
                  :type="type"
                  onfocus="(this.type='date')"
                  onblur="(this.type='text')"
                  name="date"
                  @change="date = $event.target.value"
                />
              </fieldset>
            </div>
            <ion-select
              v-if="checkIfDateHasChanged"
              label="Time slot"
              interface="popover"
              label-placement="stacked"
              fill="outline"
              required
              @ionChange="timeSlot = $event.target.value"
            >
              <ion-select-option
                v-for="(slot, name) in availableTimeSlotList"
                :key="slot"
                :value="name"
                >{{ slotValues(name) }}</ion-select-option
              >
            </ion-select>
          </div>

          <div class="form-btn">
            <ion-button
              v-if="!checkIfDateHasChanged"
              color="warning"
              @click="returnSlotAvailability"
              >Check slot availability</ion-button
            >
            <ion-button v-else @click="calculateFullPrice()">Submit</ion-button>

            <ion-button type="reset" color="light">Clear</ion-button>
          </div>

          <p class="error">{{ message }}</p>
        </form>
      </div>

      <popup-box
        v-if="openPopUp"
        :isEmployee="false"
        message="Confirm appointment?"
        :message2="
          'Date: ' +
          dateToString +
          ' @ ' +
          slotValues(timeSlot)
        "
        :message3="'Price: RM' + price.toFixed(2)"
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
} from "@ionic/vue";
import axios from "axios";
import { cars } from "@/data/cars";
import PopupBox from "../../components/PopupBox.vue";

export default {
  components: {
    IonContent,
    IonPage,
    IonInput,
    IonSelect,
    IonSelectOption,
    PopupBox,
  },

  data() {
    return {
      cars,

      name: null,
      email: null,
      carType: null,
      services: null,
      date: null,
      date2: null,
      timeSlot: null,

      message: null,
      openPopUp: false,

      availableTimeSlotList: null,
      availableServices: null,

      price: 0,
    };
  },

  computed: {
    dateToString() {
      const d = this.date == null ? new Date() : new Date(this.date);
      const dToString =
        ((d.getMonth() + 1).toString().length == 1
          ? "0" + (d.getMonth() + 1)
          : d.getMonth() + 1) +
        "/" +
        (d.getDate().toString().length == 1 ? "0" + d.getDate() : d.getDate()) +
        "/" +
        d.getFullYear();
      return dToString;
    },

    checkIfDateHasChanged() {
      if (this.date == null || this.date2 == null) {
        return false;
      }

      const d = new Date(this.date);
      const dToString =
        d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
      const d2 = new Date(this.date2);
      const d2ToString =
        d2.getMonth() + 1 + "/" + d2.getDate() + "/" + d2.getFullYear();

      return dToString == d2ToString;
    },
  },

  mounted() {
    let temp = new Date().getTime();
    this.date = new Date(temp + 1 * 24 * 60 * 60 * 1000);

    if (localStorage.getItem("name") !== undefined) {
      this.name = localStorage.getItem("name")
    }

    if (localStorage.getItem("email") !== undefined) {
      this.email = localStorage.getItem("email")
    }

    axios
      .get(process.env.VUE_APP_BACKEND + "/api/appointment/new/getAllServices")
      .then((res) => {
        this.availableServices = res.data.data;
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
      const data = {
        name: this.name,
        email: this.email,
        carType: this.carType,
        services: this.services,
        date: this.date,
        timeSlot: this.timeSlot,
      };

      if (new Date(this.date) < new Date()) {
        this.message = "Please select a date later than today!";
        return;
      } else {
        this.message = null;
      }

      axios
        .post(process.env.VUE_APP_BACKEND + "/api/appointment/new", data)
        .then((res) => {
          localStorage.setItem("name", this.name);
          localStorage.setItem("email", this.email)
          localStorage.setItem("id", res.data.id);
          
          window.location.href = "/confirmation/makeAppt/";
        })
        .catch((e) => {
          this.message =
            e.response === undefined
              ? "Cannot connect to backend. Please wait and try again"
              : e.response.data.message;
        });
    },

    // handleDate(d) {
    //   this.date = d;
    // },

    returnSlotAvailability() {
      if (this.date == null) {
        this.message = "Please select a date.";
        return;
      }

      if (new Date(this.date) < new Date()) {
        this.message = "Please select a date later than today!";
        return;
      } else {
        this.message = null;
      }

      const data = {
        date: this.date,
      };

      axios
        .post(
          process.env.VUE_APP_BACKEND +
            "/api/appointment/new/checkSlotAvailable",
          data
        )
        .then((res) => {
          this.availableTimeSlotList = res.data.timeSlots;
          this.date2 = this.date;
          this.message = null;

          Object.keys(this.availableTimeSlotList).forEach((slot) => {
            if (this.availableTimeSlotList[slot].length >= 3) {
              delete this.availableTimeSlotList[slot];
            }
          });
        })
        .catch((e) => {
          this.message =
            e.response === undefined
              ? "Cannot connect to backend. Please wait and try again"
              : e.response.data.message;
        });
    },

    slotValues(s) {
      switch (s) {
        case "0900":
          return "9.00am - 12.00pm";
        case "1400":
          return "2.00pm - 5.00pm";
        case "1800":
          return "6.00pm - 9.00pm";
        default:
          return "";
      }
    },

    calculateFullPrice() {
      axios
        .post(
          process.env.VUE_APP_BACKEND + "/api/appointment/new/getFullPrice",
          { services: this.services }
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

      this.openPopUp = true;
    },
  },
};
</script>

<style lang="scss">
#appt-new {
  margin: auto;
  margin-top: 1.2rem;
  width: 40rem;

  form {
    .date-div {
      fieldset {
        border: 1px solid rgb(87, 87, 87);
        border-radius: 0.2rem;
        background: rgba(255, 255, 255, 0.5);
        color: #000;
        font: 0.9rem "Gotham-Book";
        margin: -0.5rem 0 0.5rem 0;

        &.employee {
          background: rgba(255, 255, 255, 1);
        }
      }

      .date-input {
        font: 1.2rem "Gotham-Book";
        background: none;
        border: 0;
        outline: none;
        text-align: center;
        width: 100%;
      }

      .date-input::placeholder {
        opacity: 1;
      }
    }
  }
}

@media (max-width: 700px) {
  #appt-new {
    width: 100%;
  }
}
</style>