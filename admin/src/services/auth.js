import axios from 'axios'
import bcrypt from 'bcryptjs'

const API_URL = 'https://kth2025backend-production.up.railway.app/usuarios'

export default {
  async login(email, password) {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Opcional: usar un proxy público como solución temporal
        // baseURL: 'https://cors-anywhere.herokuapp.com/'
      })
      
      if (response.data.success) {
        const user = response.data.data.find(u => u.email === email)
        
        if (user) {
          const isPasswordValid = bcrypt.compareSync(password, user.clave)
          
          if (isPasswordValid) {
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('user', JSON.stringify(user))
            return { success: true, user }
          }
        }
      }
      
      return { success: false, message: 'Credenciales inválidas' }
    } catch (error) {
      console.error('Error en autenticación:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error en el servidor' 
      }
    }
  },
  
  logout() {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
  },
  
  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true'
  },
  
  getUser() {
    return JSON.parse(localStorage.getItem('user'))
  }
}