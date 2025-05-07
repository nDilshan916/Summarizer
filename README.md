# 🧠 AI-Based Document Summarization with Topic History

This project introduces an AI-powered system for summarizing and categorizing university faculty board meeting documents. It uses cutting-edge NLP models to generate concise summaries and track topic history for improved documentation efficiency and retrieval.

## 🚀 Project Summary

📌 **Goal**: Automate the summarization and topic categorization of meeting minutes.  
📌 **Use Case**: University faculty board meetings – often lengthy and manually processed.  
📌 **Outcome**: Achieved over 90% accuracy in topic categorization and reduced summarization time by 40%.

---

## 🛠️ Technologies Used

- **Python**
- **SBERT (Sentence-BERT)** – for semantic similarity & topic classification
- **BART (Facebook's model)** – for abstractive summarization
- **Pandas, NumPy** – for data handling
- **Matplotlib / Seaborn** – for basic analysis visualization

---

## 🔍 Key Features

- ✅ **Abstractive Summarization** using BART
- ✅ **Topic Detection** using SBERT similarity scoring
- ✅ **Topic-wise History Tracking**
- ✅ **Accuracy Metrics** (90%+ for classification)
- ✅ **Efficiency Improvement** (40% faster than manual summarization)

---

## 🧠 How It Works

1. Preprocess raw meeting text
2. Use SBERT to determine the closest matching topic
3. Pass the text to BART to generate a concise, coherent summary
4. Record and organize summaries under each topic for historical tracking

---

## 📈 Results

| Metric                  | Value        |
|------------------------|--------------|
| Topic Classification   | 90.2% F1-score |
| Summary Compression    | ~75%         |
| Time Saved             | ~40%         |

---

## 📌 Future Improvements

- 🟡 Fine-tuning BART with domain-specific data
- 🟡 Incorporating multilingual support




