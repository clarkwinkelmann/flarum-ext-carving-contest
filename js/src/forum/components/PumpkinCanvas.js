import Component from 'flarum/Component';

/* global m */

const IMAGE_WIDTH = 426;
const IMAGE_HEIGHT = 426;

export default class PumpkinCanvas extends Component {
    init() {
        super.init();

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

        const startingImage = this.props.image();
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

    static initProps(props) {
        if (!props.toolShape) {
            props.toolShape = m.prop();
        }
        if (!props.toolWidth) {
            props.toolWidth = m.prop();
        }
    }

    config(isInitialized) {
        if (isInitialized) {
            return;
        }

        document.addEventListener('mouseup', this.onmouseup);

        this.element.addEventListener('mousedown', event => {
            this.drawEnabled = true;

            this.mouseMove(event);
        });
        this.element.addEventListener('mousemove', this.mouseMove.bind(this));
        this.element.addEventListener('mouseleave', () => {
            // To remove the tool from preview
            this.updatePreview();
        });

        this.previewContext = this.element.querySelector('canvas').getContext('2d');

        this.updatePreview();
    }

    onunload() {
        document.removeEventListener('mouseup', this.onmouseup);
    }

    view() {
        return m('.CarvingContestPumpkin', m('canvas', {
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
        }));
    }

    mouseMove(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (this.drawEnabled) {
            this.drawContext.fillStyle = '#000';
            this.drawWithTool(this.drawContext, x, y, true);

            this.props.image(this.drawContext.canvas.toDataURL('image/png'));
        }

        this.updatePreview({
            x,
            y,
        });
    }

    drawWithTool(context, x, y, fill = false) {
        const width = this.props.toolWidth();

        switch (this.props.toolShape()) {
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
