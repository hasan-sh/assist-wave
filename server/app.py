from flask import Flask, request, jsonify
from flask_cors import CORS

from groq import Groq
from pymongo import MongoClient
from bson import ObjectId

import os
import json

from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the LLM
model = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

# Set up MongoDB client
mongo_client = MongoClient(os.environ.get("MONGO_URI"))
db = mongo_client.get_database("hospital_assistant")  # Use the desired database name
results_collection = db.results  # Use the desired collection name

@app.route('/api/voice', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']

    # Save the audio file temporarily
    audio_path = os.path.join('uploads', audio_file.filename)
    audio_file.save(audio_path)
    
    
    # Perform transcription using Groq
    transcription = model.audio.transcriptions.create(
      file=(audio_file.filename, audio_file),  # Required audio file
      model="whisper-large-v3-turbo",  # Required model to use for transcription
      prompt="Specify context or spelling",
      response_format="json",
      language="en",
      temperature=0.0,
    )

    # Perform chat completion to get care instructions
    chat_completion = model.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are medical assistant at hospitals. Based on patient's needs/input, create a summary and a short list of actions for the nurse/doctor. \
                    Results in JSON; {summary, actions}.\
                    In both summary and list, surround important words by *",
            },
            {
                "role": "user",
                "content": transcription.text,
            }
        ],
        model="llama3-70b-8192",
        response_format={"type": "json_object"},
    )

    care_instructions = json.loads(chat_completion.choices[0].message.content)

    # Structure the data to save in MongoDB
    now = datetime.now()
    utc_now = now.astimezone(timezone.utc)
    timestamp = utc_now.isoformat()
    data_to_save = {
        "transcription": transcription.text,
        "care_instructions": care_instructions,
        "timestamp": timestamp,
        "created_at": datetime.now(timezone.utc),
    }

    # Insert the data into MongoDB
    results_collection.insert_one(data_to_save)

    # Return the transcription and care instructions as JSON response
    return jsonify({
        'transcription': transcription.text,
        'care_instructions': care_instructions
    })


@app.route('/api/recordings', methods=['GET'])
def get_all_recordings():
    # Find all recordings 
    recordings = list(results_collection.find().sort('created_at', -1))  # Convert cursor to a list
    for recording in recordings:
        recording['_id'] = str(recording['_id'])  # Convert ObjectId to string for JSON serialization
    return jsonify(recordings)


@app.route('/api/update_status', methods=['PUT'])
def update_patient_status():
    try:
        resolved = request.json.get('resolved')
        _id = request.json.get('_id')
        if resolved is None:
            return jsonify({"error": "Resolved status is required"}), 400

        result = results_collection.find_one({"_id": ObjectId(_id)})
        if not result:
            return jsonify({"error": "Recording not found"}), 404

        # Update the 'resolved' field
        to_update = {"resolved": resolved, "resolved_at": datetime.now()}
        results_collection.update_one(
            {"_id": ObjectId(_id)},
            {"$set": to_update}
        )
        return jsonify({"message": "Status updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)  # Create uploads directory if it doesn't exist
    app.run(port=5000)  # Run with HTTPS locally