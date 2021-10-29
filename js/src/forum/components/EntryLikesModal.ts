import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Link from 'flarum/common/components/Link';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import Entry from '../models/Entry';

interface ModalAttrs {
    entry: Entry
}

// @ts-ignore Modal.view causing typescript errors
export default class PostLikesModal extends Modal {
    // We cannot type-hint through extend at this time so we code it here
    attrs!: ModalAttrs

    className() {
        return 'EntryLikesModal Modal--small';
    }

    title() {
        return app.translator.trans('clarkwinkelmann-carving-contest.forum.likes_modal.title');
    }

    content() {
        return m('.Modal-body', m('ul.EntryLikesModal-list', (this.attrs.entry.likes() || []).map(user => m('li', m(Link, {
            href: app.route.user(user),
        }, [
            avatar(user),
            ' ',
            username(user),
        ])))));
    }
}
