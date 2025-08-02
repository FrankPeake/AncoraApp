import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '@/services/recipe_service';
import RecipeListItem from '@/components/recipe_list_item';
import { View, Text, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import { Link } from 'expo-router';

export default function HomeScreen() {
  
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' , marginHorizontal: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FF8C00' }}>Home</Text>
      <Link href="/my_recipes" asChild>
      <Pressable style={{flexDirection: 'row', alignItems: 'center', gap:5, marginTop: 10}}>
        <Text style={{ color: '#FF8C00', fontSize: 16, fontWeight: '600' }}>View My Recipes</Text>
      </Pressable>
      </Link>
    </SafeAreaView>
  )
}