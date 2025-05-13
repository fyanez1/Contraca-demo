<template>
  <main class="transactions-main">
    <div class="transactions-header-row">
      <h2 class="transactions-title">Your Transactions</h2>
    </div>
    <div class="transactions-toolbar">
      <div class="sort-section">
        Sort By <span class="sort-link">Date <span class="sort-arrow">▼</span></span>
      </div>
      <div class="status-toggle">
        <button :class="['status-btn', { active: statusFilter === 'Completed' }]" @click="statusFilter = 'Completed'">Completed</button>
        <button :class="['status-btn', { active: statusFilter === 'All' }]" @click="statusFilter = 'All'">All</button>
      </div>
      <button class="filter-btn">Filter</button>
      <span class="select-all-link">Select All</span>
    </div>
    <div class="transactions-list">
      <div v-for="txn in transactions" :key="txn.id" class="transaction-card">
        <div class="txn-badge">
          <div class="txn-badge-inner">
            <span class="txn-badge-pct">{{ txn.completion }}%</span>
            <span class="txn-badge-label">complete</span>
          </div>
        </div>
        <div class="txn-main-info">
          <div class="txn-property-name">{{ txn.property }}</div>
          <div class="txn-property-address">{{ txn.address }}</div>
          <a href="#" class="txn-summary-link">Create Summary Report</a>
        </div>
        <div class="txn-side-info">
          <div class="txn-date">{{ txn.date }}</div>
          <button class="txn-open-btn" @click="handleView(txn)">Open</button>
          <input type="checkbox" class="txn-checkbox" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const statusFilter = ref('All');

const transactions = ref([
  { id: 'TXN-000', client: 'Acme Corp', property: '7890 E. Oak Street', address: 'Phoenix, AZ 85022', completion: 100, date: '5/19/25' },
  { id: 'TXN-001', client: 'John Doe', property: '42 Wallaby Way', address: 'Katonah NY, 10536', completion: 100, date: '3/4/25' },
  { id: 'TXN-002', client: 'Jane Smith', property: '14 Radcliff Street', address: 'Bedford NY, 10518', completion: 100, date: '2/27/25' },
  { id: 'TXN-003', client: 'Acme Corp', property: '1 Chestnut Lane', address: 'White Plains NY, 10605', completion: 36, date: '2/27/25' },
]);

const handleView = (transaction: any) => {
  router.push({ name: 'Documents', query: { property: transaction.property } });
};
</script>

<style scoped>
.transactions-main {
  max-width: 900px;
  margin: 2.5rem auto;
  padding: 0 1.5rem;
}
.transactions-header-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;
}
.transactions-title {
  font-size: 2.1rem;
  font-weight: 700;
  color: #222;
  margin: 0;
}
.transactions-toolbar {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}
.sort-section {
  font-size: 1.1rem;
  color: #444;
}
.sort-link {
  color: #368383;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.2em;
}
.sort-arrow {
  font-size: 0.95em;
}
.status-toggle {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  background: #e0e0e0;
}
.status-btn {
  background: none;
  border: none;
  padding: 0.5em 1.2em;
  font-size: 1.08rem;
  font-weight: 500;
  color: #444;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.status-btn.active {
  background: linear-gradient(90deg, #2ca88c 0%, #1b8b7a 100%);
  color: #fff;
}
.filter-btn {
  background: #fff;
  border: 1.5px solid #b0b0b0;
  border-radius: 7px;
  padding: 0.5em 1.3em;
  font-size: 1.08rem;
  font-weight: 500;
  color: #222;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.filter-btn:hover {
  background: #f5f5f5;
}
.select-all-link {
  color: #368383;
  font-weight: 600;
  cursor: pointer;
  margin-left: auto;
  font-size: 1.08rem;
}
.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.transaction-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 1.1rem 1.5rem;
  gap: 1.5rem;
  position: relative;
}
.txn-badge {
  min-width: 80px;
  min-height: 80px;
  background: #e0e0e0 url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=80&h=80&q=80') center/cover no-repeat;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.txn-badge-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.45);
  border-radius: 8px;
  width: 80px;
  height: 80px;
  color: #fff;
  font-weight: 700;
}
.txn-badge-pct {
  font-size: 1.45rem;
  font-weight: 700;
}
.txn-badge-label {
  font-size: 1.05rem;
  font-weight: 400;
  margin-top: -0.2em;
}
.txn-main-info {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}
.txn-property-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
}
.txn-property-address {
  font-size: 1.08rem;
  color: #888;
  margin-bottom: 0.2em;
}
.txn-summary-link {
  color: #368383;
  font-size: 1.08rem;
  text-decoration: underline;
  font-weight: 500;
  margin-top: 0.2em;
  width: fit-content;
}
.txn-summary-link:hover {
  color: #1b8b7a;
}
.txn-side-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.7em;
  min-width: 110px;
}
.txn-date {
  color: #888;
  font-size: 1.08rem;
  font-weight: 500;
}
.txn-open-btn {
  background: linear-gradient(90deg, #2ca88c 0%, #1b8b7a 100%);
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.5em 1.7em;
  font-size: 1.13rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 0.2em;
  transition: background 0.18s, color 0.18s;
}
.txn-open-btn:hover {
  background: linear-gradient(90deg, #249b7e 0%, #167a6a 100%);
}
.txn-checkbox {
  width: 22px;
  height: 22px;
  accent-color: #2ca88c;
  margin-top: 0.2em;
}
</style>
