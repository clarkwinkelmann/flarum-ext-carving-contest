import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';

app.initializers.add('carving-contest', () => {
    app.extensionData.for('clarkwinkelmann-carving-contest')
        .registerSetting(function (this: ExtensionPage) {
            return m('.Form-group', [
                m('label', app.translator.trans('clarkwinkelmann-carving-contest.admin.settings.maxEntriesPerUser')),
                m('input.FormControl', {
                    type: 'number',
                    min: 0,
                    step: 1,
                    bidi: this.setting('carving-contest.maxEntriesPerUser', '0'),
                }),
            ]);
        })
        .registerSetting({
            type: 'switch',
            setting: 'carving-contest.colorMode',
            label: app.translator.trans('clarkwinkelmann-carving-contest.admin.settings.colorMode'),
        })
        .registerSetting(function (this: ExtensionPage) {
            const setting = this.setting('carving-contest.colors', 'simple');
            const disabled = !this.setting('carving-contest.colorMode')();

            return [
                m('.Form-group.CarvingContest-Subgroup', [
                    m('label', [
                        m('input', {
                            type: 'radio',
                            name: 'carving-contest-color',
                            checked: setting() === 'simple',
                            onchange: () => setting('simple'),
                            disabled,
                        }),
                        ' ',
                        app.translator.trans('clarkwinkelmann-carving-contest.admin.colors.simple'),
                    ]),
                    m('label', [
                        m('input', {
                            type: 'radio',
                            name: 'carving-contest-color',
                            checked: setting() === 'all',
                            onchange: () => setting('all'),
                            disabled,
                        }),
                        ' ',
                        app.translator.trans('clarkwinkelmann-carving-contest.admin.colors.all'),
                    ]),
                    m('label', [
                        m('input', {
                            type: 'radio',
                            name: 'carving-contest-color',
                            checked: setting() !== 'simple' && setting() !== 'all',
                            onchange: () => setting(''),
                            disabled,
                        }),
                        ' ',
                        app.translator.trans('clarkwinkelmann-carving-contest.admin.colors.custom'),
                    ]),
                    setting() !== 'simple' && setting() !== 'all' ? [
                        m('input.FormControl', {
                            bidi: setting,
                            disabled,
                        }),
                        m('.helpText', app.translator.trans('clarkwinkelmann-carving-contest.admin.colors.custom-help')),
                    ] : null,
                ]),
            ];
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
