// TODO: Create a way to have a dynamic z-index for the canvas

import { CanvasToolBar } from "./CanvasToolBar.js";
import { DrawingCanvas } from "./DrawingCanvas.js";

window.addEventListener("load", () => {
    new DrawingCanvas("teste", 300, 200)
    new DrawingCanvas("teste2")
    new DrawingCanvas("teste3", 400, 300)
    new DrawingCanvas("jorginho", 500, 500)
})
  
window.addEventListener("mousemove", (e: MouseEvent) => {
    
    let canvaCont = DrawingCanvas.currentSelectedContainer;
    let contEvent = DrawingCanvas.lastMouseDownEventXY;
    
    if(canvaCont){

        if(canvaCont.offsetTop <= -20){

            canvaCont.dataset.draggerOffLimit = "true";

        } else if (canvaCont.offsetTop > 1 && canvaCont.dataset.draggerOffLimit == "true") {

            canvaCont.dataset.draggerOffLimit = "false"
            
        }

        if(e.clientX > 1 && e.clientY > 1){

            canvaCont.style.left = `${e.clientX - contEvent.offsetX + 2.15}px`;
            canvaCont.style.top = `${e.clientY - contEvent.offsetY + 2.15}px`;
            
        }

    }

})

