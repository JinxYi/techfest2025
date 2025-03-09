import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.layers import (
    Conv2D, BatchNormalization, MaxPooling2D, Flatten,
    Dropout, Dense, LeakyReLU, Input
)
from tensorflow.keras.optimizers import Adam

image_dimensions = {'height': 256, 'width': 256, 'channels': 3}

class Classifier:
    def __init__(self):
        self.model = None  # Use None instead of 0

    def predict(self, x):
        return self.model.predict(x)

    def fit(self, x, y):
        return self.model.train_on_batch(x, y)

    def get_accuracy(self, x, y):
        return self.model.test_on_batch(x, y)

    def load(self, path):
        self.model.load_weights(path)

class Meso4(Classifier):
    def __init__(self, learning_rate=0.001):
        super().__init__()  # Initialize parent class
        self.model = self.init_model()
        optimizer = Adam(learning_rate=learning_rate)
        self.model.compile(
            optimizer=optimizer,
            loss='binary_crossentropy',  # Use binary cross-entropy for deepfake detection
            metrics=['accuracy']
        )

    def init_model(self):
        x = Input(shape=(256, 256, 3))

        x1 = Conv2D(8, (3, 3), padding='same', activation='relu')(x)
        x1 = BatchNormalization()(x1)
        x1 = MaxPooling2D(pool_size=(2, 2), padding='same')(x1)

        x2 = Conv2D(8, (5, 5), padding='same', activation='relu')(x1)
        x2 = BatchNormalization()(x2)
        x2 = MaxPooling2D(pool_size=(2, 2), padding='same')(x2)

        x3 = Conv2D(16, (5, 5), padding='same', activation='relu')(x2)
        x3 = BatchNormalization()(x3)
        x3 = MaxPooling2D(pool_size=(2, 2), padding='same')(x3)

        x4 = Conv2D(16, (5, 5), padding='same', activation='relu')(x3)
        x4 = BatchNormalization()(x4)
        x4 = MaxPooling2D(pool_size=(4, 4), padding='same')(x4)

        y = Flatten()(x4)
        y = Dropout(0.5)(y)
        y = Dense(16)(y)
        y = LeakyReLU(alpha=0.1)(y)
        y = Dropout(0.5)(y)
        y = Dense(1, activation='sigmoid')(y)

        return Model(inputs=x, outputs=y)

# Instantiate a MesoNet model with pretrained weights
meso = Meso4()
meso.load('./Meso4_DF.h5')

def extract_frames(video_path, frame_rate=10):
    """
    Extracts frames from the video at a given frame rate.

    :param video_path: Path to the input video file
    :param frame_rate: Number of frames to extract per second
    :return: List of frames
    """
    cap = cv2.VideoCapture(video_path)
    frames = []
    frame_count = 0
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        # Extract frames at the specified rate
        if frame_count % (fps // frame_rate) == 0:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # Convert to RGB
            frame = cv2.resize(frame, (256, 256))  # Resize to MesoNet's expected input size
            frame = frame / 255.0  # Normalize to range [0, 1] to match ImageDataGenerator rescaling
            frames.append(frame)
        frame_count += 1

    cap.release()
    return np.array(frames)

def predict_deepfake(video_path):
    """
    Predicts deepfake likelihood for a video by analyzing multiple frames.

    :param video_path: Path to the input video file
    :return: Average deepfake probability score
    """
    predictions = meso.predict(frames)
    return predictions