<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginModal from '@/components/LoginModal.vue';
const showUploadModal = ref(false);
const showLoginModal = ref(false);
const showAutomation = ref(false);
const router = useRouter();
function openUploadModal(e: Event) {
  e.preventDefault();
  showUploadModal.value = true;
}
function goToDocuments() {
  showUploadModal.value = false;
  router.push({ name: 'Transactions' });
}
function openLoginModal() {
  showLoginModal.value = true;
}
function closeLoginModal() {
  showLoginModal.value = false;
}
function showAutomationSection() {
  showAutomation.value = true;
}
</script>

<template>
  <main class="doc-automation-container" :class="{ 'centered': !showAutomation }">
    <template v-if="!showAutomation">
      <button class="home-big-btn" @click="showAutomationSection">Automate Transaction Documents</button>
      <button class="home-big-btn">Set Up Email Automation</button>
    </template>
    <template v-else>
      <div class="header-bar">
        <span class="header-title">Document Automation</span>
        <span class="header-subtitle">| 42 Wallaby Way</span>
      </div>
      <div class="main-content">
        <button class="connect-btn" @click="openLoginModal">Connect your Transaction Platform</button>
        <div class="platform-subtext">Dotloop, Lonewolf, Skyslope</div>
        <div class="divider-row">
          <div class="divider"></div>
          <span class="or-text">OR</span>
          <div class="divider"></div>
        </div>
        <div class="upload-box">
          <div class="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V6M5 12l7-7 7 7"/><rect x="3" y="19" width="18" height="2" rx="1"/></svg>
          </div>
          <a href="#" class="upload-link" @click="openUploadModal">Upload Documents</a>
        </div>
      </div>
      <div v-if="showUploadModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Upload Documents</h2>
          <input type="file" multiple />
          <div class="modal-actions">
            <button class="modal-btn" @click="goToDocuments">Open</button>
          </div>
        </div>
      </div>
      <LoginModal v-if="showLoginModal" @click.self="closeLoginModal" />
    </template>
  </main>
</template>

<style scoped>
.doc-automation-container.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  border-radius: 12px;
  max-width: 600px;
  margin: 4rem auto 0 auto;
  padding: 2.5rem 2rem;
}
.home-big-btn {
  width: 100%;
  max-width: 520px;
  margin: 1.1rem 0;
  font-size: 2.1rem;
  font-weight: 500;
  color: #666;
  background: #f7f7f7;
  /* border: none; */
  border-radius: 14px;
  padding: 1.2rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: background 0.18s, color 0.18s, transform 0.12s;
}
.home-big-btn:hover {
  background: #e0e0e0;
  color: #1b8b7a;
  transform: translateY(-2px) scale(1.03);
}
.doc-automation-container {
  max-width: 500px;
  margin: 3rem auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 2.5rem 2rem 2rem 2rem;
  height: calc(100vh - 120px); /* Account for navbar and margins */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.header-bar {
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  color: #222;
}
.header-title {
  font-weight: bold;
}
.header-subtitle {
  color: #b0b0b0;
  font-weight: 400;
  margin-left: 0.5em;
}
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.connect-btn {
  background: linear-gradient(90deg, #2ca88c 0%, #1b8b7a 100%);
  color: #fff;
  font-size: 1.3rem;
  font-weight: 500;
  border: none;
  border-radius: 14px;
  padding: 1.1rem 2.5rem;
  margin-bottom: 0.7rem;
  cursor: pointer;
  transition: background 0.2s;
}
.connect-btn:hover {
  background: linear-gradient(90deg, #249b7e 0%, #167a6a 100%);
}
.platform-subtext {
  color: #757575;
  font-size: 1.1rem;
  margin-bottom: 2.2rem;
}
.divider-row {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 2.2rem;
}
.divider {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}
.or-text {
  margin: 0 1.2em;
  color: #757575;
  font-weight: 600;
  font-size: 1.1rem;
}
.upload-box {
  border: 2px dashed #bdbdbd;
  border-radius: 14px;
  width: 100%;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 0 1.5rem 0;
  background: #fafafa;
}
.upload-icon {
  margin-bottom: 0.7rem;
  color: #222;
}
.upload-link {
  color: #222;
  font-size: 1.1rem;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}
.upload-link:hover {
  color: #2ca88c;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-content h2 {
  margin-bottom: 1.2rem;
  color: #222;
}
.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  width: 100%;
}
.modal-btn {
  background: #2ca88c;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-btn:hover {
  background: #1b8b7a;
}
</style>
