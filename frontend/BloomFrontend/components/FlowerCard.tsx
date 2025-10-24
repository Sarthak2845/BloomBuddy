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
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 600 }}
      style={styles.card}
    >
      <MotiView
        from={{ rotate: '-5deg', scale: 0.8, opacity: 0 }}
        animate={{ rotate: '0deg', scale: 1, opacity: 1 }}
        transition={{ type: 'timing', duration: 800 }}
        style={styles.imageContainer}
      >
        <Image
          source={
            image
              ? { uri: image }
              : require('../assets/flowers/flower1.jpg')
          }
          style={styles.image}
        />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200, duration: 600 }}
      >
        <Text style={styles.flowerName}>{name || 'Unknown Flower'}</Text>
        <Text style={styles.scientific}>{scientific}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.detail}>🌿 Family: {family}</Text>
          <Text style={styles.detail}>🌍 Region: {region}</Text>
        </View>

        <Text style={styles.desc}>{description}</Text>
      </MotiView>

      {/* Floating Petal Animation */}
      {[...Array(3)].map((_, i) => (
        <MotiView
          key={i}
          from={{ translateY: -10, opacity: 0 }}
          animate={{ translateY: 10, opacity: 1 }}
          transition={{
            type: 'timing',
            duration: 3000,
            loop: true,
            delay: i * 800,
            repeatReverse: true,
          }}
          style={[styles.petal, { left: 50 + i * 60 }]}
        >
          <Text style={{ fontSize: 18 }}>🌸</Text>
        </MotiView>
      ))}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#FFF8F9',
    borderRadius: 100,
    padding: 8,
    elevation: 4,
    shadowColor: '#EAC5C5',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    marginBottom: 16,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
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
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: '#FFF4F5',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    marginBottom: 12,
  },
  detail: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 4,
  },
  desc: {
    marginTop: 10,
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  petal: {
    position: 'absolute',
    top: -20,
  },
});
