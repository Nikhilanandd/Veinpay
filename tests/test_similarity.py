import numpy as np
import pytest
from app.utils.similarity import cosine_similarity


def test_identical_vectors():
    """Identical vectors should have similarity of 1.0."""
    vec = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
    assert abs(cosine_similarity(vec, vec) - 1.0) < 1e-6


def test_orthogonal_vectors():
    """Orthogonal vectors should have similarity of 0.0."""
    a = np.array([1.0, 0.0, 0.0])
    b = np.array([0.0, 1.0, 0.0])
    assert abs(cosine_similarity(a, b)) < 1e-6


def test_opposite_vectors():
    """Opposite vectors should have similarity of -1.0."""
    a = np.array([1.0, 2.0, 3.0])
    b = np.array([-1.0, -2.0, -3.0])
    assert abs(cosine_similarity(a, b) - (-1.0)) < 1e-6


def test_similar_vectors():
    """Similar vectors should have high positive similarity."""
    a = np.array([1.0, 2.0, 3.0, 4.0])
    b = np.array([1.1, 2.1, 3.0, 3.9])
    score = cosine_similarity(a, b)
    assert score > 0.99


def test_different_magnitude():
    """Cosine similarity should be magnitude-invariant."""
    a = np.array([1.0, 2.0, 3.0])
    b = np.array([10.0, 20.0, 30.0])
    assert abs(cosine_similarity(a, b) - 1.0) < 1e-6


def test_return_type():
    """Should return a Python float."""
    a = np.array([1.0, 2.0])
    b = np.array([3.0, 4.0])
    result = cosine_similarity(a, b)
    assert isinstance(result, float)
