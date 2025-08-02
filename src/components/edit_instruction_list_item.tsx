import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { RecipeInstruction } from "@/types/recipe_types";
import { Link } from "expo-router";

type InstructionListItemProps = {
    index: number; // Optional index for editing
    instructionItem: RecipeInstruction
    onUpdate: (index: number, updatedFields: Partial<RecipeInstruction>) => void;
    onDelete: (index: number) => void;
}


export default function EditInstructionListItem({ instructionItem, index, onUpdate, onDelete }: InstructionListItemProps) {
    const [localInstruction, setLocalInstruction] = useState<string>(instructionItem.instruction); 

    useEffect(() => {
        console.log(localInstruction)
        onUpdate(index, { instruction: localInstruction })
    }, [localInstruction]);

    return (
            <TouchableOpacity 
                style={{ 
                    padding: 20, 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: 10, 
                    marginBottom: 10,
                    borderColor: 'gray',
                    borderWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: 'grey',
                    paddingBottom: 10,
                }}
            >
                <View style={{ gap: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{fontSize: 12, fontWeight: "bold"}}>{instructionItem.step_number}</Text>
                    <TextInput 
                        style={{fontSize: 12, color: "dark gray", width: '95%'}}
                        multiline
                        placeholder = "Description"
                        value={localInstruction}
                        onChangeText={setLocalInstruction}
                    />
                    <Pressable onPress={() => onDelete(index)} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>X</Text>
                    </Pressable>
                </View>
            </TouchableOpacity>
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
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: 'crimson',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
})