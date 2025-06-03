<script lang="ts">
  import type { SummaryCardProps } from '../lib/types.js';

  let {
    title,
    value,
    icon,
    color = 'blue'
  }: {
    title: string;
    value: number;
    icon: string;
    color?: SummaryCardProps['color'];
  } = $props();

  let colorClasses = $derived({
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100 text-blue-600',
      text: 'text-blue-900'
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'bg-amber-100 text-amber-600',
      text: 'text-amber-900'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-900'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-100 text-green-600',
      text: 'text-green-900'
    }
  }[color]);

  let iconSvg = $derived({
    package: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>`,
    clock: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
    exclamation: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"/>`,
    check: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>`
  }[icon] || icon);
</script>

<div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 {colorClasses.bg} hover:shadow-lg transition-shadow duration-200">
  <div class="flex items-center justify-between">
    <div class="flex-1">
      <p class="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p class="text-3xl font-bold {colorClasses.text}">{value}</p>
    </div>
    <div class="ml-4">
      <div class="w-12 h-12 {colorClasses.icon} rounded-xl flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {@html iconSvg}
        </svg>
      </div>
    </div>
  </div>
</div>