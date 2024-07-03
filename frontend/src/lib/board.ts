export enum EBoardAction {
    Pencil,
    Rectangle,
    Line,
    Text
};
    
let drawing = false;
let action = EBoardAction.Pencil;

export function initializeBoard() {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const startDrawing = () => {
        drawing = true;
        ctx.beginPath();
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

        switch (action) {
            case EBoardAction.Pencil:
                drawLine(e);
            break;
            case EBoardAction.Rectangle:
            case EBoardAction.Line:
            case EBoardAction.Text:
                return;
        }
    }
    
    const drawLine = (e: MouseEvent) => {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    };
    
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseleave", drawLine);
    document.addEventListener("mouseup", stopDrawing);
}

export const updateAction = (value: EBoardAction) => action = value;