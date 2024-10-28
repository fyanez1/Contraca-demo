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
  <header>
    <nav>
      <div class="title">
        <img src="@/assets/images/MIT_logo.svg.png" />
        <RouterLink :to="{ name: 'Home' }">
          <h1 class="logo-title">Sale</h1>
        </RouterLink>
      </div>
      <ul class="nav-bar-names">
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Sell Item' }" :class="{ underline: currentRouteName == 'Sell Item' }"> Sell Item </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <HomeView v-if="currentRouteName === 'Home'" @view-item="handleViewItem" />
  <ItemView v-else-if="currentRouteName === 'View Item'" :item="selectedItem" />
  <RouterView v-else />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em;
  background-color: #c4877c;
  display: flex;
  align-items: center;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.logo-title {
  color: #990a21;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 2em;
}

.underline {
  text-decoration: underline;
}
</style>
