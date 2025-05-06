import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import RecipeCard from './src/components/RecipeCard';
import { useEffect, useState } from 'react';

export type Recipe = {
  id: string;
  title: string;
};

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]) // State to hold the recipes
  useEffect(() => {
    // Fetch the recipes from the database when the component mounts
    fetchRecipes();
  }, []); // Empty dependency array to run only once on mount
  
  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/v1/recipes') // Adjust the URL as needed
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    }
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={item => item.id} 
        renderItem={({ item }) => (
          <RecipeCard recipe={item} /> // Pass each recipe as `data` to the RecipeCard component
        )}
      />
      {/* Add other components here */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003049',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
