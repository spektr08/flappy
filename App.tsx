/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Metter from 'matter-js';
import Constants from './Constants';
import Bird from './Bird';
import Wall from './Wall';
import Physics from './Physics';


export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function useOnce<Type>(callBack: () => Type): Type {
  const result = useRef<Type | null>(null);

  if (result.current !== null) {
    return result.current;
  }

  result.current = callBack();
  return result.current;
}

export const generatePipes = () => {
  let topPipeHeight = randomBetween(100, (Constants.MAX_HEIGHT / 2) - 100);
  let bottomPipeHeight = Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE;

  let sizes = [topPipeHeight, bottomPipeHeight];

  if (Math.random() < 0.5) {
    sizes = sizes.reverse();
  }
  return sizes;
}

function App(): JSX.Element {
  let setupWorld = () => {
    let engine = Metter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    let bird = Metter.Bodies.rectangle(
      Constants.MAX_WIDTH / 4,
      Constants.MAX_HEIGHT / 2,
      50,
      50,
    );
    let floor = Metter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH,
      50,
      { isStatic: true },
    );
    let celling = Metter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      25,
      Constants.MAX_WIDTH,
      50,
      { isStatic: true },
    );

    let [pipeHeight, pipeHeight2] = generatePipes();
    let pipe1 = Metter.Bodies.rectangle(
      Constants.MAX_WIDTH - (Constants.PIPE_WIDH / 2),
      pipeHeight / 2,
      Constants.PIPE_WIDH,
      pipeHeight,
      { isStatic: true },
    );
    let pipe2 = Metter.Bodies.rectangle(
      Constants.MAX_WIDTH - (Constants.PIPE_WIDH / 2),
      Constants.MAX_HEIGHT - (pipeHeight2 / 2),
      Constants.PIPE_WIDH,
      pipeHeight2,
      { isStatic: true },
    );
    let [pipeHeight3, pipeHeight4] = generatePipes();
    let pipe3 = Metter.Bodies.rectangle(
      Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDH / 2),
      pipeHeight3 / 2,
      Constants.PIPE_WIDH,
      pipeHeight3,
      { isStatic: true },
    );
    let pipe4 = Metter.Bodies.rectangle(
      Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDH / 2),
      Constants.MAX_HEIGHT - (pipeHeight4 / 2),
      Constants.PIPE_WIDH,
      pipeHeight4,
      { isStatic: true },
    );

    Metter.World.add(world, [bird, floor, celling, pipe1, pipe2, pipe3, pipe4]);
    Metter.Events.on(engine, 'collisionStart', (event) => {
      let pairs = event.pairs;
      gameEngine.dispatch({ type: 'game-over' });
    });
    return {
      physics: { engine: engine, world: world },
      bird: { body: bird, size: [50, 50], color: 'red', renderer: Bird },
      floor: { body: floor, size: [Constants.MAX_WIDTH, 50], color: 'green', renderer: Wall },
      celling: { body: celling, size: [Constants.MAX_WIDTH, 50], color: 'green', renderer: Wall },
      pipe1: { body: pipe1, size: [Constants.PIPE_WIDH, pipeHeight], color: 'green', renderer: Wall },
      pipe2: { body: pipe2, size: [Constants.PIPE_WIDH, pipeHeight2], color: 'green', renderer: Wall },
      pipe3: { body: pipe3, size: [Constants.PIPE_WIDH, pipeHeight3], color: 'green', renderer: Wall },
      pipe4: { body: pipe4, size: [Constants.PIPE_WIDH, pipeHeight4], color: 'green', renderer: Wall },
    }
  };
  const [running, setRunning] = useState(true);
 
  const entities = useOnce(() => {
    return setupWorld();
  });
 
  
  let onEvent = (e) => {
    if (e.type == 'game-over') {
      setRunning(false);
    }
  };
  let reset = () => {
    gameEngine.swap(setupWorld());
    setRunning(true);
  };
  return (
    <View style={styles.container}>

      <GameEngine
        ref={(ref) => { gameEngine = ref }}
        style={styles.gameContainer}
        entities={entities}
        systems={[Physics]}
        running={running}
        onEvent={onEvent}
      />
      {!running && <TouchableOpacity onPress={reset} style={styles.fullScreenButton}>
        <View style={styles.fullScreen}>
          <Text style={styles.gameOverText}>Game Over</Text>
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
  gameOverText: {
    color: 'white',
    fontSize: 48
  }
});

export default App;
