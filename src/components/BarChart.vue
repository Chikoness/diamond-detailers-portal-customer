<template>
  <div class="bar-chart">
    <Bar :data="barChartData" id="bar-chart" :options="options" />
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import _ from "lodash";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import getWeekOfMonth from "date-fns/getWeekOfMonth";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  props: ["data", "monthToDisplay", "selectedDay", "viewType", "months"],

  name: "History Bar-Chart",

  components: { Bar },

  computed: {
    barChartData() {
      return {
        labels:
          this.viewType == "month"
            ? this.getAllAvailableDateInMonth()
            : this.getAllDayInWeek(),
        datasets: [
          {
            label: "Hood, Headlights, Windscreen",
            data: this.viewTypeDisplay("front"),
            borderRadius: 5,
            backgroundColor: "#EDCF65",
            datalabels: {
              color: "black",
            },
          },
          {
            label: "Boot",
            data: this.viewTypeDisplay("back"),
            borderRadius: 5,
            backgroundColor: "#7D8279",
            datalabels: {
              color: "black",
            },
          },
          {
            label: "Roof",
            data: this.viewTypeDisplay("top"),
            borderRadius: 5,
            backgroundColor: "#535046",
            datalabels: {
              color: "black",
            },
          },
          {
            label: "Left doors, windows, wheels",
            data: this.viewTypeDisplay("left"),
            borderRadius: 5,
            backgroundColor: "#020202",
            datalabels: {
              color: "black",
            },
          },
          {
            label: "Right doors, windows, wheels",
            data: this.viewTypeDisplay("right"),
            borderRadius: 5,
            backgroundColor: "#767489",
            datalabels: {
              color: "black",
            },
          },
        ],
      };
    },

    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            stacked: true,
            min: 0,
            ticks: {
              color: "black",
              font: {
                family: "Gotham-Book",
                size: 12,
              },
            },
            grid: {
              display: false,
              drawTicks: false,
            },
          },
          x: {
            stacked: true,
            ticks: {
              color: "black",
              font: {
                family: "Gotham-Book",
                size: 12,
              },
            },
            grid: {
              display: false,
              drawTicks: false,
            },
          },
        },
        plugins: {
          legend: false,
        },
      };
    },
  },

  methods: {
    getAllAvailableDateInMonth() {
      let dates = [];

      Object.values(this.data).forEach((y) => {
        Object.keys(y).forEach((mon) => {
          if (this.monthToDisplay == mon) {
            const filtered = y[mon];

            _.entries(filtered).forEach(([key, value]) => {
              dates.push(this.monthToDisplay + " " + key);
            });
          } else {
            return dates;
          }
        });
      });

      return dates;
    },

    getAllDayInWeek() {
      let dates = [];

      let start = startOfWeek(
        new Date(2023, this.months.indexOf(this.monthToDisplay), this.selectedDay),
        { weekStartsOn: 1 }
      );
      let end = endOfWeek(
        new Date(2023, this.months.indexOf(this.monthToDisplay), this.selectedDay),
        { weekStartsOn: 1 }
      );

      for (let i = start.getDate(); i <= end.getDate(); i++) {
        dates.push(this.monthToDisplay + " " + i);
      }

      return dates;
    },

    viewTypeDisplay(type) {
      let displayPoints = [];

      Object.values(this.data).forEach((dat) => {
        Object.keys(dat).forEach((mm) => {
          if (this.monthToDisplay == mm) {
            let point = dat[mm];

            _.entries(point).forEach(([key, p]) => {
              if (p != undefined) {
                if (this.viewType == "month") {
                  switch (type) {
                    case "front":
                      displayPoints.push(
                        p.hood + p.lHeadlight + p.rHeadlight + p.windscreen
                      );
                      break;
                    case "top":
                      displayPoints.push(p.hood);
                      break;
                    case "back":
                      displayPoints.push(p.boot);
                      break;
                    case "left":
                      displayPoints.push(
                        p.lfDoor +
                          p.rfDoor +
                          p.lfWheel +
                          p.rfWheel +
                          p.lfWindow +
                          p.rfWindow
                      );
                      break;
                    case "right":
                      displayPoints.push(
                        p.lbDoor +
                          p.rbDoor +
                          p.lbWheel +
                          p.rbWheel +
                          p.lbWindow +
                          p.rbWindow
                      );
                      break;
                  }
                } else {
                  let start = startOfWeek(
                    new Date(
                      2023,
                      this.months.indexOf(this.monthToDisplay),
                      this.selectedDay
                    ),
                    { weekStartsOn: 1 }
                  );
                  let end = endOfWeek(
                    new Date(
                      2023,
                      this.months.indexOf(this.monthToDisplay),
                      this.selectedDay
                    ),
                    { weekStartsOn: 1 }
                  );

                  for (let i = start.getDate(); i <= end.getDate(); i++) {
                    if (point.hasOwnProperty(i)) {
                      switch (type) {
                        case "front":
                          displayPoints.push(
                            point[i].hood +
                              point[i].lHeadlight +
                              point[i].rHeadlight +
                              point[i].windscreen
                          );
                          break;
                        case "top":
                          displayPoints.push(point[i].hood);
                          break;
                        case "back":
                          displayPoints.push(point[i].boot);
                          break;
                        case "left":
                          displayPoints.push(
                            point[i].lfDoor +
                              point[i].rfDoor +
                              point[i].lfWheel +
                              point[i].rfWheel +
                              point[i].lfWindow +
                              point[i].rfWindow
                          );
                          break;
                        case "right":
                          displayPoints.push(
                            point[i].lbDoor +
                              point[i].rbDoor +
                              point[i].lbWheel +
                              point[i].rbWheel +
                              point[i].lbWindow +
                              point[i].rbWindow
                          );
                          break;
                      }
                    } else {
                      displayPoints.push(0);
                    }
                  }
                }
              }
            });
          }
        });
      });

      return displayPoints;
    },
  },

  data() {
    return {};
  },

  mounted() {
    // const ctx = document.getElementById("bar-chart");
    // new Chart(ctx, this.barChartData);
  },
};
</script>

<style lang="scss">
.bar-chart {
  padding: 0.5rem;
  z-index: 2;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 0.5rem;
  height: 60vh;
}
</style>
