import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Instruction } from "@/types/recipe_types";
import { Link } from "expo-router";

type InstructionListItemProps = {
    instructionItem: Instruction
}

export default function InstructionListItem({ instructionItem }: InstructionListItemProps) {
    const [isCompleted, setIsCompleted] = useState<boolean>(false)
    return (
            <TouchableOpacity 
                onPress={()=> setIsCompleted(currentState => !currentState)}
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
                {isCompleted
                    ? <MaterialCommunityIcons name="circle-slice-8" size={22} color="#FF8C00" style={{ alignSelf: 'flex-start' }} />
                    : <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={22} color="grey" style={{ alignSelf: 'flex-start' }} />
                }
                <View style={{ gap: 5 }}>
                    <Text style={{fontSize: 12, fontWeight: "bold"}}>{instructionItem.step_number}</Text>
                    <Text style={{fontSize: 12, color: "gray"}}>{instructionItem.instruction} min</Text>
                </View>
            </TouchableOpacity>
      )
}