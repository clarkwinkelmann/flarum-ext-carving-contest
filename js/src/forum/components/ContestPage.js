import app from 'flarum/app';
import Page from 'flarum/components/Page';
import Button from 'flarum/components/Button';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import Dropdown from 'flarum/components/Dropdown';
import Link from 'flarum/components/Link';
import humanTime from 'flarum/helpers/humanTime';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';
import icon from 'flarum/helpers/icon';
import punctuateSeries from 'flarum/helpers/punctuateSeries';
import extractText from 'flarum/utils/extractText';
import ParticipateModal from './ParticipateModal';
import PumpkinCanvas from './PumpkinCanvas';
import EntryLikesModal from './EntryLikesModal';

/* global m */

const translationPrefix = 'clarkwinkelmann-carving-contest.forum.page.';

export default class ContestPage extends Page {
    oninit(vnode) {
        super.oninit(vnode);

        this.loading = true;
        this.moreResults = false;
        this.entries = [];
        this.sort = '-createdAt';

        this.refresh();
    }

    loadResults(offset) {
        const preloadedEntries = app.preloadedApiDocument();

        if (preloadedEntries) {
            return Promise.resolve(preloadedEntries);
        } else {
            return app.store.find('carving-contest/entries', {
                page: {
                    offset,
                },
                sort: this.sort,
            });
        }
    }

    refresh() {
        this.loading = true;
        this.entries = null;

        return this.loadResults().then(
            results => {
                this.entries = [];
                this.parseResults(results);
            },
            () => {
                this.loading = false;
                m.redraw();
            }
        );
    }

    loadMore() {
        this.loading = true;

        this.loadResults(this.entries.length)
            .then(this.parseResults.bind(this));
    }

    parseResults(results) {
        [].push.apply(this.entries, results);

        this.loading = false;
        this.moreResults = !!results.payload.links.next;

        m.redraw();
    }

    likeButton(entry) {
        if (!entry.canLike()) {
            return null;
        }

        const likes = entry.likes();
        const isLiked = app.session.user && likes && likes.some(user => user === app.session.user);

        return Button.component({
            className: 'Button Button--block' + (isLiked ? ' Button--primary Button-already-liked' : ''),
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
        }, isLiked ? [
            m('span.already-liked', [
                icon('far fa-thumbs-up'),
                ' ',
                app.translator.trans(translationPrefix + 'already-liked'),
            ]),
            m('span.remove-like', [
                icon('far fa-thumbs-down'),
                ' ',
                app.translator.trans(translationPrefix + 'unlike'),
            ])
        ] : [
            icon('far fa-thumbs-up'),
            ' ',
            app.translator.trans(translationPrefix + 'like'),
        ]);
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
            .map(user => m(Link, {
                href: app.route.user(user),
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
                    app.modal.show(EntryLikesModal, {
                        entry,
                    });
                },
            }, app.translator.transChoice('flarum-likes.forum.post.others_link', count, {count})));
        }

        return m('.Entry-likedBy', [
            icon('far fa-thumbs-up'),
            app.translator.transChoice('flarum-likes.forum.post.liked_by' + (likes[0] === app.session.user ? '_self' : '') + '_text', names.length, {
                count: names.length,
                users: punctuateSeries(names)
            }),
        ]);
    }

    participateButton() {
        if (!app.session.user) {
            return null;
        }

        if (app.session.user.attribute('carvingContestCanParticipate')) {
            return Button.component({
                className: 'Button Button--primary',
                onclick: () => {
                    app.modal.show(ParticipateModal, {
                        onsave: () => {
                            app.modal.close();
                            this.refresh();
                        },
                    });
                },
            }, app.translator.trans(translationPrefix + 'participate'));
        }

        if (app.session.user.attribute('carvingContestCouldParticipate')) {
            return Button.component({
                className: 'Button Button--primary',
                disabled: true,
            }, app.translator.trans(translationPrefix + 'already-participated'));
        }

        return null;
    }

    view() {
        if (this.entries === null) {
            return m('.container', m('p', app.translator.trans(translationPrefix + 'loading')));
        }

        const sortOptions = {
            '-likesCount': app.translator.trans(translationPrefix + 'sort.mostLikes'),
            'likesCount': app.translator.trans(translationPrefix + 'sort.fewerLikes'),
            '-createdAt': app.translator.trans(translationPrefix + 'sort.mostRecent'),
            'createdAt': app.translator.trans(translationPrefix + 'sort.leastRecent'),
        };

        return m('.container', [
            m('h2', app.translator.trans(translationPrefix + 'title')),
            this.participateButton(),
            ' ',
            Dropdown.component({
                buttonClassName: 'Button',
                label: sortOptions[this.sort],
            }, Object.keys(sortOptions).map(value => {
                const label = sortOptions[value];
                const active = this.sort === value;

                return Button.component({
                    icon: active ? 'fas fa-check' : true,
                    onclick: () => {
                        this.sort = value;
                        this.refresh();
                    },
                    active,
                }, label);
            })),
            ' ',
            Button.component({
                icon: 'fas fa-sync',
                className: 'Button',
                onclick: () => {
                    this.refresh();
                },
            }, app.translator.trans(translationPrefix + 'refresh')),
            m('div', this.entries.map(entry => m('.CarvingContestEntry', {
                key: entry.id(), // Without this, canvas are re-used, causing incorrect images to be shown when one is deleted
            }, [
                m(PumpkinCanvas, {
                    image: entry.image(),
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
                            this.refresh();
                        });
                    },
                }) : null,
                m('.CarvingContestEntry--vote', [
                    this.likeButton(entry),
                    this.whoLiked(entry),
                ]),
            ]))),
            this.loading ? LoadingIndicator.component() : (this.moreResults ? Button.component({
                className: 'Button',
                onclick: this.loadMore.bind(this),
            }, app.translator.trans(translationPrefix + 'load-more')) : null),
        ]);
    }
}
