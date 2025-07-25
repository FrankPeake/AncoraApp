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
};

export type InsertRecipe = {
    title: string;
    description: string;
    cook_time: number;
    prep_time: number;
    servings: number;
    user_id: number; // Assuming user_id is required for creating a recipe
};

export type UpdateRecipe = {
    title: string;
    description: string;
    cook_time: number;
    prep_time: number;
    servings: number;
};

export type Ingredient = {
    id: string;
    recipe_id: string;
    name: string;
    quantity: number;
    unit: string;
};

export type Instruction = {
    step_number: number;
    instruction: string;
};