import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';
import LinkButton from 'flarum/common/components/LinkButton';
import ItemList from 'flarum/common/utils/ItemList';
import Entry from './models/Entry';
import ContestPage from './components/ContestPage';

app.initializers.add('carving-contest', () => {
    app.store.models['carving-contest-entries'] = Entry;

    app.routes.carvingContest = {
        path: '/carving-contest',
        component: ContestPage,
    };

    extend(IndexPage.prototype, 'navItems', function (items: ItemList) {
        if (!app.forum.attribute('carvingContestCanView')) {
            return;
        }

        items.add('carving-contest', LinkButton.component({
            icon: 'fas fa-spider',
            href: app.route('carvingContest'),
        }, app.translator.trans('clarkwinkelmann-carving-contest.forum.nav.contest')));
    });
});
