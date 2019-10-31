<?php

namespace ClarkWinkelmann\CarvingContest\Controllers;

use ClarkWinkelmann\CarvingContest\Entry;
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class EntryDeleteController extends AbstractDeleteController
{
    use AssertPermissionTrait;

    protected function delete(ServerRequestInterface $request)
    {
        $id = Arr::get($request->getQueryParams(), 'id');

        $this->assertCan($request->getAttribute('actor'), 'carving-contest.moderate');

        $entry = Entry::query()->findOrFail($id);

        $entry->delete();
    }
}
