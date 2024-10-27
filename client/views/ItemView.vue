<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const items = ref<Array<{ _id: string; name: string; description: string; pictures: string }>>([]);
const comments = ref<Array<{ id: string; name: string; description: string; image: string; item: string; comment: string; author: string; dateCreated: string }>>([]);
const newComment = ref<string>("");
const tempItemId = ref<string>("671bb87c852fc97b047d0aae");

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

async function getComments(itemId: string) {
  let query: Record<string, string> = { itemId: itemId };
  try {
    const commentResults = await fetchy(`/api/items/${itemId}/comments`, "GET", { query });
    comments.value = commentResults;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

async function postComment() {
  let query: Record<string, string> = { itemId: tempItemId.value, comment: newComment.value };
  try {
    await fetchy(`/api/items/${tempItemId.value}/comments`, "POST", { query });
  } catch (error) {
    console.error("Error posting new comment:", error);
  }
  await getComments(tempItemId.value);
}

onBeforeMount(async () => {
  await getItemsBySeller();
  await getComments("671bb87c852fc97b047d0aae");
});
</script>

<template>
  <div class="container">
    <div class="sidebar">
      <h2>Image test</h2>
      {{ items }}
      <img src="https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-dunk-high-by-you-shoes.png" alt="Description of the image" />
      {{ items[3]?.name }}<br />
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
  width: 100vw;
  height: 100vh;
}

.sidebar {
  width: 66.67%;
  background-color: #e7e7e7;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.comment-section {
  width: 33.33%;
  font-family: Arial, sans-serif;
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.comment-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 5px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}

.comment-header {
  display: flex;
  justify-content: space-between;
}

.comment-author {
  font-weight: bold;
}

.comment-date {
  margin-left: 5px;
}

.comment-time {
  font-size: 0.85em;
  color: #666;
}

.comment-text {
  margin-top: 3px;
}

.comment-input {
  display: flex;
  align-items: center;
}

.comment-input input[type="text"] {
  flex-grow: 1;
  padding: 5px;
}

.comment-input button {
  margin-left: 10px;
}
</style>
