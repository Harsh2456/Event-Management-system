/**
 * register.js - Participant Event Registration Page
 * Reads event ID from URL query string and loads event details from IndexedDB.
 */

/**
 * Parse query parameters from the current URL.
 */
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

/**
 * Format a date string (YYYY-MM-DD) to a readable format.
 */
function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

/**
 * Format 24h time to 12h time.
 */
function formatTime(timeStr) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

/**
 * Populate the event details banner.
 */
function populateEventDetails(event) {
  document.getElementById('reg-event-id').textContent       = event.id;
  document.getElementById('reg-event-name').textContent     = event.name;
  document.getElementById('reg-event-category').textContent = event.category;
  document.getElementById('reg-event-date').textContent     = formatDate(event.date);
  document.getElementById('reg-event-time').textContent     = formatTime(event.time);
}

/**
 * Show an error state when event is not found.
 */
function showEventNotFound() {
  const card = document.getElementById('event-info-card');
  card.innerHTML = `
    <div class="card-body p-4">
      <div class="alert alert-warning mb-0">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        Event not found. <a href="index.html" class="alert-link">Go back to Home</a> and try again.
      </div>
    </div>
  `;
  document.getElementById('register-form').closest('.card').style.opacity = '0.5';
  document.getElementById('register-form').closest('.card').style.pointerEvents = 'none';
}

/**
 * Handle registration form submission.
 */
function setupRegistrationForm(event) {
  const form = document.getElementById('register-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('was-validated');

    if (!form.checkValidity()) return;

    const firstName = document.getElementById('first-name').value.trim();
    const lastName  = document.getElementById('last-name').value.trim();
    const email     = document.getElementById('reg-email').value.trim();

    // Show success alert
    alert(`You are successfully registered to this event!\n\nEvent: ${event.name}\nParticipant: ${firstName} ${lastName}\nEmail: ${email}`);

    // Reset form
    form.reset();
    form.classList.remove('was-validated');
  });
}

/**
 * Initialize the registration page.
 */
async function initRegisterPage() {
  const eventId = getQueryParam('id');

  if (!eventId) {
    showEventNotFound();
    return;
  }

  try {
    // Seed DB if needed so events exist
    await seedIfEmpty();

    const event = await getEventById(eventId);

    if (!event) {
      showEventNotFound();
      return;
    }

    populateEventDetails(event);
    setupRegistrationForm(event);
  } catch (err) {
    console.error('Error loading event for registration:', err);
    showEventNotFound();
  }
}

document.addEventListener('DOMContentLoaded', initRegisterPage);
