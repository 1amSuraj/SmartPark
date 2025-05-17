from flask import Flask, jsonify
import cv2
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  

TOKEN = os.getenv("PLATE_RECOGNIZER_TOKEN")
API_URL = "https://api.platerecognizer.com/v1/plate-reader/"

@app.route('/plate', methods=['GET'])
def detect_plate():
    cap = cv2.VideoCapture(0)
    
    # Capture a frame from the webcam
    ret, frame = cap.read()
    cap.release()

    if not ret:
        return jsonify({"error": "Failed to capture image"}), 500
    
    # Save the captured image
    image_path = "capture.jpg"
    cv2.imwrite(image_path, frame)

    # Send the image to Plate Recognizer API for analysis
    with open(image_path, 'rb') as img:
        response = requests.post(
            API_URL,
            files={"upload": img},
            headers={"Authorization": f"Token {TOKEN}"}
        )

    data = response.json()

    if data.get("results"):
        plate = data["results"][0]["plate"].upper()
        return jsonify({"plate": plate})  # Return the plate number as JSON
    else:
        return jsonify({"plate": None, "message": "No plate detected"}), 400


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Running on port 5001
