
# Automated Short Answer Grading System

**AI-powered automated grading** for short answers with dynamic, interactive frontend.

---

## Features

* **Semantic grading** using TF-IDF & cosine similarity
* **Glassmorphic input cards**
* **Animated circular score** with gradient & glow
* **Confetti & spark effects** for high scores
* **3D tilt effect** on cards
* **Responsive, full-screen particle background**

---

## Project Structure

```
backend/
├─ app.py
├─ train_model.py
├─ grading_model.pkl

frontend/
├─ index.html
├─ style.css
└─ script.js
```

---

## Setup

**Backend**

```bash
pip install flask flask-cors scikit-learn joblib
python app.py
```

**Frontend**

* Open `frontend/index.html` in browser
* Enter answers and click **Grade Answer**

---

## Usage

1. Enter **Model Answer**
2. Enter **Student Answer**
3. Click **Grade Answer** → Animated score appears
4. Confetti triggers if score ≥ 80%

---

## Technologies

Python, Flask, scikit-learn, HTML, CSS, JavaScript, Canvas API
