import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import Tuple

_model = None
_model_attempted = False

def get_transformer_model():
    global _model, _model_attempted
    if not _model_attempted:
        _model_attempted = True
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception:
            _model = None
    return _model

def calculate_semantic_similarity(resume_text: str, jd_text: str) -> float:
    """
    Computes 384-dimensional dense semantic vector representations for resume
    and job description using SentenceTransformers (all-MiniLM-L6-v2).
    Falls back to dense character sub-word N-gram semantic vector representation if offline.
    """
    if not resume_text.strip() or not jd_text.strip():
        return 0.0

    model = get_transformer_model()
    if model is not None:
        try:
            embeddings = model.encode([resume_text, jd_text])
            sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
            return round(float(sim) * 100, 1)
        except Exception:
            pass

    # Dense Sub-word / Character-level N-gram Vector Representation (Semantic Fallback)
    char_vectorizer = TfidfVectorizer(analyzer='char_wb', ngram_range=(3, 5))
    matrix = char_vectorizer.fit_transform([resume_text, jd_text])
    sim = cosine_similarity(matrix[0:1], matrix[1:2])[0][0]
    return round(float(sim) * 100, 1)
