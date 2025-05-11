<template>
  <div class="cda-container">
    <div v-if="loading" class="cda-loading">Generating CDA form...</div>
    <div v-else-if="error" class="cda-error">{{ error }}</div>
    <div v-else class="cda-result">
      <h1>Commission Disbursement Authorization (CDA)</h1>
      <pre class="cda-output">{{ result }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const loading = ref(true);
const error = ref('');
const result = ref('');

const prompt = `Using the terms from the spreadsheet provided containing the data from a residential real estate transaction, create a commission Disbursement (CDA) form for the real estate agent. Do research for what the standard commission Disbursement (CDA) looks like in the state of the transaction–specifically all the information needed from the transaction to complete it. Then auto populate the terms needed to complete the commission Disbursement (CDA) form from the spreadsheet. Do not make this form as a spreadsheet, make it in the standard format that the commission Disbursement (CDA) form is typically made and distributed.`;

onMounted(async () => {
  loading.value = true;
  error.value = '';
  result.value = '';
  try {
    const response = await fetch('/api/openai/cda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) throw new Error('Failed to generate CDA form.');
    const data = await response.json();
    result.value = data.result || data.choices?.[0]?.text || 'No result.';
  } catch (e) {
    error.value = (e as Error).message || 'Unknown error.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.cda-container {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.cda-loading {
  font-size: 1.3rem;
  color: #1b8b7a;
  font-weight: 600;
}
.cda-error {
  color: #c0392b;
  font-size: 1.2rem;
  font-weight: 600;
}
.cda-result h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1b8b7a;
  text-align: center;
  margin-bottom: 1.5rem;
}
.cda-output {
  background: #f7f7f7;
  border-radius: 10px;
  padding: 1.5rem;
  font-size: 1.08rem;
  color: #222;
  white-space: pre-wrap;
  max-width: 700px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
</style> 