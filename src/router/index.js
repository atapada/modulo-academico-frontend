import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ListStudents from '../views/ListStudents.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/liststudents',
    name: 'liststudents',
    component: ListStudents
  }
]

const router = new VueRouter({
  routes
})

export default router
