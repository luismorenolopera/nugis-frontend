<template lang="pug">
  v-container
    //- loader
    v-progress-linear(
      v-if='loading'
      :color='colorLoading'
      indeterminate
    )
    //- error Message
    v-alert(
      v-model='error'
      type='error'
      transition='scale-transition'
      dismissible
    ) {{errorMessage}}
    v-card
      v-card-title(class='headline') Registrate
      v-container
        v-text-field(
          v-model='username'
          label='Usuario'
          v-validate="'required'"
          name='usuario'
          :error-messages="errors.collect('usuario')"
        )
        v-text-field(
          v-model='firstName'
          label='Nombre'
          v-validate="'required|max:30'"
          maxlength='30'
          counter
          name='nombre'
          :error-messages="errors.collect('nombre')"
        )
        v-text-field(
          v-model='lastName'
          label='Apellido'
          v-validate="'required|max:30'"
          maxlength='30'
          counter
          name='apellido'
          :error-messages="errors.collect('apellido')"
        )
        v-text-field(
          v-model='password'
          label='Contraseña'
          v-validate="'required|min:8'"
          name='contraseña'
          :append-icon="show ? 'fas fa-eye-slash' : 'fas fa-eye'"
          :type="show ? 'text' : 'password'"
          @click:append="show = !show"
          :error-messages="errors.collect('contraseña')"
        )
        v-text-field(
          v-model='passwordCheck'
          label='Confirmar contraseña'
          v-validate="{is: password}"
          name='confirmación'
          :append-icon="showCheck ? 'fas fa-eye-slash' : 'fas fa-eye'"
          :type="showCheck ? 'text' : 'password'"
          @click:append="showCheck = !showCheck"
          :error-messages="errors.collect('confirmación')"
          @keyup.enter='validate'
        )
      v-layout(align-center justify-end row)
        v-btn(type='submit' @click.stop.prevent='validate') REGISTRARSE
</template>
<script>
import { HTTP } from '@/http-common.js'

export default {
  name: 'SignUp',
  data: () => ({
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    passwordCheck: '',
    show: false,
    showCheck: false,
    error: false,
    errorMessage: '',
    loading: false,
    colorLoading: 'primary'
  }),
  methods: {
    validate () {
      if (this.errors.items.length > 0) return
      return this.$validator.validateAll().then((result) => {
        if (!result) return
        this.signUp()
      })
    },
    signUp () {
      let url = 'users/user'
      let body = {
        username: this.username,
        first_name: this.firstName,
        last_name: this.lastName,
        password: this.password
      }
      this.loading = true
      HTTP.post(url, body).then(() => {
        this.colorLoading = 'success'
      }).then(() => {
        this.login()
      }).catch(e => {
        if ('username' in e.response.data) {
          this.errorMessage = 'Este nombre de usuario esta en uso'
          this.error = true
        }
        this.loading = false
      })
    },
    login () {
      HTTP.post('api-token-auth/', {
        username: this.username,
        password: this.password
      }).then(response => {
        let token = response.data['token']
        localStorage.token = token
        this.$store.commit('setToken', { token: token })
        location.reload()
        this.$router.push('/home')
      })
    }
  }
}
</script>
