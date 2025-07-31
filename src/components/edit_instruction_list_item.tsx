import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { RecipeInstruction } from "@/types/recipe_types";
import { Link } from "expo-router";

type InstructionListItemProps = {
    index: number; // Optional index for editing
    instructionItem: RecipeInstruction
    onUpdate: (index: number, updatedFields: Partial<RecipeInstruction>) => void;
    onDelete: (index: number) => void;
}

export default function EditInstructionListItem({ instructionItem, index }: InstructionListItemProps) {
    const [instruction, setInstruction] = useState<string>(instructionItem.instruction); 
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
                        style={{fontSize: 12, color: "dark gray"}}
                        multiline
                        placeholder = "Description"
                        value={instruction}
                        onChangeText={setInstruction}
                    />
                </View>
            </TouchableOpacity>
      )
}