<template>
  <div class="extracting-container">
    <div class="spinner"></div>
    <div class="extracting-title">Extracting Data from your Transaction Documents</div>
    <div class="progress-bar-row">
      <div class="progress-bar-bg">
        <div class="progress-bar-fg" :style="{ width: percent + '%' }"></div>
      </div>
    </div>
    <div class="progress-text">
      {{ currentDocs.toLocaleString() }} of {{ totalDocs.toLocaleString() }}<br />
      <span class="progress-sub">Documents Uploaded</span>
    </div>
    <div class="extracting-footer">Feel free to close browser</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const percent = ref(0);
const currentDocs = ref(0);
const totalDocs = 73203;
const startDocs = 0;
const endDocs = 43054;
let interval: number | undefined;

onMounted(() => {
  const duration = 4000; // 4 seconds
  const steps = 100;
  let step = 0;
  interval = window.setInterval(() => {
    step++;
    percent.value = Math.min(100, (step / steps) * 100);
    currentDocs.value = Math.floor(startDocs + (endDocs - startDocs) * (step / steps));
    if (step >= steps) {
      clearInterval(interval);
      setTimeout(() => router.push({ name: 'Home' }), 200);
    }
  }, duration / steps);
});

onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
.extracting-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  font-family: 'Inter', sans-serif;
}
.spinner {
  width: 64px;
  height: 64px;
  border: 7px solid #e0e0e0;
  border-top: 7px solid #222;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 2.2rem;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.extracting-title {
  font-size: 1.55rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 1.2rem;
  text-align: center;
}
.progress-bar-row {
  width: 420px;
  max-width: 90vw;
  margin-bottom: 1.1rem;
}
.progress-bar-bg {
  width: 100%;
  height: 7px;
  background: #ededed;
  border-radius: 4px;
  overflow: hidden;
}
.progress-bar-fg {
  height: 100%;
  background: #222;
  border-radius: 4px 0 0 4px;
  transition: width 0.5s;
}
.progress-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 2.2rem;
  text-align: center;
}
.progress-sub {
  font-size: 1.05rem;
  font-weight: 400;
  color: #757575;
  display: block;
  margin-top: 0.1em;
}
.extracting-footer {
  font-size: 1.13rem;
  color: #757575;
  margin-top: 2.5rem;
  text-align: center;
}
</style> 