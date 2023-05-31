<template>
  <ion-page>
    <ion-content :fullscreen="true" v-if="isLoaded">
      <div id="appt-exist" class="container">
        <ion-button
          class="input-dirt"
          color="dark"
          v-if="checkUserType !== 'customer'"
          >Input Dirt Level</ion-button
        >
        <form
          @submit.prevent="editForm"
          :class="{ dark: checkUserType !== 'customer' }"
        >
          <div class="input-group">
            <ion-input
              label="Name"
              fill="outline"
              label-placement="stacked"
              v-model="formDetails.name"
              disabled
              required
            ></ion-input>
            <ion-input
              label="Email"
              fill="outline"
              label-placement="stacked"
              v-model="formDetails.email"
              disabled
              required
              type="email"
            ></ion-input>
            <ion-select
              interface="popover"
              label="Select Car Type"
              fill="outline"
              label-placement="stacked"
              v-model="formDetails.carType"
              required
              @ionChange="formDetails.carType = $event.target.value"
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
              interface="popover"
              :multiple="true"
              fill="outline"
              label-placement="stacked"
              v-model="formDetails.services"
              required
              @ionChange="formDetails.services = $event.target.value"
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
              <fieldset :class="checkUserType == 'customer' ? '' : 'employee'">
                <legend>Date</legend>
                <input
                  :placeholder="dateToString"
                  class="date-input"
                  v-model="dateToString"
                  :type="type"
                  onfocus="(this.type='date')"
                  onblur="(this.type='text')"
                  name="date"
                  @change="formDetails.date = $event.target.value"
                />
              </fieldset>
            </div>
            <ion-select
              v-if="checkIfDateHasChanged"
              label="Time slot"
              interface="popover"
              fill="outline"
              label-placement="stacked"
              required
              @ionChange="formDetails.timeSlot = $event.target.value"
              v-model="formDetails.timeSlot"
            >
              <ion-select-option
                v-for="(slot, name) in availableTimeSlotList"
                :key="slot"
                :value="name"
                >{{ slotValues(name) }}</ion-select-option
              >
            </ion-select>

            <ion-select
              v-if="checkUserType !== 'customer'"
              label="Employee in Charge"
              interface="popover"
              fill="outline"
              label-placement="stacked"
              @ionChange="formDetails.icNumber = $event.target.value"
            >
              <ion-select-option
                v-for="emp in allEmployees"
                :key="emp.icNumber"
                :value="emp.icNumber"
              >
                {{ emp.name }}
              </ion-select-option>
            </ion-select>

            <ion-select
              label="Status"
              interface="popover"
              fill="outline"
              label-placement="stacked"
              required
              @ionChange="formDetails.status = $event.target.value"
              :disabled="checkUserType == 'customer'"
              v-model="formDetails.status"
            >
              <ion-select-option value="Pending">Pending</ion-select-option>
              <ion-select-option value="Paid">Paid</ion-select-option>
              <ion-select-option value="Finished">Finished</ion-select-option>
            </ion-select>
          </div>

          <div class="form-btn">
            <ion-button
              v-if="!checkIfDateHasChanged"
              color="warning"
              @click="returnSlotAvailability"
              >Check slot availability</ion-button
            >
            <ion-button
              v-else
              type="submit"
              :color="checkUserType == 'customer' ? 'warning' : 'light'"
              >Edit</ion-button
            >
            <ion-button color="danger" @click="deletePopUp = true"
              >Delete</ion-button
            >
            <p class="error">{{ message }}</p>
          </div>
        </form>
      </div>

      <popup-box
        v-if="deletePopUp"
        :isEmployee="checkUserType !== 'customer'"
        message="Are you sure you would to delete your appointment?"
        :displayButtons="true"
        @close="deletePopUp = false"
        @click="$event.target.id === 'popup' ? (deletePopUp = false) : ''"
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
} from "@ionic/vue";
import PopupBox from "@/components/PopupBox.vue";
import { cars } from "@/data/cars";
import axios from "axios";

