<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import HomeView from "./views/HomeView.vue";

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
    <nav class="top-navbar">
      <RouterLink :to="{ name: 'Home' }" class="logo-title-row">
        <img src="@/assets/images/contraca_logo.png" class="contraca-logo" />
        <h1 class="contraca-title">Contraca</h1>
      </RouterLink>
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
              <img src="/client/assets/images/document_icon.png" alt="Documents" style="width: 28px; height: 28px; filter: brightness(0) invert(1);" />
            </span>
          </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }">
            <span class="nav-icon">
              <img src="/client/assets/images/settings_icon.png" alt="Settings" style="width: 28px; height: 28px; filter: brightness(0) invert(1);" />
            </span>
          </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }">
            <span class="nav-icon">
              <img src="/client/assets/images/settings_icon.png" alt="Login" style="width: 28px; height: 28px; filter: brightness(0) invert(1);" />
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>
    <div class="main-content">
      <article v-if="toast !== null" class="toast" :class="toast.style">
        <p>{{ toast.message }}</p>
      </article>
      <HomeView v-if="currentRouteName === 'Home'" @view-item="handleViewItem" />
      <RouterView v-else />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: #f8f9fa;
  color: #1a1a1a;
  line-height: 1.5;
}

button, a {
  transition: all 0.2s ease;
}

:root {
  --primary-gradient: linear-gradient(90deg, #fff 0%, #2ca88c 30%, #1b8b7a 100%);
  --primary-hover: linear-gradient(90deg, #e6f7f3 0%, #34b79a 50%, #229a87 100%);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>

<style scoped>
@import "./assets/toast.css";

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top-navbar {
  width: 100%;
  background: linear-gradient(90deg, #fff 0%, #2ca88c 30%, #1b8b7a 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75em 1.5em;
  box-shadow: var(--shadow-md);
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-title-row {
  display: flex;
  align-items: center;
  gap: 0.8em;
  text-decoration: none;
  color: inherit;
  padding: 0.5em 0.8em;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.logo-title-row:hover {
  text-decoration: none;
  background: rgba(255,255,255,0.15);
  transform: translateY(-1px);
}

.contraca-logo {
  height: 2.5em;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.contraca-title {
  color: #ffffff;
  font-size: 2rem;
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

ul.nav-bar-names {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: 1.5em;
  align-items: center;
}

ul.nav-bar-names li {
  display: flex;
  align-items: center;
}

a {
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 0.5em 0.8em;
  transition: all 0.2s ease;
}

a.underline, a:hover {
  text-decoration: none;
  background: rgba(255,255,255,0.15);
  color: #fff;
  transform: translateY(-1px);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5em;
  height: 2.5em;
}

.main-content {
  flex: 1;
  padding: 2em;
  background: #f8f9fa;
  min-height: 100vh;
  box-sizing: border-box;
}

.toast {
  margin-bottom: 1em;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}
</style>
