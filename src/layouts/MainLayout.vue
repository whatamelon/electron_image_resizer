<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-secondary">

        <q-toolbar-title style="font-weight:bold; font-style:italic;">
          Image Resizer by Denny🔥
        </q-toolbar-title>
        <!-- <router-link to="/setting" style="text-decoration:none; color:white;">
          <q-icon name="settings" :size="'sm'" />
        </router-link> -->

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
