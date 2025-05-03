from rest_framework import serializers
from ..models import Recipe, RecipeIngredient, RecipeStep, User, Unit

class RecipeSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Recipe
        fields = '__all__'

class RecipeIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeIngredient
        fields = '__all__'

class RecipeStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):  
    class Meta:
        model = User
        fields = '__all__'    

class UnitSerializer(serializers.ModelSerializer):      
    class Meta:
        model = Unit
        fields = '__all__'

