<?php

namespace ClarkWinkelmann\CarvingContest;

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less')
        ->route('/carving-contest', 'carving-contest', Content\Entries::class),
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),
    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Routes('api'))
        ->get('/carving-contest/entries', 'carving-contest.entries.index', Controllers\EntryIndexController::class)
        ->post('/carving-contest/entries', 'carving-contest.entries.store', Controllers\EntryStoreController::class)
        ->patch('/carving-contest/entries/{id:[0-9]+}', 'carving-contest.entries.update', Controllers\EntryUpdateController::class)
        ->delete('/carving-contest/entries/{id:[0-9]+}', 'carving-contest.entries.delete', Controllers\EntryDeleteController::class),

    new Extenders\ForumAttributes(),
];
