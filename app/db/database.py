import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from app.core.config import settings

logger = logging.getLogger("veinpay")


class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._client = None
            cls._instance._db = None
        return cls._instance

    def connect(self):
        try:
            self._client = MongoClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
            )
            self._client.admin.command("ping")
            self._db = self._client[settings.DATABASE_NAME]

            # Create indexes
            self._db.users.create_index("user_id", unique=True)
            self._db.auth_logs.create_index("timestamp")

            logger.info("Connected to MongoDB successfully")
        except (ConnectionFailure, OperationFailure) as e:
            logger.warning(f"MongoDB connection failed: {e}")
            logger.warning("App will start but database features won't work until MongoDB is available")
            self._client = None
            self._db = None

    def disconnect(self):
        if self._client:
            self._client.close()
            logger.info("Disconnected from MongoDB")

    @property
    def db(self):
        if self._db is None:
            raise ConnectionError("Database not connected. Check MongoDB is running and credentials are correct.")
        return self._db

    @property
    def users(self):
        return self.db.users

    @property
    def auth_logs(self):
        return self.db.auth_logs


db = Database()
