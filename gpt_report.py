from openai import OpenAI
import json

client = OpenAI(
    api_key="OPENAI_API_KEY"
)


def create_report(counts, severity):
    prompt = f"""
    You are a professional dermatologist and Korean skincare expert.

    Detected skin concerns:
    {counts}

    Severity:
    {severity}

    Return ONLY valid JSON with the following structure:

    {{
        "overall_feedback": "",
        "severity": "",
        "main_concerns": [],
        "recommended_ingredients": [],
        "ingredients_to_avoid": [],
        "morning_routine": [
            {{
                "step": "",
                "product": "",
                "reason": ""
            }}
        ],
        "evening_routine": [
            {{
                "step": "",
                "product": "",
                "reason": ""
            }}
        ],
        "extra_tips": []
    }}

    Requirements:

    - All explanations and feedback must be written in Uzbek.
    - Product names must remain in their original English names.
    - Ingredient names must remain in English.
    - Medical terms such as acne, papules, pustules, blackheads and whiteheads may remain in English.
    - Recommend only Korean skincare products.
    - Include brand names.
    - Explain why each product is suitable.
    - Do not recommend prescription medications.
    - Return only valid JSON.
    -  All explanations and feedback must be written in Uzbek.
    - Product names and ingredient names must remain in English.
    - The recommendations MUST depend on severity and lesion counts.
    - Do NOT recommend the same products for all users.

    Rules:

    If severity is "Severe":
    
    Avoid:
    - AHA
    - Retinol
    - Vitamin C
    - High concentration Niacinamide
    
    Prefer:
    - Heartleaf
    - Centella Asiatica
    - Panthenol
    - Ceramides
    
    If severity is "Moderate":
    
    Prefer:
    - Salicylic Acid
    - Centella Asiatica
    - Niacinamide
    
    If severity is "Mild":
    
    Prefer:
    - Niacinamide
    - Green Tea
    - Centella Asiatica

    For severe acne, focus on repairing the skin barrier and reducing inflammation.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.3,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": """
You are a dermatologist and Korean skincare expert.

Return JSON with:

{
 "overall_feedback":"",
 "severity":"",
 "main_concerns":[],
 "recommended_ingredients":[],
 "ingredients_to_avoid":[],
 "morning_routine":[
   {
      "step":"",
      "product":"",
      "reason":""
   }
 ],
 "evening_routine":[
   {
      "step":"",
      "product":"",
      "reason":""
   }
 ],
 "extra_tips":[]
}
"""
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return json.loads(response.choices[0].message.content)