copy .env.example .env >nul 2>&1
python manage.py makemigrations accounts products orders
