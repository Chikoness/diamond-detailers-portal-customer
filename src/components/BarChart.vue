<template>
  <div class="bar-chart">
    <Bar :data="barChartData" id="bar-chart" :options="options"/>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs"
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  props: ["data", "monthToDisplay", "viewType", "months"],
  
  name: "History Bar-Chart",

  components: { Bar },

  computed: {
    barChartData() {
      return {
        labels: this.getAllAvailableDateInMonth(),
        datasets: [
          {
              label: "Hood, Headlights, Windscreen",
              data: this.viewTypeDisplay('front'),
              borderRadius: 5,
              backgroundColor: "#EDCF65",
              datalabels: {
                color: "black",
              },
            },
            {
              label: "Boot",
              data: this.viewTypeDisplay('back'),
              borderRadius: 5,
              backgroundColor: "#7D8279",
              datalabels: {
                color: "black",
              },
            },
            {
              label: "Roof",
              data: this.viewTypeDisplay('top'),
              borderRadius: 5,
              backgroundColor: "#535046",
              datalabels: {
                color: "black",
              },
            },
            {
              label: "Left doors, windows, wheels",
              data: this.viewTypeDisplay('left'),
              borderRadius: 5,
              backgroundColor: "#020202",
              datalabels: {
                color: "black",
              },
            },
            {
              label: "Right doors, windows, wheels",
              data: this.viewTypeDisplay('right'),
              borderRadius: 5,
              backgroundColor: "#767489",
              datalabels: {
                color: "black",
              },
            },
        ]
      }
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
      }
    }
  },

  methods: {
    getAllAvailableDateInMonth() {
      let dates = [];

      Object.values(this.data).forEach((y) => {
        Object.keys(y).forEach(mon => {
          if (this.monthToDisplay == mon) {
            Object.values(y).forEach(date => {
              Object.keys(date).forEach(d => {
                dates.push(this.monthToDisplay + " " + d)
              })
            })
          } else {
            return dates
          }
        })

      });

      return dates
    },

    viewTypeDisplay(type) {
      let displayPoints = []

      if (this.viewType == "month") {
        Object.values(this.data).forEach((dat => {
          if (this.monthToDisplay == Object.keys(dat)) {
            let point = dat[Object.keys(dat)]
            
            Object.values(point).forEach(p => {
              switch(type) {
                case 'front':
                  displayPoints.push(p.hood + p.lHeadlight + p.rHeadlight + p.windscreen)
                  break;
                case 'top':
                  displayPoints.push(p.hood)
                  break;
                case 'back':
                  displayPoints.push(p.boot)
                  break;
                case 'left':
                  displayPoints.push(p.lfDoor + p.rfDoor + p.lfWheel + p.rfWheel + p.lfWindow + p.rfWindow)
                  break;
                case 'right':
                  displayPoints.push(p.lbDoor + p.rbDoor + p.lbWheel + p.rbWheel + p.lbWindow + p.rbWindow)
                  break;
              }
            })
          }
        }))
      } else {
        
      }

      return displayPoints
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
