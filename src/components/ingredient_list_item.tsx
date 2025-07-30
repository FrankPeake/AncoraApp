import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ingredient } from "@/types/recipe_types";
import { Link } from "expo-router";

type IngredientListItemProps = {
    ingredientItem: Ingredient
    ingredientArray: string[]
    uomArray: string[]
}

export default function IngredientListItem({ ingredientItem, ingredientArray, uomArray }: IngredientListItemProps) {
    const [ingredient, setIngredient] = useState<string>(ingredientItem.name)
    const [quantity, setQuantity] = useState<string>('')
    const [unit, setUnit] = useState<string>(ingredientItem.unit)
    const [searchSelected, setSearchSelected] = useState<boolean>(false)
    const [searchResults, setSearchResults] = useState<string[]>([])
    const [listType, setListType] = useState<string>('ingredient')

    const handleIngredientSearch = (input: string, text: string) => {
        if (text.length > 0) {
          const results = listType === 'ingredient' ? ingredientArray.filter(item => item.toLowerCase().includes(text.toLowerCase())) : uomArray.filter(item => item.toLowerCase().includes(text.toLowerCase()));
          setSearchResults(results)
        } else {
          listType === 'ingredient' ? setSearchResults(ingredientArray) : setSearchResults(uomArray)
        }
        listType === 'ingredient' ? setIngredient(text) : setUnit(text)
    };

    const handleIngredientPress = (text: string) => {
      listType === 'ingredient' ? setIngredient(text) : setUnit(text)
      setSearchSelected(false)
    }

    const handleSearchSelected = (input: string) => {
      setListType(input)
      setSearchSelected(true)
    }

    useEffect(() => {
      // This runs whenever `listType` changes.
      if (listType === 'ingredient') {
        setSearchResults(ingredientArray);
      } else {
        setSearchResults(uomArray);
      }
    }, [listType]);


    return (<>
              <View style={{
                      flexDirection: 'row',
                      backgroundColor: '#f9f9f9',
                      marginBottom: 5,
                      borderColor: 'gray',
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: 'grey',
                  }}>
                  <TextInput style={styles.ingredientInput} value={ingredient} onChangeText={(text) => handleIngredientSearch('ingredient', text)} onPress={() => handleSearchSelected('ingredient')}/>
                  <TextInput style={styles.ingredientInput} value={ingredientItem.quantity.toString()} onChangeText={(text) => {parseInt(text) ? setQuantity(text) : setQuantity('')}}/>
                  <TextInput style={styles.ingredientInput} value={unit} onChangeText={(text) => handleIngredientSearch('uom', text)} onPress={() => handleSearchSelected('uom')}/>
              </View>
              { searchSelected &&
              <View style={{ alignItems: 'center', marginLeft: 10 }}>
                <FlatList
                  style={{ maxHeight: 100, width: '90%' }}
                  data={searchResults}
                  initialNumToRender={5}
                  maxToRenderPerBatch={5}
                  windowSize={5}
                  updateCellsBatchingPeriod={5}
                  onEndReachedThreshold={.7}
                  renderItem={({ item }) => <Pressable onPress={() => handleIngredientPress(item)}><Text style={{ color: 'blue', marginRight: 10 }}>{item}</Text></Pressable>}
                  removeClippedSubviews={true}
                />
              </View>
             }
            </>
    )
}

const styles = StyleSheet.create({
  ingredientInput: {
    padding: 2,
    margin: 2,
    borderRadius: 5,
    borderColor: 'lightgray',
    borderWidth: StyleSheet.hairlineWidth,
  },
})