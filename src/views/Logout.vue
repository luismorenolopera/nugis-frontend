<template>
  <div></div>
</template>

<script>
export default {
  name: 'Logout',
  created: function () {
    this.$store.commit('setToken', { token: null })
    localStorage.clear()
    this.$router.push('/')
    location.reload()
  }
}
</script>
