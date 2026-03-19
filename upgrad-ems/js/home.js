/**
 * home.js - Renders upcoming events on the Home page
 */

/**
 * Builds a Bootstrap event card for participant view.
 * @param {Object} event
 * @returns {string} HTML string
 */
function buildHomeEventCard(event) {
  const categoryClass = event.category === 'Tech & Innovations' ? 'category-tech' : 'category-industrial';
  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  // Format time to 12-hour
  const [h, m] = event.time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const timeStr = `${hour12}:${m} ${ampm}`;

  return `
    <div class="col-sm-6 col-lg-4">
      <div class="card event-card h-100">
        <div class="card-header bg-white pt-3 pb-1">
          <span class="category-badge ${categoryClass}">${event.category}</span>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="fw-bold mb-3 text-dark">${escapeHTML(event.name)}</h5>
          <div class="event-meta mb-3">
            <div class="mb-1"><i class="bi bi-tag-fill me-2"></i>ID: <strong>${escapeHTML(event.id)}</strong></div>
            <div class="mb-1"><i class="bi bi-calendar3 me-2"></i>${formattedDate}</div>
            <div class="mb-1"><i class="bi bi-clock me-2"></i>${timeStr}</div>
          </div>
          <div class="mt-auto d-flex gap-2">
            <a href="${escapeHTML(event.url)}" target="_blank" rel="noopener" class="btn btn-outline-primary btn-sm flex-grow-1">
              <i class="bi bi-box-arrow-up-right me-1"></i>Join Event
            </a>
            <a href="register.html?id=${encodeURIComponent(event.id)}" class="btn btn-primary btn-sm flex-grow-1">
              <i class="bi bi-person-plus me-1"></i>Register
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Safely escapes HTML special characters.
 */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Loads and renders all events on the home page.
 */
async function loadHomeEvents() {
  const container = document.getElementById('home-events-container');
  const noEventsEl = document.getElementById('no-events-home');

  try {
    // Seed default events if DB is empty
    await seedIfEmpty();

    const events = await getAllEvents();

    if (events.length === 0) {
      container.innerHTML = '';
      noEventsEl.style.display = 'block';
      return;
    }

    noEventsEl.style.display = 'none';
    container.innerHTML = events.map(buildHomeEventCard).join('');
  } catch (err) {
    console.error('Error loading events:', err);
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Unable to load events. Please refresh the page.
        </div>
      </div>
    `;
  }
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', loadHomeEvents);
