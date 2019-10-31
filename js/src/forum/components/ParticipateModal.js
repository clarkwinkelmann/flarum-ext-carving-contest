import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import PumpkinCanvas from './PumpkinCanvas';

const translationPrefix = 'clarkwinkelmann-carving-contest.forum.modal.';

/* global m */

export default class ParticipateModal extends Modal {
    toolShape = m.prop('circle');
    toolWidth = m.prop(30);
    name = m.prop('');
    image = m.prop('');
    loading = false;

    className() {
        return 'Modal--large';
    }

    title() {
        return app.translator.trans(translationPrefix + 'title');
    }

    content() {
        return m('.Modal-body', [
            m('.Form-group', [
                m('.CarvingContestTools', [
                    Button.component({
                        disabled: this.toolShape() === 'circle',
                        icon: 'fas fa-circle',
                        className: 'Button',
                        onclick: () => {
                            this.toolShape('circle');
                        },
                        children: app.translator.trans(translationPrefix + 'tools.circle'),
                    }),
                    Button.component({
                        disabled: this.toolShape() === 'square',
                        icon: 'fas fa-square',
                        className: 'Button',
                        onclick: () => {
                            this.toolShape('square');
                        },
                        children: app.translator.trans(translationPrefix + 'tools.square'),
                    }),
                    m('input', {
                        type: 'range',
                        step: 2,
                        min: 10,
                        max: 50,
                        bidi: this.toolWidth,
                    }),
                ]),
                PumpkinCanvas.component({
                    toolShape: this.toolShape,
                    toolWidth: this.toolWidth,
                    image: this.image,
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(translationPrefix + 'name')),
                m('input[type=text].FormControl', {
                    bidi: this.name,
                }),
            ]),
            m('.Form-group', [
                Button.component({
                    loading: this.loading,
                    disabled: this.name() === '' || this.image() === '',
                    className: 'Button Button--primary',
                    children: app.translator.trans(translationPrefix + 'submit'),
                    onclick: () => {
                        app.store.createRecord('carving-contest-entries').save({
                            name: this.name(),
                            image: this.image(),
                        }).then(() => {
                            this.props.oncreate();
                        });
                    },
                }),
            ]),
        ]);
    }
}
