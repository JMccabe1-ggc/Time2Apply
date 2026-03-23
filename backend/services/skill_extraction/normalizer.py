import re

def normalize_text(text: str) -> str:
    """
    Normalize resume text before NLP processing.
    """

    text = text.lower()

    # whitespaces
    text = re.sub(r"\s+", " ", text)

    # anything other than english
    text = re.sub(r"[^\x00-\x7F]+", " ", text)

    return text.strip()