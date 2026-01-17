import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from datasets import load_dataset

if __name__ == "__main__":
    print("Loading SciEntsBank dataset from Hugging Face...")
    # Load the SciEntsBank dataset (train split)
    try:
        dataset = load_dataset("allenai/scientsbank", "2_way", split="train")
        print(f"Dataset loaded: {len(dataset)} examples")

        questions = dataset['question']
        reference_answers = dataset['reference_answer']
        student_answers = dataset['student_answer']
        corpus = list(set(questions + reference_answers + student_answers))

    except Exception as e:
        print(f"Warning: Could not load SciEntsBank ({e}). Using fallback local dataset.")
        # Fallback dataset
        qa_pairs = [
            {"question": "What is photosynthesis?", "answer": "Photosynthesis is the process by which plants make food."},
            {"question": "Explain gravity.", "answer": "Gravity is a force that pulls objects toward Earth."},
            {"question": "What does DNA do?", "answer": "DNA carries genetic information in all living organisms."},
            {"question": "What is the boiling point of water?", "answer": "The boiling point of water is 100 degrees Celsius."},
            {"question": "Define potential energy.", "answer": "Potential energy is the stored energy in an object due to its position."},
             # Add a few more generic science terms to vocabulary
            {"question": "Science", "answer": "experiment hypothesis method conclusion data analysis variable control constant"}
        ]
        corpus = [item["question"] for item in qa_pairs] + [item["answer"] for item in qa_pairs]

    print(f"Training Vectorizer on {len(corpus)} unique text samples...")

    vectorizer = TfidfVectorizer(stop_words='english')
    vectorizer.fit(corpus)

    joblib.dump(vectorizer, "grading_vectorizer.pkl")
    print("Vectorizer trained and saved to 'grading_vectorizer.pkl'!")
