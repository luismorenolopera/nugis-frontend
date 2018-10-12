<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex(xs12)
        v-text-field(
          label='Titulo'
          counter='100'
          required
        )
      v-flex(x12)
        v-text-field(
          label='Imagen'
          counter
          maxlength='200'
          placeholder='https://ibb.co/joa3zK'
        )
</template>

<script>
export default {
  name: 'UploadLocalFile'
}
</script>
