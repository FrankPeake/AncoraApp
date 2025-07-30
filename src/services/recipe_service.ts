import { InsertRecipe, UpdateRecipe } from "@/types/recipe_types";

export async function getRecipes() {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/recipes/`)
  if (!response.ok) {
    throw new Error('Failed to fetch recipes')
  }
  return response.json()
}   

export async function getRecipeById(id: string) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/recipes/${id}`)
    if (!response.ok) {
        throw new Error('Failed to fetch recipe')
    }
    return response.json()
}

export async function createRecipe(recipe: InsertRecipe) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/recipes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  })

  if (!response.ok) {
    throw new Error('Failed to create recipe');
  }

  return response.json()
}

export async function updateRecipe(id: string, recipe: UpdateRecipe) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  })

  if (!response.ok) {
    throw new Error('Failed to update recipe');
  }

  return response.json()
}

export async function deleteRecipe(id: string) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/recipes/${id}`, {
        method: 'DELETE',
    })
    if (!response.ok) {
        throw new Error('Failed to delete recipe')
    }
    return
}

export async function getIngredients() {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/ingredients/`)
  if (!response.ok) {
    throw new Error('Failed to fetch ingredients')
  }
  return response.json()
}   

export async function getUOMs() {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/uom/`)
  if (!response.ok) {
    throw new Error('Failed to fetch uoms')
  }
  return response.json()
}   