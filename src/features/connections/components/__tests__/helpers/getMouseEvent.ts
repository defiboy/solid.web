interface FakeMouseEventInit {
    bubbles: boolean,
    cancelable: boolean,
    composed: boolean,
    altKey: boolean,
    button: 0 | 1 | 2 | 3 | 4,
    buttons: number,
    clientX: number,
    clientY: number,
    ctrlKey: boolean,
    metaKey: boolean,
    movementX: number,
    movementY: number,
    offsetX: number,
    offsetY: number,
    pageX: number,
    pageY: number,
    screenX: number,
    screenY: number,
    shiftKey: boolean,
    x: number,
    y: number,
}

class FakeMouseEvent extends MouseEvent {
    offsetX: number;
    offsetY: number;
    pageX: number;
    pageY: number;
    x: number;
    y: number;

    constructor(type: string, values: Partial<FakeMouseEventInit>) {
        const { pageX, pageY, offsetX, offsetY, x, y, ...mouseValues } = values;
        super(type, mouseValues);

        Object.assign(this, {
            offsetX: offsetX || 0,
            offsetY: offsetY || 0,
            pageX: pageX || 0,
            pageY: pageY || 0,
            x: x || 0,
            y: y || 0,
        });
    }
}

export const getMouseEvent = (type: string, values: Partial<FakeMouseEventInit> = {}): FakeMouseEvent => {
    values = {
        bubbles: true,
        cancelable: true,
        pageX: 1000,
        pageY: 1000,
        ...values,
    };
    return new FakeMouseEvent(type, values);
}