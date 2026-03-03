import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from app.core.logging import logger


class EmbeddingModel:
    """Singleton wrapper for MobileNetV2 feature extraction (lazy-loaded)."""

    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def _load_model(self):
        """Lazy-load MobileNetV2 on first use."""
        if self._model is None:
            logger.info("Loading MobileNetV2 model...")
            self._model = MobileNetV2(
                weights="imagenet",
                include_top=False,
                pooling="avg",
                input_shape=(224, 224, 3),
            )
            logger.info("MobileNetV2 loaded successfully")

    def get_embedding(self, gray_img: np.ndarray) -> np.ndarray:
        """
        Convert a grayscale vein image to a MobileNetV2 embedding vector.

        Args:
            gray_img: Grayscale uint8 image (224×224)

        Returns:
            1D float32 embedding vector (1280 dimensions)
        """
        self._load_model()

        # Expand grayscale → RGB by stacking
        img_rgb = np.stack([gray_img, gray_img, gray_img], axis=-1)
        img_rgb = img_rgb.astype(np.float32)
        img_rgb = np.expand_dims(img_rgb, axis=0)
        img_rgb = preprocess_input(img_rgb)

        embedding = self._model.predict(img_rgb, verbose=0)
        return embedding.flatten()


# Module-level singleton
embedding_model = EmbeddingModel()


def get_embedding(gray_img: np.ndarray) -> np.ndarray:
    """Convenience function to get embedding from grayscale image."""
    return embedding_model.get_embedding(gray_img)
