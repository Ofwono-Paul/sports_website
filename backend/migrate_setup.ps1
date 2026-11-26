Copy-Item -LiteralPath ".env.example" -Destination ".env" -Force
& "venv/Scripts/python.exe" manage.py makemigrations accounts products orders
