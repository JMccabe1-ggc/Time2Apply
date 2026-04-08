import math

def cosine_similarity(vec1, vec2):
    if not vec1 or not vec2:
        return 0.0

    # Dot product
    dot_product = sum(a * b for a, b in zip(vec1, vec2))

    # Magnitudes
    magnitude1 = math.sqrt(sum(a * a for a in vec1))
    magnitude2 = math.sqrt(sum(b * b for b in vec2))

    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0

    return dot_product / (magnitude1 * magnitude2)


def calculate_match_percentage(similarity: float):
    # Clamp between 0–1 for safety
    similarity = max(0.0, min(1.0, similarity))

    return round(similarity * 100, 2)


def build_explanation(resume_skills: set, job_skills: set):
    matched = resume_skills.intersection(job_skills)
    missing = job_skills.difference(resume_skills)

    return {
        "matched_skills": list(matched),
        "missing_skills": list(missing)
    }


def compute_match(resume_embedding, job_embedding, resume_skills, job_skills):
    similarity = cosine_similarity(resume_embedding, job_embedding)

    match_percentage = calculate_match_percentage(similarity)

    explanation = build_explanation(resume_skills, job_skills)

    return {
        "match_percentage": match_percentage,
        "similarity": similarity,
        **explanation
    }