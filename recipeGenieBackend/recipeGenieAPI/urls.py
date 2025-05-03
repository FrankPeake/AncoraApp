from django.urls import path, include

urlpatterns = [
    path('v1/', include('recipeGenieAPI.api.urls')),
    # You might have other non-API related URLs for your app here in the future
]