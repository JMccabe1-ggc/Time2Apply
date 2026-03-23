import spacy
from .matcher import build_matcher
from .loader import load_alias_to_skill_map
from .normalizer import normalize_text

nlp = spacy.load("en_core_web_sm")

matcher = build_matcher()
alias_map = load_alias_to_skill_map()


def extract_skills_from_text(text: str):
    
    normalized = normalize_text(text)

    doc = nlp(normalized)

    matches = matcher(doc)

    detected = set()

    for match_id, start, end in matches:
        span = doc[start:end].text.lower()

        if span in alias_map:
            detected.add(alias_map[span])

    return list(detected)