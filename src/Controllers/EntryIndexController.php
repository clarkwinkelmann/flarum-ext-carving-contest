<?php

namespace ClarkWinkelmann\CarvingContest\Controllers;

use ClarkWinkelmann\CarvingContest\Entry;
use ClarkWinkelmann\CarvingContest\Serializers\EntrySerializer;
use Flarum\Api\Controller\AbstractListController;
use Flarum\User\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class EntryIndexController extends AbstractListController
{
    use AssertPermissionTrait;

    public $serializer = EntrySerializer::class;

    public $include = [
        'user',
        'likes',
    ];

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertCan($request->getAttribute('actor'), 'carving-contest.view');

        return Entry::query()
            ->orderBy('likes_count', 'desc')
            ->get();
    }
}
