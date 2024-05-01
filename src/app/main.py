"""
At the command line, only need to run once to install the package via pip:

$ pip install google-generativeai
"""

from pathlib import Path
import hashlib
import google.generativeai as genai
from flask import Flask, request, jsonify
from datetime import datetime
import base64
import redis
## Setup Flask Server
app = Flask(__name__)

genai.configure(api_key="AIzaSyCRZnZ2Qy9U1gZPtTRucPpsZutlN3S4uO4")

# Set up the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 0,
  "max_output_tokens": 8192,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]

model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

uploaded_files = []

def upload_if_needed(base64String) -> str:
  # Get current date and time
  curr_datetime = datetime.now()

  bytes_data = base64.b64decode(base64String)

  path = Path("/audio" + curr_datetime.strftime("%Y-%m-%d %H:%M:%S") + ".mp3")
  hash_id = hashlib.sha256(bytes_data).hexdigest()
  try:
    existing_file = genai.get_file(name=hash_id)
    return [existing_file.uri]
  except:
    pass
  uploaded_files.append(genai.upload_file(path=path, display_name=hash_id))
  return [uploaded_files[-1].uri]

# convo.send_message("YOUR_USER_INPUT")
# print(convo.last.text)
# for uploaded_file in uploaded_files:
#   genai.delete_file(name=uploaded_file.name)

# @app.route("/")
# def home():
#     return "Home"

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

@app.route("/get-user/<user_id>")
def get_user(user_id):
    user_data = {
        "user_id": user_id,
        "name": "John Doe",
        "email": "john.doe@example.com"
    }

    extra = request.args.get("extra")
    if extra:
        user_data["extra"] = extra

    return jsonify(user_data), 200

@app.route("/create-user", methods=["POST"])
def create_user():
    data = request.get_json()

    return jsonify(data), 201

@app.route("/get-transcription", methods=["POST"])
def get_transcription():
    #payLoadData = request.get_json()

    # blob_file = request.files['blob']
    blob_file = request.get_json()

    uploaded_uri = upload_if_needed(blob_file["base64String"])

    convo = model.start_chat(history=[
        {
            "role": "user",
            "parts": uploaded_uri # upload_if_needed("<path>/audio0.mp3")
        },
        {
            "role": "user",
            "parts": ["\n\nTranscribe what is in this audio or media file. Ensure you correct any grammatical ensure. Go"]
        },
    ])

    # convo.send_message("YOUR_USER_INPUT")
    
    response_text = convo.last.text
    return jsonify({"transcription": response_text}), 201

    # for uploaded_file in uploaded_files:
    #   genai.delete_file(name=uploaded_file.name)

@app.route('/set-value', methods=['POST'])
def set_value():
    data = request.get_json()
    key = data.get('key')
    value = data.get('value')
    redis_client.set(key, value)
    return jsonify({'message': 'Value set successfully'})

@app.route('/get-value', methods=['GET'])
def get_value():
    # Get all keys from Redis
    keys = redis_client.keys('*')

    object_list = []
    for key in keys:
        value = redis_client.get(key)
        object_dict = {
            "user": key.decode('utf-8'),
            "response": value.decode('utf-8') if value else None
        }
        object_list.append(object_dict)

    return jsonify(object_list)

if __name__  == "__main__":
    app.run(debug=True)