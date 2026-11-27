from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response


def home(request):
    return JsonResponse({
        "message": "Welcome to Sports Marketplace API",
        "status": "running"
    })


@api_view(["GET"])
def health_check(request):
    return Response({
        "message": "Sports Marketplace API is running",
        "status": "success"
    })