import numpy as np
from numpy.linalg import norm

def cosine_similarity(a, b):
    """
    Cosine similarity between 2 embedding vectors.
    Output: value between -1 and 1.
    """
    a = np.array(a)
    b = np.array(b)

    return np.dot(a, b) / (norm(a) * norm(b))
