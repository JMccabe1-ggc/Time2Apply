from datetime import datetime, timezone


def normalize_job_field(value: str | None) -> str:
    if not value:
        return ""
    return " ".join(value.strip().lower().split())


def build_job_fingerprint(title: str | None, company: str | None, location: str | None) -> str:
    normalized_title = normalize_job_field(title)
    normalized_company = normalize_job_field(company)
    normalized_location = normalize_job_field(location)

    return f"{normalized_title}|{normalized_company}|{normalized_location}"


def parse_posted_date(posted_date: str | None):
    if not posted_date:
        return None

    try:
        # Handles ISO strings ending in Z
        return datetime.fromisoformat(posted_date.replace("Z", "+00:00"))
    except Exception:
        return None


def calculate_age_days(posted_date: str | None) -> int | None:
    dt = parse_posted_date(posted_date)
    if not dt:
        return None

    now = datetime.now(timezone.utc)
    delta = now - dt
    return max(delta.days, 0)


def map_score_to_level(score: float) -> str:
    if score >= 0.70:
        return "very_high"
    if score >= 0.45:
        return "high"
    if score >= 0.20:
        return "moderate"
    return "low"


def compute_ghost_risk(posted_date: str | None, existing_fingerprint_count: int):
    score = 0.0
    flags = []

    age_days = calculate_age_days(posted_date)

    # Age scoring
    if age_days is None:
        score += 0.20
        flags.append("missing_posted_date")
    elif 15 <= age_days <= 30:
        score += 0.25
        flags.append("posted_15_to_30_days_ago")
    elif 31 <= age_days <= 45:
        score += 0.50
        flags.append("posted_31_to_45_days_ago")
    elif age_days > 45:
        score += 0.75
        flags.append("posted_more_than_45_days_ago")

    # Repost / recurrence scoring
    if existing_fingerprint_count == 1:
        score += 0.15
        flags.append("reposted_once")
    elif existing_fingerprint_count >= 2:
        score += 0.30
        flags.append("reposted_multiple_times")

    score = min(score, 1.0)
    level = map_score_to_level(score)

    return {
        "ghost_risk_score": round(score, 2),
        "ghost_risk_level": level,
        "ghost_flags": flags,
    }