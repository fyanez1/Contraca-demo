<template>
  <main class="documents-main">
    <div class="header-bar">
      <span class="header-title">Document Automation</span>
      <span class="header-subtitle">| 42 Wallaby Way</span>
    </div>
    <div class="action-buttons">
      <button class="action-btn">Export Data as Spreadsheet</button>
      <button class="action-btn">Push Data to CRM</button>
      <button class="action-btn automate">Automate Closing Documents</button>
    </div>
    <div class="documents-grid">
      <div v-for="doc in documents" :key="doc.title" class="doc-card">
        <div class="doc-info">
          <div class="doc-title">{{ doc.title }}</div>
          <div class="doc-date">Recieved: {{ doc.date }}</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// const dummyPdf = require('@/assets/documents/5102 E Larkspur (1) (1).pdf');
const documents = [
  { title: 'Purchase & Sale', date: '12/8/24' },
  { title: 'Exclusive Right to Sell', date: '12/8/24' },
  { title: "Seller's Property Disclosure (SPDS)", date: '12/8/24' },
  { title: 'Buyer Attachment', date: '12/8/24' },
  { title: 'Market Conditions Advisory', date: '12/8/24' },
  { title: 'Loan Confirmation', date: '12/8/24' },
  { title: 'Wire Fraud Advisory', date: '12/8/24' },
  { title: 'Addendum 1', date: '12/8/24' },
  { title: 'Addendum 2', date: '12/8/24' },
  { title: 'BINSR', date: '12/8/24' },
  { title: 'Loan Status Update', date: '12/8/24' },
  { title: 'Agency Disclosure and Election', date: '12/8/24' },
];
</script>

<style scoped>
.documents-main {
  max-width: 1200px;
  margin: 2.5rem auto;
  padding: 0 1.5rem;
}
.header-bar {
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 2.2rem;
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
.action-buttons {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  justify-content: flex-start;
}
.action-btn {
  background: #f5f5f5;
  color: #222;
  font-size: 1.1rem;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  padding: 1rem 2.2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: background 0.2s;
}
.action-btn.automate {
  background: linear-gradient(90deg, #2ca88c 0%, #1b8b7a 100%);
  color: #fff;
}
.action-btn:not(.automate):hover {
  background: #e0e0e0;
}
.action-btn.automate:hover {
  background: linear-gradient(90deg, #249b7e 0%, #167a6a 100%);
}
.documents-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.doc-card {
  background: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.2rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 160px;
}
.doc-preview {
  width: 60px;
  height: 80px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.doc-info {
  color: #757575;
}
.doc-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.2rem;
}
.doc-date {
  font-size: 1rem;
  color: #b0b0b0;
}
</style> 