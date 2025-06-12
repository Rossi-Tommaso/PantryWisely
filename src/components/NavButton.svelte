<script lang="ts">
  import type { NavButtonProps } from '../lib/types.js';
  import { goto } from '$app/navigation';

  let {
    title,
    description,
    icon,
    href,
    variant = 'secondary'
  }: {
    title: string;
    description: string;
    icon: string;
    href: string;
    variant?: NavButtonProps['variant'];
  } = $props();

  let variantClasses = $derived({
    primary: {
      button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl',
      icon: 'bg-white/20 text-white',
      arrow: 'text-white/80'
    },
    secondary: {
      button: 'bg-white hover:bg-gray-50 text-gray-900 shadow-md hover:shadow-lg border border-gray-200',
      icon: 'bg-gray-100 text-gray-600',
      arrow: 'text-gray-400'
    }
  }[variant]);

  let iconSvg = $derived({
    pantry: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>`,
    shopping: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L7 13m0 0l-2.293 2.293A1 1 0 005 16h12M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4"/>`,
    stats: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`
  }[icon] || icon);

  function handleClick() {
    goto(`${href}`);
  }
</script>

<button 
  onclick={handleClick}
  class="w-full rounded-2xl p-6 transition-all duration-200 transform hover:-translate-y-1 {variantClasses.button}"
>
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <div class="w-12 h-12 {variantClasses.icon} rounded-xl flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {@html iconSvg}
        </svg>
      </div>
      <div class="text-left">
        <h3 class="text-lg font-semibold mb-1">{title}</h3>
        <p class="text-sm opacity-80">{description}</p>
      </div>
    </div>
    <div class="ml-4">
      <svg class="w-5 h-5 {variantClasses.arrow}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </div>
  </div>
</button>