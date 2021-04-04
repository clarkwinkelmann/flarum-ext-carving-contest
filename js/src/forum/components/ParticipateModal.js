import app from 'flarum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import PumpkinCanvas from './PumpkinCanvas';

const translationPrefix = 'clarkwinkelmann-carving-contest.forum.modal.';

/* global m */

export default class ParticipateModal extends Modal {
    toolShape = 'circle';
    toolWidth = 30;
    name = '';
    image = '';
    disabled = true;
    loading = false;

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

    content() {
        return m('.Modal-body', [
            m('.Form-group', [
                m('.CarvingContestTools', [
                    Button.component({
                        disabled: this.toolShape === 'circle',
                        icon: 'fas fa-circle',
                        className: 'Button',
                        onclick: () => {
                            this.toolShape = 'circle';
                        },
                    }, app.translator.trans(translationPrefix + 'tools.circle')),
                    Button.component({
                        disabled: this.toolShape === 'square',
                        icon: 'fas fa-square',
                        className: 'Button',
                        onclick: () => {
                            this.toolShape = 'square';
                        },
                    }, app.translator.trans(translationPrefix + 'tools.square')),
                    m('input', {
                        type: 'range',
                        step: 2,
                        min: 10,
                        max: 50,
                        value: this.toolWidth,
                        onchange: event => {
                            this.toolWidth = parseInt(event.target.value);
                        },
                    }),
                ]),
                m(PumpkinCanvas, {
                    toolShape: this.toolShape,
                    toolWidth: this.toolWidth,
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
                    onchange: event => {
                        this.name = event.target.value;

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
