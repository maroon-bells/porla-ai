from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from collections import Counter
from pathlib import Path
import tempfile

from score import calculate_score
from gpt_report import create_report

try:
    from save_to_sheets import save_analysis
except:
    save_analysis = None

app = FastAPI()
print("========== CORS LOADED ==========")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Load YOLO model =====
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "yolov8s-acnedetect-best.pt"

print("MODEL PATH:", MODEL_PATH)

model = YOLO(str(MODEL_PATH))

@app.get("/test123")
def test123():
    return {"hello": "Mohinur"}
@app.get("/")
def home():
    return {"message": "Porla AI Backend Running 🚀"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    # ===== Save uploaded image =====
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        temp.write(await file.read())
        temp_path = temp.name

    # ===== YOLO prediction =====
    results = model.predict(
        source=temp_path,
        imgsz=1280,
        conf=0.4
    )

    boxes = results[0].boxes
    counts = {}

    if boxes is not None and len(boxes) > 0:

        classes = boxes.cls.cpu().numpy()

        labels = [
            model.names[int(c)]
            for c in classes
        ]

        counts = dict(Counter(labels))

    # ===== Acne score =====
    score, severity = calculate_score(counts)

    # ===== No acne detected =====
    if len(counts) == 0:

        report = {
            "overall_feedback": "Teringiz toza, akne aniqlanmadi.",
            "severity": "Clear Skin",
            "main_concerns": [],
            "recommended_ingredients": [
                "Niacinamide",
                "Hyaluronic Acid"
            ],
            "ingredients_to_avoid": [],
            "morning_routine": [],
            "evening_routine": [],
            "extra_tips": [
                "Yengil skincare routine davom ettiring"
            ]
        }

        return {
            "counts": {},
            "acne_score": 0,
            "severity": "Clear Skin",
            "report": report
        }

    # ===== GPT report =====
    report = create_report(counts, severity)

    return {
        "counts": counts,
        "acne_score": score,
        "severity": severity,
        "report": report
    }