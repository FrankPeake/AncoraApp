from rest_framework import viewsets 
from ..models import Recipe, RecipeIngredient, RecipeStep, User, Unit
from .serializers import RecipeSerializer, RecipeIngredientSerializer, RecipeStepSerializer, UserSerializer, UnitSerializer

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class RecipeIngredientViewSet(viewsets.ModelViewSet):
    queryset = RecipeIngredient.objects.all()
    serializer_class = RecipeIngredientSerializer

class RecipeStepViewSet(viewsets.ModelViewSet):
    queryset = RecipeStep.objects.all()
    serializer_class = RecipeStepSerializer         

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer       

class UnitViewSet(viewsets.ModelViewSet):              
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer       
    