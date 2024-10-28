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
  <main class="column">
    <h1>Put item up for sale</h1>
    <form @submit.prevent="sellItem" class="pure-form">
      <fieldset>
        <legend><b>Item name</b></legend>
        <input v-model="name" type="text" placeholder="" />
      </fieldset>
      <fieldset>
        <legend><b>Item description</b></legend>
        <input v-model="description" type="text" placeholder="" />
      </fieldset>
      <fieldset>
        <legend><b>Cost</b></legend>
        <input v-model="cost" type="number" placeholder="enter a number without '$'" />
      </fieldset>
      <fieldset>
        <legend><b>Picture</b></legend>
        <input v-model="picture" type="text" placeholder="enter image link" />
      </fieldset>
      <fieldset>
        <legend><b>Email</b></legend>
        <input v-model="email" type="text" placeholder="" />
      </fieldset>
      <button type="submit" class="pure-button pure-button-primary">Post sale</button>
    </form>
    <br />
    <br />
  </main>
</template>
