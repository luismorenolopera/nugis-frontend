<template lang="pug">
  v-container
    router-link(to='/login')
      v-btn(round color='primary') INICIAR SESIÓN
    router-link(to='/signup')
      v-btn(round color='primary') REGISTRARTE
</template>

<script>
export default {
  name: 'Landing'
}
</script>
