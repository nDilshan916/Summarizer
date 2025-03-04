from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import json, re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from PyPDF2 import PdfReader
from collections import defaultdict
from bson import ObjectId


app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient("mongodb+srv://ai_project:12345@cluster0.g9oh7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['AI_Project']
topics_collection = db['minutes']

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
    Cleans text by removing section numbers, extra line breaks, and page footers.
    """
    # Remove section numbers (e.g., "21.46" or "21.46.1")
    text = re.sub(r"^\d+(\.\d+)*\s*", "", text, flags=re.MULTILINE)
    
    # Remove common footer patterns
    text = re.sub(r"Page\s+\d+\s+of\s+\d+", "", text, flags=re.IGNORECASE)  # Remove "Page X of Y"
    text = re.sub(r"Approved at the .* Executive Board,.*", "", text, flags=re.IGNORECASE)  # Remove approval footers
    text = re.sub(r"WAYAMBA UNIV ERSITY .* OF SRI LANKA,.*", "", text, flags=re.IGNORECASE)  # Remove "Minutes of..." footers

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
    Ensures the topic name is not repeated in the content.
    Returns a list of dictionaries, each with 'topic', 'content', and 'id' keys.
    """
    EXCLUDED_TOPICS = [
        "MINUTES OF THE PREVIOUS MEETING AND MATTERS ARISING",
        "DATES OF FUTURE MEETINGS"
    ]

    topics = []
    current_topic = None
    current_content = []

    for chunk in chunks:
        match = re.match(r"^(\d+\.\d+)\s+(.*)", chunk)
        if match:
            if current_topic:
                cleaned_content = clean_text(" ".join(current_content).strip())
                cleaned_content = cleaned_content.replace(current_topic, "", 1).strip()

                if current_topic not in EXCLUDED_TOPICS:
                    topics.append({
                        "id": str(ObjectId()),  # Generate unique ID
                        "topic": current_topic,
                        "content": cleaned_content
                    })

            current_topic = clean_text(match.group(2).strip())
            current_content = []

        current_content.append(chunk.strip())

    if current_topic and current_topic not in EXCLUDED_TOPICS:
        cleaned_content = clean_text(" ".join(current_content).strip())
        cleaned_content = cleaned_content.replace(current_topic, "", 1).strip()
        topics.append({
            "id": str(ObjectId()),  # Generate unique ID
            "topic": current_topic,
            "content": cleaned_content
        })

    return topics

def calculate_similarity(a, b):
    """
    Calculates similarity between two strings using cosine similarity on SBERT embeddings.
    """
    embedding_a = model.encode([a])
    embedding_b = model.encode([b])
    return float(cosine_similarity(embedding_a, embedding_b)[0][0])

def assign_topics(new_topics, existing_data):
    """
    Assigns new topics to the existing topics based on similarity and logs the max similarity score for each new topic.
    """
    existing_topics = existing_data["documents"]
    final_topics = existing_topics.copy()
    # Calculate the next document number dynamically
    max_document_number = max(
        (
            doc["document_number"]
            for topic in existing_topics
            for doc in topic["contents"]
        ),
        default=0,
    )
    document_number = max_document_number + 1  # Increment the document number
    threshold = 0.7  # Similarity threshold

    for new_topic_data in new_topics:
        new_topic = new_topic_data["topic"]
        new_content = new_topic_data["content"]
        max_similarity = 0
        assigned_topic = None

        for existing_topic in final_topics:
            similarity = calculate_similarity(new_topic, existing_topic["topic"])
            if similarity > max_similarity:
                max_similarity = similarity
                assigned_topic = existing_topic

        # Print the maximum similarity score for the current new topic
        if assigned_topic:
            print(f"Max similarity for new topic '{new_topic}': {max_similarity:.4f} "
                  f"with previous topic '{assigned_topic['topic']}'")

        if max_similarity >= threshold:
            # Ensure content is a list
            if not isinstance(assigned_topic["contents"], list):
                assigned_topic["contents"] = []
            assigned_topic["contents"].append({
                "document_number": document_number,
                "date": datetime.utcnow().strftime("%Y-%m-%d"),
                "content": new_content
            })
        else:
            # Add as a new topic
            final_topics.append({
                "id": str(ObjectId()),  # Generate a unique ID
                "topic": new_topic,
                "contents": [
                    {
                        "document_number": document_number,
                        "date": datetime.utcnow().strftime("%Y-%m-%d"),
                        "content": new_content
                    }
                ]
            })
        for topic in final_topics:
            if "id" not in topic:
                topic["id"] = str(ObjectId())
    
    return final_topics




@app.route('/upload', methods=['POST'])
def upload_document():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']

    # Extract text from PDF
    extracted_text = extract_text_from_pdf(file)
    chunks = group_related_chunks(extracted_text)
    grouped_topics = group_chunks_by_topic(chunks)

    # Check if topics collection already has data
    topics_data = topics_collection.find_one()

    if not topics_data:
        # First document upload
        new_topics = []
        for idx, topic_data in enumerate(grouped_topics, start=1):
            new_topics.append({
                "topic": topic_data["topic"],
                "contents": [
                    {
                        "document_number": 1,
                        "date": datetime.utcnow().strftime("%Y-%m-%d"),
                        "content": topic_data["content"]
                    }
                ]
            })
        topics_collection.insert_one({"documents": new_topics, "last_updated": datetime.utcnow()})
    else:
        # Append to existing topics
        updated_topics = assign_topics(grouped_topics, topics_data)
        topics_collection.update_one(
        {},
        {"$set": {"documents": updated_topics, "last_updated": datetime.utcnow()}}
    )


    return jsonify({"message": "Document processed successfully."})

@app.route('/get_topics', methods=['GET'])
def get_topics():
    try:
        # Fetch topics from the MongoDB collection
        topics_data = topics_collection.find_one({}, {"_id": 0})  # Exclude MongoDB's `_id` field
        if not topics_data:
            return jsonify({"message": "No topics found"}), 404
        
        return jsonify(topics_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/rename_topic', methods=['POST'])
def rename_topic():
    data = request.json
    topic_id = data.get('id')
    new_name = data.get('new_name')

    if not topic_id or not new_name:
        return jsonify({"error": "Missing topic ID or new name"}), 400

    result = topics_collection.update_one(
        {"documents.id": topic_id},
        {"$set": {"documents.$.topic": new_name}}
    )

    if result.matched_count:
        return jsonify({"message": "Topic renamed successfully"})
    return jsonify({"error": "Topic not found"}), 404

@app.route('/delete_topic', methods=['DELETE'])
def delete_topic():
    data = request.json
    topic_id = data.get('id')
    
    print(f"Received topic_id: {topic_id}")

    if not topic_id:
        return jsonify({"error": "Missing topic ID"}), 400

    result = topics_collection.update_one(
        {},
        {"$pull": {"documents": {"id": topic_id}}}
    )

    if result.modified_count:
        return jsonify({"message": "Topic deleted successfully"})
    return jsonify({"error": "Topic not found"}), 404
from transformers import pipeline

# Load summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.route('/generate_summary', methods=['POST'])
def generate_summary():
    try:
        data = request.json
        topic_id = data.get('id')

        if not topic_id:
            return jsonify({"error": "Missing topic ID"}), 400

        # Fetch the topic content from the database
        topic_data = topics_collection.find_one({"documents.id": topic_id}, {"documents.$": 1})
        if not topic_data or not topic_data.get("documents"):
            return jsonify({"error": "Topic not found"}), 404

        topic = topic_data["documents"][0]
        topic_name = topic["topic"]
        contents = topic["contents"]

        summaries = []
        for content in contents:
            summary = summarizer(content["content"], max_length=150, min_length=50, do_sample=False)
            summaries.append({
                "date": content["date"],
                "summary": summary[0]["summary_text"]
            })

        # Save to summarize collection with topic_id
        db['summarize'].update_one(
            {"_id": ObjectId(topic_id)},  # Use topic_id as the primary identifier
            {
                "$set": {
                    "topic_name": topic_name,
                    "summaries": summaries
                }
            },
            upsert=True  # Create the document if it does not exist
        )

        return jsonify({"message": "Summaries generated successfully", "topic": topic_name, "summaries": summaries})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@app.route('/get_summary/<topic_id>', methods=['GET'])
def get_summary(topic_id):
    try:
        # Query the summarize collection using the topic_id
        summary_data = db['summarize'].find_one({"_id": ObjectId(topic_id)})
        
        if not summary_data:
            return jsonify({"message": "No summary found for the given topic ID"}), 404

        # Extract the topic name and summaries
        topic_name = summary_data.get("topic_name", "Unknown Topic")
        summaries = summary_data.get("summaries", [])

        return jsonify({
            "topic_name": topic_name,
            "summaries": summaries
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)