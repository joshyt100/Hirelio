FROM python:3.12-slim

# Prevent Python from writing pyc files & buffering
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install Postgres client libs
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && pip install -r requirements.txt

# Copy Django app
COPY . /app/

# Expose port internally
EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "cover_backend.wsgi:application"]

