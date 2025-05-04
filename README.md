# Embryo AI App

## Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Frontend

```bash
cd frontend
npm install
npm start
```

## Notlar
- `best_resnet50_clean.pth` dosyanı `backend/` klasörüne koymalısın.
- React sunucusu 3000, FastAPI 8000 portunda çalışır.
- Gerekirse `class_names` listesini güncelle.
