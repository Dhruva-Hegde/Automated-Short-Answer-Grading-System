from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

vectorizer = joblib.load("grading_vectorizer.pkl")

import re
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

@app.route("/grade", methods=["POST"])
def grade():
    data = request.json
    model_ans = data["model_answer"]
    student_ans = data["student_answer"]

    # 1. Rubric Scoring (Keyword Matching)
    def extract_keywords(text):
        # Remove punctuation and converting to lower case
        text = re.sub(r'[^\w\s]', '', text.lower())
        words = set(text.split())
        # Remove common stop words (and, the, is, etc.)
        keywords = words - ENGLISH_STOP_WORDS
        return keywords

    model_keywords = extract_keywords(model_ans)
    student_words = extract_keywords(student_ans)

    if not model_keywords:
        rubric_score = 0
    else:
        # Check intersection
        match_count = len(model_keywords.intersection(student_words))
        rubric_score = (match_count / len(model_keywords)) * 100

    # 2. Semantic Similarity Scoring (Vector Space)
    try:
        vec1 = vectorizer.transform([model_ans])
        vec2 = vectorizer.transform([student_ans])
        similarity = cosine_similarity(vec1, vec2)[0][0]
        similarity_score = round(similarity * 100, 2)
    except:
        similarity_score = 0

    # 3. Final Weighted Score
    # Give match priority to Keywords (60%) to prevent "high similarity, wrong meaning"
    # But keep similarity (40%) to handle synonyms/context (though basic TFIDF is weak at synonyms, it helps structure)
    
    # Correction: If rubric score is very low (e.g. 0), the answer is likely wrong regardless of similarity (which might match on 'the', 'is', etc)
    if rubric_score < 20: 
        final_score = rubric_score # Penalize heavily if key concepts are missing
    else:
        final_score = (rubric_score * 0.6) + (similarity_score * 0.4)
    
    final_score = round(final_score, 2)

    # Set threshold
    threshold = 40
    status = "Correct" if final_score >= threshold else "Wrong"

    return jsonify({
        "score": final_score, 
        "status": status,
        "details": {
            "rubric_score": round(rubric_score, 2),
            "similarity_score": similarity_score
        }
    })

if __name__ == "__main__":
    app.run(debug=True)
