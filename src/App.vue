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

export default {
  components: {
    BreadcrumbsBar,
    IonApp,
    IonRouterOutlet
  },

  async mounted() {
    const coord = await Geolocation.getCurrentPosition();

    console.log(coord.coords.latitude)
  }
}
</script>
