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
      <ItemView v-else-if="currentRouteName === 'View Item'" :item="selectedItem" />
      <RouterView v-else />
    </div>
  </div>
</template>

<style scoped>
@import "./assets/toast.css";

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top-navbar {
  width: 100%;
  background: linear-gradient(90deg, #2ca88c 0%, #1b8b7a 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 1em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  box-sizing: border-box;
}

.logo-title-row {
  display: flex;
  align-items: center;
  gap: 0.7em;
  text-decoration: none;
  color: inherit;
}

.logo-title-row:hover {
  text-decoration: none;
  background: none;
}

.contraca-logo {
  height: 2.5em;
}

.contraca-title {
  color: #ffffff;
  font-size: 2.2em;
  margin: 0;
  font-weight: 700;
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
  padding: 0.3em 0.7em;
  transition: background 0.2s;
}

a.underline, a:hover {
  text-decoration: underline;
  background: rgba(255,255,255,0.12);
  color: #fff;
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
  background: #f1f3f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.toast {
  margin-bottom: 1em;
}
</style>
