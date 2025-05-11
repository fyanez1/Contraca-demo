<template>
  <main class="finished-docs-main">
    <div class="header-bar">
      <span class="header-title">Document Automation</span>
      <span class="header-subtitle">| 42 Wallaby Way</span>
    </div>
    <div class="finished-docs-content">
      <div class="docs-list-section">
        <div class="section">
          <div class="section-title">Required Documents</div>
          <ul class="doc-list">
            <li v-for="doc in requiredDocs" :key="doc" class="doc-row">
              <span>{{ doc }}</span>
              <span class="download-icon">&#8681;</span>
            </li>
          </ul>
        </div>
        <div class="section">
          <div class="section-title">Additional Reports and Optional Documents</div>
          <ul class="doc-list">
            <li v-for="doc in optionalDocs" :key="doc" class="doc-row">
              <span>{{ doc }}</span>
              <span class="download-icon">&#8681;</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="action-panel">
        <button class="test-btn" @click="goToCDA">test</button>
        <button class="action-btn send">Send Documents</button>
        <button class="action-btn">Push Data to CRM</button>
        <button class="action-btn">Push Data to Accounting</button>
        <button class="action-btn">Confirm for Compliance Review</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const requiredDocs = [
  'Commission Disbursement Authorization (CDA)',
  'Final Deal Sheet',
  'Closing Statement / ALTA Settlement Statement Upload',
  'Post-Closing Compliance Checklist',
  "Agent's Internal Transact...n Log",
  '1099-S Filing Form (if not handled by title)',
  'Affiliated Business Disclosure Follow-up',
  'Post Possession Agreement',
  'Bill of Sale',
  'Broker Acknowledgment / Supervisor Sign-Off',
];
const optionalDocs = [
  'Deal Summary Email to Client',
  'Deal Summary Report 1-page',
  'Comprehensive Deal Summary Report 3-page',
  'Personal Commission Tracker Spreadsheet',
  'Referral Payment Request Form',
  'Internal Office Production Report',
  'Client Database Update Form',
  'Warranty Submission Confirmation',
  'Marketing Authorization Form',
];
function goToCDA() {
  router.push({ name: 'CommissionDisbursementAuthorization' });
}
</script>

<style scoped>
.finished-docs-main {
  max-width: 1200px;
  margin: 2.5rem auto;
  padding: 0 1.5rem;
}
.header-bar {
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
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
.finished-docs-content {
  display: flex;
  gap: 2rem;
  min-height: 600px;
}
.docs-list-section {
  flex: 2;
  background: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.5rem 0.5rem 1.5rem 1.5rem;
  overflow-y: auto;
  max-height: 650px;
}
.section {
  margin-bottom: 1.5rem;
}
.section-title {
  font-size: 1.15rem;
  font-weight: bold;
  margin-bottom: 0.7rem;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.3rem;
}
.doc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.doc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.7rem 0.4rem 0;
  border-bottom: 1px solid #eaeaea;
  font-size: 1.05rem;
  color: #222;
}
.download-icon {
  font-size: 1.3rem;
  color: #b0b0b0;
  cursor: pointer;
  margin-left: 1.2rem;
}
.action-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: flex-start;
  align-items: stretch;
}
.action-btn {
  background: #f5f5f5;
  color: #222;
  font-size: 1.35rem;
  font-weight: 500;
  border: none;
  border-radius: 14px;
  padding: 1.3rem 0;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: background 0.2s, color 0.2s;
}
.action-btn:hover {
  background: linear-gradient(90deg, #2ca88c 0%, #1b8b7a 100%);
  color: #fff;
}
.test-btn {
  background: #1b8b7a;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  padding: 1.2rem 0;
  margin-bottom: 2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s, color 0.2s, transform 0.1s;
  width: 100%;
  letter-spacing: 0.02em;
}
.test-btn:hover {
  background: #249b7e;
  color: #fff;
  transform: translateY(-2px) scale(1.03);
}
</style> 