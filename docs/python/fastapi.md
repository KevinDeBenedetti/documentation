# FastAPI

*Building high-performance APIs with Python and FastAPI.*

## Overview

[FastAPI](https://fastapi.tiangolo.com/) is a modern, fast Python web framework for building APIs with automatic OpenAPI documentation.

## Key Features

- **Fast**: Very high performance, on par with NodeJS and Go
- **Type-safe**: Leverages Python type hints for validation
- **Auto docs**: Swagger UI and ReDoc out of the box
- **Async**: Full support for `async`/`await`

## Prerequisites

```shell
# Create a development environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install FastAPI and Uvicorn
pip install "fastapi[all]"

# Deactivate the virtual environment
deactivate
```

## Quick Start

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

```shell
# Start the server
uvicorn main:app --reload
```

Access the auto-generated docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Routes and HTTP Methods

### Basic Routes

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/items")
async def get_items():
    return {"items": ["item1", "item2"]}

@app.post("/items")
async def create_item(name: str):
    return {"name": name, "id": 1}

@app.put("/items/{item_id}")
async def update_item(item_id: int, name: str):
    return {"id": item_id, "name": name}

@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    return {"message": f"Item {item_id} deleted"}
```

### Path Parameters

```python
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}

@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(user_id: int, item_id: str):
    return {"user_id": user_id, "item_id": item_id}
```

### Query Parameters

```python
@app.get("/items")
async def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

# Optional parameters
@app.get("/items/{item_id}")
async def read_item(item_id: str, q: str | None = None):
    if q:
        return {"item_id": item_id, "q": q}
    return {"item_id": item_id}
```

## Pydantic Models

Use Pydantic for request/response validation:

```python
# models.py
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

class Item(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(None, max_length=500)
    price: float = Field(..., gt=0)
    tax: float | None = None
    tags: list[str] = []

class User(BaseModel):
    username: str
    email: EmailStr
    full_name: str | None = None
    disabled: bool = False

    class Config:
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "john@example.com",
                "full_name": "John Doe"
            }
        }
```

```python
# main.py
@app.post("/items")
async def create_item(item: Item):
    item_dict = item.model_dump()
    if item.tax:
        item_dict.update({"price_with_tax": item.price + item.tax})
    return item_dict
```

## Error Handling

```python
# main.py
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

app = FastAPI()

items_db = {"foo": {"name": "Foo", "price": 50.2}}

@app.get("/items/{item_id}")
async def read_item(item_id: str):
    if item_id not in items_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return items_db[item_id]

# Custom validation error handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()}
    )
```

## Dependency Injection

FastAPI has a powerful dependency injection system:

```python
# dependencies.py
from fastapi import Header, HTTPException

async def verify_token(x_token: str = Header()):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="Invalid token")

async def verify_key(x_key: str = Header()):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="Invalid key")
    return x_key
```

```python
# main.py
from fastapi import FastAPI, Depends
from dependencies import verify_token, verify_key

app = FastAPI()

@app.get("/items", dependencies=[Depends(verify_token)])
async def read_items():
    return [{"item": "Foo"}, {"item": "Bar"}]

@app.get("/users")
async def read_users(key: str = Depends(verify_key)):
    return [{"username": "Rick"}, {"username": "Morty"}]
```

## Database

### SQLAlchemy Setup

```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Models and Usage

```python
# models.py
from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
```

```python
# main.py
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

app = FastAPI()

@app.post("/users")
def create_user(username: str, email: str, db: Session = Depends(get_db)):
    db_user = models.User(username=username, email=email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.id == user_id).first()
```

## Middleware

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware
@app.middleware("http")
async def add_process_time_header(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

## Testing

```python
# test_main.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_create_item():
    response = client.post(
        "/items",
        json={"name": "Test", "price": 10.5}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test"
```

```shell
# Install pytest and run tests
pip install pytest
pytest
```

## Dependency Management

```shell
# Generate requirements.txt
pip freeze > requirements.txt

# Install from requirements.txt
pip install -r requirements.txt
```

```text
# requirements.txt
fastapi[all]==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0
sqlalchemy==2.0.25
pytest==7.4.4
```

## Deployment

### Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/dbname
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=dbname
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Production with Gunicorn

```shell
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Project Structure

```
app/
├── main.py          # FastAPI application
├── models/          # Pydantic and SQLAlchemy models
├── routes/          # API route handlers
├── services/        # Business logic
├── repositories/    # Data access
└── core/
    ├── config.py    # Settings
    └── security.py  # Auth utilities
```

## Best Practices

- Use Pydantic models for validation
- Version the API (`/api/v1/...`)
- Implement consistent error handling with `HTTPException`
- Use dependencies for reusable logic
- Write tests for every endpoint
- Configure CORS properly
- Use environment variables for configuration
- Use async endpoints for I/O-bound operations

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic V2](https://docs.pydantic.dev/latest/)
- [SQLAlchemy + FastAPI](https://fastapi.tiangolo.com/tutorial/sql-databases/)
- [Awesome FastAPI](https://github.com/mjhea0/awesome-fastapi)
