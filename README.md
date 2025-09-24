# User Manager (React + Fetch + Plain CSS)

> A simple user management UI to view, add, edit, delete, search, sort, filter and paginate users using JSONPlaceholder as a mock backend.

API used: https://jsonplaceholder.typicode.com/users

## Tech Stack
- React (Create React App)
- Fetch API for HTTP
- Plain CSS (flex/grid)

## Folder Structure
- `src/pages/Users/` – page-level component (`index.js`, `index.css`)
- `src/Components/` – reusable UI components
  - `TopBar/` – search bar, buttons
  - `UserTable/` – table rendering, sort triggers
  - `Pagination/` – pagination controls
  - `FilterPopup/` – filter form modal
  - `UserFormModal/` – add/edit user form modal with validation
- `src/services/api.js` – API calls to JSONPlaceholder

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Start development server
   ```bash
   npm start
   ```
   App runs at http://localhost:3000

3. Build for production
   ```bash
   npm run build
   ```

## Features
- View users in a table with columns: ID, First Name, Last Name, Email, Department.
- Add/Edit/Delete users with a modal form.
- Client-side validation (required fields, email format).
- Search across all visible fields.
- Column sorting (ID, First Name, Last Name, Email, Department).
- Filter popup (first name, last name, email, department).
- Pagination with selectable page sizes (10, 25, 50, 100).
- Responsive layout for desktop and mobile.

## Implementation Notes & Assumptions
- JSONPlaceholder is a mock API: POST/PUT/DELETE will succeed but do not persist. The UI applies optimistic updates for a seamless experience.
- The API returns `name` as a full name. We split it into `firstName` and `lastName` by the first space. For names without spaces, `lastName` may be empty.
- Department is mapped from `company.name` in JSONPlaceholder. If missing, defaults to `General`.
- Sorting, searching, filtering, and pagination are all client-side since the dataset is small (10 default records).
- Error states show a banner at the top of the page.

## How to Use
- Click "Add User" to open the add modal. Fill the fields and submit.
- Click "Edit" in a row to edit that user.
- Click "Delete" to remove a user (optimistic). A confirmation dialog will appear.
- Use the search box for quick search across all fields.
- Click column headers to sort. Click again to toggle asc/desc.
- Open "Filters" to apply field-specific filters.
- Change rows per page from the pagination control.

## Challenges & Future Improvements
- JSONPlaceholder doesn’t persist mutations. In a real app, we’d re-fetch after mutate or use a state library for cache sync.
- Add unit/integration tests (components and data utils).
- Improve accessibility (keyboard focus traps in modals, ARIA labels).
- Add toast notifications for success/failure.
- Extract table sorting into a reusable hook and add multi-column sort.
- Implement infinite scrolling as an alternative to pagination.
- Add debounce to search input.

## GitHub Submission
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: user manager with CRUD, filters, search, sort, pagination"
   ```
2. Create a public repository on GitHub (e.g., `user-manager`).
3. Add remote and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/user-manager.git
   git push -u origin main
   ```

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
