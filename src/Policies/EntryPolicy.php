<?php

namespace ClarkWinkelmann\CarvingContest\Policies;

use ClarkWinkelmann\CarvingContest\Entry;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class EntryPolicy extends AbstractPolicy
{
    function createIfNotReachedLimit(User $actor): bool
    {
        return $actor->hasPermission('carving-contest.participate');
    }

    function create(User $actor): bool
    {
        if (!$this->createIfNotReachedLimit($actor)) {
            return false;
        }

        /**
         * @var $settings SettingsRepositoryInterface
         */
        $settings = resolve(SettingsRepositoryInterface::class);

        $maxEntries = (int)$settings->get('carving-contest.maxEntriesPerUser');

        if ($maxEntries > 0) {
            return $actor->carving_contest_entry_count < $maxEntries;
        }

        return true;
    }

    function like(User $actor, Entry $entry): bool
    {
        if ($actor->cannot('carving-contest.like')) {
            return false;
        }

        return $entry->user_id !== $actor->id || $actor->can('carving-contest.moderate');
    }
}
