export function initializeBoard() {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const drawLine = (e: MouseEvent) => {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    
    canvas.addEventListener("mousemove", drawLine);
}