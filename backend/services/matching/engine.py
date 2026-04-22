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


def calculate_match_percentage(similarity: float, skill_overlap_score: float):
    final_score = (0.3 * similarity) + (0.7 * skill_overlap_score)

    # Clamp between 0–1 for safety
    final_score = max(0.0, min(1.0, final_score))

    return round(final_score * 100, 2)


def build_explanation(resume_skills: set, job_skills: set):
    matched = resume_skills.intersection(job_skills)
    missing = job_skills.difference(resume_skills)

    return {
        "matched_skills": list(matched),
        "missing_skills": list(missing)
    }

def calculate_skill_overlap_score(resume_skills: set, job_skills: set):
    if not job_skills:
        return 0.0

    matched_skills = resume_skills.intersection(job_skills)
    return len(matched_skills) / len(job_skills)


def compute_match(resume_embedding, job_embedding, resume_skills, job_skills):
    similarity = cosine_similarity(resume_embedding, job_embedding)

    skill_overlap_score = calculate_skill_overlap_score(resume_skills, job_skills)

    match_percentage = calculate_match_percentage(similarity, skill_overlap_score)

    explanation = build_explanation(resume_skills, job_skills)

    return {
        "match_percentage": match_percentage,
        "similarity": similarity,
        "skill_overlap_score": skill_overlap_score,
        **explanation
    }