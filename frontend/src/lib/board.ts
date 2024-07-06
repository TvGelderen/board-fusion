import getStroke from 'perfect-freehand';
import rough from 'roughjs';
import type { Drawable } from 'roughjs/bin/core';

export enum EAction {
    Drag,
    Draw
};

export enum ETool {
    Line,
    Pencil,
    Rectangle,
    Circle
}

enum ECorner {
    TopLeft = 0,
    TopMiddle = 1,
    TopRight = 2,
    MiddleRight = 3,
    BottomRight = 4,
    BottomMiddle = 5,
    BottomLeft = 6,
    MiddleLeft = 7,
}

type Coordinates = {
    x: number;
    y: number;
}

type Element = {
    idx: number;
    coords1: Coordinates;
    coords2: Coordinates;
    element: Drawable | null;
    points: Coordinates[] | null;
    type: ETool;
}

const generator = rough.generator();

let startX = 0;
let startY = 0;
let drawing = false;
let dragging = false;
let resizing = false;
let action = EAction.Draw;
let tool = ETool.Pencil;
let resizeCorner: ECorner | null = null;
let selectedElement: Element | null = null;
let selectedElementBox: {
    box: Element | null;
    resizeBalls: Element[];
} | null = null;
const elements: Element[] = [];
const resizeBallDiameter = 10;
const selectedBoxMargin = 5;
const selectedBoxPadding = 10;

export const updateAction = (value: EAction) => action = value;

export const updateTool = (value: ETool) => {
    if (action === EAction.Drag) {
        updateAction(EAction.Draw);
    }
    tool = value;
};

