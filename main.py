import cv2
import mediapipe as mp
import numpy as np

mp_face_detection = mp.solutions.face_detection
face_detector = mp_face_detection.FaceDetection(
    model_selection=1,
    min_detection_confidence=0.5
)
from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
from collections import Counter
from PIL import Image
import tempfile
from save_to_sheets import save_analysis
from score import calculate_score
from gpt_report import create_report

app = FastAPI()

# Modelni bir marta yuklaymiz
from pathlib import Path
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "yolov8s-acnedetect-best.pt"

print("MODEL PATH:", MODEL_PATH)

model = YOLO(str(MODEL_PATH))

@app.get("/")
def home():
    return {"message": "Porla AI Backend Running"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    # Faylni vaqtincha saqlash
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        temp.write(await file.read())
        temp_path = temp.name

    # ===== FACE DETECTION =====
    image = cv2.imread(temp_path)

    if image is None:
        return {
            "error": "Rasmni o'qib bo'lmadi."
        }

    # Face detection
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    face_results = face_detector.process(rgb_image)

    if not face_results.detections:
        return {
            "error": "Rasmda yuz aniqlanmadi. Iltimos yuzingiz aniq ko'rinadigan rasm yuklang."
        }

    # Blur detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    blur_score = cv2.Laplacian(
        gray,
        cv2.CV_64F
    ).var()

    print("Blur score:", blur_score)

    if blur_score < 100:
        return {
            "error": "Rasm xira (blurry). Iltimos aniqroq selfie yuklang."
        }
    # ===== BRIGHTNESS DETECTION =====

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    brightness = np.mean(gray)

    print("Brightness:", brightness)

    if brightness < 50:
        return {
            "error": "Rasm juda qorong'i. Iltimos yaxshi yoritilgan joyda suratga oling."
        }

    if brightness > 220:
        return {
            "error": "Rasm juda yorug'. Iltimos tabiiy yorug'likda suratga oling."
        }
    # YOLO prediction
    results = model.predict(
        source=temp_path,
        imgsz=1280,
        conf=0.4
    )

    boxes = results[0].boxes

    counts = {}

    if len(boxes) > 0:

        classes = boxes.cls.cpu().numpy()

        labels = [
            model.names[int(c)]
            for c in classes
        ]

        counts = dict(Counter(labels))

    # Acne score
    # Acne score
    score, severity = calculate_score(counts)

    # GPT report
    if len(counts) == 0:
        return {
            "counts": {},
            "acne_score": 0,
            "severity": "Clear Skin",
            "report": {
                "overall_feedback": "Akne aniqlanmadi.",
                "recommended_ingredients": [],
                "morning_routine": [],
                "evening_routine": [],
                "extra_tips": []
            }
        }
    report = create_report(counts, severity)

    # Google Sheetsga yozish
    save_analysis(
        file.filename,
        counts,
        score,
        severity,
        report
    )

    return {
        "counts": counts,
        "acne_score": score,
        "severity": severity,
        "report": report
    }