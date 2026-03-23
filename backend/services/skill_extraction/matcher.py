import spacy
from spacy.matcher import PhraseMatcher
from .loader import load_skill_aliases

nlp = spacy.load("en_core_web_sm")


def build_matcher():
    """
    Build PhraseMatcher from skill aliases.
    """

    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")

    aliases = load_skill_aliases()

    patterns = [nlp.make_doc(alias) for alias in aliases]

    matcher.add("SKILLS", patterns)

    return matcher