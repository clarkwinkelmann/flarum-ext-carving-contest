<?php

namespace ClarkWinkelmann\CarvingContest\Policies;

use ClarkWinkelmann\CarvingContest\Entry;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AbstractPolicy;
use Flarum\User\User;

class EntryPolicy extends AbstractPolicy
{
    protected $model = Entry::class;

    function createIfNotReachedLimit(User $actor)
    {
        return $actor->hasPermission('carving-contest.participate');
    }

    function create(User $actor)
    {
        if (!$this->createIfNotReachedLimit($actor)) {
            return false;
        }

        /**
         * @var $settings SettingsRepositoryInterface
         */
        $settings = app(SettingsRepositoryInterface::class);

        $maxEntries = (int)$settings->get('carving-contest.maxEntriesPerUser');

        if ($maxEntries > 0) {
            return $actor->carving_contest_entry_count < $maxEntries;
        }

        return true;
    }

    function like(User $actor, Entry $entry)
    {
        if ($actor->cannot('carving-contest.like')) {
            return false;
        }

        return $entry->user_id !== $actor->id || $actor->can('carving-contest.moderate');
    }
}
