import { DrawingCanvas } from "./DrawingCanvas.js";

export class CanvasToolBar {

    #fillStyle: string = "#000";
    // #selectedPencil: string;
    #ParentCanvas: DrawingCanvas;
    pencils: Object = {
        squared: "squared",
        circular: "circular"
    };
    pencilWidth: string = "1";


    constructor(ParentCanvas: DrawingCanvas){

        this.#ParentCanvas = ParentCanvas;

        let toolBarDiv = document.createElement("div");
        toolBarDiv.id = `toolbar-${this.#ParentCanvas.getCanvas().id}`
        toolBarDiv.classList.add("CanvasToolBar");

        // Defining color Input
        let colorInput = document.createElement("input");

        colorInput.addEventListener("change", () => {
            this.#fillStyle = colorInput.value;
        })

        colorInput.type = "color"
        colorInput.value = "#fff";

        //Defining slideinput
        let pencilWidth = document.createElement("input")
        pencilWidth.value = "10";
        pencilWidth.type = "range";
        pencilWidth.min = "1";
        pencilWidth.max = "250";
        pencilWidth.ariaOrientation = "vertical"

        pencilWidth.addEventListener("change", () => {
            this.pencilWidth = pencilWidth.value;
        })

        //Defining ClearButton

        let clearBTN = document.createElement("button");
        clearBTN.classList.add("toolBarTrash");
        clearBTN.addEventListener("click", () => {
            this.#ParentCanvas.clearAll();
        })



        // STYLING SEC

        let stylingSec = document.createElement("section");
        stylingSec.appendChild(colorInput)
        stylingSec.appendChild(pencilWidth)




        // UtilsSec

        let utilsSec = document.createElement("section");

        utilsSec.appendChild(clearBTN)



        toolBarDiv.appendChild(stylingSec)
        toolBarDiv.appendChild(utilsSec)


        this.#ParentCanvas.getContainer().appendChild(toolBarDiv);
        
    }


    setFillStyle(style: string){
        this.#fillStyle = style;
    }

    getFillStyle(){
        return this.#fillStyle;
    }
}