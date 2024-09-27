import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },{
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },{
      path:'/login',
      name:'login',
      component:()=>import('../views/Login.vue')
    },{
      path:'/user-dashboard',
      name:'user-dashboard',
      component:()=>import('../views/userDashboard.vue')
    },{
      path:'/admin-dashboard',
      name:'admin-dashboard',
      component:()=>import('../views/adminDashboard.vue')
    },{
      path:'/album/:id',
      name:'album',
      component:()=>import('../views/Album.vue'),
      props : true
    },{
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/Analytics.vue')
    
    },{
      path: '/users',  
      name: 'users',
      component: () => import('../views/Users.vue')
    }, {
      path: '/artists',
      name: 'artists',
      component: () => import('../views/Artists.vue')
    },{
      path: '/genres',
      name: 'genres',
      component: () => import('../views/Genre.vue')
    }

  ]
})

export default router
