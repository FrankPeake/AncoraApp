import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

type Ingredient = {
    quantity: Float;
    uom: string;
    name: string;
  };

export default function RecipeCard() {
  
    const [recipeName, setRecipeName] = useState('ie. Pumpkin Pie'); // Explicitly type the recipe name
    const [ingredients, setIngredients] = useState<Ingredient[]>([]); // Explicitly type the ingredients array
    const [steps, setSteps] = useState<string[]>([]); // Explicitly type the steps array
    const [ingredientInput, setIngredientInput] = useState<Ingredient>({ quantity: 0, uom: '', name: '' });
    const [stepInput, setStepInput] = useState('');

    const scrollViewRef = useRef<ScrollView>(null); // Ref for the ScrollView

    const scrollToSection = (yPosition: number) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: yPosition, animated: true });
      }
    };
  const addIngredient = () => {
    if (ingredientInput.quantity && ingredientInput.uom && ingredientInput.name) {
      setIngredients([...ingredients, ingredientInput]);
      setIngredientInput({ quantity: 0, uom: '', name: '' });
    }
  };

  const addStep = () => {
    if (stepInput) {
      setSteps([...steps, stepInput]);
      setStepInput('');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>{recipeName}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter recipe name"
              value={recipeName}
              onChangeText={setRecipeName}
              onFocus={() => scrollToSection(200)}
            />
            </View>
          {/* Ingredients Section */}
          <Text style={styles.subHeader}>Ingredients</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={ingredientInput.quantity ? ingredientInput.quantity.toString() : ''}
              onChangeText={(text) => setIngredientInput({ ...ingredientInput, quantity: parseFloat(text) })}
              onFocus={() => scrollToSection(200)}
            />
            <TextInput
              style={styles.input}
              placeholder="Unit of Measure"
              value={ingredientInput.uom}
              onChangeText={(text) => setIngredientInput({ ...ingredientInput, uom: text })}
              onFocus={() => scrollToSection(200)}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={ingredientInput.name}
              onChangeText={(text) => setIngredientInput({ ...ingredientInput, name: text })}
              onFocus={() => scrollToSection(200)}
            />
            <Button title="Add" onPress={addIngredient} />
          </View>
          <FlatList
            data={ingredients}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text>{`${item.quantity} ${item.uom} ${item.name}`}</Text>
            )}
          />

          {/* Steps Section */}
          <Text style={styles.subHeader}>Steps</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add a step"
              value={stepInput}
              onChangeText={setStepInput}
              onFocus={() => scrollToSection(200)}
            />
            <Button title="Add" onPress={addStep} />
          </View>
          <FlatList
            data={steps}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => <Text>{`${index + 1}. ${item}`}</Text>}
          />
            <Button title="Save" onPress={() => console.log('Recipe saved!')} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

    
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    marginTop: 50,
    padding: 30,
    backgroundColor: '#fdf0d5',
    minWidth: 350,
    maxWidth: 400, 
    height: '80%',
    borderRadius: 25, },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 5,
    borderRadius: 5,
  },
});