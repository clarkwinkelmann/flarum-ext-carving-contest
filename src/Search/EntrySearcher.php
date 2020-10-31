<?php

namespace ClarkWinkelmann\CarvingContest\Search;

use ClarkWinkelmann\CarvingContest\Entry;
use Flarum\Search\ApplySearchParametersTrait;
use Flarum\Search\GambitManager;
use Flarum\Search\SearchCriteria;
use Flarum\Search\SearchResults;

class EntrySearcher
{
    use ApplySearchParametersTrait;

    protected $gambits;

    public function __construct(GambitManager $gambits)
    {
        $this->gambits = $gambits;
    }

    public function search(SearchCriteria $criteria, $limit = null, $offset = 0, array $load = [])
    {
        $actor = $criteria->actor;

        $query = Entry::query();

        $search = new EntrySearch($query->getQuery(), $actor);

        $this->gambits->apply($search, $criteria->query);
        $this->applySort($search, $criteria->sort);
        $this->applyOffset($search, $offset);
        $this->applyLimit($search, $limit + 1);

        $entries = $query->get();

        $areMoreResults = $limit > 0 && $entries->count() > $limit;

        if ($areMoreResults) {
            $entries->pop();
        }

        $entries->load($load);

        return new SearchResults($entries, $areMoreResults);
    }
}
