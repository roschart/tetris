import {compose, curry} from 'ramda'
import Immutable from 'immutable'
import flyd from 'flyd'


const getScreen = id => {
    let canvas = document.getElementById(id)
    let context = canvas.getContext('2d')
    return {canvas, context}
}

const scale = ({context, canvas }) => {
    context.scale(20,20)
    return {context, canvas}
}

const fillScreen = color => screen => {
    let {context, canvas} = screen
    context.fillStyle = color
    context.fillRect(0,0,canvas.width, canvas.height)
    return screen
}

const clear= fillScreen('#000')

const drawPiece = color => player => screen  => {
    let {context, canvas} = screen
    let {piece, position: offset} = player
      piece.forEach((row, y)=>{
        row.forEach((value,x)=>{
            if(value!==0){
                context.fillStyle = color
                context.fillRect(x+ offset.x ,y+ offset.y,1,1)
        }})})
    return screen
}

const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0]] 

const player = {
    position: {x: 0, y: 0},
    piece: matrix
}

const game = {
 init:() => Immutable.fromJS(player),
 update: curry((player ,action) => {
     //first verision any acction move down
     return player.updateIn(['position', 'y'], v=> v + 1)
 })   
}
  
var screen = getScreen('screen')
var init = compose(drawPiece('red')(player), clear, scale)
var draw = compose(drawPiece('red')(player), clear)

var update = ()=>{
    //draw(screen)
    //player.position.y++
    requestAnimationFrame(update)
}

init(screen)
//update()

//test inmutable state
// var  state =  game.init()
// var nextState= game.update(state)('_') 
// console.log(nextState.toJS())

var actions$=flyd.stream()
var player$=flyd.scan(game.update,game.init(), actions$)
flyd.on(
    player=>{
        clear(screen)
        drawPiece('red')(player.toJS())(screen)
    },
    player$)
actions$('_')('_')