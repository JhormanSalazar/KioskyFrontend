<script setup lang="ts">
import { ScalingSquaresSpinner } from 'epic-spinners'

withDefaults(defineProps<{
  size?: number
  color?: string
  animationDuration?: number
}>(), {
  size: 45,
  color: '#fde68a', // amber-200
  animationDuration: 1250
})
</script>

<template>
  <ScalingSquaresSpinner :animation-duration="animationDuration" :size="size" :color="color" />
</template>
