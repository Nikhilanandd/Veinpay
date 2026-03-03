import numpy as np


def cosine_similarity(embedding1: list | np.ndarray, embedding2: list | np.ndarray) -> float:
    """Compute cosine similarity between two embedding vectors."""
    a = np.array(embedding1, dtype=np.float64).flatten()
    b = np.array(embedding2, dtype=np.float64).flatten()

    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return float(np.dot(a, b) / (norm_a * norm_b))
