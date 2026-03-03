import cv2
import numpy as np


def extract_vein_pattern(gray_img: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Extract vein pattern features from a grayscale image.

    Pipeline:
        1. Gabor filter for vein enhancement
        2. Adaptive thresholding
        3. Morphological skeletonization

    Args:
        gray_img: Grayscale uint8 image (224×224)

    Returns:
        Tuple of (skeleton_image, gabor_output, thresholded_image)
    """
    if gray_img is None:
        raise ValueError("extract_vein_pattern received None image")

    if len(gray_img.shape) != 2:
        raise ValueError("extract_vein_pattern expects a grayscale (2D) image")

    # 1. Gabor filter
    g_kernel = cv2.getGaborKernel(
        ksize=(21, 21),
        sigma=8.0,
        theta=0,
        lambd=12,
        gamma=0.5,
        psi=0,
        ktype=cv2.CV_32F,
    )
    gabor = cv2.filter2D(gray_img, cv2.CV_32F, g_kernel)
    gabor_norm = cv2.normalize(gabor, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    # 2. Adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        gabor_norm,
        255,
        cv2.ADAPTIVE_THRESH_MEAN_C,
        cv2.THRESH_BINARY_INV,
        21,
        9,
    )

    # 3. Skeletonization
    skeleton = np.zeros(thresh.shape, np.uint8)
    element = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
    temp = thresh.copy()

    while True:
        eroded = cv2.erode(temp, element)
        temp2 = cv2.dilate(eroded, element)
        temp2 = cv2.subtract(temp, temp2)
        skeleton = cv2.bitwise_or(skeleton, temp2)
        temp = eroded.copy()
        if cv2.countNonZero(temp) == 0:
            break

    return skeleton, gabor_norm, thresh
