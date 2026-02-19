<script setup lang="ts">
import { computed, type Component } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title: string
    value: string | number
    icon: Component
    color?: 'amber' | 'blue' | 'green' | 'purple' | 'pink' | 'cyan' | 'rose'
    loading?: boolean
    trend?: { value: number; label: string }
    subtitle?: string
  }>(),
  {
    color: 'amber',
    loading: false,
  }
)

const colorMap: Record<string, { icon: string; badge: string }> = {
  amber: { icon: 'text-amber-400', badge: 'bg-amber-400/10 ring-1 ring-amber-400/20' },
  blue: { icon: 'text-blue-400', badge: 'bg-blue-400/10 ring-1 ring-blue-400/20' },
  green: { icon: 'text-green-400', badge: 'bg-green-400/10 ring-1 ring-green-400/20' },
  purple: { icon: 'text-purple-400', badge: 'bg-purple-400/10 ring-1 ring-purple-400/20' },
  pink: { icon: 'text-pink-400', badge: 'bg-pink-400/10 ring-1 ring-pink-400/20' },
  cyan: { icon: 'text-cyan-400', badge: 'bg-cyan-400/10 ring-1 ring-cyan-400/20' },
  rose: { icon: 'text-rose-400', badge: 'bg-rose-400/10 ring-1 ring-rose-400/20' },
}

const colors = computed(() => colorMap[props.color] ?? colorMap.amber)
</script>

<template>
  <div
    class="relative overflow-hidden bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-5 flex flex-col gap-4 transition-colors duration-200 hover:border-gray-600 group">
    <!-- Loading skeleton -->
    <template v-if="loading">
      <div class="flex items-center justify-between">
        <div class="h-4 w-28 bg-gray-700 rounded animate-pulse" />
        <div class="w-10 h-10 rounded-lg bg-gray-700 animate-pulse" />
      </div>
      <div class="h-7 w-16 bg-gray-700 rounded animate-pulse" />
    </template>

    <!-- Content -->
    <template v-else>
      <div class="flex items-start justify-between gap-3">
        <p class="text-sm font-medium text-gray-400 leading-tight">{{ title }}</p>
        <div :class="['shrink-0 w-10 h-10 rounded-lg flex items-center justify-center', colors.badge]">
          <component :is="icon" :class="['w-5 h-5', colors.icon]" :stroke-width="1.75" />
        </div>
      </div>

      <div class="flex items-end justify-between gap-2">
        <p class="text-2xl font-bold text-gray-100 leading-none tracking-tight">
          {{ value }}
        </p>

        <!-- Trend badge -->
        <div v-if="trend !== undefined" class="flex items-center gap-1 text-xs font-medium pb-0.5">
          <component :is="trend.value >= 0 ? TrendingUp : TrendingDown" class="w-3.5 h-3.5"
            :class="trend.value >= 0 ? 'text-green-400' : 'text-rose-400'" />
          <span :class="trend.value >= 0 ? 'text-green-400' : 'text-rose-400'">
            {{ trend.value >= 0 ? '+' : '' }}{{ trend.value }}%
          </span>
          <span class="text-gray-500">{{ trend.label }}</span>
        </div>

        <p v-else-if="subtitle" class="text-xs text-gray-500 pb-0.5">{{ subtitle }}</p>
      </div>
    </template>

    <!-- Hover accent line top -->
    <div
      class="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
      :style="props.color !== 'amber' ? {} : {}" />
  </div>
</template>
