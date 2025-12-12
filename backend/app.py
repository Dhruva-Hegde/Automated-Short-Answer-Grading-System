from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# LOAD CORRECT FILE
vectorizer = joblib.load("grading_vectorizer.pkl")

@app.route("/grade", methods=["POST"])
def grade():
    data = request.json
    model_ans = data["model_answer"]
    student_ans = data["student_answer"]

    vec1 = vectorizer.transform([model_ans])
    vec2 = vectorizer.transform([student_ans])

    similarity = cosine_similarity(vec1, vec2)[0][0]
    score = round(similarity * 100, 2)

    return jsonify({"score": score})

if __name__ == "__main__":
    app.run(debug=True)
