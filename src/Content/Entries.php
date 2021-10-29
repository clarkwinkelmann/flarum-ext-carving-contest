<?php

namespace ClarkWinkelmann\CarvingContest\Content;

use Flarum\Api\Client;
use Flarum\Frontend\Document;
use Flarum\Http\Exception\RouteNotFoundException;
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
        $apiDocument = $this->getApiDocument($request);

        $document->payload['apiDocument'] = $apiDocument;
    }

    protected function getApiDocument(ServerRequestInterface $request)
    {
        $response = $this->api->withParentRequest($request)->get('/carving-contest/entries');

        if ($response->getStatusCode() === 403) {
            throw new RouteNotFoundException();
        }

        return json_decode($response->getBody());
    }
}
