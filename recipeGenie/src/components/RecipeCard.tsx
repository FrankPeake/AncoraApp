import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, KeyboardAvoidingView,TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import Autocomplete from 'react-native-autocomplete-input';


type Ingredient = {
    quantity: Float;
    uom: string;
    name: string;
  };

  const unitsOfMeasure = [
    { id: '1', title: 'cup' },
    { id: '2', title: 'L' },
    { id: '3', title: 'g' },
    { id: '4', title: 'kg' },
    { id: '5', title: 'tbps' },
    { id: '6', title: 'tsp' },
    { id: '7', title: 'oz' },
    { id: '8', title: 'lb' },
    { id: '9', title: 'ml' },
    { id: '10', title: 'qt' },
    { id: '11', title: 'pt' },
  ];

export default function RecipeCard() {
  
  const [recipeName, setRecipeName] = useState('ie. Pumpkin Pie'); // Explicitly type the recipe name
  const [ingredients, setIngredients] = useState<Ingredient[]>([]); // Explicitly type the ingredients array
  const [steps, setSteps] = useState<string[]>([]); // Explicitly type the steps array
  const [ingredientInput, setIngredientInput] = useState<Ingredient>({ quantity: 0, uom: '', name: '' });
  const [stepInput, setStepInput] = useState('');
  const [filteredUoM, setFilteredUoM]  = useState(unitsOfMeasure);
  const [hideUoMList, setHideUoMList] = useState(true); // Toggle UoM dropdown visibility
  const [recipe_table, setRecipes] = useState<any[]>([]);
  const [ingredients_table, setRecipes] = useState<any[]>([]);
  const [recipe_ingredients_table, setRecipes] = useState<any[]>([]);





  // const [filteredUoM, setFilteredUoM] = useState(unitsOfMeasure); // Filtered UoM options
  // const [showUoMList, setShowUoMList] = useState(false); // Toggle UoM dropdown visibility


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

  const handleUoMChange = (text: string) => {
    setIngredientInput({ ...ingredientInput, uom: text });
    setFilteredUoM(unitsOfMeasure.filter((uom) => uom.title.toLowerCase().includes(text.toLowerCase())));
    setHideUoMList(false);
  };

  const selectUoM = (uom: string) => {
    setIngredientInput({ ...ingredientInput, uom });
    setHideUoMList(true);
  };

  const saveRecipe = () => {
    if (!recipeName.trim() || ingredients.length === 0 || steps.length === 0) {
      console.log('Please complete the recipe before saving.');
      return;
    }
    const newRecipe = {
      name: recipeName,
      recipe_id: Math.random().toString(36).substring(2, 15), // Generate a random recipe ID
      steps,
    };
    setRecipes([...recipes, newRecipe]); 
    console.log('Recipe saved:', newRecipe);
    setRecipeName(''); // Clear the recipe name input
    setIngredients([]); // Clear the ingredients array
    setSteps([]); // Clear the steps array
    console.log('Recipes:', recipes); // Log the saved recipes
  }
    
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
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
                style={[styles.input, { maxWidth: 60 }]}
                placeholder="Qty"
                value={ingredientInput.quantity ? ingredientInput.quantity.toString() : ''}
                onChangeText={(text) => setIngredientInput({ ...ingredientInput, quantity: parseFloat(text) })}
                onFocus={() => scrollToSection(200)}
              />
              <Autocomplete
                  data={filteredUoM}
                  defaultValue={ingredientInput.uom}
                  onChangeText={handleUoMChange}
                  hideResults={hideUoMList}
                  flatListProps={{
                    keyExtractor: (_, idx) => idx.toString(),
                    renderItem: ({ item }) => (
                      <TouchableOpacity onPress={() => selectUoM(item.title)}>
                        <Text style={styles.autocompleteItem}>{item.title}</Text>
                      </TouchableOpacity>
                    ),
                  }}
                  containerStyle={styles.autocompleteContainer}
                  inputContainerStyle={styles.autocompleteInputContainer}
                  style={styles.input} // Explicitly set text color and background
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
            {ingredients.map((item, index) => (
              <Text key={index}>{`${item.quantity} ${item.uom} ${item.name}`}</Text>
            ))}

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
            {steps.map((item, index) => (
              <Text key={index}>{`${index + 1}. ${item}`}</Text>
            ))}
              <Button title="Save" onPress={saveRecipe} />
          </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    
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
    backgroundColor: '#fdf0d5',
    minHeight: 40,
  },
  autocompleteContainer: {
    backgroundColor: '#fdf0d5',

  },
  autocompleteInputContainer: {
    borderWidth: 0,
    minWidth: 60,
    minHeight: 40,
  },
  autocompleteItem: {
    borderBottomColor: '#black',
    padding: 5,    
    borderWidth: 0.2,
    borderColor: 'gray',
  },
});