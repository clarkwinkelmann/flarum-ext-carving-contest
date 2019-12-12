<?php

namespace ClarkWinkelmann\CarvingContest\Content;

use ClarkWinkelmann\CarvingContest\Controllers\EntryIndexController;
use Flarum\Api\Client;
use Flarum\Frontend\Document;
use Flarum\Http\Exception\RouteNotFoundException;
use Flarum\User\User;
use Psr\Http\Message\ServerRequestInterface;

class Entries
{
    protected $api;

    public function __construct(Client $api)
    {
        $this->api = $api;
    }

    public function __invoke(Document $document, ServerRequestInterface $request)
    {
        $apiDocument = $this->getApiDocument($request->getAttribute('actor'));

        $document->payload['apiDocument'] = $apiDocument;

        return $document;
    }

    protected function getApiDocument(User $actor)
    {
        $response = $this->api->send(EntryIndexController::class, $actor);

        if ($response->getStatusCode() === 403) {
            throw new RouteNotFoundException();
        }

        return json_decode($response->getBody());
    }
}
