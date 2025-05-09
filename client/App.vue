<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import HomeView from "./views/HomeView.vue";
import ItemView from "./views/ItemView.vue";

const currentRoute = useRoute();
const router = useRouter();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

const selectedItem = ref();

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});

function handleViewItem(item: object) {
  selectedItem.value = item;
  void router.push({ name: "View Item" });
}
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="title">
        <img src="@/assets/images/contraca_logo.png" />
        <RouterLink :to="{ name: 'Home' }">
          <h1 class="logo-title">Contraca</h1>
        </RouterLink>
      </div>
      <ul class="nav-bar-names">
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }">
            <span class="nav-icon">
              <img src="/client/assets/images/home_icon.png" alt="Home" style="width: 28px; height: 28px; filter: brightness(0) invert(1);" />
            </span>
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Documents' }" :class="{ underline: currentRouteName == 'Documents' }">
            <span class="nav-icon">
              <img src="/client/assets/images/document_icon.png" alt="Home" style="width: 28px; height: 28px; filter: brightness(0) invert(1);" />
            </span>
          </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }">
            <span class="nav-icon">
              <img src="/client/assets/images/settings_icon.png" alt="Home" style="width: 28px; height: 28px; filter: brightness(0) invert(1);" />
            </span>
          </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }">
            <span class="nav-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 5 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 16 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.09.29.14.59.14.91s-.05.62-.14.91z"/></svg>
            </span>
          </RouterLink>
        </li>
      </ul>
    </aside>
    <div class="main-content">
      <article v-if="toast !== null" class="toast" :class="toast.style">
        <p>{{ toast.message }}</p>
      </article>
      <HomeView v-if="currentRouteName === 'Home'" @view-item="handleViewItem" />
      <ItemView v-else-if="currentRouteName === 'View Item'" :item="selectedItem" />
      <RouterView v-else />
    </div>
  </div>
</template>

<style scoped>
@import "./assets/toast.css";

.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background: linear-gradient(180deg, #6fe2c3 0%, #2ca88c 50%, #1b8b7a 100%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2em 1em 2em 1em;
  min-height: 100vh;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 2em;
}

img {
  height: 2em;
}

.logo-title {
  color: #fff !important;
}

.title a {
  color: #fff !important;
}

ul.nav-bar-names {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2em;
  width: 100%;
}

ul.nav-bar-names li {
  width: 100%;
}

ul.nav-bar-names li a {
  color: #fff;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
  display: block;
  width: 100%;
  padding: 0.5em 0.8em;
  border-radius: 8px;
  transition: background 0.2s;
}

a.underline, a:hover {
  text-decoration: underline;
  background: rgba(255,255,255,0.12);
  color: #fff;
}

.main-content {
  flex: 1;
  padding: 2em 2em 2em 2em;
  background: #f1f3f5;
  min-height: 100vh;
}

.toast {
  margin-bottom: 1em;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5em;
  height: 2.5em;
}
</style>
