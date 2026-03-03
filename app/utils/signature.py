import numpy as np


def compute_skeleton_signature(skeleton_img: np.ndarray) -> float:
    """
    Compute a scalar signature from a skeleton image.

    Returns the fraction of non-zero (white) pixels.
    Used for analytics/debugging only, not core matching.
    """
    if skeleton_img is None:
        return 0.0

    total = float(skeleton_img.size)
    if total == 0:
        return 0.0

    return float(np.count_nonzero(skeleton_img)) / total