export function initializeBoard() {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;

    const rc = rough.canvas(canvas);

    const handleMouseDown = (e: MouseEvent) => {
        if (action === EAction.Drag) {
            const element = getElementAtPosition(e.offsetX, e.offsetY);
            if (!element) return;

            selectedElement = element;

            const corner = getResizeBallAtPosition(e.offsetX, e.offsetY);
            if (corner != -1) {
                startResizing(e, corner);
                return;
            }

            startDragging(e);
            return;
        }
        startDrawing(e);
    };

    const handleMouseUp = () => {
        if (action === EAction.Drag) {
            if (resizing) {
                resizing = false;
                resizeCorner = null;
            }
            stopDragging();
            canvas.style.cursor = "default";
            return;
        }
        stopDrawing();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (action === EAction.Drag) {
            if (dragging) {
                drag(e);
                return;
            }
            if (resizing) {
                resize(e);
                return;
            }

            const element = getElementAtPosition(e.offsetX, e.offsetY);
            if (selectedElement?.idx !== element?.idx) {
                selectedElement = element;
                selectedElementBox = null;
                updateSelectedElementBox();
                rerender();
            }

            if (!selectedElement) return;
            const resizeBall = getResizeBallAtPosition(e.offsetX, e.offsetY);
            if (selectedElement.type == ETool.Rectangle) {
                switch (resizeBall) {
                    case ECorner.TopLeft:
                    case ECorner.BottomRight:
                        canvas.style.cursor = "nwse-resize";
                        break;
                    case ECorner.TopMiddle:
                    case ECorner.BottomMiddle:
                        canvas.style.cursor = "ns-resize";
                        break;
                    case ECorner.TopRight:
                    case ECorner.BottomLeft:
                        canvas.style.cursor = "nesw-resize";
                        break;
                    case ECorner.MiddleRight:
                    case ECorner.MiddleLeft:
                        canvas.style.cursor = "ew-resize";
                        break;
                    default:
                        canvas.style.cursor = "move";
                }
            } else if (selectedElement.type == ETool.Line) {
                if (resizeBall === -1) {
                    canvas.style.cursor = "move";
                    return;
                }

                canvas.style.cursor = "pointer";
            }

            return;
        }

        draw(e);
    }

    const handleMouseEnter = () => {
        if (!drawing) return;
    };

    const handleMouseLeave = (e: MouseEvent) => {
        if (action === EAction.Drag) {
            return;
        }
        draw(e);
    };

    const startDrawing = (e: MouseEvent) => {
        drawing = true;
        startX = e.offsetX;
        startY = e.offsetY;

        const element = createElement(elements.length, startX, startY, startX, startY, tool);
        if (!element) return;

        elements.push(element);
    };

    const startDragging = (e: MouseEvent) => {
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
    }

    const startResizing = (e: MouseEvent, corner: ECorner) => {
        resizing = true;
        resizeCorner = corner;
        startX = e.clientX;
        startY = e.clientY;
    }

    const stopDrawing = () => {
        drawing = false;
    };

    const stopDragging = () => {
        if (!dragging) return;

        selectedElement = null;
        dragging = false;
    }

    const draw = (e: MouseEvent) => {
        if (!drawing) return;

        const index = elements.length - 1;
        if (tool === ETool.Pencil) {
            if (!elements[index].points) {
                elements[index].points = [];
            }
            elements[index].points.push({ x: e.offsetX, y: e.offsetY });
        } else {
            const element = createElement(index, startX, startY, e.offsetX, e.offsetY, tool);
            if (!element) return;

            elements[index] = element;
        }

        rerender();
    }

    const drag = (e: MouseEvent) => {
        if (!dragging || !selectedElement) return;

        const { coords1, coords2 } = selectedElement;

        const x1 = e.clientX - (startX - coords1.x);
        const y1 = e.clientY - (startY - coords1.y);
        let x2 = e.clientX - (startX - coords2.x);
        let y2 = e.clientY - (startY - coords2.y);

        if (selectedElement.type === ETool.Rectangle) {
            x2 = x1 + Math.abs(selectedElement.coords1.x - selectedElement.coords2.x);
            y2 = y1 + Math.abs(selectedElement.coords1.y - selectedElement.coords2.y);
        }

        updateElement(selectedElement.idx, x1, y1, x2, y2);

        rerender();
    }

    const resize = (e: MouseEvent) => {
        if (!resizing || !selectedElement) return;

        if (selectedElement.type === ETool.Rectangle) {
            switch (resizeCorner) {
                case ECorner.TopLeft:
                case ECorner.BottomRight:
                    break;
                case ECorner.TopMiddle:
                case ECorner.BottomMiddle:
                    break;
                case ECorner.TopRight:
                case ECorner.BottomLeft:
                    break;
                case ECorner.MiddleRight:
                case ECorner.MiddleLeft:
                    break;
            }
        } else if (selectedElement.type === ETool.Line) {
            if (Math.abs(distance(elements[selectedElement.idx].coords1, { x: e.offsetX, y: e.offsetY })) < 
                Math.abs(distance(elements[selectedElement.idx].coords2, { x: e.offsetX, y: e.offsetY }))) {
                updateElement(selectedElement.idx, e.offsetX, e.offsetY, selectedElement.coords2.x, selectedElement.coords2.y);
            } else {
                updateElement(selectedElement.idx, selectedElement.coords1.x, selectedElement.coords1.y, e.offsetX, e.offsetY);
            }
        }

        rerender();
    }

    const rerender = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (selectedElementBox) {
            if (selectedElementBox.box?.element) {
                rc.draw(selectedElementBox.box.element);
            }
            selectedElementBox.resizeBalls.forEach(ball => {
                if (ball.element) {
                    rc.draw(ball.element)
                }
            });
        }

        elements.forEach(el => {
            if (el.element) {
                rc.draw(el.element);
            } else if (el.points) {
                const stroke = getStroke(el.points);
                const pathData = getSvgPathFromStroke(stroke);
                const path = new Path2D(pathData);
                ctx.fill(path);
                return;
            }
        });
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseup", handleMouseUp);
}

function createElement(idx: number, x1: number, y1: number, x2: number, y2: number, type: ETool, strokeWidth: number = 3) {
    let element: Drawable | null = null;

    switch (type) {
        case ETool.Line:
            element = generator.line(x1, y1, x2, y2, { strokeWidth });
            break;
        case ETool.Rectangle:
            element = generator.rectangle(x1, y1, x2 - x1, y2 - y1, { strokeWidth });
            if (x1 > x2) {
                [x1, x2] = [x2, x1];
            }
            if (y1 > y2) {
                [y1, y2] = [y2, y1];
            }
            break;
        case ETool.Circle:
            element = generator.circle(x1, y1, resizeBallDiameter, { fill: "white", fillWeight: 10 });
            break;
    }

    return {
        idx: idx,
        coords1: { x: x1, y: y1 },
        coords2: { x: x2, y: y2 },
        element: element,
        points: null,
        type: type
    };
}

