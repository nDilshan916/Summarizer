from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import json, re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from PyPDF2 import PdfReader
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client['AI_Project']
categories_collection = db['categories']
topics_collection = db['topics']

# Load pre-trained model
model = SentenceTransformer('all-MiniLM-L6-v2')

def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

# Additional utility functions remain the same: clean_text, group_related_chunks, group_chunks_by_topic, calculate_similarity, assign_topics.
def clean_text(text):
    """
    Cleans text by removing section numbers and extra line breaks.
    """
    # Remove section numbers (e.g., "22.39")
    text = re.sub(r"^\d+(\.\d+)*\s*", "", text, flags=re.MULTILINE)
    # Replace multiple newlines with a single space
    text = re.sub(r"\n+", " ", text).strip()
    return text

def group_related_chunks(text):
    """
    Groups related lines under the same topic based on hierarchical numbering.
    """
    lines = text.splitlines()
    chunks = []
    current_chunk = []
    last_topic_number = None

    for line in lines:
        match = re.match(r"^(\d+(\.\d+)*)(\s+.*)?", line)
        if match:
            current_number = match.group(1)
            if last_topic_number and not current_number.startswith(last_topic_number):
                if current_chunk:
                    chunks.append("\n".join(current_chunk))
                current_chunk = []
                last_topic_number = current_number
            else:
                last_topic_number = last_topic_number or current_number
        current_chunk.append(line.strip())

    if current_chunk:
        chunks.append("\n".join(current_chunk))
    return chunks

def group_chunks_by_topic(chunks):
    """
    Groups chunks by their main topic and subpoints.
    Returns a list of dictionaries, each with 'topic' and 'content' keys.
    """
    topics = []
    current_topic = None
    current_content = []

    for chunk in chunks:
        match = re.match(r"^(\d+\.\d+)\s+(.*)", chunk)
        if match:
            # Save the previous topic before starting a new one
            if current_topic:
                topics.append({
                    "topic": current_topic,
                    "content": " ".join(current_content).strip()
                })
            current_topic = clean_text(match.group(2).strip())
            current_content = []
        current_content.append(chunk.strip())

    # Append the last topic
    if current_topic:
        topics.append({
            "topic": current_topic,
            "content": " ".join(current_content).strip()
        })

    return topics


def calculate_similarity(a, b):
    """
    Calculates similarity between two strings using cosine similarity on SBERT embeddings.
    """
    embedding_a = model.encode([a])
    embedding_b = model.encode([b])
    return float(cosine_similarity(embedding_a, embedding_b)[0][0])

def assign_topics(new_topics, existing_topics):
    """
    Assigns new topics to the existing topics based on similarity, while maintaining the structure.
    """
    final_topics = []
    threshold = 0.6  # Similarity threshold
    matched_topics = set()  # Track topics that have been matched

    for new_topic_data in new_topics:
        new_topic = new_topic_data["topic"]
        new_content = new_topic_data["content"]
        max_similarity = 0
        assigned_topic = None

        for prev_topic_data in existing_topics["topics"]:
            prev_topic = prev_topic_data["topic"]
            similarity = calculate_similarity(new_topic, prev_topic)

            if similarity > max_similarity:
                max_similarity = similarity
                assigned_topic = prev_topic_data

        if max_similarity >= threshold:
            # Append new content to the existing topic
            assigned_topic["content"] += " " + new_content
            assigned_topic["content"] = assigned_topic["content"].strip()
            matched_topics.add(assigned_topic["topic"])
            final_topics.append(assigned_topic)

                  
        else:
            # Add new topic as it is
            final_topics.append({
                "topic": new_topic,
                "content": new_content
            })
        print(f"Max similarity for new topic '{new_topic}': {max_similarity:.4f} with topic '{assigned_topic['topic'] if assigned_topic else None}'") 

    # Add unmatched existing topics
    for prev_topic_data in existing_topics["topics"]:
        if prev_topic_data["topic"] not in matched_topics:
            final_topics.append(prev_topic_data)

    return final_topics


@app.route('/create-category', methods=['POST'])
def create_category():
    data = request.json
    category_name = data.get('name')
    if not category_name:
        return jsonify({"error": "Category name is required"}), 400
    
    category = {
        "name": category_name,
        "created_at": datetime.utcnow()
    }
    category_id = categories_collection.insert_one(category).inserted_id
    return jsonify({"category_id": str(category_id)})

@app.route('/upload/<category_id>', methods=['POST'])
def upload_document(category_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    
    # Extract text from PDF
    extracted_text = extract_text_from_pdf(file)
    
    # # Process text
    # text = re.sub(r"\n+", " ", extracted_text.strip())
    #print({"Cleaned text: ": text})
    chunks = group_related_chunks(extracted_text)
    #print({"Chunks: ": chunks})
    print({"Number of chunks: ": len(chunks)})

    grouped_topics = group_chunks_by_topic(chunks)    
    
    
    # Check if this is the first document
    existing_topics = topics_collection.find_one({"category_id": category_id})
    
    if not existing_topics:
        # First document, save directly
        new_topics = {"category_id": category_id, "topics": grouped_topics, "last_updated": datetime.utcnow()}
        topics_collection.insert_one(new_topics)
    else:
        # Compare with existing topics
        final_topics = assign_topics(grouped_topics, existing_topics)
        topics_collection.update_one({"category_id": category_id}, {"$set": {"topics": final_topics, "last_updated": datetime.utcnow()}})
    
    return jsonify({"message": "Document processed successfully."})

if __name__ == '__main__':
    app.run(debug=True)
