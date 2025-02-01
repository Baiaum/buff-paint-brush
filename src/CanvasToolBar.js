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
var _CanvasToolBar_fillStyle, _CanvasToolBar_ParentCanvas;
export class CanvasToolBar {
    constructor(ParentCanvas) {
        _CanvasToolBar_fillStyle.set(this, "#000");
        // #selectedPencil: string;
        _CanvasToolBar_ParentCanvas.set(this, void 0);
        this.pencils = {
            squared: "squared",
            circular: "circular"
        };
        this.pencilWidth = "1";
        __classPrivateFieldSet(this, _CanvasToolBar_ParentCanvas, ParentCanvas, "f");
        let toolBarDiv = document.createElement("div");
        toolBarDiv.id = `toolbar-${__classPrivateFieldGet(this, _CanvasToolBar_ParentCanvas, "f").getCanvas().id}`;
        toolBarDiv.classList.add("CanvasToolBar");
        // Defining color Input
        let colorInput = document.createElement("input");
        colorInput.addEventListener("change", () => {
            __classPrivateFieldSet(this, _CanvasToolBar_fillStyle, colorInput.value, "f");
        });
        colorInput.type = "color";
        colorInput.value = "#fff";
        //Defining slideinput
        let pencilWidth = document.createElement("input");
        pencilWidth.value = "10";
        pencilWidth.type = "range";
        pencilWidth.min = "1";
        pencilWidth.max = "250";
        pencilWidth.ariaOrientation = "vertical";
        pencilWidth.addEventListener("change", () => {
            this.pencilWidth = pencilWidth.value;
        });
        //Defining ClearButton
        let clearBTN = document.createElement("button");
        clearBTN.classList.add("toolBarTrash");
        clearBTN.addEventListener("click", () => {
            __classPrivateFieldGet(this, _CanvasToolBar_ParentCanvas, "f").clearAll();
        });
        // STYLING SEC
        let stylingSec = document.createElement("section");
        stylingSec.appendChild(colorInput);
        stylingSec.appendChild(pencilWidth);
        // UtilsSec
        let utilsSec = document.createElement("section");
        utilsSec.appendChild(clearBTN);
        toolBarDiv.appendChild(stylingSec);
        toolBarDiv.appendChild(utilsSec);
        __classPrivateFieldGet(this, _CanvasToolBar_ParentCanvas, "f").getContainer().appendChild(toolBarDiv);
    }
    setFillStyle(style) {
        __classPrivateFieldSet(this, _CanvasToolBar_fillStyle, style, "f");
    }
    getFillStyle() {
        return __classPrivateFieldGet(this, _CanvasToolBar_fillStyle, "f");
    }
}
_CanvasToolBar_fillStyle = new WeakMap(), _CanvasToolBar_ParentCanvas = new WeakMap();
