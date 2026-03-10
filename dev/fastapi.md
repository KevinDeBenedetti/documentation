# FastAPI

*Building high-performance APIs with Python and FastAPI.*

## Overview

[FastAPI](https://fastapi.tiangolo.com/) is a modern, fast Python web framework for building APIs with automatic OpenAPI documentation.

## Key Features

- **Fast**: Very high performance, on par with NodeJS and Go
- **Type-safe**: Leverages Python type hints for validation
- **Auto docs**: Swagger UI and ReDoc out of the box
- **Async**: Full support for `async`/`await`

## Quick Start

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

## Pydantic Models

Use Pydantic for request/response validation:

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.post("/items/")
async def create_item(item: Item):
    return item
```

## Dependency Injection

FastAPI has a powerful dependency injection system:

```python
from fastapi import Depends

async def get_db():
    db = Database()
    try:
        yield db
    finally:
        await db.close()

@app.get("/users/")
async def get_users(db: Database = Depends(get_db)):
    return await db.fetch_all("SELECT * FROM users")
```

## Project Structure

```
app/
├── main.py          # FastAPI application
├── models/          # Pydantic models
├── routes/          # API route handlers
├── services/        # Business logic
├── repositories/    # Data access
└── core/
    ├── config.py    # Settings
    └── security.py  # Auth utilities
```

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic V2](https://docs.pydantic.dev/latest/)
- [SQLAlchemy + FastAPI](https://fastapi.tiangolo.com/tutorial/sql-databases/)
