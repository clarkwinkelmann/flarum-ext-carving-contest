import app from 'flarum/app';

/* global m */

const IMAGE_WIDTH = 426;
const IMAGE_HEIGHT = 426;

export default class PumpkinCanvas {
    oninit(vnode) {
        this.previewContext = null;

        const imageSourceCanvas = document.createElement('canvas');
        imageSourceCanvas.width = IMAGE_WIDTH;
        imageSourceCanvas.height = IMAGE_HEIGHT;
        this.imageSourceContext = imageSourceCanvas.getContext('2d');
        const image = new Image();
        image.src = app.forum.attribute('baseUrl') + '/assets/extensions/clarkwinkelmann-carving-contest/pumpkin.jpg';
        image.onload = () => {
            this.imageSourceContext.drawImage(image, 0, 0);

            this.updatePreview();
        };

        const drawCanvas = document.createElement('canvas');
        drawCanvas.width = IMAGE_WIDTH;
        drawCanvas.height = IMAGE_HEIGHT;
        this.drawContext = drawCanvas.getContext('2d');

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

    oncreate(vnode) {
        document.addEventListener('mouseup', this.onmouseup);

        vnode.dom.addEventListener('mousedown', event => {
            this.drawEnabled = true;

            this.mouseMove(vnode, event);
        });
        vnode.dom.addEventListener('mousemove', this.mouseMove.bind(this, vnode));
        vnode.dom.addEventListener('mouseleave', () => {
            // To remove the tool from preview
            this.updatePreview();
        });

        this.previewContext = vnode.dom.querySelector('canvas').getContext('2d');

        this.updatePreview();
    }

    onremove() {
        document.removeEventListener('mouseup', this.onmouseup);
    }

    view(vnode) {
        this.toolWidth = vnode.attrs.toolWidth;
        this.toolShape = vnode.attrs.toolShape;

        return m('.CarvingContestPumpkin', m('canvas', {
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
        }));
    }

    mouseMove(vnode, event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (this.drawEnabled) {
            this.drawContext.fillStyle = '#000';
            this.drawWithTool(this.drawContext, x, y, true);

            vnode.attrs.onchange(this.drawContext.canvas.toDataURL('image/png'));
        }

        this.updatePreview({
            x,
            y,
        });
    }

    drawWithTool(context, x, y, fill = false) {
        const width = this.toolWidth;

        switch (this.toolShape) {
            case 'circle':
                context.beginPath();
                context.arc(x, y, width / 2, 0, 2 * Math.PI);

                if (fill) {
                    context.fill();
                } else {
                    context.stroke();
                }
                break;
            case 'square':
                context.fillRect(x - (width / 2), y - (width / 2), width, width);
                break;
        }
    }

    updatePreview(toolPosition = null) {
        if (!this.previewContext) {
            return;
        }

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

        this.previewContext.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.previewContext.putImageData(imageSourceData, 0, 0);

        if (toolPosition) {
            this.previewContext.strokeStyle = 'rgba(0,0,0,0.5)';
            this.previewContext.lineWidth = 3;
            this.drawWithTool(this.previewContext, toolPosition.x, toolPosition.y);
        }
    }
}
