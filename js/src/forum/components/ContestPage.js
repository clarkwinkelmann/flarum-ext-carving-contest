import app from 'flarum/app';
import Page from 'flarum/components/Page';
import Button from 'flarum/components/Button';
import humanTime from 'flarum/helpers/humanTime';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';
import icon from 'flarum/helpers/icon';
import punctuateSeries from 'flarum/helpers/punctuateSeries';
import extractText from 'flarum/utils/extractText';
import ParticipateModal from './ParticipateModal';
import PumpkinCanvas from './PumpkinCanvas';

/* global m */

const translationPrefix = 'clarkwinkelmann-carving-contest.forum.page.';

export default class ContestPage extends Page {
    init() {
        super.init();

        this.refreshEntries();
    }

    refreshEntries() {
        this.entries = null;

        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/carving-contest/entries',
        }).then(result => {
            this.entries = app.store.pushPayload(result);
            m.redraw();
        });
    }

    likeButton(entry) {
        if (!app.forum.attribute('carvingContestCanLike')) {
            return null;
        }

        const likes = entry.likes();
        const isLiked = app.session.user && likes && likes.some(user => user === app.session.user);

        return Button.component({
            children: app.translator.trans(translationPrefix + (isLiked ? 'unlike' : 'like')),
            className: 'Button Button--link',
            onclick: () => {
                entry.save({
                    isLiked: !isLiked,
                });

                // We've saved the fact that we do or don't like the entry, but in order
                // to provide instantaneous feedback to the user, we'll need to add or
                // remove the like from the relationship data manually.
                const data = entry.data.relationships.likes.data;
                data.some((like, i) => {
                    if (like.id === app.session.user.id()) {
                        data.splice(i, 1);
                        return true;
                    }
                });

                if (!isLiked) {
                    data.unshift({type: 'users', id: app.session.user.id()});
                }
            }
        });
    }

    whoLiked(entry) {
        const likes = entry.likes();

        if (!likes || !likes.length) {
            return;
        }

        const limit = 4;
        const overLimit = likes.length > limit;

        // Construct a list of names of users who have liked this post. Make sure the
        // current user is first in the list, and cap a maximum of 4 items.
        const names = likes.sort(a => a === app.session.user ? -1 : 1)
            .slice(0, overLimit ? limit - 1 : limit)
            .map(user => m('a', {
                href: app.route.user(user),
                config: m.route,
            }, user === app.session.user ? app.translator.trans('flarum-likes.forum.post.you_text') : username(user)));

        // If there are more users that we've run out of room to display, add a "x
        // others" name to the end of the list. Clicking on it will display a modal
        // with a full list of names.
        if (overLimit) {
            const count = likes.length - names.length;

            names.push(m('a', {
                href: '#',
                onclick: e => {
                    e.preventDefault();
                    app.modal.show(new PostLikesModal({post}));
                },
            }, app.translator.transChoice('flarum-likes.forum.post.others_link', count, {count})));
        }

        return m('.Post-likedBy', [
            icon('far fa-thumbs-up'),
            app.translator.transChoice('flarum-likes.forum.post.liked_by' + (likes[0] === app.session.user ? '_self' : '') + '_text', names.length, {
                count: names.length,
                users: punctuateSeries(names)
            }),
        ]);
    }

    view() {
        if (this.entries === null) {
            return m('.container', m('p', app.translator.trans(translationPrefix + 'loading')));
        }

        return m('.container', [
            m('h2', app.translator.trans(translationPrefix + 'title')),
            app.forum.attribute('carvingContestCanParticipate') ? Button.component({
                className: 'Button Button--primary',
                onclick: () => {
                    app.modal.show(new ParticipateModal({
                        oncreate: () => {
                            app.modal.close();
                            this.refreshEntries();
                        },
                    }));
                },
                children: app.translator.trans(translationPrefix + 'participate'),
            }) : null,
            m('div', this.entries.map(entry => m('.CarvingContestEntry', {
                key: entry.id(), // Without this, canvas are re-used, causing incorrect images to be shown when one is deleted
            }, [
                PumpkinCanvas.component({
                    image: m.prop(entry.image()),
                }),
                m('h3.CarvingContestEntry--name', entry.name()),
                m('p', [
                    avatar(entry.user()),
                    username(entry.user()),
                    ' - ',
                    humanTime(entry.createdAt()),
                ]),
                app.forum.attribute('carvingContestCanModerate') ? Button.component({
                    className: 'Button Button--icon CarvingContestEntry--delete',
                    icon: 'fas fa-trash',
                    onclick: () => {
                        if (!confirm(extractText(app.translator.trans(translationPrefix + 'delete-confirmation', {
                            name: entry.name(),
                            user: entry.user(),
                        })))) {
                            return;
                        }

                        entry.delete().then(() => {
                            this.refreshEntries();
                        });
                    },
                }) : null,
                m('.CarvingContestEntry--vote', [
                    this.likeButton(entry),
                    this.whoLiked(entry),
                ]),
            ]))),
        ]);
    }
}
