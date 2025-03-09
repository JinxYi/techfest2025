# Fact-Checking API with Flask & React (Team 85)

## 📌 Overview

This project consists of a **Flask backend** that fact-checks objective claims using Google's Fact Check API, and and another flask server which analysis media to predict whether it is deepfake or real. The **React frontend** interacts with the API to fetch and display results.

---

## 🏗️ Project Structure

## 🚀 Backend (Flask API)

### 🔹 **Setup**

1. **Install dependencies**

   ```sh
   cd backend
   pip install -r requirements.txt
   ```

2. Run the Flask server

    ```
    python main.py
    ```

## 🌐 Frontend (React)

- Setup
    - Install dependencies

```
cd frontend
npm install
```

Run the React app

```
npm start
```

React app runs at:
http://localhost:3000

## 🎯 Testing the API

You can test the API using:

- Postman (GUI-based)
- cURL (Command Line)

```
    curl -X POST "http://localhost:8000/classify" \
         -H "Content-Type: application/json" \
         -d '{"claims": ["The Earth is round"]}'
```

## 🛠 Tech Stack

- Backend: Python, Flask, Transformers (Hugging Face), OpenAI API, PyTorch, TensorFlow
- Frontend: React, MUI, Fetch API

## Future Improvements

As a product in its development stage, we plan to introduce several upgrades, including:

- Real-time detection using Augmented Reality (AR) to overlay fact-checking insights on videos or images we encounter daily.
- Cross-platform social media verification, allowing users to fact-check information directly on social platforms.
- Cost efficiency improvements, focusing on optimizing training costs, computational power, and long-term maintenance.
