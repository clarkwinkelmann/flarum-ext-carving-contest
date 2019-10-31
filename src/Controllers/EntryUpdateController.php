<?php

namespace ClarkWinkelmann\CarvingContest\Controllers;

use ClarkWinkelmann\CarvingContest\Entry;
use ClarkWinkelmann\CarvingContest\Serializers\EntrySerializer;
use Flarum\Api\Controller\AbstractShowController;
use Flarum\User\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class EntryUpdateController extends AbstractShowController
{
    use AssertPermissionTrait;

    public $serializer = EntrySerializer::class;

    public $include = [
        'user',
        'likes',
    ];

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $id = array_get($request->getQueryParams(), 'id');

        $actor = $request->getAttribute('actor');

        $this->assertCan($actor, 'carving-contest.like');

        $attributes = array_get($request->getParsedBody(), 'data.attributes', []);

        /**
         * @var $entry Entry
         */
        $entry = Entry::query()->findOrFail($id);

        if (isset($attributes['isLiked'])) {
            $liked = (bool) $attributes['isLiked'];

            $currentlyLiked = $entry->likes()->where('user_id', $actor->id)->exists();

            if ($liked && ! $currentlyLiked) {
                $entry->likes()->attach($actor->id);
            } elseif ($currentlyLiked) {
                $entry->likes()->detach($actor->id);
            }

            $entry->likes_count = $entry->likes()->count();
            $entry->save();
        }

        return $entry;
    }
}
