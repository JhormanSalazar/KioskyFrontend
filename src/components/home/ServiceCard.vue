<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
  icon: any;
}>();
</script>

<template>
  <div class="text-card-foreground relative p-6 space-y-4 bg-amber-200 rounded-lg text-black max-w-90 mx-auto">
    <div class="rounded-lg flex flex-col items-start gap-4">
      <div class="w-12 h-12 rounded-sm bg-amber-50 justify-center items-center flex">
        <props.icon color="#262626" />
      </div>
      <p class="text-base">{{props.title}}</p>
    </div>

    <div class="pt-4 text-sm">{{props.description}}</div>
  </div>
</template>
