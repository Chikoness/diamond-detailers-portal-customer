import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage'
import CustomerPage from '../views/CustomerPage'
import NewAppointmentPage from '../views/Appointment/NewAppointmentPage'
import ExistingAppointmentPage from '../views/Appointment/ExistingAppointmentPage'
import ConfirmationPage from '../views/ConfirmationPage'
import AuthenticationPage from '../views/AuthenticationPage'
import AppointmentPage from '@/views/AppointmentPage'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/customer',
    name: 'Customer',
    component: CustomerPage
  },
  {
    path: '/authentication',
    name: 'Authenticate',
    component: AuthenticationPage
  },
  {
    path: '/appointment',
    name: 'Appointment',
    component: AppointmentPage
  },
  {
    path: '/appointment/new',
    name: 'New Appointment',
    component: NewAppointmentPage
  },
  {
    path: '/appointment/edit/:id',
    name: 'Edit Appointment',
    component: ExistingAppointmentPage
  },
  {
    path: '/confirmation/:id',
    name: 'Confirmation',
    component: ConfirmationPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
