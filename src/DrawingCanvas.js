var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DrawingCanvas_canvasName, _DrawingCanvas_isClicked, _DrawingCanvas_canvaContainer, _DrawingCanvas_canvas, _DrawingCanvas_rootCanvasId;
import { CanvasToolBar } from "./CanvasToolBar.js";
export class DrawingCanvas {
    constructor(canvasName, w = 200, h = 100) {
        _DrawingCanvas_canvasName.set(this, void 0);
        _DrawingCanvas_isClicked.set(this, false);
        _DrawingCanvas_canvaContainer.set(this, void 0);
        _DrawingCanvas_canvas.set(this, void 0);
        _DrawingCanvas_rootCanvasId.set(this, void 0);
        DrawingCanvas.instances.push(canvasName);
        DrawingCanvas.highest_zindex++;
        // If only width is set, the height is set to the same as the width
        if (w == 200 && h == 100) {
            h = w;
        }
        __classPrivateFieldSet(this, _DrawingCanvas_canvasName, canvasName, "f");
        let canva = document.createElement("canvas");
        canva.id = `canvas-${__classPrivateFieldGet(this, _DrawingCanvas_canvasName, "f")}`;
        canva.width = w;
        canva.height = h;
        __classPrivateFieldSet(this, _DrawingCanvas_rootCanvasId, canva.id, "f");
        __classPrivateFieldSet(this, _DrawingCanvas_canvas, canva, "f");
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
        });
        draggerBTNcontainer.appendChild(minimizeBTN);
        draggerBTNcontainer.appendChild(closeBTN);
        //Defining nameElement
        let nameDisplay = document.createElement("span");
        nameDisplay.innerHTML = canvasName;
        canvaDragger.appendChild(nameDisplay);
        canvaDragger.appendChild(draggerBTNcontainer);
        //@ts-ignore
        // this.#ParentCanvas.getContainer().dataset.minimized = "true";
        canvaDragger.classList.add("canvaDragger");
        this.handleContainerDrag(canvaDragger, this);
        __classPrivateFieldSet(this, _DrawingCanvas_canvaContainer, canvaContainer, "f");
        this.ctx2d = canva.getContext("2d");
        let html = document.getElementsByTagName("html")[0];
        canvaContainer.appendChild(canvaDragger);
        canvaContainer.appendChild(canva);
        html.appendChild(canvaContainer);
        // Instanciating a new ToolBar
        this.toolBar = new CanvasToolBar(this);
    }
    HandleMinimize(btn, drawingCanvas) {
        function minimize() {
            drawingCanvas.getContainer().dataset.minimized = "true";
            let minimized_canvas = document.getElementById("minimized_canvas");
            if (minimized_canvas) {
                let mininimized_canva_icon = document.createElement("div");
                mininimized_canva_icon.classList.add("mininimized_canva_icon");
                mininimized_canva_icon.title = __classPrivateFieldGet(drawingCanvas, _DrawingCanvas_canvasName, "f");
                mininimized_canva_icon.innerText = `${__classPrivateFieldGet(drawingCanvas, _DrawingCanvas_canvasName, "f")[0].toLocaleUpperCase()}${__classPrivateFieldGet(drawingCanvas, _DrawingCanvas_canvasName, "f")[__classPrivateFieldGet(drawingCanvas, _DrawingCanvas_canvasName, "f").length - 1].toLocaleUpperCase()}`;
                function maximize() {
                    drawingCanvas.getContainer().dataset.minimized = "false";
                    mininimized_canva_icon.removeEventListener("click", maximize);
                    mininimized_canva_icon.remove();
                }
                mininimized_canva_icon.addEventListener("click", maximize);
                minimized_canvas.appendChild(mininimized_canva_icon);
            }
        }
        btn.addEventListener("click", minimize);
    }
    handleContainerDrag(div, drawingCanvas) {
        function mouseUp() {
            var _a;
            drawingCanvas.setIsClicked(false);
            (_a = DrawingCanvas.currentSelectedContainer) === null || _a === void 0 ? void 0 : _a.removeEventListener("mouseup", mouseUp);
        }
        function mouseDown(e) {
            var _a;
            DrawingCanvas.lastMouseDownEventXY = { "offsetX": e.offsetX, "offsetY": e.offsetY };
            DrawingCanvas.highest_zindex++;
            drawingCanvas.setIsClicked(true);
            (_a = DrawingCanvas.currentSelectedContainer) === null || _a === void 0 ? void 0 : _a.addEventListener("mouseup", mouseUp);
        }
        div.addEventListener("mousedown", mouseDown);
    }
    handlePointerDragAndClick(drawingCanvas) {
        let canvas = __classPrivateFieldGet(drawingCanvas, _DrawingCanvas_canvas, "f");
        function mouseMove(e) {
            drawingCanvas.draw(e.offsetX, e.offsetY);
        }
        function mouseLeave() {
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mouseleave", mouseLeave);
        }
        function mouseUp() {
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mouseleave", mouseLeave);
            canvas.removeEventListener("mouseup", mouseUp);
        }
        function mouseDown() {
            canvas.addEventListener("mouseup", mouseUp);
            canvas.addEventListener("mouseleave", mouseLeave);
            canvas.addEventListener("mousemove", mouseMove);
        }
        canvas.addEventListener("mousedown", mouseDown);
        function clickDraw(e) {
            drawingCanvas.draw(e.offsetX, e.offsetY);
        }
        canvas.addEventListener("click", clickDraw);
    }
    getRootCanvasId() {
        return __classPrivateFieldGet(this, _DrawingCanvas_rootCanvasId, "f");
    }
    setIsClicked(bool) {
        console.info("isClicked: " + __classPrivateFieldGet(this, _DrawingCanvas_isClicked, "f"), "Container: " + __classPrivateFieldGet(this, _DrawingCanvas_canvaContainer, "f").id);
        __classPrivateFieldGet(this, _DrawingCanvas_canvaContainer, "f").dataset.isClicked = bool.toString();
        __classPrivateFieldSet(this, _DrawingCanvas_isClicked, bool, "f");
        if (bool) {
            DrawingCanvas.currentSelectedContainer = __classPrivateFieldGet(this, _DrawingCanvas_canvaContainer, "f");
            __classPrivateFieldGet(this, _DrawingCanvas_canvaContainer, "f").style.zIndex = DrawingCanvas.highest_zindex.toString();
        }
        else {
            DrawingCanvas.lastSelectedContainer = DrawingCanvas.currentSelectedContainer;
            DrawingCanvas.currentSelectedContainer = null;
            // this.#canvaContainer.style.zIndex = "0";
        }
    }
    getIsClicked() {
        return __classPrivateFieldGet(this, _DrawingCanvas_isClicked, "f");
    }
    getContainer() {
        return __classPrivateFieldGet(this, _DrawingCanvas_canvaContainer, "f");
    }
    getCanvasName() {
        return __classPrivateFieldGet(this, _DrawingCanvas_canvasName, "f");
    }
    getCanvas() {
        return __classPrivateFieldGet(this, _DrawingCanvas_canvas, "f");
    }
    getCtx2d() {
        return this.ctx2d;
    }
    destroy() {
        __classPrivateFieldGet(this, _DrawingCanvas_canvaContainer, "f").remove();
    }
    draw(x1, y1) {
        let size = parseFloat(this.toolBar.pencilWidth);
        if (!x1 || !y1 || !size || !this.ctx2d)
            return 0;
        this.ctx2d.fillStyle = this.toolBar.getFillStyle();
        this.ctx2d.fillRect(x1, y1, size, size);
    }
    clearAll() {
        if (!this.ctx2d)
            return 0;
        // this.ctx2d.fillStyle = this.toolBar.getFillStyle();
        this.ctx2d.clearRect(0, 0, __classPrivateFieldGet(this, _DrawingCanvas_canvas, "f").width, __classPrivateFieldGet(this, _DrawingCanvas_canvas, "f").height);
    }
}
_DrawingCanvas_canvasName = new WeakMap(), _DrawingCanvas_isClicked = new WeakMap(), _DrawingCanvas_canvaContainer = new WeakMap(), _DrawingCanvas_canvas = new WeakMap(), _DrawingCanvas_rootCanvasId = new WeakMap();
DrawingCanvas.highest_zindex = 0;
DrawingCanvas.instances = [];
