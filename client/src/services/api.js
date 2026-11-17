import axios from 'axios';

const api = axios.create({
  baseURL: 'https://accessease-ai.onrender.com/api',
  timeout: 60000,
});

export async function sendChatMessage(message, conversationHistory = []) {
  const response = await api.post('/ai/chat', { message, conversationHistory });
  return response.data;
}

export async function simplifyText(text, level = 'simple', language = 'english') {
  const response = await api.post('/ai/simplify', { text, level, language });
  return response.data;
}

export async function describeImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/ai/describe-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return response.data;
}

export async function runAccessibilityWorkflow(file) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/ai/accessibility-workflow', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 90000,
  });
  return response.data;
}

export async function checkHealth() {
  const response = await api.get('/health');
  return response.data;
}

export function getErrorMessage(error) {
  if (error.response && error.response.data && error.response.data.error) return error.response.data.error;
  if (error.message) return error.message;
  return 'An unexpected error occurred. Please try again.';
}
