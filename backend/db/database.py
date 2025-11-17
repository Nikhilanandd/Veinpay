import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

# ----------------------------------------
# Load environment variables from .env
# ----------------------------------------
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception(
        "MONGO_URI is not set. Please add it to your .env file."
    )

# ----------------------------------------
# Connect to MongoDB Atlas
# ----------------------------------------
try:
    client = MongoClient(MONGO_URI)
    db = client["veinpay_db"]     
    users_collection = db["users"]
    print("[MongoDB Atlas] Connected successfully!")

except ConnectionFailure as e:
    print("[MongoDB Atlas] Connection failed:", e)
    raise e


# ----------------------------------------
# Save / Update User Signature
# ----------------------------------------
def save_user_signature(user_id: str, signature: str):
    users_collection.update_one(
        {"user_id": user_id},
        {"$set": {"signature": signature}},
        upsert=True
    )
    print(f"[MongoDB] Signature stored for user: {user_id}")


# ----------------------------------------
# Get User Signature
# ----------------------------------------
def get_user_signature(user_id: str):
    user = users_collection.find_one({"user_id": user_id})
    if user:
        return user.get("signature")
    print(f"[MongoDB] No signature found for user: {user_id}")
    return None
