<?php

namespace ClarkWinkelmann\CarvingContest\Controllers;

use ClarkWinkelmann\CarvingContest\Entry;
use Flarum\Api\Controller\AbstractDeleteController;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class EntryDeleteController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $id = Arr::get($request->getQueryParams(), 'id');

        $request->getAttribute('actor')->assertCan('carving-contest.moderate');

        $entry = Entry::query()->findOrFail($id);

        $entry->delete();
    }
}
