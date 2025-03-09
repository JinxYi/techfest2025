from fastapi import FastAPI, UploadFile, File
import uvicorn
import tempfile
from model import predict_deepfake
from model import extract_frames
from starlette.middleware.cors import CORSMiddleware
import numpy as np  
from fastapi.responses import JSONResponse

app = FastAPI()

# Add CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow any frontend to access the API
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.post("/detect-deepfake/")
async def detect_deepfake(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
        temp_video.write(await file.read())
        temp_path = temp_video.name
    frames = extract_frames(temp_path)  # Use temp_path to extract frames

    predictions = predict_deepfake(frames)
    average_score = np.mean(predictions)
    average_score = float(average_score)
    average_score = round(average_score * 100, 4)
    
    response = JSONResponse(content={"deepfake_probability": average_score})
    # Explicitly setting the Access-Control-Allow-Origin header
    response.headers["Access-Control-Allow-Origin"] = "*"
    
    return response

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
