import React, { useState } from "react";
import { Alert, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { Recipe } from "@/types/recipe_types";
import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";

type RecipeListItemProps = {
    recipeItem: Recipe
}

export default function RecipeListItem({ recipeItem }: RecipeListItemProps) {
    const [isCompleted, setIsCompleted] = useState<boolean>(true)
    // const { mutate: completeTask } = useMutation({
    //     mutationFn: async () => (),
    //     onSuccess: () => {
    //         // Optionally handle success, e.g., show a toast or update UI
    //     },
    //     onError: (error) => {
    //         Alert.alert('Error', `Failed to update recipe: ${error.message}`);
    //     }
    // })
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
            {/* {isCompleted
                ? <MaterialCommunityIcons name="circle-slice-8" size={22} color="#FF8C00" style={{ alignSelf: 'flex-start' }} />
                : <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={22} color="grey" style={{ alignSelf: 'flex-start' }} />
            } */}
            <View style={{ gap: 5 }}>
                <Text style={{fontSize: 16, fontWeight: "bold"}}>{recipeItem.title}</Text>
                <Text style={{fontSize: 10, color: "gray"}}>{recipeItem.prep_time} min | {recipeItem.servings} servings</Text>
                <Text style={{color:"gray"}}>{recipeItem.description}</Text>
            </View>
            <Link href={`create_update_recipe/?id=${recipeItem.id}`} asChild>
                <AntDesign 
                    name="infocirlceo" 
                    size={17} 
                    color="#FF8C00" 
                    style={{ alignSelf: 'flex-start', marginLeft: 'auto', marginRight: 5 }}
                />
            </Link>
        </TouchableOpacity>
  )
}