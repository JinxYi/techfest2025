from flask import Flask, request, jsonify, render_template
from transformers import pipeline
from PIL import Image
import io
import torch

app = Flask(__name__)

def load_model():
    # Use a face or deepfake detection model instead of Stable Diffusion
    # This is a model specifically for deepfake detection
    model = pipeline('image-classification', model="prithivMLmods/AI-vs-Deepfake-vs-Real",
                     device=0 if torch.cuda.is_available() else -1)
    return model

deepfake_model = load_model()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    image_file = request.files['image']
    image = Image.open(image_file).convert("RGB")
    
    # Process image through the deepfake detection model
    result = deepfake_model(image)
    
    # Result will be a list of classifications with confidence scores
    # e.g. [{'label': 'REAL', 'score': 0.9856}, {'label': 'FAKE', 'score': 0.0144}]
    
    return jsonify({
        "result": result,
        "message": f"Prediction: {result[0]['label']} with confidence {result[0]['score']:.4f}"
    })

if __name__ == '__main__':
    app.run(debug=True)