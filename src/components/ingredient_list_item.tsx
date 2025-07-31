import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RecipeIngredient, Ingredients, Units } from "@/types/recipe_types";

type IngredientListItemProps = {
    ingredientItem: RecipeIngredient
    ingredients: Ingredients[]
    units: Units[]
    index: number; // Optional index for editing
    onUpdate: (index: number, updatedFields: Partial<RecipeIngredient>) => void;
    onDelete: (index: number) => void;
}

export default function IngredientListItem({ ingredientItem, index, ingredients, units, onDelete, onUpdate }: IngredientListItemProps) {
    const [localIngredientName, setLocalIngredientName] = useState(ingredientItem.name);
    const [localQuantity, setLocalQuantity] = useState(ingredientItem.quantity.toString());
    const [localUnitName, setLocalUnitName] = useState(ingredientItem.unit);
    const [searchSelected, setSearchSelected] = useState<boolean>(false)
    const [listType, setListType] = useState<string>('name')
    const [currentSearchSource, setCurrentSearchSource] = useState<Ingredients[]>(ingredients);



    const recipeIngredientID = ingredientItem.id

    useEffect(() => {
      console.log("Setlocal called")
      setLocalIngredientName(ingredientItem.name);
      setLocalQuantity(ingredientItem.quantity.toString());
      setLocalUnitName(ingredientItem.unit);
    }, [ingredientItem]); // Update local state when prop changes

    useEffect(() => {
      console.log("UE listype called")
      // This runs whenever `listType` changes.
      if (listType === 'name') {
          setCurrentSearchSource(ingredients)
        } else { // listType === 'uom'
          setCurrentSearchSource(units)
        }
    }, [listType])

    const filteredResults = useMemo(() => {
      console.log("filter called")
      const currentInput = listType === 'unit' ? localUnitName : localIngredientName;
      const lowerCaseInput = currentInput ? currentInput.toLowerCase() : '';
      const newSearch = currentSearchSource.filter(item => {
          return item.name.toLowerCase().includes(lowerCaseInput);
      });
      return newSearch
    }, [localIngredientName, localUnitName])

    const handleTextInputBlur = () => {
        setTimeout(() => {
            setSearchSelected(false);
            if (listType === 'name') {
              onUpdate(index, { name: localIngredientName });
            } else {
              onUpdate(index, { unit: localUnitName });
            }
        }, 100);
    }

    const handleOptionPress = (selectedItemName: string, selectedItemId: string, listType: string) => {
      console.log("HOP called")
      const ingredientUpdate: Partial<RecipeIngredient> = {}
      ingredientUpdate.id = recipeIngredientID
      if (listType === 'name') {
        ingredientUpdate.name = selectedItemName
        ingredientUpdate.ingredient_id = selectedItemId
        setLocalIngredientName(selectedItemName)
      } else { // listType === 'unit'
        ingredientUpdate.uom_id = selectedItemId
        ingredientUpdate.unit = selectedItemName  
        setLocalUnitName(selectedItemName)
      }
      ingredientUpdate.quantity = parseFloat(localQuantity)
      onUpdate(index, ingredientUpdate);
      setSearchSelected(false)
      Keyboard.dismiss(); // Dismiss the keyboard when an item is selected
    }

    const handleSearchFocus = (input: string) => {
      console.log("Focus Called")
      setListType(input)
      setSearchSelected(true)
        if (input === 'name') {
        setCurrentSearchSource(ingredients);
      } else { // input === 'uom'
        setCurrentSearchSource(units);
      }  
    }

    return (<>
              <View style={{
                      flexDirection: 'row',
                      backgroundColor: '#f9f9f9',
                      marginBottom: 5,
                      borderColor: 'gray',
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: 'grey',
                  }}>
                  <TextInput 
                    style={[styles.ingredientInput, {minWidth: 50}]}
                    value={localQuantity}
                    onChangeText={(text) => {
                      setLocalQuantity(text)
                      if (text === '' || !isNaN(Number(text))) {
                        onUpdate(index, { quantity: Number(text) || 0 })
                      }
                    }}
                    keyboardType="numeric"
                  />
                  <TextInput 
                    style={[styles.ingredientInput, {minWidth: 80}]}
                    value={localUnitName} 
                    onChangeText={setLocalUnitName} 
                    onFocus={() => handleSearchFocus('unit')} 
                    onBlur={handleTextInputBlur}
                  />
                  <TextInput 
                    style={[styles.ingredientInput, {minWidth: 100}]} 
                    value={localIngredientName} 
                    onChangeText={setLocalIngredientName} 
                    onFocus={() => handleSearchFocus('name')} 
                    onBlur={handleTextInputBlur}
                  />
                  <Pressable onPress={() => onDelete(index)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>X</Text>
                  </Pressable>
              </View>
            { searchSelected &&
              <View style={{ alignItems: 'center', marginLeft: 10} }>
                <FlatList
                  style={{ maxHeight: 150, width: '100%' }}
                  data={filteredResults}
                  keyExtractor={(item) => item.id}
                  initialNumToRender={5}
                  maxToRenderPerBatch={5}
                  windowSize={5}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => <Pressable onPress={() => handleOptionPress(item.name, item.id, listType)}><Text style={styles.searchOptions}>{item.name}</Text></Pressable>}
                  removeClippedSubviews={true}
                />
              </View>
             }
            </>
    )
}

const styles = StyleSheet.create({
  ingredientInput: {
    padding: 5,
    margin: 5,
    borderRadius: 5,
    borderColor: 'lightgray',
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchOptions: {
    backgroundColor: 'white',
    borderColor: 'lightgray', 
    borderBottomWidth: 1,
    borderRadius: 5,
    padding: 5,
    gap: 5,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'crimson',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})