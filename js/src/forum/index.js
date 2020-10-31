import {extend} from 'flarum/extend';
import app from 'flarum/app';
import IndexPage from 'flarum/components/IndexPage';
import LinkButton from 'flarum/components/LinkButton';
import Entry from './models/Entry';
import ContestPage from './components/ContestPage';

/* global m */

app.initializers.add('clarkwinkelmann/carving-contest', () => {
    app.store.models['carving-contest-entries'] = Entry;

    app.routes.carvingContest = {
        path: '/carving-contest',
        component: ContestPage,
    };

    extend(IndexPage.prototype, 'navItems', function (items) {
        if (!app.forum.attribute('carvingContestCanView')) {
            return;
        }

        items.add('carving-contest', LinkButton.component({
            icon: 'fas fa-spider',
            href: app.route('carvingContest'),
        }, app.translator.trans('clarkwinkelmann-carving-contest.forum.nav.contest')));
    });
});
