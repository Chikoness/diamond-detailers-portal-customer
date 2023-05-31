<template>
  <ion-app>
    <ion-router-outlet />
    <breadcrumbs-bar />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import BreadcrumbsBar from './components/BreadcrumbsBar.vue';

export default {
  components: {
    BreadcrumbsBar,
    IonApp,
    IonRouterOutlet
  }
}
</script>