export default {
  components: {
    IonContent,
    IonPage,
    IonInput,
    IonSelect,
    IonSelectOption,
    PopupBox,
  },

  mounted() {
    axios
      .get(process.env.VUE_APP_BACKEND + "/api/appointment/get", {
        params: { id: this.$route.params.id },
      })

      .then((res) => {
        this.formDetails = res.data.data;
        this.timeSlot2 = this.formDetails.timeSlot;
        this.oldDate = this.formDetails.date;

        axios
          .post(
            process.env.VUE_APP_BACKEND +
              "/api/appointment/new/checkSlotAvailable",
            { date: this.formDetails.date }
          )
          .then((res) => {
            this.availableTimeSlotList = res.data.timeSlots;
            this.date2 = this.formDetails.date;
            this.message = null;

            Object.keys(this.availableTimeSlotList).forEach((slot) => {
              if (this.availableTimeSlotList[slot].length >= 3) {
                delete this.availableTimeSlotList[slot];
              }
            });

            axios
              .get(
                process.env.VUE_APP_BACKEND +
                  "/api/appointment/new/getAllServices"
              )
              .then((res) => {
                this.availableServices = res.data.data;

                axios
                  .get(process.env.VUE_APP_BACKEND + "/api/employees/all")
                  .then((res) => {
                    this.allEmployees = res.data.data;
                  })
                  .catch((e) => {
                    this.message =
                      e.response === undefined
                        ? "Cannot connect to backend. Please wait and try again"
                        : e.response.data.message;
                  });

                this.isLoaded = true;
              })
              .catch((e) => {
                this.message =
                  e.response === undefined
                    ? "Cannot connect to backend. Please wait and try again"
                    : e.response.data.message;
              });
          })
          .catch((e) => {
            this.message =
              e.response === undefined
                ? "Cannot connect to backend. Please wait and try again"
                : e.response.data.message;
          });
      })
      .catch(() => {
        window.location.href = "/appointment";
      });
  },

  computed: {
    dateToString() {
      const d = new Date(this.formDetails.date);
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
      const d = new Date(this.formDetails.date);
      const dToString =
        d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
      const d2 = new Date(this.date2);
      const d2ToString =
        d2.getMonth() + 1 + "/" + d2.getDate() + "/" + d2.getFullYear();

      return dToString == d2ToString;
    },

    checkUserType() {
      const type = localStorage.getItem("type");

      if (type == null) {
        return "customer";
      }

      return type;
    },
  },

  data() {
    return {
      isLoaded: false,
      cars,
      formDetails: {},
      editModeOn: false,
      deletePopUp: false,
      availableTimeSlotList: null,
      availableServices: null,
      date2: null,
      oldDate: null,
      timeSlot2: null,
      message: null,
      allEmployees: null,
    };
  },

  methods: {
    editForm() {
      const convertDate = new Date(this.formDetails.date);
      const convertOldDate = new Date(this.oldDate);
      this.formDetails.date =
        convertDate.getFullYear() +
        "/" +
        ((convertDate.getMonth() + 1).toString().length == 1
          ? "0" + (convertDate.getMonth() + 1)
          : convertDate.getMonth() + 1) +
        "/" +
        (convertDate.getDate().toString().length == 1
          ? "0" + convertDate.getDate()
          : convertDate.getDate());

      this.oldDate =
        convertOldDate.getFullYear() +
        "/" +
        ((convertOldDate.getMonth() + 1).toString().length == 1
          ? "0" + (convertOldDate.getMonth() + 1)
          : convertOldDate.getMonth() + 1) +
        "/" +
        convertOldDate.getDate();

      const data = {
        id: this.$route.params.id,
        carType: this.formDetails.carType,
        services: this.formDetails.services,
        date: this.formDetails.date,
        oldDate: this.oldDate,
        timeSlot: this.formDetails.timeSlot,
        oldTimeSlot: this.timeSlot2,
        status: this.formDetails.status,
        icNumber: this.checkUserType == 'customer' ? "" : this.formDetails.icNumber
      };

      axios
        .post(process.env.VUE_APP_BACKEND + "/api/appointment/edit", data)
        .then(() => {
          localStorage.setItem("id", this.$route.params.id);
          
          window.location.href =
            this.checkUserType == "customer"
              ? "/confirmation/editAppt"
              : "/appointment";
        })
        .catch((e) => {
          this.message =
            e.response === undefined
              ? "Cannot connect to backend. Please wait and try again"
              : e.response.data.message;
        });
    },

    confirmDelete() {
      const data = {
        id: this.$route.params.id,
        carType: this.formDetails.carType,
        services: this.formDetails.services,
        date: this.formDetails.date,
        oldDate: this.oldDate,
        timeSlot: this.formDetails.timeSlot,
        oldTimeSlot: this.timeSlot2,
        status: this.formDetails.status,
      };

      axios
        .post(process.env.VUE_APP_BACKEND + "/api/appointment/delete", data)
        .then(() => {
          localStorage.setItem("id", this.$route.params.id)
          window.location.href =
            this.checkUserType == "customer"
              ? "/confirmation/deleteAppt"
              : "/appointment";
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

    returnSlotAvailability() {
      if (this.formDetails.date == null) {
        this.message = "Please select a date.";
        return;
      }

      const data = {
        date: this.formDetails.date,
      };

      axios
        .post(
          process.env.VUE_APP_BACKEND +
            "/api/appointment/new/checkSlotAvailable",
          data
        )
        .then((res) => {
          this.availableTimeSlotList = res.data.timeSlots;
          this.date2 = this.formDetails.date;
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
  },
};
</script>

<style lang="scss">
#appt-exist {
  margin-top: 1.2rem;

  .input-dirt {
    width: 60%;
    box-shadow: rgba(255, 255, 255, 0.4) 0px 5px,
      rgba(255, 255, 255, 0.3) 0px 10px, rgba(255, 255, 255, 0.2) 0px 15px,
      rgba(255, 255, 255, 0.1) 0px 20px, rgba(255, 255, 255, 0.05) 0px 25px;
    margin: 0 auto 1.2rem auto;
  }

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
</style>