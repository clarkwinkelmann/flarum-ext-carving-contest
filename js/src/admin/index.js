import app from 'flarum/app';

/* global m */

app.initializers.add('carving-contest', () => {
    app.extensionData.for('clarkwinkelmann-carving-contest')
        .registerSetting(function () {
            return m('.Form-group', [
                m('label', app.translator.trans('clarkwinkelmann-carving-contest.admin.settings.maxEntriesPerUser')),
                m('input.FormControl', {
                    type: 'number',
                    min: 0,
                    step: 1,
                    bidi: this.setting('carving-contest.maxEntriesPerUser', 0),
                }),
            ]);
        })
        .registerPermission({
            icon: 'fas fa-spider',
            label: app.translator.trans('clarkwinkelmann-carving-contest.admin.permissions.view'),
            permission: 'carving-contest.view',
            allowGuest: true,
        }, 'view')
        .registerPermission({
            icon: 'fas fa-spider',
            label: app.translator.trans('clarkwinkelmann-carving-contest.admin.permissions.like'),
            permission: 'carving-contest.like',
        }, 'reply')
        .registerPermission({
            icon: 'fas fa-spider',
            label: app.translator.trans('clarkwinkelmann-carving-contest.admin.permissions.participate'),
            permission: 'carving-contest.participate',
        }, 'reply')
        .registerPermission({
            icon: 'fas fa-spider',
            label: app.translator.trans('clarkwinkelmann-carving-contest.admin.permissions.moderate'),
            permission: 'carving-contest.moderate',
        }, 'moderate');
});
