import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ingredient } from "@/types/recipe_types";
import { Link } from "expo-router";

type IngredientListItemProps = {
    ingredientItem: Ingredient
}

export default function IngredientListItem({ ingredientItem }: IngredientListItemProps) {
    const [name, setName] = useState<string>('')
    const [quantity, setQuantity] = useState<string>('')
    const [unit, setUnit] = useState<string>('')

    return (
            <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#f9f9f9',
                    marginBottom: 5,
                    borderColor: 'gray',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: 'grey',
                }}>
                <TextInput style={styles.ingredientInput} value={ingredientItem.name} onChangeText={setName}/>
                <TextInput style={styles.ingredientInput} value={ingredientItem.quantity.toString()} onChangeText={(text) => {parseInt(text) ? setQuantity(text) : setQuantity('')}}/>
                <TextInput style={styles.ingredientInput} value={ingredientItem.unit} onChangeText={setUnit}/>
            </View>
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