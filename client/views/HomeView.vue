<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const items = ref<Array<{ _id: string; name: string; description: string; picture: string }>>([]);

async function getItemsBySeller() {
  let query: Record<string, string> = { seller: "fyanez" };
  let postResults;
  try {
    postResults = await fetchy("/api/items", "GET", { query });
  } catch (_) {
    return;
  }
  items.value = postResults;
}

onBeforeMount(async () => {
  await getItemsBySeller();
});
</script>

<template>
  <main>
    <h1>Items for sale</h1>
    <div class="item-images">
      <div v-for="(image, index) in items" :key="index" class="image-container">
        <img :src="image.picture" alt="image" class="item-image" />
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
.item-images {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  width: 100%;
}

.image-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
