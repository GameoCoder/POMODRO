
---

# 🧠 AI Study Tracker (Pomodoro + Face Detection)

> A smart study tracking web application that combines Pomodoro focus sessions, AI-powered face detection, and session analytics to help users maintain focus and improve productivity.

This project goes beyond standard timers by using **face-api.js** to detect presence. If you walk away or get distracted (face not visible), the timer pauses automatically, ensuring you only track *real* focus time.

---

## 🛠 Tech Stack

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)


---

## 🚀 Features

### 🎯 1. Focus Mode

* **Default Session:** 25-minute focus interval.
* **Breaks:** 5-minute Short Break, customizable Long Break.
* **Audio Cues:** Alarm sounds when a session or break ends.
* **UI:** Clean, modern interface with a visual countdown.

### 👁 2. AI-Based Face Detection

Powered by the **TinyFaceDetector** model, this feature ensures accuracy in tracking:

* **Auto-Pause:** If your face is missing for **5 seconds**, the session pauses.
* **Auto-Resume:** When your face is detected for **2 consecutive seconds**, the timer resumes.
* **Metrics:** Tracks interruption counts and duration.
* **Privacy:** The camera works silently and processes data locally.

### 📊 3. Session Tracking

Every study session is recorded in the Supabase database with:

* Start/End timestamps
* Total actual duration
* Interruption logs (start, end, duration)
* Syncs via `POST /sessions/bulk-save`

### 🔐 4. Authentication

* User Signup & Login
* Uses JWT Token for secure auth
* Protected session routes using Bearer tokens
---

## 🧠 How the AI Logic Works

The application uses a specific logic flow to prevent false positives/negatives:

1. **Start:** Focus session begins, the Camera activates.
2. **Detection:** Face detection runs every **1 second**.
3. **Pause Trigger:** If `no face detected` for **5 seconds**  Timer pauses & Interruption logged.
4. **Resume Trigger:** If `face detected` for **2 consecutive seconds**  Timer resumes automatically.

*Note: No manual resume button is needed; the AI handles the flow.*

---

## ⏱ Timer Modes

| Mode | Duration | AI Active | Alarm |
| --- | --- | --- | --- |
| **Focus** | 25 min | ✅ Yes | ✅ Yes |
| **Short Break** | 5 min | ❌ No | ✅ Yes |
| **Long Break** | Custom | ❌ No | ✅ Yes |

---

## 🗄 Database Schema (Supabase)

The project uses two main tables to handle users and analytics.

**1. users**

* `id` (UUID)
* `email` (Unique)
* `password` (Hashed)

**2. sessions**

* `id`
* `user_id` (FK)
* `started_at`
* `ended_at`
* `interruption_count`

<!-- **3. interruptions**

* `id`
* `session_id` (FK)
* `start_time`
* `end_time` -->
---

## 📁 Project Structure

```text
study-tracker/
│
├── frontend/
│   ├── appPage/
│   |   ├── app.html
│   |   ├── script.js
│   |   ├── style.css
│   ├── loginPage/
│   |   ├── login.html
│   |   ├── style.css
│   |   ├── signup.html
│   |   ├── signstyle.css
│   |   ├── prac.js
│   |   ├── background.jpg
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── models/
│
├── backend/
│   ├── controllers/
│   |   ├── authController.js
│   |   ├── sessionController.js
│   ├── middleware/
│   |   ├── auth.js
│   ├── routes/
│   |   ├── authRoutes.js
│   |   ├── sessionRoutes.js
│   ├── .env.sample
│   ├── server.js
│   ├── auth.js
│   ├── sessions.js
│   └── data.js
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Project

```bash
git clone <your-repo-url>
cd study-tracker
```

### 2️⃣ Setup Backend

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
JWT_SECRET=your_secret
```

Start the server (runs on `http://localhost:3000`):

```bash
node server.js
```

### 3️⃣ Setup Frontend

Ensure you have downloaded the **face-api models** and placed them in `frontend/models/`.

Serve the frontend (using Python or any static server):

```bash
cd frontend
python -m http.server 5500
```

Open your browser and visit: `http://localhost:5500`

---

## 📦 Dependencies

**Backend:**

* `express`
* `jsonwebtoken`
* `bcrypt`
* `cors`
* `dotenv`
* `@supabase/supabase-js`

**Frontend:**

* `face-api.js`

---

## 🔮 Future Improvements

* [ ] 📈 **Dashboard:** Charts for daily/weekly focus stats.
* [ ] 🔁 **Auto Cycle:** Automatically transition Focus → Break → Focus.
* [ ] 🏆 **Gamification:** Streak tracking and focus scores.
* [ ] ☁ **Deployment:** Cloud hosting for backend and frontend.
* [ ] 📱 **Mobile:** Responsive optimization for phones/tablets.
* [ ] 🤖 **Advanced AI:** Custom trained ML attention models.

---

## 🛡 Privacy Note

> **Important:** The camera stream is processed entirely locally within the browser using `face-api.js`. **No video data is sent to the server.** Only numerical session analytics (timestamps, duration) are saved to the database.

---

## 👨‍💻 Author

Built as a full-stack AI productivity project to encourage deep focus and provide measurable insights.

---