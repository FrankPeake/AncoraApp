import { InsertRecipe } from '@/types/recipe_types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, Pressable, FlatList, ScrollView } from 'react-native';
import { createRecipe, deleteRecipe, getRecipeById, updateRecipe } from '@/services/recipe_service';
import IngredientListItem from '@/components/ingredient_list_item';
import EditInstructionListItem from '@/components/edit_instruction_list_item';

export default function CreateUpdateRecipe() {
  const { id } = useLocalSearchParams<{id: string}>() // Get the recipe ID from the URL if it exists
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [prepTime, setPrepTime] = useState<string>('')
  const [servings, setServings] = useState<string>('')
  const [cookTime, setCookTime] = useState<string>('')

  const queryClient = useQueryClient()

  const { mutate: saveRecipe, isPending } = useMutation({
    mutationFn:  () => {
      let recipeData: InsertRecipe = {
        title,
        description,
        user_id: 1, // Assuming a static user_id for now
        prep_time: parseInt(prepTime),
        servings: parseInt(servings),
        cook_time: parseInt(cookTime)
      }
      return createRecipe(recipeData)
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
        cook_time: parseInt(cookTime)
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

  const { data, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id), 
    enabled: !!id, 
  })

  useEffect(() => {
      if (data) {
        setTitle(data.title)
        setDescription(data.description)
        setPrepTime(data.prep_time.toString())
        setServings(data.servings.toString())
        setCookTime(data.cook_time.toString())
      }
    }, [data])

  if (isLoading) {
    return <ActivityIndicator size={"large"} style={{marginTop: '20%'}}/>
  } 

  if (error) {
    return (
      <Text style={{ 
        marginTop: '20%',
        fontWeight: 'bold',
        alignSelf: 'center'
      }}>
        Error: {error.message}
      </Text>
    )
  } 

  const onSavePress = () => {
    if (id) {
      putRecipe()
    } else {
      saveRecipe()
    }
  }

  const isSaveButtonDisabled = () => isPending || !title || !description || !prepTime || !servings || !cookTime;  
  
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
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
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
            placeholder = "Prep Time (min)"
            keyboardType="numeric"
            value={prepTime.toString()}
            onChangeText={(text) => {parseInt(text) ? setPrepTime(text) : setPrepTime('')}}
          />
          <View style ={styles.divider} />
          <TextInput
            placeholder = "Cook Time (min)"
            keyboardType="numeric"
            value={cookTime.toString()}
            onChangeText={(text) => {parseInt(text) ? setCookTime(text) : setCookTime('')}}
          />
          <View style ={styles.divider} />
          <TextInput
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
    {!!id &&
    <View style ={styles.inputBox}>
      <FlatList
            data={data.ingredients}
            renderItem={({ item }) =><IngredientListItem ingredientItem={item} />}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
        />
    </View>
    }
    <Text style={{ color: 'dark gray', fontSize: 16, marginLeft: 15, marginTop: 10 }}>Instructions</Text>
    {!!id &&
    <View style ={styles.inputBox}>
      <FlatList
            data={data.instructions}
            renderItem={({ item }) =><EditInstructionListItem instructionItem={item} />}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
        />
    </View>
    }
    </ScrollView>
    {!!id &&
          <Pressable onPress={()=>delRecipe()} style={styles.inputBox}>
            <Text style={{ color: 'crimson', textAlign: 'center' }}>Delete</Text>
          </Pressable>
    }
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
})
