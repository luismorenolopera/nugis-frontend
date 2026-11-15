<script setup>
import { computed, ref } from 'vue'
import { coverGradient } from '@/util'
import Icon from './Icon.vue'

const props = defineProps({ track: Object, size: { type: String, default: '56px' } })
const failed = ref(false)
const bg = computed(() => coverGradient(props.track?.title))
</script>

<template>
  <div class="cover" :style="{ width: size, height: size, background: bg }">
    <img v-if="track?.cover && !failed" :src="track.cover" alt="" loading="lazy" decoding="async" @error="failed = true">
    <Icon v-else name="music" :size="20" />
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  flex: none;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.8);
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
}
img { width: 100%; height: 100%; object-fit: cover; }
</style>
