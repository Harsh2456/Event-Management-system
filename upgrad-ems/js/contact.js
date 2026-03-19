/**
 * contact.js - Contact Us page form logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('contact-form');
  const successEl  = document.getElementById('contact-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('was-validated');

    if (!form.checkValidity()) return;

    const name        = document.getElementById('contact-name').value.trim();
    const email       = document.getElementById('contact-email').value.trim();
    const description = document.getElementById('contact-description').value.trim();

    // Show inline success message
    successEl.classList.remove('d-none');
    successEl.innerHTML = `
      <i class="bi bi-check-circle-fill me-2"></i>
      Thank you, <strong>${name}</strong>! Your message has been sent successfully.
      We'll get back to you at <strong>${email}</strong> within 24 hours.
    `;

    // Scroll to success message
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Reset form
    form.reset();
    form.classList.remove('was-validated');

    // Auto-hide after 8 seconds
    setTimeout(() => successEl.classList.add('d-none'), 8000);
  });

  // Clear success banner if user starts typing again
  form.addEventListener('input', () => {
    if (!successEl.classList.contains('d-none')) {
      successEl.classList.add('d-none');
    }
  });
});
