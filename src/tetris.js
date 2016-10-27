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
        if(action==='left'){
            return player.updateIn(['position', 'x'], v=> v - 1)
        }
        else if(action==='right'){
            return player.updateIn(['position', 'x'], v=> v + 1)
        }
        else if(action==='down'){
            return player.updateIn(['position', 'y'], v=> v + 1)
        }
        return player
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
var actions$=flyd.stream()
var player$=flyd.scan(game.update,game.init(), actions$)
flyd.on(
    player=>{
        clear(screen)
        drawPiece('red')(player.toJS())(screen)
    },
    player$)
actions$('_')('_')  


window.addEventListener('keydown', (e)=>{
    e.preventDefault()
    if(e.keyCode===37) { actions$('left') }
    else if (e.keyCode===39) { actions$('right') }
    else if (e.keyCode===40) { actions$('down') }
},false)

setInterval(()=>{actions$('down')}, 1000)