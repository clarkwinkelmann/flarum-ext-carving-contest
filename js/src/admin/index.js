import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import ItemList from 'flarum/utils/ItemList';
import SettingsModal from './modals/SettingsModal';

app.initializers.add('clarkwinkelmann/carving-contest', () => {
    app.extensionSettings['clarkwinkelmann-carving-contest'] = () => app.modal.show(SettingsModal);

    extend(PermissionGrid.prototype, 'permissionItems', groups => {
        const items = new ItemList();

        items.add('view', {
            icon: 'fas fa-spider',
            label: app.translator.trans('clarkwinkelmann-carving-contest.admin.permissions.view'),
            permission: 'carving-contest.view',
            allowGuest: true,
        });

        items.add('like', {
            icon: 'fas fa-spider',
            label: app.translator.trans('clarkwinkelmann-carving-contest.admin.permissions.like'),
            permission: 'carving-contest.like',
        });

        items.add('participate', {
            icon: 'fas fa-spider',
            label: app.translator.trans('clarkwinkelmann-carving-contest.admin.permissions.participate'),
            permission: 'carving-contest.participate',
        });

        items.add('moderate', {
            icon: 'fas fa-spider',
            label: app.translator.trans('clarkwinkelmann-carving-contest.admin.permissions.moderate'),
            permission: 'carving-contest.moderate',
        });

        groups.add('carving-contest', {
            label: app.translator.trans('clarkwinkelmann-carving-contest.admin.permissions.heading'),
            children: items.toArray(),
        });
    });
});
