<?php

namespace ClarkWinkelmann\CarvingContest\Filters;

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;

/**
 * We need at least one filter to register a filterer, so here's a dummy one
 */
class NoOpFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'noop';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        // no-op
    }
}
