<template>
  <div class="nf">
    <h1 class="glitch code" data-text="404">404</h1>
    <p class="mono-label">// señal perdida · página no encontrada</p>
    <RouterLink class="btn" to="/home">Volver</RouterLink>
  </div>
</template>

<style scoped>
.nf { min-height: 60vh; display: grid; place-content: center; justify-items: center; text-align: center; gap: 12px; }
.code { font-size: clamp(5rem, 20vw, 10rem); margin: 0; color: var(--magenta); text-shadow: var(--glow-m); }
</style>
