<template>
  <ion-page>
    <ion-content :fullscreen="true" v-if="dirtInfo">
      <div id="history-page" class="container">
        <div class="input-group">
          <ion-select
            interface="popover"
            label="Display type"
            fill="outline"
            label-placement="stacked"
            v-model="viewType"
            required
            @ionChange="viewType = $event.target.value"
          >
            <ion-select-option value="month"> Month </ion-select-option>
            <ion-select-option value="week"> Week </ion-select-option>
          </ion-select>
        </div>

        <div class="input-group">
          <ion-select
            interface="popover"
            label="Select month"
            fill="outline"
            label-placement="stacked"
            v-model="selectedMonth"
            required
            @ionChange="selectedMonth = $event.target.value"
          >
            <ion-select-option v-for="m in months" :key="m" :value="m">
              {{ m }}
            </ion-select-option>
          </ion-select>

          <ion-select
            v-if="viewType == 'week'"
            interface="popover"
            label="Select day"
            fill="outline"
            label-placement="stacked"
            v-model="selectedDay"
            required
            @ionChange="selectedDay = $event.target.value"
          >
            <ion-select-option v-for="d in numOfDaysInMonth()" :key="d" :value="d">
              {{ d }}
            </ion-select-option>
          </ion-select>
        </div>
        <bar-chart
          :data="dirtData"
          :monthToDisplay="selectedMonth"
          :selectedDay="selectedDay"
          :viewType="viewType"
          :months="months"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage, IonSelect, IonSelectOption } from "@ionic/vue";
import BarChart from "@/components/BarChart.vue";
import axios from "axios";
import _ from "lodash";
import getWeeksInMonth from "date-fns/getWeeksInMonth";
import getDaysInMonth from 'date-fns/getDaysInMonth'

export default {
  components: {
    IonContent,
    IonPage,
    IonSelect,
    IonSelectOption,
    BarChart,
  },

  watch: {
    selectedMonth: {
      deep: true,
      handler(val) {
        if (val !== this.selectedMonthTemp) {
          this.selectedDay = 1
          this.selectedMonthTemp = val
        }
      }
    }
  },

  data() {
    return {
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],

      dirtInfo: null,
      dirtData: {},

      viewType: "month",
      selectedMonth: null,
      selectedMonthTemp: null,
      selectedDay: 1,
    };
  },

  computed: {
    email() {
      return localStorage.getItem("email");
    },
  },

  mounted() {
    this.selectedMonth = this.months[new Date().getMonth()];
    this.selectedMonthTemp = this.months[new Date().getMonth()];
    this.selectedDay = new Date().getDate();

    axios
      .post(process.env.VUE_APP_BACKEND + "/api/customer/getDirtInfo", {
        email: this.email,
      })
      .then((res) => {
        this.dirtInfo = res.data.data;
        this.categorizeDirtInfo(res.data.data);
      })
      .catch((e) => {
        this.message =
          e.response === undefined
            ? "Cannot connect to backend. Please wait and try again"
            : e.response.data.message;
      });
  },

  methods: {
    categorizeDirtInfo() {
      let dirtArray = [];

      this.dirtInfo.forEach((d) => {
        dirtArray.push(d);

        let date = new Date(d.date);
        let year = date.getFullYear().toString();
        let month = this.months[date.getMonth()].toString();
        let day = date.getDate().toString();
        _.setWith(this.dirtData, `${year}.${month}.${day}`, d.dirtInfo, Object);
      });
    },

    getAllAvailableMonths() {
      let m = [];

      Object.values(this.dirtData).forEach((y) => {
        m.push(Object.keys(y)[0]);
      });

      return m;
    },

    numOfDaysInMonth() {
      return getDaysInMonth(new Date(2023, this.months.indexOf(this.selectedMonth)), 1)
    },
  },
};
</script>

<style lang="scss">
#history-page {
  height: 75%;
  padding: 0 1rem;
  margin: 7rem auto 0 auto;
  width: 40rem;

  .input-group {
    display: flex;

    ion-select {
      width: 45vw;
      margin: auto;
    }

    margin-bottom: 1.5rem;
  }
}

@media (max-width: 700px) {
  #history-page {
    width: 100%;
  }
}
</style>
