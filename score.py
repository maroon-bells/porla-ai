def calculate_score(counts):

    blackhead = counts.get("Blackhead", 0)
    whitehead = counts.get("Whitehead", 0)
    papular = counts.get("Papular", 0)
    purulent = counts.get("Purulent", 0)

    score = (
        blackhead * 1 +
        whitehead * 1 +
        papular * 3 +
        purulent * 5
    )

    total_lesions = (
        blackhead +
        whitehead +
        papular +
        purulent
    )

    if total_lesions <= 5:
        severity = "Mild"

    elif total_lesions <= 20:
        severity = "Moderate"

    else:
        severity = "Severe"

    return score, severity