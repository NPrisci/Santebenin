<template>
   <div class="d-flex flex-column w-100 h-100 min-vh-100">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
   </div>
</template>