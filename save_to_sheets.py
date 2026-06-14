import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime

scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]

creds = ServiceAccountCredentials.from_json_keyfile_name(
    "uploads/porla-active-a5e4f521ac79.json",
    scope
)

client = gspread.authorize(creds)

sheet = client.open("PORLA.AI").sheet1


def save_analysis(
        image_name,
        counts,
        acne_score,
        severity,
        report
):

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    feedback = report["overall_feedback"]

    ingredients = ", ".join(
        report["recommended_ingredients"]
    )

    row = [
        timestamp,
        image_name,
        str(counts),
        acne_score,
        severity,
        feedback,
        ingredients
    ]

    sheet.append_row(row)

    print("✅ Saved to Google Sheets")