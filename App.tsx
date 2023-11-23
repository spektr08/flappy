/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Image } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Metter from 'matter-js';
import Constants from './Constants';
import Bird from './Bird';
import Floor from './Floor';
import Physics, { resetPipes } from './Physics';
import Images from './assets/Images';

function useOnce<Type>(callBack: () => Type): Type {
  const result = useRef<Type | null>(null);

  if (result.current !== null) {
    return result.current;
  }

  result.current = callBack();
  return result.current;
}

function App(): JSX.Element {
  let setupWorld = () => {
    let engine = Metter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    world.gravity.y = 0.0;
    let bird = Metter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT / 2,
      Constants.BIRD_WIDTH,
      Constants.BIRD_HEIGHT,
    );
    let floor1 = Metter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH + 4,
      50,
      { isStatic: true }
  );

  let floor2 = Metter.Bodies.rectangle(
      Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH + 4,
      50,
      { isStatic: true }
  );

    Metter.World.add(world, [bird, floor1, floor2]);
    Metter.Events.on(engine, 'collisionStart', (event) => {
      let pairs = event.pairs;
      gameEngine.dispatch({ type: 'game-over' });
    });
    return {
      physics: { engine: engine, world: world },
      bird: { body: bird, pose: 1, renderer: Bird },
      floor1: { body: floor1, renderer: Floor },
      floor2: { body: floor2, renderer: Floor },
    }
  };
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
 
  const entities = useOnce(() => {
    return setupWorld();
  });
 
  
  let onEvent = (e) => {
    if (e.type == 'game-over') {
      setRunning(false);
    } else if (e.type == 'score') {
      setScore(score+1);
    }
  };
  let reset = () => {
    gameEngine.swap(setupWorld());
    setRunning(true);
    resetPipes();
    setScore(0);
  };
  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
      <GameEngine
        ref={(ref) => { gameEngine = ref }}
        style={styles.gameContainer}
        entities={entities}
        systems={[Physics]}
        running={running}
        onEvent={onEvent}
      />
      <Text style={styles.score}>{score}</Text>
      {!running && <TouchableOpacity onPress={reset} style={styles.fullScreenButton}>
        <View style={styles.fullScreen}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Text style={styles.gameOverSubText}>Try Again</Text>
        </View>
      </TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  score: {
    position: 'absolute',
    color: 'white',
    fontSize: 72,
    top: 50,
    left: Constants.MAX_WIDTH / 2 - 20,
    textShadowColor: '#444444',
    textShadowOffset: { width: 2, height: 2},
    textShadowRadius: 2,
    fontFamily: '04b_19'
  },
  gameOverText: {
    color: 'white',
    fontSize: 48,
    fontFamily: '04b_19'
  },
  gameOverSubText: {
      color: 'white',
      fontSize: 24,
      fontFamily: '04b_19'
  },
});

export default App;
