# VeinPay — Biometric Vein Pattern Authentication System

> ** Prototype / Proof of Concept**
> This is a working prototype demonstrating vein-based biometric authentication using AI/ML.
> It is **not production-deployed** yet but serves as a foundation for building a full-scale
> contactless biometric payment and identity verification platform.

---

##  The Vision

**What if you could pay with just your hand?**

VeinPay explores a future where **vein patterns in your hand replace cards, PINs, and passwords** for secure payments and authentication. Unlike fingerprints or facial recognition:

-  **Vein patterns are internal** — they can't be photographed, copied, or stolen
-  **Contactless** — no touching shared surfaces
-  **Unique to every individual** — even identical twins have different vein patterns
-  **Liveness detection built-in** — veins are only visible with blood flow (can't be faked from a dead hand)

### Future Scope

This prototype lays the groundwork for:

| Feature | Description |
|---------|-------------|
| **Contactless Payments** | Pay at stores by scanning your palm — no wallet, no phone needed |
| **Bank Authentication** | Replace OTPs and PINs with vein-based identity for banking apps |
| **ATM Withdrawals** | Authenticate at ATMs using your hand instead of a card |
| **Secure Access Control** | Office/building entry using vein patterns |
| **Healthcare ID** | Patient identification that can never be lost or forged |
| **Government ID** | Aadhaar/national ID verification with unforgeable biometrics |
| **Multi-factor Auth** | Combine vein scan with other factors for ultra-secure systems |

---

## 🏗️ Architecture

```
React Frontend (Vite + TailwindCSS)
        ↓ (Axios REST API)
FastAPI Backend (Modular)
        ↓
CV + ML Processing Pipeline
        ↓
MongoDB
```

### How It Works

```
User's Hand Image
        ↓
  Preprocessing (Grayscale → Resize → Histogram Equalization)
        ↓
  Vein Enhancement (Gabor Filters → Morphological Skeletonization)
        ↓
  Feature Extraction (MobileNetV2 → 1280-dimensional embedding)
        ↓
  Registration: Store embedding in MongoDB
        or
  Authentication: Cosine similarity matching against stored embeddings
        ↓
  Result: Authenticated ✅ / Rejected ❌ with confidence score
```

---

## ✨ Key Features

- **AI-Powered Vein Recognition** — MobileNetV2 deep learning for feature extraction
- **Advanced CV Pipeline** — Histogram equalization → Gabor filters → Morphological skeletonization
- **React Frontend** — Professional UI with TailwindCSS, image upload/camera capture
- **Analytics Dashboard** — Real-time stats with Recharts (pie charts, bar charts, success rates)
- **FastAPI Backend** — Modular architecture with structured JSON responses
- **MongoDB Storage** — Only embedding vectors stored (never raw images)
- **Docker Ready** — Full docker-compose setup for one-command deployment

---

## 📁 Project Structure

```
VeinPay/
├── app/                          # Backend (FastAPI)
│   ├── main.py                   # Application entry point + lifespan
│   ├── core/
│   │   ├── config.py             # Environment-based settings (pydantic-settings)
│   │   └── logging_config.py     # Structured logging setup
│   ├── routes/
│   │   ├── __init__.py           # Router exports
│   │   ├── auth.py               # POST /register, POST /authenticate
│   │   ├── analytics.py          # GET /analytics
│   │   └── health.py             # GET /health
│   ├── services/
│   │   ├── registration.py       # Registration business logic
│   │   ├── authentication.py     # Authentication + similarity matching
│   │   └── analytics.py          # Analytics aggregation
│   ├── utils/
│   │   ├── preprocess.py         # Image preprocessing pipeline
│   │   ├── extract_vein.py       # Gabor + skeletonization
│   │   ├── mobilenet.py          # MobileNetV2 singleton (lazy-loaded)
│   │   ├── similarity.py         # Cosine similarity (numpy-only)
│   │   └── signature.py          # Skeleton signature extraction
│   └── db/
│       └── database.py           # MongoDB connection + operations
├── frontend/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx               # Router setup
│   │   ├── main.jsx              # Entry point
│   │   ├── index.css             # TailwindCSS imports
│   │   ├── components/           # Navbar, Footer, ImageCapture, etc.
│   │   ├── pages/                # Landing, Register, Authenticate, Analytics
│   │   ├── services/             # Axios API client
│   │   └── hooks/                # Custom React hooks
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── tests/
│   └── test_similarity.py        # Unit tests for cosine similarity
├── pyproject.toml                # Python dependencies (uv)
├── docker-compose.yml            # Full stack orchestration
├── Dockerfile.backend            # Backend container
├── Dockerfile.frontend           # Frontend container (multi-stage + nginx)
├── nginx.conf                    # Nginx config for frontend
├── .env                          # Environment variables (local)
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Python | 3.10+ | `sudo apt install python3` |
| uv | latest | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| Node.js | 18+ | `sudo apt install nodejs npm` |
| MongoDB | 7.0+ | See below |

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/VeinPay.git
cd VeinPay
```

### Step 2: Start MongoDB

**Option A: Using Docker (recommended)**
```bash
docker run -d \
  --name veinpay-mongo \
  -p 27017:27017 \
  -v veinpay_mongo_data:/data/db \
  mongo:7 --noauth
```

**Option B: Local MongoDB**
```bash
sudo systemctl start mongod
```

Verify it's running:
```bash
# Docker
docker exec veinpay-mongo mongosh --eval "db.runCommand({ ping: 1 })"

# Local
mongosh --eval "db.runCommand({ ping: 1 })"
```

### Step 3: Setup Environment

```bash
# Create .env file (edit values as needed)
cat > .env << 'EOF'
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=veinpay
SIMILARITY_THRESHOLD=0.85
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
LOG_LEVEL=INFO
SECRET_KEY=change-me-in-production
APP_VERSION=1.0.0
EOF
```

### Step 4: Install & Run Backend

```bash
# Install Python dependencies
uv sync

# Start the backend
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Verify: `curl http://localhost:8000/health`

### Step 5: Install & Run Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

### Step 6: Open in Browser

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |

---

## 🐳 Docker Deployment

### Run Everything with Docker Compose

```bash
# Build and start all services (MongoDB + Backend + Frontend)
docker-compose up --build

# Run in background
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Stop and remove volumes (deletes database)
docker-compose down -v
```

| Service | URL | Container |
|---------|-----|-----------|
| Frontend | http://localhost:3000 | `veinpay-frontend` |
| Backend API | http://localhost:8000 | `veinpay-backend` |
| Swagger Docs | http://localhost:8000/docs | `veinpay-backend` |
| MongoDB | localhost:27017 | `veinpay-mongo` |

### Build Individual Containers

```bash
# Backend only
docker build -f Dockerfile.backend -t veinpay-backend .
docker run -p 8000:8000 --env-file .env veinpay-backend

# Frontend only
docker build -f Dockerfile.frontend -t veinpay-frontend .
docker run -p 3000:80 veinpay-frontend
```

---

## 📡 API Endpoints

All responses follow a standardized format:
```json
{
  "status": "success" | "error",
  "message": "Description",
  "data": {}
}
```

| Method | Endpoint | Description | Input |
|--------|----------|-------------|-------|
| `GET` | `/health` | Health check | — |
| `POST` | `/register` | Register a user | `user_id` + `image` (multipart) |
| `POST` | `/authenticate` | Authenticate a user | `image` (multipart) |
| `GET` | `/analytics` | System statistics | — |

### POST /register
```bash
curl -X POST http://localhost:8000/register \
  -F "user_id=john_doe" \
  -F "image=@hand_photo.jpg"
```
Response:
```json
{
  "status": "success",
  "message": "User 'john_doe' registered successfully",
  "data": { "user_id": "john_doe" }
}
```

### POST /authenticate
```bash
curl -X POST http://localhost:8000/authenticate \
  -F "image=@hand_photo.jpg"
```
Response:
```json
{
  "status": "success",
  "message": "Authenticated successfully",
  "data": {
    "authenticated": true,
    "similarity_score": 0.9432,
    "matched_user": "john_doe"
  }
}
```

### GET /analytics
```bash
curl http://localhost:8000/analytics
```
Response:
```json
{
  "status": "success",
  "message": "Analytics retrieved successfully",
  "data": {
    "total_users": 5,
    "total_authentications": 23,
    "successful_authentications": 19,
    "failed_authentications": 4,
    "success_rate": 82.61,
    "recent_logs": [...]
  }
}
```

---

## 🧠 ML/CV Pipeline

| Stage | Technique | Details |
|-------|-----------|---------|
| 1. Preprocessing | Grayscale → Resize → CLAHE | Normalizes input to 224×224 |
| 2. Vein Enhancement | Gabor Filters (σ=8, λ=12) | Highlights vein structures |
| 3. Skeletonization | Morphological thinning | Extracts clean vein topology |
| 4. Feature Extraction | MobileNetV2 (ImageNet) | 1280-dimensional embedding vector |
| 5. Matching | Cosine Similarity | Threshold-based (default: 0.85) |

---

## ⚙️ Configuration

Environment variables in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URL` | `mongodb://localhost:27017` | MongoDB connection string |
| `DATABASE_NAME` | `veinpay` | Database name |
| `SIMILARITY_THRESHOLD` | `0.85` | Cosine similarity threshold for auth |
| `CORS_ORIGINS` | `http://localhost:5173,...` | Allowed CORS origins |
| `LOG_LEVEL` | `INFO` | Logging level |
| `SECRET_KEY` | — | Secret key for future JWT auth |
| `APP_VERSION` | `1.0.0` | Displayed in health check |

---

## 🔒 Security

| Feature | Status |
|---------|--------|
| Raw images never stored | ✅ Only embeddings |
| File type validation | ✅ Image MIME types only |
| File size limit | ✅ 10MB max |
| Input sanitization | ✅ Pydantic validation |
| CORS restrictions | ✅ Configured origins |
| Structured error responses | ✅ No stack traces leaked |
| JWT auth for admin routes | 🔜 Planned |
| HTTPS | 🔜 For production deployment |
| Rate limiting | 🔜 Planned |

---

## 🧪 Running Tests

```bash
uv run pytest -v
```

---

## 🛣️ Roadmap

- [x] Core vein pattern recognition pipeline
- [x] User registration and authentication
- [x] React frontend with camera capture
- [x] Analytics dashboard
- [x] Docker deployment
- [ ] NIR (Near-Infrared) camera support for real vein imaging
- [ ] JWT authentication for admin endpoints
- [ ] Payment gateway integration (Razorpay / Stripe)
- [ ] Multi-hand enrollment (left + right)
- [ ] Liveness detection (anti-spoofing)
- [ ] Encryption of stored embeddings
- [ ] Kubernetes deployment config
- [ ] Mobile app (React Native)
- [ ] Hardware integration (dedicated vein scanner)

---

## 🤝 Contributing

This is a prototype/research project. Contributions, ideas, and feedback are welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational and research purposes. See [LICENSE](LICENSE) for details.

---

## 👤 Author

**Nikhil** — Built as a prototype for biometric payment authentication research.

---

> *"The most secure password is the one you don't have to remember — it's already inside you."*



