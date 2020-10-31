import app from 'flarum/app';
import BaseSettingsModal from 'flarum/components/SettingsModal';

/* global m */

const settingsPrefix = 'carving-contest.';
const translationPrefix = 'clarkwinkelmann-carving-contest.admin.settings.';

export default class SettingsModal extends BaseSettingsModal {
    title() {
        return app.translator.trans(translationPrefix + 'title');
    }

    form() {
        return [
            m('.Form-group', [
                m('label', app.translator.trans(translationPrefix + 'maxEntriesPerUser')),
                m('input.FormControl', {
                    type: 'number',
                    min: 0,
                    step: 1,
                    bidi: this.setting(settingsPrefix + 'maxEntriesPerUser', 0),
                }),
            ]),
        ];
    }
}
