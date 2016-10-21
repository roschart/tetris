// var {compose}=require('ramda')
import {compose} from 'ramda'



const getScreen = id => {
    let canvas = document.getElementById(id)
    let context = canvas.getContext('2d')
    return {canvas, context}
}

const scale = ({context, canvas }) => {
    context.scale(20,20)
    return {context, canvas}
}

const clear = color => screen => {
    let {context, canvas} = screen
    context.fillStyle = color
    context.fillRect(0,0,canvas.width, canvas.height)
    return screen
}

const drawPiece = color => piece => offset => screen  => {
    let {context, canvas} = screen
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
  
var screen = getScreen('screen')
var init = compose(drawPiece('red')(matrix)({x:0,y:0}) , clear('#000'), scale)

init(screen)