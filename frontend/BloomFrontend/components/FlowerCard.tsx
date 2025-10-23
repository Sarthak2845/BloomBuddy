import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MotiView } from 'moti';
import Colors from '../constants/Colors';

interface FlowerCardProps {
  name: string;
  scientific: string;
  family: string;
  region: string;
  description: string;
  image?: string;
}

export default function FlowerCard({
  name,
  scientific,
  family,
  region,
  description,
  image,
}: FlowerCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600 }}
      style={styles.card}
    >
      {image && (
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 200, duration: 400 }}
        >
          <Image source={{ uri: image }} style={styles.image} />
        </MotiView>
      )}

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300, duration: 500 }}
      >
        <Text style={styles.flowerName}>{name}</Text>
        <Text style={styles.scientific}>{scientific}</Text>
        <View style={styles.line} />
        <Text style={styles.detail}>🌿 Family: {family}</Text>
        <Text style={styles.detail}>🌍 Region: {region}</Text>
        <Text style={styles.desc}>{description}</Text>
      </MotiView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 15,
  },
  flowerName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  scientific: {
    fontStyle: 'italic',
    color: '#6B4F4F',
    textAlign: 'center',
    marginBottom: 8,
  },
  line: {
    height: 1,
    backgroundColor: '#FFD6E0',
    marginVertical: 10,
  },
  detail: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 6,
  },
  desc: {
    marginTop: 10,
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
});
