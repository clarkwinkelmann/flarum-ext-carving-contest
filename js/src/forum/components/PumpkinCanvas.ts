import {ClassComponent, Vnode, VnodeDOM} from 'mithril';
import app from 'flarum/forum/app';
import BrushState from '../states/BrushState';

interface PumpkinCanvasAttrs {
    mode: 'color' | 'carve'
    brush?: BrushState
    image?: string
    onchange?: (value: string) => void
}

const IMAGE_WIDTH = 426;
const IMAGE_HEIGHT = 426;

export default class PumpkinCanvas implements ClassComponent<PumpkinCanvasAttrs> {
    mode!: 'color' | 'carve'
    brush?: BrushState
    previewContext: CanvasRenderingContext2D | null = null
    imageSourceCanvas!: HTMLCanvasElement
    imageSourceContext!: CanvasRenderingContext2D
    drawCanvas!: HTMLCanvasElement
    drawContext!: CanvasRenderingContext2D
    onmouseup!: () => void
    drawEnabled: boolean = false

    oninit(vnode: Vnode<PumpkinCanvasAttrs, this>) {
        this.mode = vnode.attrs.mode;
        this.brush = vnode.attrs.brush;

        this.imageSourceCanvas = document.createElement('canvas');
        this.imageSourceCanvas.width = IMAGE_WIDTH;
        this.imageSourceCanvas.height = IMAGE_HEIGHT;
        this.imageSourceContext = this.imageSourceCanvas.getContext('2d')!;
        const image = new Image();
        image.src = app.forum.attribute('baseUrl') + '/assets/extensions/clarkwinkelmann-carving-contest/pumpkin.jpg';
        image.onload = () => {
            this.imageSourceContext.drawImage(image, 0, 0);

            this.updatePreview();
        };

        this.drawCanvas = document.createElement('canvas');
        this.drawCanvas.width = IMAGE_WIDTH;
        this.drawCanvas.height = IMAGE_HEIGHT;
        this.drawContext = this.drawCanvas.getContext('2d')!;

        const startingImage = vnode.attrs.image;
        if (startingImage) {
            const image = new Image();
            image.src = startingImage;
            image.onload = () => {
                this.drawContext.drawImage(image, 0, 0);

                this.updatePreview();
            };
            image.onerror = err => {
                console.error('Error loading image', err);
            };
        }

        this.onmouseup = () => {
            this.drawEnabled = false;
        };
    }

    oncreate(vnode: VnodeDOM<PumpkinCanvasAttrs, this>) {
        document.addEventListener('mouseup', this.onmouseup);

        vnode.dom.addEventListener('mousedown', event => {
            this.drawEnabled = true;

            this.mouseMove(vnode, event as MouseEvent);
        });
        vnode.dom.addEventListener('mousemove', this.mouseMove.bind(this, vnode) as any);
        vnode.dom.addEventListener('mouseleave', () => {
            // To remove the tool from preview
            this.updatePreview();
        });

        this.previewContext = vnode.dom.querySelector('canvas')!.getContext('2d');

        this.updatePreview();
    }

    onremove() {
        document.removeEventListener('mouseup', this.onmouseup);
    }

    view() {
        return m('.CarvingContestPumpkin', m('canvas', {
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
        }));
    }

    mouseMove(vnode: VnodeDOM<PumpkinCanvasAttrs, this>, event: MouseEvent) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (this.drawEnabled && this.brush) {
            if (this.mode === 'color' && this.brush.color) {
                this.drawContext.fillStyle = this.brush.color;
            } else {
                this.drawContext.fillStyle = '#000';
            }
            this.drawWithTool(this.drawContext, x, y, true);

            if (vnode.attrs.onchange) {
                vnode.attrs.onchange(this.drawContext.canvas.toDataURL('image/png'));
            }
        }

        this.updatePreview({
            x,
            y,
        });
    }

    drawWithTool(context: CanvasRenderingContext2D, x: number, y: number, fill: boolean = false) {
        if (!this.brush) {
            return;
        }

        const width = this.brush.width;

        context.beginPath();

        switch (this.brush.shape) {
            case 'circle':
                context.arc(x, y, width / 2, 0, 2 * Math.PI);
                break;
            case 'square':
                context.rect(x - (width / 2), y - (width / 2), width, width);
                break;
        }

        if (fill) {
            context.fill();
        } else {
            context.stroke();
        }
    }

    updatePreview(toolPosition: { x: number, y: number } | null = null) {
        if (!this.previewContext) {
            return;
        }

        this.previewContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

        if (this.mode === 'color') {
            // In paint mode, we draw the two images on top of another
            this.previewContext.drawImage(this.imageSourceCanvas, 0, 0);
            this.previewContext.drawImage(this.drawCanvas, 0, 0);
        } else {
            // In carve mode, we subtract the drawing from the source
            const imageSourceData = this.imageSourceContext.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
            const drawData = this.drawContext.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

            for (let i = 0; i < imageSourceData.data.length; i += 4) {
                // If the pixel in that area has an alpha value greater than 0, we create a hole in the image data
                // Returning 0 for every index will give rgba(0,0,0,0)
                if (drawData.data[i + 3] > 0) {
                    imageSourceData.data[i] = 0;
                    imageSourceData.data[i + 1] = 0;
                    imageSourceData.data[i + 2] = 0;
                    imageSourceData.data[i + 3] = 0;
                }
            }

            this.previewContext.putImageData(imageSourceData, 0, 0);
        }

        if (toolPosition) {
            this.previewContext.strokeStyle = 'rgba(0,0,0,0.5)';
            this.previewContext.lineWidth = 3;
            this.drawWithTool(this.previewContext, toolPosition.x, toolPosition.y);
        }
    }
}
