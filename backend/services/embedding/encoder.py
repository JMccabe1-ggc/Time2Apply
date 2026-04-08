from sentence_transformers import SentenceTransformer

# Load once (important for performance)
model = SentenceTransformer("all-MiniLM-L6-v2")

def generate_embedding(text: str):
    if not text or len(text.strip()) == 0:
        return None

    embedding = model.encode(text)

    # Convert numpy array → Python list (so it can be stored in DB)
    return embedding.tolist()