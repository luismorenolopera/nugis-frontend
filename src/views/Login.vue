<template lang="pug">
v-container
  //- loader
  v-progress-linear(v-if='loading' indeterminate)
  //- error message
  v-alert(v-model='error'
          type='error'
          transition='scale-transition'
          dismissible) {{errorMessage}}
  v-card
    v-card-title(class='headline') Login
    v-container
      v-text-field(v-model='username'
                   label='Usuario'
                   v-validate="'required'"
                   name='usuario'
                   :error-messages="errors.collect('usuario')"
                   @keyup.enter='validate')
      v-text-field(v-model='password'
                   label='Contraseña'
                   v-validate="'required'"
                   name='contraseña'
                   :append-icon="show ? 'fas fa-eye-slash' : 'fas fa-eye'"
                   :type="show ? 'text' : 'password'"
                   @click:append="show = !show"
                   :error-messages="errors.collect('contraseña')"
                   @keyup.enter='validate')
    v-btn(type='submit' @click.stop.prevent='validate') Entrar

</template>

<script>
import { HTTP } from '@/http-common'

export default {
  name: 'Login',
  data: () => ({
    username: '',
    password: '',
    show: false,
    loading: false,
    error: false,
    errorMessage: null
  }),
  methods: {
    validate () {
      if (this.errors.items.length > 0) return
      return this.$validator.validateAll().then((result) => {
        if (!result) return
        this.login()
      })
    },
    login () {
      this.loading = true
      HTTP.post('api-token-auth/', {
        username: this.username,
        password: this.password
      }).then((response) => {
        let token = response.data['token']
        localStorage.token = token
        this.$router.push('/home')
        this.$store.commit('setToken', { token: token })
        location.reload()
      }).catch((e) => {
        this.loading = false
        this.errorMessage = 'Las credenciales no coinciden'
        this.error = true
      })
    }
  }
}
</script>
