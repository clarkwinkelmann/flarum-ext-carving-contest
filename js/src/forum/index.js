import {extend, override} from 'flarum/extend';
import app from 'flarum/app';
import IndexPage from 'flarum/components/IndexPage';
import LinkButton from 'flarum/components/LinkButton';
import Entry from './models/Entry';
import ContestPage from './components/ContestPage';

app.initializers.add('clarkwinkelmann/carving-contest', () => {
    app.store.models['carving-contest-entries'] = Entry;

    app.routes.carvingContest = {
        path: '/carving-contest',
        component: ContestPage.component(),
    };

    extend(IndexPage.prototype, 'navItems', function (items) {
        if (app.forum.attribute('carvingContestCanView')) {
            items.add('carving-contest', LinkButton.component({
                icon: 'fas fa-spider',
                children: app.translator.trans('clarkwinkelmann-carving-contest.forum.nav.contest'),
                href: app.route('carvingContest'),
            }));
        }
    });
});
