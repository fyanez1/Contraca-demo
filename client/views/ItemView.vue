<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { defineProps, onBeforeMount, ref } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const comments = ref<Array<{ id: string; name: string; description: string; image: string; item: string; comment: string; author: string; dateCreated: string }>>([]);
const newComment = ref<string>("");
const isClaimed = ref<boolean>(false);
const queuePosition = ref<number>(0);

async function getComments() {
  let query: Record<string, string> = { itemId: props.item._id };
  try {
    const commentResults = await fetchy(`/api/items/${props.item._id}/comments`, "GET", { query });
    comments.value = commentResults;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

async function postComment() {
  let query: Record<string, string> = { itemId: props.item._id, comment: newComment.value };
  try {
    await fetchy(`/api/items/${props.item._id}/comments`, "POST", { query });
  } catch (error) {
    console.error("Error posting new comment:", error);
  }
  await getComments();
  newComment.value = "";
}

async function getQueuePosition() {
  let query: Record<string, string> = { itemId: props.item.id };
  try {
    const position = await fetchy(`/api/items/${props.item._id}/position`, "GET", { query });
    queuePosition.value = position;
  } catch (error) {
    console.error("Error getting queue position", error);
  }
}

async function claimItem() {
  let query: Record<string, string> = { itemId: props.item.id };
  try {
    await fetchy(`/api/items/${props.item._id}/claim`, "PATCH", { query });
    isClaimed.value = true;
  } catch (error) {
    console.error("Error claiming item", error);
  }
  await getQueuePosition();
}

async function unclaimItem() {
  let query: Record<string, string> = { itemId: props.item.id };
  try {
    await fetchy(`/api/items/${props.item._id}/unclaim`, "PATCH", { query });
    isClaimed.value = false;
  } catch (error) {
    console.error("Error unclaiming item", error);
  }
  await getQueuePosition();
}

async function toggleClaim() {
  if (isClaimed.value) {
    await unclaimItem();
  } else {
    await claimItem();
  }
}

onBeforeMount(async () => {
  await getComments();
  await getQueuePosition();
});
</script>

<template>
  <div class="container">
    <div class="main-content">
      <div class="image-section">
        <img :src="item.picture" :alt="item.name" class="item-image" />
        <p class="item-description"><b>Description:</b> {{ item.description }}</p>
        <p class="item-contact"><b>Contact:</b> {{ item.contact }}</p>
      </div>
      <div class="item-name-section">
        <h1>{{ item.name }}</h1>
        <p class="seller-note">Seller may reach out to you if you are on the queue.</p>
        <button @click="toggleClaim" class="action-button">
          {{ isClaimed ? "Unclaim Item" : "Claim Item" }}
        </button>
        <p v-if="queuePosition.position > 0" class="queue-position">Position: {{ queuePosition.position }}</p>
        <p class="item-cost">Price: ${{ item.cost }}</p>
      </div>
      <div class="item-details">
        <!-- This div is kept empty for consistency with the original layout -->
      </div>
    </div>
    <div class="comment-section">
      <ul>
        <li v-for="comment in comments" :key="comment.id" class="comment-box">
          <div class="comment-header">
            <div>
              <b class="comment-author">{{ comment.author }}</b>
              <span class="comment-date">{{ `${comment.dateCreated.slice(5, 7)}/${comment.dateCreated.slice(8, 10)}` }}</span>
            </div>
            <i class="comment-time">{{ comment.dateCreated.slice(11, 16) }}</i>
          </div>
          <p class="comment-text">{{ comment.comment }}</p>
        </li>
      </ul>

      <div class="comment-input">
        <input v-model="newComment" type="text" placeholder="Type your comment here..." />
        <button @click="postComment">Post</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 80vh;
}

.main-content {
  width: 66.67%;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
}

.image-section {
  width: 50%;
  padding-right: 10px;
}

.item-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.item-contact {
  margin-top: -10px;
  font-size: 25px;
}

.item-name-section {
  width: 33.33%;
  padding-left: 15px;
  display: flex;
  flex-direction: column;
}

.seller-note {
  color: rgb(50, 20, 216);
  margin-bottom: 5px;
  margin-top: 0px;
}

.action-button {
  margin-top: 5px;
  margin-bottom: 10px;
  padding: 8px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-button:hover {
  background-color: #45a049;
}

.queue-position {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.item-details {
  width: 100%;
  margin-top: 0px;
}

.item-cost {
  font-weight: bold;
  margin-bottom: 10px;
  color: #0f5a12;
  font-size: 25px;
}

.item-description {
  line-height: 1.6;
  margin-top: 10px;
  font-size: 25px;
}

.comment-section {
  width: 33.33%;
  font-family: Arial, sans-serif;
  padding: 20px;
  border-left: 1px solid #ccc;
  overflow-y: auto;
}

ul {
  list-style-type: none;
  padding: 0;
}

.comment-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comment-author {
  font-weight: bold;
}

.comment-date {
  margin-left: 5px;
  color: #666;
}

.comment-time {
  font-size: 0.85em;
  color: #666;
}

.comment-text {
  margin-top: 5px;
}

.comment-input {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.comment-input input[type="text"] {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.comment-input button {
  margin-left: 10px;
  padding: 8px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comment-input button:hover {
  background-color: #45a049;
}
</style>
