import { Ingredients, InsertRecipe, Recipe, RecipeIngredient, RecipeInstruction, Units } from '@/types/recipe_types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, Pressable, FlatList, ScrollView } from 'react-native';
import { createRecipe, deleteRecipe, getIngredients, getRecipeById, getUOMs, updateRecipe } from '@/services/recipe_service';
import IngredientListItem from '@/components/ingredient_list_item';
import EditInstructionListItem from '@/components/edit_instruction_list_item';

export default function CreateUpdateRecipe() {
  const { id } = useLocalSearchParams<{id: string}>() // Get the recipe ID from the URL if it exists

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [prepTime, setPrepTime] = useState<string>('')
  const [servings, setServings] = useState<string>('')
  const [cookTime, setCookTime] = useState<string>('')

  const [ingredientsState, setIngredientsState] = useState<RecipeIngredient[]>([]);
  const [instructionsState, setInstructionsState] = useState<RecipeInstruction[]>([]);

  const queryClient = useQueryClient()

  // --- Fetching Data ---

  const { data: recipeData, isLoading: isRecipeLoading, error: recipeError } = useQuery<Recipe, Error>({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id), 
    enabled: !!id, 
  })
  const {data: ingredients, isLoading:ingLoading, error: ingError} = useQuery({
      queryKey: ['ingredients'],
      queryFn: () => getIngredients()
  })
  const {data: units, isLoading:uomLoading, error: uomError} = useQuery({
      queryKey: ['uoms'],
      queryFn: () => getUOMs()
  })

  // --- Mutations ---

  const { mutate: saveRecipe, isPending } = useMutation({
    mutationFn:  () => {
      let recipeData: InsertRecipe = {
        title,
        description,
        user_id: 1, // Assuming a static user_id for now
        prep_time: parseInt(prepTime),
        servings: parseInt(servings),
        cook_time: parseInt(cookTime),
        ingredients: ingredientsState,
        instructions: instructionsState
      }
      console.log("Recipe Data to be saved:", recipeData);
      return createRecipe(recipeData)
      // return createRecipe(recipeData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      router.back()
    },
    onError: (error) => {
      Alert.alert('Error', `Failed to create recipe: ${error.message}`);
    }
  })

  const {mutate: putRecipe} = useMutation({
    mutationFn: () => {
      const newRecipe = {
        title,
        description,
        prep_time: parseInt(prepTime),
        servings: parseInt(servings),
        cook_time: parseInt(cookTime),
        ingredients: ingredientsState,
        instructions: instructionsState
      }
      return updateRecipe(id as string, newRecipe)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      router.back()
    },
    onError: (error) => {
      Alert.alert('Error', `Failed to update recipe: ${error.message}`);
    }
  })

  const {mutate: delRecipe} = useMutation({
    mutationFn: () => deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      router.back()
    },
    onError: (error) => {
      Alert.alert('Error', `Failed to delete recipe: ${error.message}`);
    }
  })

  // --- Initialization/UseEffect ---
  useEffect(() => {
      if (recipeData) {
        setTitle(recipeData.title)
        setDescription(recipeData.description)
        setPrepTime(recipeData.prep_time.toString())
        setServings(recipeData.servings.toString())
        setCookTime(recipeData.cook_time.toString())
        setIngredientsState([...(recipeData.ingredients ?? [{ name: '', quantity: '0', unit: '', ingredient_id: 1, uom_id: 1 }])]);
        setInstructionsState([...(recipeData.instructions ?? [{ step_number: 1, instruction: ''}])]);
        }else if (!id) { // If it's a new recipe (no ID)
          // Initialize with one empty ingredient/instruction for convenience
          setIngredientsState([{  name: '', quantity: '0', unit: '', ingredient_id: 1, uom_id: 1 }]);
          setInstructionsState([{ step_number: 1, instruction: ''}]);
        }
    }, [recipeData, id])

