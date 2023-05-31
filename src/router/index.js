import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage'
import EmployeePage from '../views/EmployeePage'
import CustomerPage from '../views/CustomerPage'
import AppointmentPage from '../views/AppointmentPage'
import NewAppointmentPage from '../views/Appointment/NewAppointmentPage'
import ExistingAppointmentPage from '../views/Appointment/ExistingAppointmentPage'
import AuthenticationPage from '../views/AuthenticationPage'
import ConfirmationPage from '../views/ConfirmationPage'
import RegisterEmployee from '../views/Employee/RegisterEmployee'
import EditEmployee from '../views/Employee/EditEmployee'

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
    path: '/employee',
    name: 'Employee',
    component: EmployeePage
  },
  {
    path: '/employee/new',
    name: 'Register New Employee',
    component: RegisterEmployee
  },
  {
    path: '/employee/edit/:id',
    name: 'Change Employee Details',
    component: EditEmployee
  },
  {
    path: '/authentication',
    name: 'Authenticate',
    component: AuthenticationPage
  },
  {
    path: '/customer',
    name: 'Customer',
    component: CustomerPage
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
