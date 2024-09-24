import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import config from './config'; // Importing the config

const Stack = createStackNavigator();

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchGames = async (query = '') => {
    try {
      setLoading(true);
      const url = query
        ? `https://api.rawg.io/api/games?key=${config.RAWG_API_KEY}&search=${query}`
        : `https://api.rawg.io/api/games?key=${config.RAWG_API_KEY}`;

      console.log('Fetching from URL:', url); // For debugging
      const response = await axios.get(url);
      setGames(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const renderGameItem = ({ item }) => (
    <View style={styles.gameItem}>
      <Image source={{ uri: item.background_image }} style={styles.gameImage} />
      <Text style={styles.gameTitle}>{item.name}</Text>
    </View>
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchGames(query);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a game..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {loading ? (
        <Text>Loading games...</Text>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGameItem}
        />
      )}
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="GameList" 
          component={GameList} 
          options={{ title: 'Game List', headerShown: true }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
  },
  gameItem: {
    marginVertical: 10,
    alignItems: 'center',
  },
  gameImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default App;
