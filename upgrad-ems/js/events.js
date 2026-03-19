/**
 * events.js - Admin Events Management Page
 * Handles Add, Read, Delete, and Search operations.
 * Requires db.js to be loaded first.
 */

// ─── Auth Guard ──────────────────────────────────────────────────────────────
// Protect this page: redirect to login if not authenticated
if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
  alert('Unauthorized access! Please login first.');
  window.location.replace('login.html');
}

// ─── DOM References ───────────────────────────────────────────────────────────
const eventsContainer = document.getElementById('events-container');
const noEventsMsg     = document.getElementById('no-events-msg');
const eventsAlert     = document.getElementById('events-alert');
const addEventForm    = document.getElementById('add-event-form');
const saveEventBtn    = document.getElementById('save-event-btn');
const logoutBtn       = document.getElementById('logout-btn');
const searchInput     = document.getElementById('search-input');
const searchType      = document.getElementById('search-type');
const searchBtn       = document.getElementById('search-btn');
const clearSearchBtn  = document.getElementById('clear-search-btn');

// ─── Utility ──────────────────────────────────────────────────────────────────

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function showAlert(msg, type = 'success') {
  eventsAlert.className = `alert alert-${type} d-flex align-items-center gap-2`;
  eventsAlert.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}"></i><span>${msg}</span>`;
  eventsAlert.classList.remove('d-none');
  setTimeout(() => eventsAlert.classList.add('d-none'), 4000);
}

// ─── Render Events ────────────────────────────────────────────────────────────

/**
 * Build a Bootstrap card for an admin event.
 */
function buildAdminEventCard(event) {
  const categoryClass = event.category === 'Tech & Innovations' ? 'category-tech' : 'category-industrial';
  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  const [h, m] = event.time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const timeStr = `${hour12}:${m} ${ampm}`;

  return `
    <div class="col-sm-6 col-lg-4" id="card-${escapeHTML(event.id)}">
      <div class="card event-card h-100">
        <div class="card-header bg-white pt-3 pb-1 d-flex justify-content-between align-items-start">
          <span class="category-badge ${categoryClass}">${escapeHTML(event.category)}</span>
          <small class="text-muted fw-semibold">#${escapeHTML(event.id)}</small>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="fw-bold mb-3 text-dark">${escapeHTML(event.name)}</h5>
          <div class="event-meta mb-3">
            <div class="mb-1"><i class="bi bi-calendar3 me-2"></i>${formattedDate}</div>
            <div class="mb-1"><i class="bi bi-clock me-2"></i>${timeStr}</div>
            <div class="mb-1 text-truncate">
              <i class="bi bi-link-45deg me-2"></i>
              <a href="${escapeHTML(event.url)}" target="_blank" rel="noopener" class="text-primary small">Join Link</a>
            </div>
          </div>
          <div class="mt-auto d-flex gap-2">
            <a href="${escapeHTML(event.url)}" target="_blank" rel="noopener" class="btn btn-outline-primary btn-sm flex-grow-1">
              <i class="bi bi-box-arrow-up-right me-1"></i>View
            </a>
            <button class="btn btn-danger btn-sm delete-btn flex-grow-1" onclick="handleDelete('${escapeHTML(event.id)}')">
              <i class="bi bi-trash-fill me-1"></i>Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render an array of events into the grid.
 */
function renderEvents(events) {
  if (!events || events.length === 0) {
    eventsContainer.innerHTML = '';
    noEventsMsg.classList.remove('d-none');
    return;
  }
  noEventsMsg.classList.add('d-none');
  eventsContainer.innerHTML = events.map(buildAdminEventCard).join('');
}

/**
 * Load all events from DB and render them.
 */
async function loadEvents() {
  try {
    await seedIfEmpty();
    const events = await getAllEvents();
    renderEvents(events);
  } catch (err) {
    console.error('Error loading events:', err);
    showAlert('Failed to load events. Please refresh.', 'danger');
  }
}

// ─── Add Event ────────────────────────────────────────────────────────────────

saveEventBtn.addEventListener('click', async () => {
  addEventForm.classList.add('was-validated');

  if (!addEventForm.checkValidity()) {
    return;
  }

  const newEvent = {
    id:       document.getElementById('event-id').value.trim(),
    name:     document.getElementById('event-name').value.trim(),
    category: document.getElementById('event-category').value,
    date:     document.getElementById('event-date').value,
    time:     document.getElementById('event-time').value,
    url:      document.getElementById('event-url').value.trim()
  };

  try {
    await addEvent(newEvent);

    // Close modal & reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
    modal.hide();
    addEventForm.reset();
    addEventForm.classList.remove('was-validated');

    showAlert(`Event "${newEvent.name}" added successfully!`);
    await loadEvents();
  } catch (err) {
    if (err && err.name === 'ConstraintError') {
      showAlert(`Event ID "${newEvent.id}" already exists. Please use a unique ID.`, 'danger');
    } else {
      console.error('Add event error:', err);
      showAlert('Failed to add event. Please try again.', 'danger');
    }
  }
});

// Reset form validation state when modal is closed without saving
document.getElementById('addEventModal').addEventListener('hidden.bs.modal', () => {
  addEventForm.reset();
  addEventForm.classList.remove('was-validated');
  eventsAlert.classList.add('d-none');
});

// ─── Delete Event ─────────────────────────────────────────────────────────────

async function handleDelete(eventId) {
  if (!confirm(`Are you sure you want to delete event "${eventId}"?`)) return;

  try {
    await deleteEvent(eventId);
    // Remove card from DOM directly (no full reload)
    const cardEl = document.getElementById(`card-${eventId}`);
    if (cardEl) cardEl.remove();

    // Check if any cards remain
    const remaining = eventsContainer.querySelectorAll('[id^="card-"]');
    if (remaining.length === 0) {
      noEventsMsg.classList.remove('d-none');
    }

    showAlert(`Event "${eventId}" deleted successfully.`);
  } catch (err) {
    console.error('Delete error:', err);
    showAlert('Failed to delete event. Please try again.', 'danger');
  }
}

// ─── Search ───────────────────────────────────────────────────────────────────

async function handleSearch() {
  const query = searchInput.value.trim();
  const field = searchType.value;

  try {
    const results = await searchEvents(query, field);
    renderEvents(results);
    if (results.length === 0 && query) {
      noEventsMsg.querySelector('p').innerHTML =
        `<i class="bi bi-search me-2"></i>No events match "<strong>${escapeHTML(query)}</strong>". Try a different search.`;
    }
  } catch (err) {
    console.error('Search error:', err);
    showAlert('Search failed. Please try again.', 'danger');
  }
}

searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});

clearSearchBtn.addEventListener('click', async () => {
  searchInput.value = '';
  searchType.value = 'all';
  noEventsMsg.querySelector('p').innerHTML =
    `<i class="bi bi-calendar-x me-2"></i>No events found. Add your first event!`;
  await loadEvents();
});

// ─── Logout ───────────────────────────────────────────────────────────────────

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('isAdminLoggedIn');
  sessionStorage.removeItem('adminEmail');
  window.location.href = 'login.html';
});

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadEvents);
