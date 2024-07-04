export enum EBoardAction {
    Drag,
    Pencil,
    Rectangle,
    Line,
    Text
};
    
let snapshot: ImageData;

let startX = 0
let startY = 0;
let drawing = false;
let action = EBoardAction.Drag;

export function initializeBoard() {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;
    
    const startDrawing = (e: MouseEvent) => {
        drawing = true;
        startX = e.offsetX;
        startY = e.offsetY;

        ctx.beginPath();

        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    
    const stopDrawing = () => {
        drawing = false;
    };

    const handleMouseEnter = () => {
        if (!drawing) return;
        ctx.beginPath();
    };
    
    const draw = (e: MouseEvent) => {
        if (!drawing) return;

        ctx.putImageData(snapshot, 0, 0);

        switch (action) {
            case EBoardAction.Drag:
                return;
            case EBoardAction.Pencil:
                drawPencil(e);
                break;
            case EBoardAction.Rectangle:
                drawRectangle(e);
                break;
            case EBoardAction.Line:
                drawLine(e);
                break;
            case EBoardAction.Text:
                return;
        }
    }
    
    const drawPencil = (e: MouseEvent) => {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    };
    
    const drawRectangle = (e: MouseEvent) => {
        ctx.strokeRect(e.offsetX, e.offsetY, startX - e.offsetX, startY - e.offsetY);
    }
    
    const drawLine = (e: MouseEvent) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseleave", draw);
    document.addEventListener("mouseup", stopDrawing);
}

export const updateAction = (value: EBoardAction) => action = value;