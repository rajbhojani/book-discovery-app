<template>
  <div class="animate-(--animate-fade-in)">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Cover skeleton -->
        <div class="flex-shrink-0 mx-auto md:mx-0">
          <div class="w-48 h-72 skeleton rounded-(--radius-lg)" />
        </div>

        <!-- Info skeleton -->
        <div class="flex-1 space-y-4">
          <div class="h-8 skeleton w-3/4" />
          <div class="h-5 skeleton w-1/2" />
          <div class="flex gap-2 mt-4">
            <div class="h-6 skeleton w-16 rounded-full" />
            <div class="h-6 skeleton w-20 rounded-full" />
            <div class="h-6 skeleton w-14 rounded-full" />
          </div>
          <div class="h-10 skeleton w-40 rounded-(--radius-full) mt-6" />
          <div class="space-y-2 mt-8">
            <div class="h-4 skeleton w-full" />
            <div class="h-4 skeleton w-full" />
            <div class="h-4 skeleton w-5/6" />
            <div class="h-4 skeleton w-3/4" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
