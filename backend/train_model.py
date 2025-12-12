import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Example answers (model + common student rephrases)
answers = [
    "Photosynthesis is the process by which plants make food.",
    "Plants prepare food using sunlight through photosynthesis.",
    "Gravity is a force that pulls objects toward Earth.",
    "Objects fall due to Earth's gravitational force.",
    "DNA carries genetic information in all living organisms.",
    "Genetic information is stored in DNA of all organisms.",
]

vectorizer = TfidfVectorizer()
vectorizer.fit(answers)

joblib.dump(vectorizer, "grading_vectorizer.pkl")

print("Vectorizer trained and saved!")
