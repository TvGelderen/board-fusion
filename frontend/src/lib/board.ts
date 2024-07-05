import rough from 'roughjs';
import type { Drawable } from 'roughjs/bin/core';

export enum EAction {
    Drag,
    Draw
};

export enum ETool {
    Pencil,
    Rectangle,
    Line
}

type Coordinates = {
    x: number;
    y: number;
}

type Element = {
    coords1: Coordinates;
    coords2: Coordinates;
    element: Drawable;
}

const generator = rough.generator();
    
let startX = 0;
let startY = 0;
let drawing = false;
let action = EAction.Draw;
let tool = ETool.Line;
const elements: Element[] = [];

export function initializeBoard() {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;
    
    const rc = rough.canvas(canvas);

    const startDrawing = (e: MouseEvent) => {
        if (action == EAction.Drag) {
            return;
        }

        drawing = true;
        startX = e.offsetX;
        startY = e.offsetY;

        const element = createElement(startX, startY, e.offsetX, e.offsetY);
        if (!element) return;

        elements.push(element);
    };
    
    const stopDrawing = () => {
        drawing = false;
    };

    const handleMouseEnter = () => {
        if (!drawing) return;
    };
    
    const draw = (e: MouseEvent) => {
        if (!drawing) return;

        const element = createElement(startX, startY, e.offsetX, e.offsetY);
        if (!element) return;

        elements[elements.length - 1] = element;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        elements.forEach(el => rc.draw(el.element));
    }

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseleave", draw);
    document.addEventListener("mouseup", stopDrawing);
}

function createElement(x1: number, y1: number, x2: number, y2: number): Element | null {
    let element: Drawable | null = null;

    switch (tool) {
        case ETool.Pencil:
            break;
        case ETool.Rectangle:
            element = generator.rectangle(x1, y1, x2-x1, y2-y1);
            break;
        case ETool.Line:
            element = generator.line(x1, y1, x2, y2);
            break;
    }

    return element == null ? 
        null :
        {
            coords1: {x: x1, y: y1},
            coords2: {x: x2, y: y2},
            element: element
        };
}

export const updateAction = (value: EAction) => action = value;

export const updateTool = (value: ETool) => tool = value;
