<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column">
    <h1>Settings for {{ currentUsername }}</h1>
    <button class="action-btn" @click="logout">Logout</button>
    <button class="action-btn delete" @click="delete_">Delete User</button>
    <UpdateUserForm />
  </main>
</template>

<style scoped>
.column {
  max-width: 600px;
  margin: 2.5rem auto;
  padding: 0 1.5rem;
  height: calc(100vh - 120px); /* Account for navbar and margins */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

h1 {
  color: #222;
  margin-bottom: 2rem;
  font-weight: 600;
  font-size: 1.75rem;
  letter-spacing: -0.02em;
}

.action-btn {
  background: #f5f5f5;
  color: #222;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  padding: 1rem 2.2rem;
  margin-bottom: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: background 0.2s, color 0.2s;
  letter-spacing: -0.01em;
}

.action-btn:hover {
  background: linear-gradient(90deg, #2ca88c 0%, #1b8b7a 100%);
  color: #fff;
}

.action-btn.delete {
  background: #f5f5f5;
  color: #dc3545;
}

.action-btn.delete:hover {
  background: #dc3545;
  color: #fff;
}
</style>
