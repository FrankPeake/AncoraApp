import { Stack, router } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
            name="create_update_recipe" 
            options={{ 
                presentation: "modal",
                title: "Create or Update Recipe" 
            }} 
        />
      </Stack>  
    </QueryClientProvider>
  )
}