// --- Handlers for UI events ---

  const handleUpdateIngredient = useCallback((index: number, updatedFields: Partial<RecipeIngredient>) => {
    setIngredientsState(prev => {
      const newIngredients = [...prev];
      newIngredients[index] = { ...newIngredients[index], ...updatedFields };
      return newIngredients;
    });
  }, []);

  const handleUpdateInstruction = useCallback((index: number, updatedFields: Partial<RecipeInstruction>) => {
    setInstructionsState(prev => {
      console.log("inst callback")
      const newInstructions = [...prev];
      newInstructions[index] = { ...newInstructions[index], ...updatedFields };
      console.log("newInstructions", newInstructions)
      return newInstructions;
    });
  }, []);

  const handleAddIngredient = useCallback(() => {
    setIngredientsState(prev => [...prev, { ingredient_id: 1, uom_id: 1, name: '', quantity: '0', unit: '' }]);
  }, []);

  const handleAddInstruction = useCallback(() => {
    setInstructionsState(prev => [...prev, {instruction: '', step_number: prev.length + 1 }]);
  }, []);


  const handleDeleteIngredient = useCallback((index: number) => {
    setIngredientsState(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleDeleteInstruction = useCallback((index: number) => {
    setInstructionsState(prev => prev.filter((_, i) => i !== index)); 
  }, []);

  // --- Error Handling ---

 // Combine all loading states
  const totalIsLoading = isRecipeLoading || ingLoading || uomLoading;
  // Combine all error states
  const totalError = recipeError || ingError || uomError;

  if (totalIsLoading) {
    return <ActivityIndicator size={"large"} style={{ marginTop: '20%' }} />;
  }

  if (totalError) {
    return (
      <Text style={{
        marginTop: '20%',
        fontWeight: 'bold',
        alignSelf: 'center'
      }}>
        Error: {totalError.message}
      </Text>
    );
  }

  // Ensure master lists are available (they should be due to loading checks above)
  // If no ingredients/units are fetched, provide empty arrays to avoid errors
  const availableIngredients = ingredients || [];
  const availableUnits = units || [];
  
  // --- Save Logic ---
  const onSavePress = () => {
    if (id) {
      putRecipe()
    } else {
      saveRecipe()
    }
  }

    const isSaveButtonDisabled = () =>
    !title ||
    !description ||
    !prepTime ||
    !servings ||
    !cookTime

  return (
    <>
    <Stack.Screen
      options={{
        title: 'Create or Update Recipe',
        headerRight: () => (
          <Text disabled = {isSaveButtonDisabled()} style={{ color: 'gray', fontSize: 16, fontWeight: '600' }} onPress={() => onSavePress()} >Save</Text>
        ),
      }}
    />
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} keyboardShouldPersistTaps="handled">
      <View style ={styles.inputBox}>
        <TextInput
          multiline
          placeholder = "Recipe Title"
          value={title}
          onChangeText={setTitle}
        />
        <View style ={styles.divider} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            style={{ minWidth: "30%" }}
            placeholder = "Prep Time (min)"
            keyboardType="numeric"
            value={prepTime.toString()}
            onChangeText={(text) => {parseInt(text) ? setPrepTime(text) : setPrepTime('')}}
          />
          <View style ={styles.divider} />
          <TextInput
            style={{ minWidth: "30%" }}
            placeholder = "Cook Time (min)"
            keyboardType="numeric"
            value={cookTime.toString()}
            onChangeText={(text) => {parseInt(text) ? setCookTime(text) : setCookTime('')}}
          />
          <View style ={styles.divider} />
          <TextInput
            style={{ minWidth: "30%" }}
            placeholder = "Servings"
            keyboardType="numeric"
            value={servings.toString()}
            onChangeText={(text) => {parseInt(text) ? setServings(text) : setServings('')}}
          />
        </View>
        <View style ={styles.divider} />
        <TextInput
          multiline
          placeholder = "Description"
          value={description}
          onChangeText={setDescription}
        />
    </View>
    <Text style={{ color: 'dark gray', fontSize: 16, marginLeft: 15, marginTop: 10 }}>Ingredients</Text>
    <View style ={styles.inputBox}>
      <FlatList
          data={ingredientsState ?? []}
          keyExtractor={(item) => item.ingredient_id.toString()}
          renderItem={({ item, index }) =>
          <IngredientListItem 
            ingredientItem={item}
            index={index}
            ingredients={availableIngredients} 
            units={units}
            onUpdate={handleUpdateIngredient}
            onDelete={handleDeleteIngredient}
          />}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
      />
      <Pressable onPress={handleAddIngredient} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Ingredient</Text>
      </Pressable>
    </View>
    <Text style={{ color: 'dark gray', fontSize: 16, marginLeft: 15, marginTop: 10 }}>Instructions</Text>
    <View style ={styles.inputBox}>
      <FlatList
            data={instructionsState ?? []}
            keyExtractor={(item) => item.step_number.toString()}
            renderItem={({ item, index }) =>
            <EditInstructionListItem 
              instructionItem={item} 
              index={index}
              onUpdate={handleUpdateInstruction} 
              onDelete={handleDeleteInstruction} 
            />}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
        />
      <Pressable onPress={handleAddInstruction} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Instruction</Text>
      </Pressable>
    </View>
    {!!id &&
          <Pressable onPress={()=>delRecipe()} style={styles.inputBox}>
            <Text style={{ color: 'crimson', textAlign: 'center' }}>Delete</Text>
          </Pressable>
    }
    </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  divider: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
  },
  inputBox: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 20,
    gap: 10,
  },
  addButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'darkblue',
    fontWeight: 'bold',
  },
})
