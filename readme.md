![logo](public/logo.png)

# Facelock

Secure local password manager.

## Features

- 🔐 Face authentication for secure access
- 📦 Password collections for organized storage
- 🔍 Full-text search across all entries
- 🎲 Built-in password generator
- 📋 TOTP/2FA support
- 💾 Local SQLite storage — your data stays on your device
- 🌙 Dark theme with purple accent

## Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/iewher/facelock
cd facelock

# Install dependencies
npm install
```

## Development

### Run in development mode

```bash
npm run dev
```

This starts the Vite dev server and Electron app with hot-reload enabled.

### Project Structure

```
├── app/                    # React frontend
│   ├── components/         # UI components
│   ├── hooks/              # Custom React hooks
│   └── styles/             # Global styles
├── lib/                    # Shared code & Electron main process
│   ├── conveyor/           # Type-safe IPC system
│   │   ├── api/            # API classes (renderer → main)
│   │   ├── handlers/       # IPC handlers (main process)
│   │   └── schemas/        # Zod validation schemas
│   ├── main/               # Electron main process
│   │   ├── app.ts          # App entry point
│   │   └── database.ts     # SQLite setup & migrations
│   └── preload/            # Electron preload script
├── resources/              # App assets (icons, etc.)
└── electron-builder.yml    # Build configuration
```

## Usage

### Getting Started

1. **First Launch** — On first launch, you'll be prompted to set up a master key
2. **Authentication** — Use your face to unlock the app (or master key as fallback)
3. **Library** — You'll see the main password library with all your saved entries

### Managing Passwords

#### Adding a Password

1. Click **"Добавить"** (Add) button
2. Fill in the fields:
   - **Название** — Entry name (required)
   - **Логин / Email** — Username or email
   - **Пароль** — Password (required)
   - **URL** — Website URL (optional)
   - **2FA / TOTP** — Two-factor authentication code (optional)
   - **Примечания** — Additional notes (optional)
3. Click **"Сохранить"** (Save)

**Quick actions:**

- 🎲 Generate a random password
- 👁 Show/hide password

#### Editing a Password

1. Hover over a password card
2. Click the ✏️ **Edit** button
3. Modify fields and save

#### Deleting a Password

1. Hover over a password card
2. Click the 🗑️ **Delete** button
3. Confirm deletion

### Managing Collections

Collections organize your passwords into groups.

#### Creating a Collection

1. Click the **+** button in the **Коллекции** sidebar
2. Enter a collection name
3. Click **"Сохранить"**

#### Adding Passwords to Collections

When creating or editing a password:

1. Click the **Коллекция** dropdown
2. Select the desired collection
3. Save the password

The password will automatically appear in that collection's view.

#### Viewing Collections

- **Независимые** — Passwords without a collection
- **Collection name** — Click any collection to view its passwords

#### Editing a Collection

1. Hover over a collection in the sidebar
2. Click the ✏️ **Edit** button
3. Change the name and save

#### Deleting a Collection

1. Hover over a collection in the sidebar
2. Click the 🗑️ **Delete** button
3. If the collection has passwords, a warning appears — passwords will become independent
4. Click **"Удалить"** to confirm

### Search

Use the search bar to filter passwords by title or username.

## Architecture

### Conveyor IPC System

Type-safe inter-process communication between Electron main and renderer processes:

- **Schemas** (`lib/conveyor/schemas/`) — Zod validation schemas define API contracts
- **APIs** (`lib/conveyor/api/`) — Client classes for calling main process methods
- **Handlers** (`lib/conveyor/handlers/`) — Server-side IPC handlers
- **Hooks** (`app/hooks/use-conveyor.ts`) — React hook for accessing APIs

### Database

SQLite database with automatic migrations:

- `users` — User accounts and master keys
- `passwords` — Saved password entries with collection references
- `collections` — Password groups with UUIDs

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **UI:** Radix UI, shadcn/ui components
- **State:** Zustand, React Query
- **Backend:** Electron 40, better-sqlite3
- **IPC:** Custom Conveyor system with Zod validation
- **Build:** Vite, electron-builder
