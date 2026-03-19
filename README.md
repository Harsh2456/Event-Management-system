# upGrad Virtual Event Management System (EMS)

A fully responsive, browser-based web application for managing and hosting virtual events. Built with **HTML5, CSS3, Bootstrap 5, and vanilla JavaScript**, with all data persisted locally using **IndexedDB**.

---

## 📁 Project Structure

```
upgrad-ems/
├── index.html          # Home page (public)
├── login.html          # Admin login page
├── events.html         # Admin events dashboard (protected)
├── register.html       # Participant event registration
├── contact.html        # Contact Us page
├── css/
│   └── style.css       # Custom styles
└── js/
    ├── db.js           # IndexedDB abstraction layer
    ├── home.js         # Home page event rendering
    ├── login.js        # Admin authentication logic
    ├── events.js       # CRUD + search for admin dashboard
    ├── register.js     # Registration page logic
    └── contact.js      # Contact form logic
```

---

## 🚀 Getting Started

No installation or server required. Just open the project in a browser.

1. Download and unzip `upgrad-ems.zip`
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. The app runs entirely client-side

> **Note:** IndexedDB requires a browser environment. Opening files directly via `file://` works in Chrome/Edge. For Firefox, consider serving via a local server (e.g. VS Code Live Server).

---

## 👥 User Roles

### Participant (Public)
- Browse upcoming events on the Home page
- Click **Register** to sign up for any event
- Contact the organisation via the Contact Us page

### Admin
- Login at `login.html` using hard-coded credentials:
  - **Email:** `admin@upgrad.com`
  - **Password:** `12345`
- Add, view, delete, and search events on the Events dashboard
- Logout redirects back to the Login page

---

## 📄 Pages Overview

### 1. Home Page (`index.html`)
- Hero banner introducing the upGrad EMS platform
- Displays all upcoming events as Bootstrap cards
- Each card has a **Register** button that links to the registration page
- Each card has a **Join Event** link that opens the event URL
- Responsive navbar with links to all pages

### 2. Event Registration Page (`register.html`)
- Accessed by clicking **Register** on any event card
- Automatically loads event details (ID, Name, Category, Date, Time) from IndexedDB using the URL query parameter `?id=`
- Participant fills in: First Name, Last Name, Email
- On successful submission, displays a confirmation alert

### 3. Admin Login Page (`login.html`)
- Email and password fields with HTML5 validation
- Hard-coded credential check in JavaScript
- On success: sets `sessionStorage` flag and redirects to `events.html`
- On failure: displays an inline error alert
- Includes a password show/hide toggle

### 4. Events Management Page (`events.html`) — *Protected*
- **Route-guarded:** redirects to login if not authenticated
- **Add Event** via a Bootstrap modal form with fields:
  - Event ID, Name, Category (dropdown), Date, Time, URL
  - Full client-side validation (required, type, pattern)
- **View Events** displayed as Bootstrap cards
- **Delete Event** removes the card from the DOM and the database
- **Search** by Event ID, Name, or Category (with field selector)
- **Logout** clears session and redirects to login

### 5. Contact Us Page (`contact.html`)
- Fields: Full Name, Email, Message/Description
- Client-side validation with Bootstrap feedback
- Inline success alert on form submission
- Contact info cards (address, phone, email, hours)

---

## 💾 Data Storage

All event data is stored using the browser's **IndexedDB** API (via `db.js`).

| Operation | Function       | Description                            |
|-----------|----------------|----------------------------------------|
| Create    | `addEvent()`   | Adds a new event with unique ID        |
| Read      | `getAllEvents()`| Retrieves all stored events            |
| Read One  | `getEventById()`| Retrieves a single event by ID        |
| Delete    | `deleteEvent()`| Removes an event by ID                 |
| Search    | `searchEvents()`| Filters events by id, name, or category|

Three seed events are automatically loaded on first run if the database is empty:
- **EVT001** – AI & Machine Learning Summit 2025 *(Tech & Innovations)*
- **EVT002** – Industrial Automation Expo *(Industrial Events)*
- **EVT003** – Web3 & Blockchain Conference *(Tech & Innovations)*

---

## 🔒 Authentication & Route Protection

- Admin credentials are validated in `login.js` against hard-coded values
- On successful login, `sessionStorage.setItem('isAdminLoggedIn', 'true')` is set
- `events.js` checks this flag on load; if absent, it alerts the user and redirects to `login.html`
- Logout clears the `sessionStorage` entry

---

## ✅ Form Validation

All forms use Bootstrap 5's built-in validation classes (`was-validated`, `invalid-feedback`) triggered on submit:

| Form | Validated Fields |
|------|-----------------|
| Login | Email format, password required |
| Add Event | ID (alphanumeric), Name, Category, Date, Time, URL format |
| Registration | First Name, Last Name, Email format |
| Contact Us | Name, Email format, Description (min 10 chars) |

---

## 🎨 Tech Stack

| Technology | Version | Usage |
|------------|---------|-------|
| HTML5 | — | Page structure & semantic markup |
| CSS3 | — | Custom styles & animations |
| Bootstrap | 5.3.2 | Responsive layout, components, forms |
| Bootstrap Icons | 1.11.3 | UI iconography |
| JavaScript (ES6+) | — | Logic, DOM manipulation, async/await |
| IndexedDB | Browser API | Local persistent data storage |

---

## 📱 Responsive Design

The application is fully responsive across:
- **Desktop** (1200px+)
- **Tablet** (768px – 1199px)
- **Mobile** (< 768px)

Uses Bootstrap Grid, Flexbox, and custom media queries for layout adjustments.

---

## 🧪 Test Checklist

- [ ] Home page loads and displays seed events
- [ ] Register button redirects to registration page with correct event details
- [ ] Registration form validates and shows success alert
- [ ] Login fails with wrong credentials and shows error
- [ ] Login succeeds with `admin@upgrad.com` / `12345`
- [ ] Accessing `events.html` directly without login redirects to login
- [ ] Add Event form validates all fields
- [ ] New event appears in the events grid after saving
- [ ] Delete button removes the event card
- [ ] Search filters events correctly by ID, name, and category
- [ ] Clear search restores all events
- [ ] Logout redirects to login page
- [ ] Contact form validates and shows success message
- [ ] All pages render correctly on mobile

---

## 📝 Notes

- Data persists in the browser's IndexedDB for the current browser/device only
- Clearing browser data or site storage will reset all events (seed data will reload on next visit)
- No backend or internet connection required after initial CDN asset load
- CDN dependencies: Bootstrap CSS/JS and Bootstrap Icons (loaded from jsDelivr)

---

*upGrad EMS – Empowering Learning Through Virtual Events*
