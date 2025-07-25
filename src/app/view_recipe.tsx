import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Pressable, FlatList } from 'react-native';
import { deleteRecipe, getRecipeById } from '@/services/recipe_service';
import { navigate } from 'expo-router/build/global-state/routing';
import { SafeAreaView } from 'react-native-safe-area-context';
import InstructionListItem from '@/components/instruction_list_item';

export default function ViewRecipe() {
    const { id } = useLocalSearchParams<{id: string}>() // Get the recipe ID from the URL if it exists
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [prepTime, setPrepTime] = useState<string>('')
    const [servings, setServings] = useState<string>('')
    const [cookTime, setCookTime] = useState<string>('')

    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id), 
    enabled: !!id, 
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
    } else if (data) {
        console.log(data)
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
  return (
     <>
        <Stack.Screen
          options={{
            title: title,
            headerRight: () => (
              <Text style={{ color: 'gray', fontSize: 16, fontWeight: '600' }} onPress={() => navigate(`/create_update_recipe/?id=${id}`)} >Edit</Text>
            ),
          }}
        />
          <View style ={styles.inputBox}>
            <Text style={{fontSize:16}}>{title}</Text>
            <Text style={{ color: 'gray', fontSize: 10 }}> Prep: {prepTime.toString()} min | Cooktime: {cookTime.toString()} min | Servings: {servings.toString()}</Text>
            <Text>{description}</Text>
            <Text style={{ color: 'dark gray', fontSize: 16 }}>Ingredients:</Text>
            <FlatList
                data={data.ingredients}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Text style={{fontSize:12, color: 'dark gray'}}>{item.name} - {item.quantity} {item.unit}</Text>}
                showsVerticalScrollIndicator={false}
            />
        </View>
        <View style={styles.divider} />
        <SafeAreaView style={{ flex: 1, alignItems: 'center' , marginHorizontal: 20 }}>
            <FlatList
                data={data.instructions}
                renderItem={({ item }) => <InstructionListItem instructionItem={item} />}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
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