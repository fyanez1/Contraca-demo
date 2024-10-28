<script setup lang="ts">
import router from "@/router";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const name = ref("");
const description = ref("");
const cost = ref(0);
const picture = ref("");
const email = ref("");

async function sellItem() {
  await fetchy("/api/items", "POST", {
    body: { name: name.value, cost: cost.value.toString(), description: description.value, picture: picture.value, contact: email.value },
  });
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="sell-item-container">
    <h1 class="page-title">Put Item Up for Sale</h1>
    <form @submit.prevent="sellItem" class="sell-item-form">
      <div class="form-group">
        <label for="name">Item Name</label>
        <input id="name" v-model="name" type="text" required />
      </div>
      <div class="form-group">
        <label for="description">Item Description</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>
      <div class="form-group">
        <label for="cost">Cost</label>
        <input id="cost" v-model="cost" type="number" step="0.01" min="0" placeholder="Enter amount without '$'" required />
      </div>
      <div class="form-group">
        <label for="picture">Picture URL</label>
        <input id="picture" v-model="picture" type="url" placeholder="Enter image link" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" required />
      </div>
      <button type="submit" class="submit-button">Post Sale</button>
    </form>
  </main>
</template>

<style scoped>
.sell-item-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.sell-item-form {
  background-color: #e0dada;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  height: 100px;
  resize: vertical;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #970d0d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
