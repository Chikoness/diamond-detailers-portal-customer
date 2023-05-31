<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div
        id="employee"
        class="container"
        v-if="isEmployerEmployee && employees"
      >
        <div class="logo small"></div>
        <p class="title">Welcome back, {{ getName }}!</p>
        <br />
        <div class="list">
          <template v-if="isEmployer">
            <ion-button href="/employee/new" color="dark"
              >Register New Employee</ion-button
            >
            <ion-button @click="display = 'employees'" color="dark"
              >Display Employees</ion-button
            >
          </template>
          <ion-button @click="display = 'appointments'" color="dark"
            >Display Appointments</ion-button
          >

          <display-employees
            v-if="display == 'employees'"
            :display="'employees'"
            :data="employees"
            @click="$event.target.id === 'display-emp' ? (display = false) : ''"
          />

          <display-employees 
            v-if="display == 'appointments'"
            :display="'appointments'"
            :data="appts"
            @click="$event.target.id === 'display-emp' ? (display = false) : ''"
          />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage, IonButton } from "@ionic/vue";
import axios from "axios";
import DisplayEmployees from '@/components/DisplayEmployees.vue';

export default {
  components: {
    IonContent,
    IonPage,
    IonButton,
    DisplayEmployees,
  },

  data() {
    return {
      icNumber: null,
      message: null,
      employees: null,
      appts: null,
      display: null,
    };
  },

  mounted() {
    if (!this.isEmployerEmployee) {
      window.location.href = "/authentication";
    }

    axios
      .get(process.env.VUE_APP_BACKEND + "/api/employees/all")
      .then((res) => {
        this.employees = res.data.data;
      })
      .catch((e) => {
        this.message =
          e.response === undefined
            ? "Cannot connect to backend. Please wait and try again"
            : e.response.data.message;
      });

      axios
        .get(process.env.VUE_APP_BACKEND + "/api/appointment/all")
        .then((res) => {
          this.appts = res.data.data;
        })
        .catch((e) => {
          this.message =
            e.response === undefined
              ? "Cannot connect to backend. Please wait and try again"
              : e.response.data.message;
        });
  },

  computed: {
    isEmployerEmployee() {
      return (
        localStorage.getItem("type") == "employer" ||
        localStorage.getItem("type") == "employee"
      );
    },

    isEmployer() {
      return localStorage.getItem("type") == "employer";
    },

    getName() {
      return localStorage.getItem("name");
    },
  },

  methods: {
    submitICNumber() {
      const data = {
        icNumber: this.icNumber,
      };

      axios
        .post(process.env.VUE_APP_BACKEND + "/api/employees/get", data)
        .then((res) => {
          localStorage.setItem("icToCheck", this.icNumber);

          window.location.href = "/employee/edit";
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
#employee {
  height: 60%;

  .title {
    text-align: center;
    margin-bottom: 1rem;
  }

  .list {
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 80%;

    ion-button {
      margin-bottom: 1.2rem;
      box-shadow: rgba(255, 255, 255, 0.4) 0px 5px,
        rgba(255, 255, 255, 0.3) 0px 10px, rgba(255, 255, 255, 0.2) 0px 15px,
        rgba(255, 255, 255, 0.1) 0px 20px, rgba(255, 255, 255, 0.05) 0px 25px;
    }
  }
}
</style>