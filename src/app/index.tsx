import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '@/services/recipe_service';
import RecipeListItem from '@/components/recipe_list_item';
import { View, Text, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const {data, isLoading, error} = useQuery({
    queryKey: ['recipes'],
    queryFn: () => getRecipes()
  })
  if (isLoading) {
    return <ActivityIndicator size={"large"} style={{marginTop: '20%'}}/>
  } else {
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

  const recipe = data[0]; // Display the first recipe as an example

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' , marginHorizontal: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FF8C00' }}>Recipes</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecipeListItem recipeItem={item} />}
        showsVerticalScrollIndicator={false}
      />
      <Link href="/create_update_recipe" asChild>
      <Pressable style={{flexDirection: 'row', alignItems: 'center', gap:5, marginTop: 10}}>
        <Entypo name="circle-with-plus" size={24} color="#FF8C00" />
        <Text style={{ color: '#FF8C00', fontSize: 16, fontWeight: '600' }}>Add Recipe</Text>
      </Pressable>
      </Link>
      <Text style={{ marginTop: 20 }}>Total Recipes: {data.length}</Text>
    </SafeAreaView>
  )
}