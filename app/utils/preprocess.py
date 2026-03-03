import cv2
import numpy as np


def preprocess_image(image: np.ndarray) -> np.ndarray:
    """
    Convert a decoded BGR image to a cleaned grayscale image.

    Steps:
        1. BGR → Grayscale
        2. Resize to 224×224
        3. Histogram equalization

    Args:
        image: BGR image array from cv2.imdecode

    Returns:
        Preprocessed grayscale image (224×224, uint8)
    """
    if image is None:
        raise ValueError("Input image is None in preprocess_image")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (224, 224))
    equalized = cv2.equalizeHist(resized)

    return equalized
