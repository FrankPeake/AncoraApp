from django.db import models

# Create your models here.
class Recipe(models.Model):
    title = models.CharField(max_length=255)
    user_id = models.IntegerField()
    prep_time = models.IntegerField()  # in minutes
    cook_time = models.IntegerField()  # in minutes
    servings = models.IntegerField()

    def __str__(self):
        return self.title
    

class RecipeIngredient(models.Model):
    recipe_id = models.ForeignKey(Recipe, related_name='ingredients', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    quantity = models.FloatField()
    unit_id = models.ForeignKey('unit', related_name='ingredients', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.name}"

class RecipeStep(models.Model):
    recipe_id = models.ForeignKey(Recipe, related_name='steps', on_delete=models.CASCADE)
    step_number = models.IntegerField()
    instruction = models.TextField()

    def __str__(self):
        return f"Step {self.step_number}: {self.instruction}"
    
class Unit(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)  # hashed password
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username        