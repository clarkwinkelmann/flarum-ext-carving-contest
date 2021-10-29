import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import PumpkinCanvas from './PumpkinCanvas';
import BrushState from '../states/BrushState';

interface ParticipateModalAttrs {
    onsave: () => void
}

const translationPrefix = 'clarkwinkelmann-carving-contest.forum.modal.';

// @ts-ignore Modal.view causing typescript errors
export default class ParticipateModal extends Modal {
    // We cannot type-hint through extend at this time so we code it here
    attrs!: ParticipateModalAttrs

    brush: BrushState = new BrushState()
    name: string = ''
    image: string = ''
    disabled: boolean = true
    loading: boolean = false

    className() {
        return 'Modal--large';
    }

    title() {
        return app.translator.trans(translationPrefix + 'title');
    }

    checkIfDisabled() {
        const previouslyDisabled = this.disabled;

        this.disabled = this.name === '' || this.image === '';

        // Handle disabled state redraw when the image changes (because we don't redraw every time it changes)
        if (previouslyDisabled !== this.disabled) {
            m.redraw();
        }
    }

    colorChoice() {
        const colors = app.forum.attribute('carvingContestColors');

        if (colors === 'all') {
            return m('input', {
                type: 'color',
                value: this.brush.color,
                onchange: (event: Event) => {
                    this.brush.color = (event.target as HTMLInputElement).value;
                },
            });
        }

        let colorOptions: string[];

        if (colors === 'simple') {
            colorOptions = [
                '#f32501', // Red
                '#ff8d12', // Orange
                '#ffe884', // Yellow
                '#94ae3f', // Green
                '#084f93', // Blue
                '#000000', // Black
            ];
        } else {
            colorOptions = app.forum.attribute('carvingContestColors').split(',');
        }

        return m('div', colorOptions.map(color => m('.CarvingContest-ColorChoice', {
            style: {
                backgroundColor: color,
            },
            onclick: () => {
                this.brush.color = color;
            },
            className: this.brush.color === color ? 'selected' : '',
        })));
    }

    colorTools() {
        if (!app.forum.attribute('carvingContestColorMode')) {
            return null;
        }

        return m('.CarvingContestTools', [
            this.colorChoice(),
        ]);
    }

    content() {
        return m('.Modal-body', [
            m('.Form-group', [
                this.colorTools(),
                m('.CarvingContestTools', [
                    Button.component({
                        disabled: this.brush.shape === 'circle',
                        icon: 'fas fa-circle',
                        className: 'Button',
                        onclick: () => {
                            this.brush.shape = 'circle';
                        },
                    }, app.translator.trans(translationPrefix + 'tools.circle')),
                    Button.component({
                        disabled: this.brush.shape === 'square',
                        icon: 'fas fa-square',
                        className: 'Button',
                        onclick: () => {
                            this.brush.shape = 'square';
                        },
                    }, app.translator.trans(translationPrefix + 'tools.square')),
                    m('input', {
                        type: 'range',
                        step: 2,
                        min: 10,
                        max: 50,
                        value: this.brush.width,
                        onchange: (event: Event) => {
                            this.brush.width = parseInt((event.target as HTMLInputElement).value);
                        },
                    }),
                ]),
                m(PumpkinCanvas, {
                    mode: app.forum.attribute('carvingContestColorMode') ? 'color' : 'carve',
                    brush: this.brush,
                    image: this.image,
                    onchange: value => {
                        this.image = value;

                        this.checkIfDisabled();
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(translationPrefix + 'name')),
                m('input[type=text].FormControl', {
                    value: this.name,
                    onchange: (event: Event) => {
                        this.name = (event.target as HTMLInputElement).value;

                        this.checkIfDisabled();
                    },
                }),
            ]),
            m('.Form-group', [
                Button.component({
                    loading: this.loading,
                    disabled: this.disabled,
                    className: 'Button Button--primary',
                    onclick: () => {
                        app.store.createRecord('carving-contest-entries').save({
                            name: this.name,
                            image: this.image,
                        }).then(() => {
                            this.attrs.onsave();
                        });
                    },
                }, app.translator.trans(translationPrefix + 'submit')),
            ]),
        ]);
    }
}
