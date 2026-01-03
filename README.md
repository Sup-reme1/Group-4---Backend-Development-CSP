# Group 4 Cap Stone Project - Backend

## Clone the repository
```bash
git clone https://github.com/Sup-reme1/Group-4---Backend-Development-CSP.git
cd "Group 4 Cap Stone Project"
```

## Install dependencies

```bash
npm install
```

## Environment
Create a `.env` file in the project root with values used by `config/db.js` and the app. Example:

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/mydb
PORT=5000
SESSION_SECRET=your_secret_here
```

## Start the server
- Production: `npm start` (runs `node server.js`)
- Development (auto-restart): `npm run dev` (requires `nodemon`)

```bash
npm start
# or
npm run dev
```

## Branching & pushing changes (recommended workflow)
1. Create a new branch for your work:

```bash
git checkout -b feature/yourname-short-description
```

2. Make your changes and stage them:

```bash
git add .
```

3. Commit with a clear message:

```bash
git commit -m "feat: add new endpoint for X"
```

4. Push the branch to remote:

```bash
git push -u origin feature/yourname-short-description
```

5. Open a Pull Request on GitHub/GitLab for review.

## How to create an API with models (Mongoose + Express)
Follow this pattern using the existing `models/` and `routes/` folders.

1. Add a Mongoose model in `models/` (example `models/Item.js`):

2. Create a route in `routes/` (example `routes/items.js`):

3. Register the route in `server.js` (near other `app.use` lines):

4. Ensure the DB connection runs before the server starts. The project has `config/db.js` — confirm `server.js` calls it (e.g., `require('./config/db')()`).

5. Test your endpoints with Postman.

## Notes
- Follow existing code patterns: models use Mongoose schemas (see `models/User.js`).
- Keep route handlers small; consider adding controllers if a route grows complex.
