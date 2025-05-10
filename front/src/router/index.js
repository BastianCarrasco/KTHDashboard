import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LoginForm from '../components/LoginForm.vue'
import EditarFormulario from '../views/EditarFormulario.vue'
import Estadisticas from '../views/Estadisticas.vue'
import Usuarios from '../views/Usuarios.vue'
import Inventos from '../views/Inventos.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/editar-formulario',
    name: 'EditarFormulario',
    component: EditarFormulario,
    meta: { requiresAuth: true }
  },
  {
    path: '/estadisticas',
    name: 'Estadisticas',
    component: Estadisticas,
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: Usuarios,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventos',
    name: 'Inventos',
    component: Inventos,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardia de navegación para verificar autenticación
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router