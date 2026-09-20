import re
import numpy as np
from typing import List, Dict, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def preprocess_text(text: str) -> str:
    """
    Clean and normalize input text while preserving common technical terms.
    """
    if not text:
        return ""
    # Lowercase text
    text = text.lower()
    # Replace non-alphanumeric characters except +, #, ., -, and whitespace
    text = re.sub(r'[^a-z0-9+#.\s-]', ' ', text)
    # Collapse multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def calculate_tfidf_match(resume_text: str, job_description: str) -> Tuple[float, List[str], List[str]]:
    """
    Computes TF-IDF vector representations for resume and job description,
    calculates Cosine Similarity match score, and extracts matched vs missing terms.
    
    Returns:
        (match_score, matched_terms, missing_terms)
    """
    clean_resume = preprocess_text(resume_text)
    clean_jd = preprocess_text(job_description)

    if not clean_resume or not clean_jd:
        return 0.0, [], []

    # Initialize TF-IDF Vectorizer with unigrams and bigrams
    vectorizer = TfidfVectorizer(
        stop_words='english',
        ngram_range=(1, 2),
        token_pattern=r'(?u)\b[a-z0-9+#.-]+\b'
    )

    # Fit and transform the document collection [resume, jd]
    tfidf_matrix = vectorizer.fit_transform([clean_resume, clean_jd])
    feature_names = vectorizer.get_feature_names_out()

    # Calculate Cosine Similarity between vector 0 (resume) and vector 1 (jd)
    similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    raw_similarity = float(similarity_matrix[0][0])
    
    # Scale score to 0 - 100 percentage rounded to 1 decimal place
    match_score = round(raw_similarity * 100, 1)

    # Extract term weights for Resume and JD
    resume_vector = tfidf_matrix[0].toarray().flatten()
    jd_vector = tfidf_matrix[1].toarray().flatten()

    matched_terms = []
    missing_terms = []

    # Rank terms by JD importance weight
    jd_term_weights = []
    for idx, term in enumerate(feature_names):
        jd_weight = jd_vector[idx]
        resume_weight = resume_vector[idx]
        if jd_weight > 0:
            jd_term_weights.append((term, jd_weight, resume_weight))

    # Sort terms by highest JD weight
    jd_term_weights.sort(key=lambda x: x[1], reverse=True)

    for term, jd_w, res_w in jd_term_weights:
        # Filter out short numeric-only tokens
        if term.isdigit() or len(term) < 2:
            continue
        
        if res_w > 0:
            if term not in matched_terms:
                matched_terms.append(term)
        else:
            if term not in missing_terms:
                missing_terms.append(term)

    return match_score, matched_terms[:15], missing_terms[:15]
