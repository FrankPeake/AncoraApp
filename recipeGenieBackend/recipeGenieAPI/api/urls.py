from rest_framework import routers
from .views import RecipeViewSet, RecipeIngredientViewSet, RecipeStepViewSet, UserViewSet, UnitViewSet  
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'recipe_ingredients', RecipeIngredientViewSet)
router.register(r'recipe_steps', RecipeStepViewSet)
router.register(r'users', UserViewSet)
router.register(r'units', UnitViewSet)

urlpatterns = [
    path('', include(router.urls)),
]       
