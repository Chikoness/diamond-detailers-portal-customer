<template>
  <ion-app>
    <ion-router-outlet />
    <breadcrumbs-bar />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import BreadcrumbsBar from './components/BreadcrumbsBar.vue';
import { Geolocation } from '@capacitor/geolocation';
import axios from "axios";

export default {
  components: {
    BreadcrumbsBar,
    IonApp,
    IonRouterOutlet
  },

  async mounted() {
    const coord = await Geolocation.getCurrentPosition();

    this.$nextTick(function () {
      window.setInterval(() => {
        if (localStorage.getItem("email") !== undefined) {

          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${coord.coords.latitude}&lon=${coord.coords.longitude}&appid=db4a24c53fcb9e886f91a65e5fd19e9c`
            ).then((res) => {
              let sendWeatherDistance = {
                email: "chichiko90@gmail.com",
                weatherDistance: {
                  lat: coord.coords.latitude,
                  long: coord.coords.longitude,
                  weather: res.data.weather[0].id
                }
              }

              axios
                .post(
                  process.env.VUE_APP_BACKEND +
                  "/api/customer/getWeatherDistance",
                  sendWeatherDistance
                )
            })
        }
      }, 60000);
    })

  }
}
</script>
