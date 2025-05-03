from django.contrib import admin
from .models import Recipe, RecipeIngredient, RecipeStep, User, Unit

# Register your models here.
admin.site.register(Recipe)
admin.site.register(RecipeIngredient)
admin.site.register(RecipeStep)
admin.site.register(User)
admin.site.register(Unit)