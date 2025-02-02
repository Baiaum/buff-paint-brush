import { CanvasToolBar } from "./CanvasToolBar.js";

export class DrawingCanvas  {

    static currentSelectedContainer: HTMLDivElement | null;
    static lastMouseDownEventXY: {"offsetX": number, "offsetY": number};
    static highest_zindex: number = 0;

    static lastSelectedContainer: HTMLDivElement | null;
    static instances: Array<string> = [];
    
    readonly #canvasName: string;
    readonly ctx2d: CanvasRenderingContext2D | null;
    readonly toolBar: CanvasToolBar;
    #isClicked: boolean = false;
    #canvaContainer: HTMLDivElement;
    #canvas: HTMLCanvasElement;

    
    #rootCanvasId: string;

    constructor(canvasName: string, w: number = 200, h: number = 100){

        DrawingCanvas.instances.push(canvasName);

        DrawingCanvas.highest_zindex++;

        // If only width is set, the height is set to the same as the width
        if(w == 200 && h == 100){
            h = w;
        }

        this.#canvasName = canvasName;

        let canva = document.createElement("canvas");
        canva.id = `canvas-${this.#canvasName}`;

        canva.width = w;
        canva.height = h;

        this.#rootCanvasId = canva.id;

        this.#canvas = canva;

        this.handlePointerDragAndClick(this);

        let canvaContainer = document.createElement("div");
        canvaContainer.id = `container-${canva.id}`;

        canvaContainer.dataset.draggerOffLimit = "false";
        canvaContainer.dataset.minimized = "false";

        canvaContainer.classList.add("canvaContainer");
        canvaContainer.style.zIndex = DrawingCanvas.highest_zindex.toString();

        canvaContainer.style.left = `${window.innerWidth / 3.5}px`;
        canvaContainer.style.top = `${window.innerHeight / 3.5}px`;

        // DRAGGER

        let canvaDragger = document.createElement("div");
        canvaDragger.id = `dragger-${canva.id}`;

        let draggerBTNcontainer = document.createElement("section");


        //Defining Minimizing button

        let minimizeBTN = document.createElement("button");
        minimizeBTN.classList.add("canvaDraggerSecBTNS");
        minimizeBTN.id = "minimizeBTN";

        this.HandleMinimize(minimizeBTN, this);

        //Defining closeBTN

        let closeBTN = document.createElement("button");
        closeBTN.classList.add("canvaDraggerSecBTNS");
        closeBTN.id = "closeBTN";

        closeBTN.addEventListener("click", () => {
            this.getContainer().dataset.minimized = "true";
        })
        
        draggerBTNcontainer.appendChild(minimizeBTN)
        draggerBTNcontainer.appendChild(closeBTN)

        //Defining nameElement

        let nameDisplay = document.createElement("span");
        nameDisplay.innerHTML = canvasName;

        canvaDragger.appendChild(nameDisplay)
        canvaDragger.appendChild(draggerBTNcontainer);
        

        canvaDragger.classList.add("canvaDragger");

        this.handleContainerDrag(canvaDragger, this, this.containerDrag_MouseDown);

        this.#canvaContainer = canvaContainer;

        this.ctx2d = canva.getContext("2d");    

        let html = document.getElementsByTagName("html")[0];
        
        canvaContainer.appendChild(canvaDragger);
        canvaContainer.appendChild(canva);
        html.appendChild(canvaContainer);
        
        // Instanciating a new ToolBar
        this.toolBar = new CanvasToolBar(this);

    }

    HandleMinimize(btn: HTMLButtonElement, drawingCanvas: DrawingCanvas){
        
        function minimize(){
            
            drawingCanvas.getContainer().dataset.minimized = "true";

            let minimized_canvas = document.getElementById("minimized_canvas");

            if(minimized_canvas){

                let mininimized_canva_icon = document.createElement("div");
                mininimized_canva_icon.classList.add("mininimized_canva_icon");
                mininimized_canva_icon.title = drawingCanvas.#canvasName;
                mininimized_canva_icon.innerText = `${drawingCanvas.#canvasName[0].toLocaleUpperCase()}${drawingCanvas.#canvasName[drawingCanvas.#canvasName.length - 1].toLocaleUpperCase()}`

                function maximize(){

                    drawingCanvas.getContainer().dataset.minimized = "false";
                    mininimized_canva_icon.removeEventListener("click", maximize)
                    mininimized_canva_icon.remove();

                }

                mininimized_canva_icon.addEventListener("click", maximize)

                minimized_canvas.appendChild(mininimized_canva_icon);
            }

        }


        btn.addEventListener("click", minimize);
    }

