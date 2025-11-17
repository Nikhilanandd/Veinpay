from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2

from backend.utils.preprocess import preprocess_image
from backend.utils.extract_vein import extract_vein_pattern
from backend.utils.mobilenet import mobilenet_embedding
from backend.utils.signature import cosine_similarity
from backend.db.database import save_user_embedding, get_user_embedding

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
async def ping():
    return {"status": "Backend running"}

# ----------------------------
# Register User
# ----------------------------
@app.post("/register")
async def register(user_id: str, file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    pre_img = preprocess_image(img)
    skeleton, gabor_img, thresh_img = extract_vein_pattern(pre_img)

    # Extract MobileNet embedding
    embedding = mobilenet_embedding(skeleton)
    embedding_list = embedding.tolist()

    # Save in DB
    save_user_embedding(user_id, embedding_list)

    return {
        "status": "Registered",
        "user_id": user_id,
        "embedding_size": len(embedding_list)
    }

# ----------------------------
# Match User
# ----------------------------
@app.post("/match")
async def match(user_id: str, file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    pre_img = preprocess_image(img)
    skeleton, gabor_img, thresh_img = extract_vein_pattern(pre_img)

    new_emb = mobilenet_embedding(skeleton)

    stored_emb = get_user_embedding(user_id)

    if stored_emb is None:
        return {"match": False, "error": "User not found"}

    stored_emb = np.array(stored_emb, dtype=np.float32)

    score = cosine_similarity(new_emb, stored_emb)

    # Fix numpy serialization issue
    match_bool = bool(float(score) > 0.90)

    return {
        "user_id": user_id,
        "score": float(score),
        "match": match_bool
    }
