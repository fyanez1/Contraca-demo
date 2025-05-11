<template>
  <main class="transactions-main">
    <div class="header-bar">
      <span class="header-title">Transactions</span>
      <span class="header-subtitle">| {{ selectedProperty || 'All Properties' }}</span>
    </div>
    <div class="breadcrumb-row">
      <span class="breadcrumb-current">Transactions</span>
    </div>
    <div class="action-buttons">
      <button class="action-btn">Add Transaction</button>
      <button class="action-btn">Export Transactions</button>
    </div>
    <div class="transactions-table-wrapper">
      <table class="transactions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Property</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="txn in transactions" :key="txn.id">
            <td>{{ txn.id }}</td>
            <td>{{ txn.client }}</td>
            <td>{{ txn.property }}</td>
            <td>{{ txn.status }}</td>
            <td>${{ txn.amount.toLocaleString() }}</td>
            <td>{{ txn.date }}</td>
            <td>
              <button class="table-action-btn" @click="handleView(txn)">View</button>
              <button class="table-action-btn">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedProperty = ref('');

const transactions = ref([
  { id: 'TXN-001', client: 'John Doe', property: '123 Main St', status: 'Pending', amount: 350000, date: '2024-06-01' },
  { id: 'TXN-002', client: 'Jane Smith', property: '456 Oak Ave', status: 'Closed', amount: 420000, date: '2024-05-15' },
  { id: 'TXN-003', client: 'Acme Corp', property: '789 Pine Rd', status: 'In Review', amount: 510000, date: '2024-05-28' },
]);

const handleView = (transaction: any) => {
  selectedProperty.value = transaction.property;
  router.push({ name: 'Documents', query: { property: transaction.property } });
};
</script>

<style scoped>
.transactions-main {
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
.breadcrumb-row {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  margin-bottom: 1.2rem;
  margin-left: 0.2rem;
  gap: 0.5em;
}
.breadcrumb-current {
  color: #b0b0b0;
  font-weight: 600;
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
  transition: background 0.2s, color 0.2s;
}
.action-btn:hover {
  background: linear-gradient(90deg, #2ca88c 0%, #1b8b7a 100%);
  color: #fff;
}
.transactions-table-wrapper {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.5rem;
  overflow-x: auto;
}
.transactions-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
}
.transactions-table th, .transactions-table td {
  padding: 0.9rem 1.1rem;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
}
.transactions-table th {
  background: #f7f7f7;
  color: #1b8b7a;
  font-weight: 700;
  font-size: 1.08rem;
}
.transactions-table td {
  color: #222;
  font-size: 1.05rem;
}
.table-action-btn {
  background: #e0e0e0;
  color: #1b8b7a;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1.1rem;
  margin-right: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.table-action-btn:hover {
  background: #2ca88c;
  color: #fff;
}
</style>
