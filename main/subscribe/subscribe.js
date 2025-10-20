document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // stop reload

    const formData = {
      name: form.querySelector('input[type="text"]').value,
      email: form.querySelector('input[type="email"]').value,
      message: form.querySelector('textarea').value,
    };

    showMessage('Отправка данных...', 'loading');

    try {
      // dummy API endpoint
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Server response:', result);
        showMessage('✅ Спасибо! Ваша подписка оформлена успешно.', 'success');
        form.reset();
      } else {
        showMessage('❌ Ошибка при отправке. Попробуйте позже.', 'error');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showMessage('⚠️ Ошибка соединения. Проверьте интернет.', 'error');
    }
  });

  // callback to display temporary messages
  function showMessage(text, type) {
    const existing = document.querySelector('.message');
    if (existing) existing.remove();

    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    form.insertAdjacentElement('afterend', message);

    if (type !== 'loading') setTimeout(() => message.remove(), 4000);
  }
});
