import cv2
import requests
import os
from dotenv import load_dotenv


load_dotenv()
TOKEN = os.getenv("PLATE_RECOGNIZER_TOKEN")
API_URL = "https://api.platerecognizer.com/v1/plate-reader/"

# Initialize camera
cap = cv2.VideoCapture(0)

print("Press 's' to scan plate, 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame.")
        break

    cv2.imshow("Plate Scanner", frame)
    key = cv2.waitKey(1)

    if key == ord('s'):
        image_path = "capture.jpg"
        cv2.imwrite(image_path, frame)
        print("[INFO] Image captured. Sending to API...")

        with open(image_path, 'rb') as img:
            response = requests.post(
                API_URL,
                files={"upload": img},
                headers={"Authorization": f"Token {TOKEN}"}
            )
        data = response.json()
        
        if data.get("results"):
            plate = data["results"][0]["plate"]
            stored_plate = plate
            print(f"[SUCCESS] Plate Detected: {plate.upper()}")
        else:
            print("[WARNING] No plate found.")

    elif key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
