# NoteLab

A creative workspace for notes and ideas.

NoteLab is a small full-stack web app for creating, browsing, editing, and deleting notes. The frontend uses AngularJS and the backend is an Express API backed by MongoDB.

## Features

- Create notes with a title, type, content, and tags
- View all notes, newest first
- Browse notes filtered by type (Personal, Work, Study, Project, Other)
- Edit and delete existing notes

## Tech Stack

- **Frontend:** HTML, CSS, AngularJS 1.8, Lottie (home page animation)
- **Backend:** Node.js, Express, `cors`, `body-parser`
- **Database:** MongoDB (via the official `mongodb` driver)

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [MongoDB](https://www.mongodb.com/) running locally, or a MongoDB connection string

## Getting Started

```bash
git clone https://github.com/epeltz33/NoteLab.git
cd NoteLab
npm install
node server/app.js
```

Open <http://localhost:3000>.

### Configuration

| Variable | Default                     | Description                  |
| -------- | --------------------------- | ---------------------------- |
| `DB_URI` | `mongodb://127.0.0.1:27017` | MongoDB connection string    |

The app uses a database named `notelab` and a `notes` collection. The server listens on port `3000` and exits if it cannot connect to MongoDB.

## Pages

| Route     | Page             | Description                    |
| --------- | ---------------- | ------------------------------ |
| `/`       | `notelab.html`   | Home                           |
| `/write`  | `write-data.html`  | Create a note                |
| `/view`   | `view-data.html`   | View, edit, and delete notes |
| `/browse` | `browse-data.html` | Browse notes by type         |

## API

| Method   | Endpoint            | Description                                     |
| -------- | ------------------- | ----------------------------------------------- |
| `GET`    | `/notes`            | Get all notes                                   |
| `GET`    | `/notes/type/:type` | Get notes of a given type                       |
| `POST`   | `/notes`            | Create a note (`title`, `content`, `type` required; `tags` optional) |
| `PUT`    | `/notes/:id`        | Update a note                                   |
| `DELETE` | `/notes/:id`        | Delete a note                                   |
| `GET`    | `/api-test`         | Health check                                    |

Example:

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Groceries","type":"Personal","content":"Milk, eggs","tags":["home"]}'
```

## Project Structure

```
NoteLab/
├── client/            # Static frontend (HTML, CSS, AngularJS controllers)
│   ├── css/
│   ├── js/
│   └── *.html
├── server/
│   ├── app.js         # Express server and page routes
│   ├── services.js    # Notes API and MongoDB access
│   └── files/         # Sample note data
└── package.json
```

## License

Released under the [MIT License](LICENSE).
