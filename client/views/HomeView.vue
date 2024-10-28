<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { ObjectId } from "mongodb";
import { storeToRefs } from "pinia";
import { defineEmits, onBeforeMount, ref } from "vue";

const emit = defineEmits(["viewItem"]);
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const items = ref<Array<{ _id: ObjectId; name: string; description: string; picture: string; cost: number }>>([]);

async function getItems(_id?: string) {
  let query: Record<string, string> = _id !== undefined ? { _id } : {};
  let postResults;
  try {
    console.log("QUERY", query);
    postResults = await fetchy("/api/items", "GET", { query: query });
  } catch (_) {
    return;
  }
  items.value = postResults;
}

function viewItem(item: object) {
  emit("viewItem", item);
}

onBeforeMount(async () => {
  await getItems();
});
</script>

<template>
  <main>
    <h1>Items for Sale</h1>
    <div class="item-grid">
      <div v-for="(item, index) in items" :key="index" class="item-card">
        <div class="image-container">
          <img :src="item.picture" :alt="item.name" class="item-image" @click="viewItem(item)" />
        </div>
        <div class="item-info">
          <h3 class="item-name">{{ item.name }}</h3>
          <p class="item-cost">${{ item.cost }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.item-card {
  background-color: #f2efef;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.item-card:hover {
  transform: translateY(-5px);
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
  transition: transform 0.3s ease;
}

.item-card:hover .item-image {
  transform: scale(1.05);
}

.item-info {
  padding: 1rem;
  text-align: center;
}

.item-name {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: #474350;
}

.item-cost {
  margin: 0;
  font-weight: bold;
  color: #474350;
}
</style>
