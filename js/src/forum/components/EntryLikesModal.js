import Modal from 'flarum/components/Modal';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';

/* global m */

export default class PostLikesModal extends Modal {
    className() {
        return 'EntryLikesModal Modal--small';
    }

    title() {
        return app.translator.trans('clarkwinkelmann-carving-contest.forum.likes_modal.title');
    }

    content() {
        return m('.Modal-body', m('ul.EntryLikesModal-list', this.props.entry.likes().map(user => m('li', m('a', {
            href: app.route.user(user),
            config: m.route,
        }, [
            avatar(user),
            ' ',
            username(user),
        ])))));
    }
}
