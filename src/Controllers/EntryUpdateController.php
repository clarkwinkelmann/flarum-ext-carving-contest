<?php

namespace ClarkWinkelmann\CarvingContest\Controllers;

use ClarkWinkelmann\CarvingContest\Entry;
use ClarkWinkelmann\CarvingContest\Serializers\EntrySerializer;
use Flarum\Api\Controller\AbstractShowController;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class EntryUpdateController extends AbstractShowController
{
    public $serializer = EntrySerializer::class;

    public $include = [
        'user',
        'likes',
    ];

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $id = Arr::get($request->getQueryParams(), 'id');

        $actor = $request->getAttribute('actor');

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        /**
         * @var $entry Entry
         */
        $entry = Entry::query()->findOrFail($id);

        $actor->assertCan('like', $entry);

        if (isset($attributes['isLiked'])) {
            $liked = (bool)$attributes['isLiked'];

            $currentlyLiked = $entry->likes()->where('user_id', $actor->id)->exists();

            if ($liked && !$currentlyLiked) {
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
