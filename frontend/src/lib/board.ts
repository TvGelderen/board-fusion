export function initializeBoard() {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let drawing = false;
    
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
    
    const drawLine = (e: MouseEvent) => {
        if (!drawing) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    };
    
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mousemove", drawLine);
    canvas.addEventListener("mouseleave", drawLine);
    document.addEventListener("mouseup", stopDrawing);
}