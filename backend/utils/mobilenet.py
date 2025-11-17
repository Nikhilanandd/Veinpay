import numpy as np
import cv2
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.models import Model

# Load MobileNetV2 once globally
base_model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")
model = Model(inputs=base_model.input, outputs=base_model.output)

def mobilenet_embedding(img):
    """
    Convert a skeleton or grayscale image into a MobileNetV2 feature embedding.
    Output: 1280-dimensional vector.
    """

    # Convert to RGB for MobileNet
    img_rgb = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)

    # Resize for MobileNet input
    resized = cv2.resize(img_rgb, (224, 224))

    # Expand dims and preprocess
    x = np.expand_dims(resized, axis=0)
    x = preprocess_input(x)

    # Get feature vector
    embedding = model.predict(x)[0]

    return embedding  # numpy array (1280,)
