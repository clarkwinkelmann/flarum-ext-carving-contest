<?php

namespace ClarkWinkelmann\CarvingContest\Filters;

use ClarkWinkelmann\CarvingContest\Entry;
use Flarum\Filter\AbstractFilterer;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class EntryFilterer extends AbstractFilterer
{
    protected function getQuery(User $actor): Builder
    {
        return Entry::query();
    }
}
