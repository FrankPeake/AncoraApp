from django.shortcuts import render

from django.http import JsonResponse

def hello(request):
    return JsonResponse({'message': 'Hello from Django!'})

# This code creates a new view that returns a JSON response with the message “Hello from Django!”.