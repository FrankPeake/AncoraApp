import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RecipeCard from './src/components/RecipeCard';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello BINCH!</Text>
      <View style={{flex: 1}}>
        <RecipeCard />
      </View>
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
