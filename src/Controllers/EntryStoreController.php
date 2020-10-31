<?php

namespace ClarkWinkelmann\CarvingContest\Controllers;

use ClarkWinkelmann\CarvingContest\Entry;
use ClarkWinkelmann\CarvingContest\Serializers\EntrySerializer;
use ClarkWinkelmann\CarvingContest\Validators\EntryValidator;
use Flarum\Api\Controller\AbstractCreateController;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class EntryStoreController extends AbstractCreateController
{
    public $serializer = EntrySerializer::class;

    public $include = [
        'user',
        'likes',
    ];

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');

        $actor->assertCan('carving-contest.participate');

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        /**
         * @var $validator EntryValidator
         */
        $validator = app(EntryValidator::class);

        $validator->assertValid($attributes);

        $entry = new Entry();
        $entry->user()->associate($actor);
        $entry->name = Arr::get($attributes, 'name');
        $entry->image = Arr::get($attributes, 'image');
        $entry->save();

        return $entry;
    }
}
