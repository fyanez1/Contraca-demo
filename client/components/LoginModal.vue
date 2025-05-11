<template>
  <div class="modal-overlay">
    <div class="login-modal">
      <h2 class="login-title">Sign in</h2>
      <div class="login-subtitle">to your Transaction Manager</div>
      <div class="login-desc">Enter your credentials for<br>Dotloop, Lonewolf, or Skyslope</div>
      <form @submit.prevent="onSubmit">
        <input
          v-model="email"
          class="login-input"
          type="text"
          placeholder="Email or Username"
          autocomplete="username"
          required
        />
        <div class="password-row">
          <input
            v-model="password"
            class="login-input"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            autocomplete="current-password"
            required
          />
          <span class="show-toggle" @click="showPassword = !showPassword">{{ showPassword ? 'hide' : 'show' }}</span>
        </div>
        <button class="sign-in-btn" type="submit">Sign in</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const router = useRouter();
const emit = defineEmits(['close']);

function onSubmit() {
  router.push({ name: 'Transactions' });
  emit('close');
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.login-modal {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  padding: 2.5rem 2.5rem 2.2rem 2.5rem;
  min-width: 340px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.login-title {
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: #111;
  font-family: 'Inter', sans-serif;
}
.login-subtitle {
  font-size: 1.15rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
}
.login-desc {
  font-size: 1.1rem;
  color: #757575;
  margin-bottom: 1.7rem;
  font-family: 'Inter', sans-serif;
}
.login-input {
  width: 100%;
  font-size: 1.15rem;
  padding: 0.9em 1em;
  border: 2px solid #bdbdbd;
  border-radius: 8px;
  margin-bottom: 1.1rem;
  font-family: 'Inter', sans-serif;
  color: #444;
  background: #fafafa;
  outline: none;
  transition: border 0.2s;
}
.login-input:focus {
  border-color: #2ca88c;
}
.password-row {
  position: relative;
  display: flex;
  align-items: center;
}
.show-toggle {
  position: absolute;
  right: 1.1em;
  top: 50%;
  transform: translateY(-50%);
  color: #368383;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}
.sign-in-btn {
  width: 100%;
  margin-top: 0.7rem;
  background: linear-gradient(90deg, #3db89c 0%, #2ca88c 50%, #1b8b7a 100%);
  color: #fff;
  font-size: 1.18rem;
  font-weight: 500;
  border: none;
  border-radius: 2em;
  padding: 0.95em 0;
  cursor: pointer;
  transition: background 0.2s;
  font-family: 'Inter', sans-serif;
}
.sign-in-btn:hover {
  background: linear-gradient(90deg, #45c5a7 0%, #34b79a 50%, #229a87 100%);
}
</style> 