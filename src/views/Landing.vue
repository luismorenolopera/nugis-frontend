<template lang="pug">
  v-tabs(
    centered
    icons-and-text
    grow
  )
    v-tabs-slider
    //- tabs ui
    v-tab(href='#login') INICIAR SESIÓN
      v-icon fas fa-sign-in-alt
    v-tab(href='#signup') REGISTRATE
      v-icon fas fa-users
    //- tabs views
    v-tab-item(id='login')
      login
    v-tab-item(id='signup')
      sign-up
</template>

<script>
import Login from '@/views/Login.vue'
import SignUp from '@/views/SignUp.vue'

export default {
  name: 'Landing',
  components: {
    Login,
    SignUp
  }
}
</script>