function resizeElement(idx: number, corner: ECorner) {
}

function updateElement(idx: number, x1: number, y1: number, x2: number, y2: number) {
    elements[idx] = createElement(idx, x1, y1, x2, y2, elements[idx].type);
    updateSelectedElementBox();
}

function updateSelectedElementBox() {
    if (!selectedElement) return;

    const { coords1, coords2 } = elements[selectedElement.idx];

    let corners: Coordinates[] = [];
    let box: Element | null = null;

    if (selectedElement.type === ETool.Rectangle) {
        const x1 = coords1.x - selectedBoxPadding;
        const y1 = coords1.y - selectedBoxPadding;
        const x2 = coords2.x + selectedBoxPadding;
        const y2 = coords2.y + selectedBoxPadding;
        corners = [{ x: x1, y: y1 }, { x: average(x1, x2), y: y1 }, { x: x2, y: y1 }, { x: x2, y: average(y1, y2) }, { x: x2, y: y2 }, { x: average(x1, x2), y: y2 }, { x: x1, y: y2 }, { x: x1, y: average(y1, y2) }];
        box = createElement(elements.length, x1, y1, x2, y2, ETool.Rectangle, 1);
    } else if (selectedElement.type === ETool.Line) {
        corners = [{ x: coords1.x, y: coords1.y }, { x: coords2.x, y: coords2.y }];
    }

    const resizeBalls = corners.map((coords, index) => createElement(index, coords.x, coords.y, coords.x, coords.y, ETool.Circle, 1));

    selectedElementBox = { box, resizeBalls }
}

function getElementAtPosition(x: number, y: number) {
    // The last element will have the highest priority
    return elements.findLast((element: Element) => {
        if (withinElement(x, y, element)) {
            return true;
        }
    }) ?? null;
}

function getResizeBallAtPosition(x: number, y: number) {
    if (!selectedElementBox) return -1;
    return selectedElementBox.resizeBalls.findIndex((element: Element) => {
        if (withinElement(x, y, element)) {
            return true;
        }
    });
}

function withinElement(x: number, y: number, element: Element) {
    switch (element.type) {
        case ETool.Rectangle:
            return x >= element.coords1.x - (selectedBoxPadding + selectedBoxMargin) &&
                x <= element.coords2.x + (selectedBoxPadding + selectedBoxMargin) &&
                y >= element.coords1.y - (selectedBoxPadding + selectedBoxMargin) &&
                y <= element.coords2.y + (selectedBoxPadding + selectedBoxMargin);
        case ETool.Line:
            return Math.abs(offset(element.coords1, element.coords2, { x: x, y: y })) < selectedBoxPadding;
        case ETool.Circle:
            return x >= element.coords1.x - resizeBallDiameter &&
                x <= element.coords1.x + resizeBallDiameter &&
                y >= element.coords1.y - resizeBallDiameter &&
                y <= element.coords1.y + resizeBallDiameter;
    }

    return false;
}

const distance = (a: Coordinates, b: Coordinates) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const offset = (a: Coordinates, b: Coordinates, c: Coordinates) => distance(a, b) - (distance(a, c) + distance(b, c));

const average = (a: number, b: number) => (a + b) / 2

function getSvgPathFromStroke(points: number[][], closed = true) {
    const len = points.length;
    if (len < 4) {
        return ``;
    }

    let a = points[0];
    let b = points[1];
    const c = points[2];

    let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(b[1], c[1]).toFixed(2)} T`;

    for (let i = 2, max = len - 1; i < max; i++) {
        a = points[i];
        b = points[i + 1];
        result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `;
    }

    if (closed) {
        result += 'Z';
    }

    return result;
}
