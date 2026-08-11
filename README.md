# PORLA.AI

✨ Porla AI

AI-powered skin analysis and personalized skincare recommendations

🌐 Website: porla.ai

🚀 What is Porla AI?

Porla AI combines Computer Vision, Deep Learning and Generative AI to make professional-level skin analysis more accessible.

User simply uploads a facial image, and Porla AI:
📸 Analyzes the uploaded image
🔍 Detects visible skin concerns
🧠 Evaluates the severity of detected conditions
📊 Generates an overall skin analysis
💡 Provides personalized skincare recommendations
🛍️ Can connect recommendations with relevant skincare products

The goal is to transform skincare from guesswork into data-driven personalization.

🧠 How It Works


                 USER
                   │
                   ▼
            Upload Face Image
                   │
                   ▼
        ┌─────────────────────┐
        │   Image Processing  │
        │   OpenCV / PIL       │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │   YOLO Detection    │
        │   Skin Concerns     │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ Severity Assessment │
        │ Mild / Moderate /   │
        │ Severe              │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │    GPT Analysis     │
        │ Personalized Report │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ Skincare Products   │
        │ & Recommendations   │
        └─────────────────────┘




🔬 AI Skin Detection


Porla AI uses a custom-trained YOLO-based computer vision model to detect multiple visible skin concerns.


Current detection classes include:
- Blackhead
- Whitehead
- Cystic acne
- Conglobata
- Papular acne


   └── AI Report Generation
             │
             ▼
        Personalized
        Skin Report




🛠️ Tech Stack
Frontend
React
Vite
JavaScript
HTML5
CSS3
Backend
Python
FastAPI
OpenCV
PIL
NumPy
AI / Machine Learning
YOLO
Ultralytics
PyTorch
Computer Vision
Generative AI / LLM
Development
Git
GitHub
REST API





📁 Project Structure


porla-ai/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── main.py
│   ├── models/
│   │   └── yolov8s-acnedetect-best.pt
│   ├── services/
│   ├── utils/
│   └── requirements.txt
│
├── README.md
└── .gitignore




⚙️ Installation


1. Clone the repository


git clone https://github.com/maroon-bells/porla-ai.git
cd porla-ai


2. Backend setup


Create a virtual environment:


python -m venv venv



Activate it:


Windows


venv\Scripts\activate



macOS / Linux


source venv/bin/activate



Install dependencies:


pip install -r requirements.txt




3. Environment Variables


Create a .env file:


OPENAI_API_KEY=your_api_key



Additional environment variables can be configured depending on the deployment environment.



4. Run the Backend


uvicorn main:app --reload --port 3001



The API will be available at:


http://localhost:3001




5. Frontend Setup


Install dependencies:


npm install



Run the development server:


npm run dev



The frontend will be available at:


http://localhost:5173



Configure the backend endpoint if necessary:


VITE_BACKEND_URL=http://localhost:3001/api/skin-analyze

