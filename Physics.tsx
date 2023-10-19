import  Metter  from 'matter-js'
import Constants from './Constants';

const Physics = (entities, {touches, time}) => {
    let engine = entities.physics.engine;
    let bird =  entities.bird.body;

    touches.filter(t=>t.type === 'press').forEach( t => {
        Metter.Body.applyForce(bird, bird.position, { x: 0.0, y: -0.1});
    })

    for (let i=1; i<=4; i++) {
        if (entities['pipe' + i].body.position.x <= -1 * (Constants.PIPE_WIDH / 2)) {
            Metter.Body.setPosition(entities['pipe' + i].body, {x: Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDH / 2), y: entities['pipe' + i].body.position.y})
        } else {
            Metter.Body.translate(entities['pipe' + i].body, {x: -1, y: 0});
        }
       
    }

    Metter.Engine.update(engine, time.delta);
    return entities;
}
export default Physics