from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import joblib
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
from ultralytics import YOLO
from collections import Counter
from io import BytesIO
import os

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Constants
RF_MODEL_PATH = "random_forest_car_damage_model.joblib"
ANN_MODEL_PATH = "ann_model.h5"
IMG_SIZE = (64, 64)  # Update to match your ANN model input size
CLASSES = ['Damaged', 'No Damaged']
YOLO_MODEL_PATH = "best.pt"

# Load the pretrained models
try:
    ann_model = load_model(ANN_MODEL_PATH)  # Load your custom ANN model
    rf_model = joblib.load(RF_MODEL_PATH)  # Load the Random Forest model
    yolo_model = YOLO(YOLO_MODEL_PATH)  # Load the YOLO model
except Exception as e:
    raise RuntimeError(f"Error loading models: {str(e)}")
@app.route('/predictedImage', methods=['GET'])
def predicted_image():
    try:
        # Locate the latest YOLO prediction folder
        yolo_output_dir = "runs/detect/"
        latest_dir = sorted([os.path.join(yolo_output_dir, d) for d in os.listdir(yolo_output_dir)], key=os.path.getmtime, reverse=True)[0]
        
        # Get the list of files in the latest directory and find the image file
        files = os.listdir(latest_dir)
        image_files = [f for f in files if f.endswith(('.jpg', '.jpeg', '.png'))]  # Consider image extensions
        if not image_files:
            return jsonify({"error": "No image file found in the prediction folder"}), 404

        predicted_image_path = os.path.join(latest_dir, image_files[0])  # Get the first image file

        if not os.path.exists(predicted_image_path):
            return jsonify({"error": "Predicted image not found"}), 404

        # Send the image file
        return send_file(predicted_image_path, mimetype='image/jpeg')
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    

    
@app.route('/predict', methods=['POST'])
def predict():
    # Ensure file is present in the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    # Ensure a file is selected
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Convert the file to a BytesIO object and open it as an image
        img = Image.open(BytesIO(file.read()))
        print(f"Received image with mode: {img.mode}")
        img2 = img

        # Convert RGBA to RGB if needed
        if img.mode != "RGB":
            img = img.convert("RGB")
        print(f"Image converted to mode: {img.mode}")

        # -----------------------------------
        # ANN Model Feature Extraction
        # -----------------------------------
        # Resize and preprocess the image for ANN model
        ann_img = img.resize(IMG_SIZE)
        img_array = img_to_array(ann_img)
        print(f"ANN image size: {ann_img.size}")
        img_array = preprocess_input(img_array)  # Normalize pixel values
        img_array = img_array.flatten()  # Flatten to 1D array
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

        # ANN prediction
        ann_prediction = ann_model.predict(img_array)
        ann_predicted_label = CLASSES[int(ann_prediction[0] > 0.5)]  # Threshold at 0.5
        print(f"ANN predicted label: {ann_predicted_label}")

        # -----------------------------------
        # Random Forest Model Feature Extraction
        # -----------------------------------
        def extract_features(image):
            """Extract features for RandomForest."""
            from skimage.feature import hog
            from skimage.color import rgb2gray
            from skimage.filters import sobel
            import numpy as np

            # Convert to grayscale
            gray_image = rgb2gray(image)

            # HOG features
            hog_features, _ = hog(
                gray_image, 
                orientations=5, 
                pixels_per_cell=(8, 8), 
                cells_per_block=(2, 2), 
                visualize=True, 
                block_norm="L2-Hys"
            )

            # Sobel edge features
            edges = sobel(gray_image)
            edge_features = edges.ravel()

            # Color histogram features
            color_hist = np.histogram(image.ravel(), bins=32, range=(0, 1))[0]

            # Combine all features
            combined_features = np.hstack([hog_features, edge_features, color_hist])
            return combined_features

        # Resize and normalize the image
        img_resized = np.resize(np.array(img), IMG_SIZE + (3,)) / 255.0
        print(f"Resized image shape for RF: {img_resized.shape}")
        rf_features = extract_features(img_resized).reshape(1, -1)  # Reshape for model
        print(f"RF features shape: {rf_features.shape}")

        # Random Forest prediction
        rf_prediction = rf_model.predict(rf_features)
        rf_predicted_label = CLASSES[int(rf_prediction[0])]
        print(f"Random Forest predicted label: {rf_predicted_label}")

        # -----------------------------------
        # YOLO Model Prediction
        # -----------------------------------
        # Perform YOLO prediction using the original image
        yolo_predictions = yolo_model.predict(source=img2, save=True, save_txt=True, project='runs/detect', name='predictions')
        print(f"YOLO predictions: {yolo_predictions}")

        # Analyze YOLO predictions
        class_counts = Counter()
        for result in yolo_predictions:
            class_ids = result.boxes.cls.cpu().numpy()  # Convert tensor to numpy array
            for class_id in class_ids:
                class_name = yolo_model.names[int(class_id)]  # Map class index to name
                class_counts[class_name] += 1

        # Return predictions as JSON response
        response = {
            "random_forest_label": rf_predicted_label,
        }
        
        print(yolo_predictions[0].save_dir)
        # Include YOLO class counts only if the car is labeled as "Damaged" by Random Forest
        if rf_predicted_label == "Damaged":
            response["yolo_class_counts"] = dict(class_counts)
            response["image_path"] = str(yolo_predictions[0].save_dir)  # Include saved image path

        return jsonify(response)

    except ValueError as ve:
        return jsonify({"error": f"Value error: {str(ve)}"}), 500
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# Start Flask app
if __name__ == '__main__':
    app.run(debug=True)