    containerDrag_MouseDown(e: MouseEvent, drawingCanvas: DrawingCanvas){

        function mouseUp(){
                
            drawingCanvas.setIsClicked(false);
            
            DrawingCanvas.currentSelectedContainer?.removeEventListener("mouseup", mouseUp)
        }
            
        DrawingCanvas.lastMouseDownEventXY = {"offsetX": e.offsetX, "offsetY": e.offsetY};

        DrawingCanvas.highest_zindex++;

        drawingCanvas.setIsClicked(true);

        DrawingCanvas.currentSelectedContainer?.addEventListener("mouseup", mouseUp)

    }
    
    handleContainerDrag(div: HTMLDivElement, drawingCanvas: DrawingCanvas){
    
        div.addEventListener("mousedown", this.containerDrag_MouseDown)

    }
    
    handlePointerDragAndClick(drawingCanvas: DrawingCanvas){

        let canvas = drawingCanvas.#canvas;

        function mouseMove(e: MouseEvent){

            drawingCanvas.draw(e.offsetX, e.offsetY);

        }

        function mouseLeave(){

            canvas.removeEventListener("mousemove", mouseMove)
            canvas.removeEventListener("mouseleave", mouseLeave);

        }
    
        function mouseUp(){

            canvas.removeEventListener("mousemove", mouseMove)
            canvas.removeEventListener("mouseleave", mouseLeave);
            canvas.removeEventListener("mouseup", mouseUp)

        }
    
        function mouseDown(){
        
            canvas.addEventListener("mouseup", mouseUp)
            canvas.addEventListener("mouseleave", mouseLeave)
            canvas.addEventListener("mousemove", mouseMove)
    
        }
        
        canvas.addEventListener("mousedown", mouseDown)

        canvas.addEventListener("click", this.clickDraw)

    }

    clickDraw(e: MouseEvent){
        this.draw(e.offsetX, e.offsetY);
    }

    getRootCanvasId(): string {
        return this.#rootCanvasId;
    }

    setIsClicked(bool: boolean){ 

        console.info("isClicked: " + this.#isClicked, "Container: " + this.#canvaContainer.id);
        this.#canvaContainer.dataset.isClicked = bool.toString();
        this.#isClicked = bool;

        if(bool){

            DrawingCanvas.currentSelectedContainer = this.#canvaContainer;
            
            this.#canvaContainer.style.zIndex = DrawingCanvas.highest_zindex.toString();

        } else {
            
            DrawingCanvas.lastSelectedContainer = DrawingCanvas.currentSelectedContainer;

            DrawingCanvas.currentSelectedContainer = null;
            
            // this.#canvaContainer.style.zIndex = "0";

        }
    }

    getIsClicked(): boolean{
        return this.#isClicked;
    }

    getContainer(): HTMLDivElement{
        return this.#canvaContainer;
    }

    getCanvasName(): string{
        return this.#canvasName;
    }

    getCanvas(): HTMLCanvasElement{
        return this.#canvas;
    }

    getCtx2d(): CanvasRenderingContext2D | null {
        return this.ctx2d;
    }

    destroy(){
        this.#canvaContainer.remove();
    }

    draw(x1: number, y1: number){

        let size = parseFloat(this.toolBar.pencilWidth);

        if(!x1 || !y1 || !size || !this.ctx2d) return 0;
        
        this.ctx2d.fillStyle = this.toolBar.getFillStyle();
        this.ctx2d.fillRect(x1, y1, size, size);
        
    }

    clearAll(){

        this.ctx2d?.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    }

    addSelfDestructingEventListener = (element: HTMLElement, eventType: keyof HTMLElementEventMap, callback: Function) => {
        
        let handler = () => {

            callback();
            element.removeEventListener(eventType, handler);
            
        };

        element.addEventListener(eventType, handler);

    };

}


