<?php

namespace ClarkWinkelmann\CarvingContest\Policies;

use ClarkWinkelmann\CarvingContest\Entry;
use Flarum\User\AbstractPolicy;
use Flarum\User\User;

class EntryPolicy extends AbstractPolicy
{
    protected $model = Entry::class;

    function like(User $actor, Entry $entry)
    {
        if ($actor->cannot('carving-contest.like')) {
            return false;
        }

        return $entry->user_id !== $actor->id || $actor->can('carving-contest.moderate');
    }
}
