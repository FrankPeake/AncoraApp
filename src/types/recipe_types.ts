export type Recipe = {
    id: string;
    title: string;
    description: string;
    cook_time: number;
    created_at: string;
    updated_at: string;
    prep_time: number;
    servings: number;
    user_id: number;
    ingredients?: RecipeIngredient[]; 
    instructions?: RecipeInstruction[];
};

export type InsertRecipe = {
    title: string;
    description: string;
    cook_time: number;
    prep_time: number;
    servings: number;
    user_id: number; // Assuming user_id is required for creating a recipe
    ingredients?: RecipeIngredient[]; 
    instructions?: RecipeInstruction[];
};

export type UpdateRecipe = {
    title: string;
    description: string;
    cook_time: number;
    prep_time: number;
    servings: number;
    ingredients?: RecipeIngredient[]; 
    instructions?: RecipeInstruction[];
};

export type RecipeIngredient = {
    ingredient_id: number;
    name: string;
    quantity: string;
    unit: string;
    uom_id: number;
};

export type RecipeInstruction = {
    step_number: number;
    instruction: string;
};

export type Ingredients = {
    id: string;
    name: string;
}

export type Units = {
    id: string;
    name: string;
};