<script setup lang="ts">
import router from "@/router";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const name = ref("");
const description = ref("");
const cost = ref("");
const pictures = ref("");
const email = ref("");

async function sellItem() {
  await fetchy("/api/items", "POST", {
    body: { name: name, cost: cost, description: description, pictures: pictures, contact: email },
  });
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column">
    <h1>Put item up for sale</h1>
    <form @submit.prevent="sellItem" class="pure-form">
      <fieldset>
        <legend>Item name</legend>
        <input v-bind:value="name" type="text" placeholder="name" />
      </fieldset>
      <fieldset>
        <legend>Item description</legend>
        <input v-bind:value="description" type="text" placeholder="description" />
      </fieldset>
      <fieldset>
        <legend>Cost</legend>
        <input v-bind:value="cost" type="number" placeholder="enter a number without '$'" />
      </fieldset>
      <fieldset>
        <legend>Pictures</legend>
        <input v-bind:value="pictures" type="text" placeholder="" />
      </fieldset>
      <fieldset>
        <legend>Email</legend>
        <input v-bind:value="email" type="email" placeholder="example@gmail.com" />
      </fieldset>
      <button type="submit" class="pure-button pure-button-primary">Post sale</button>
    </form>
  </main>
</template>
