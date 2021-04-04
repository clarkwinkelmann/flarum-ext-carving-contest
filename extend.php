<?php

namespace ClarkWinkelmann\CarvingContest;

use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Extend;
use Flarum\User\User;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less')
        ->route('/carving-contest', 'carving-contest', Content\Entries::class),
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/resources/less/admin.less'),
    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Routes('api'))
        ->get('/carving-contest/entries', 'carving-contest.entries.index', Controllers\EntryIndexController::class)
        ->post('/carving-contest/entries', 'carving-contest.entries.store', Controllers\EntryStoreController::class)
        ->patch('/carving-contest/entries/{id:[0-9]+}', 'carving-contest.entries.update', Controllers\EntryUpdateController::class)
        ->delete('/carving-contest/entries/{id:[0-9]+}', 'carving-contest.entries.delete', Controllers\EntryDeleteController::class),

    (new Extend\Model(User::class))
        ->hasMany('carvingContestEntries', Entry::class),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(function (ForumSerializer $serializer): array {
            return [
                'carvingContestCanView' => $serializer->getActor()->hasPermission('carving-contest.view'),
                'carvingContestCanModerate' => $serializer->getActor()->hasPermission('carving-contest.moderate'),
            ];
        }),

    (new Extend\ApiSerializer(UserSerializer::class))
        ->attributes(function (UserSerializer $serializer, User $user): array {
            if ($serializer->getActor()->can('carving-contest.view')) {
                return [
                    'carvingContestEntryCount' => $user->carving_contest_entry_count,
                ];
            }

            return [];
        }),

    (new Extend\ApiSerializer(BasicUserSerializer::class))
        ->attributes(function (BasicUserSerializer $serializer, User $user): array {
            // Use is() instead of CurrentUserSerializer because we need this information to update with relationships as well
            if ($serializer->getActor()->is($user)) {
                return [
                    'carvingContestCouldParticipate' => $user->can('createIfNotReachedLimit', Entry::class),
                    'carvingContestCanParticipate' => $user->can('create', Entry::class),
                ];
            }

            return [];
        }),

    (new Extend\Policy())
        ->modelPolicy(Entry::class, Policies\EntryPolicy::class),

    (new Extend\Filter(Filters\EntryFilterer::class))
        ->addFilter(Filters\NoOpFilter::class),

    (new Extend\Settings())
        ->serializeToForum('carvingContestColorMode', 'carving-contest.colorMode', 'boolval')
        ->serializeToForum('carvingContestColors', 'carving-contest.colors'),
];
