<?php

namespace ClarkWinkelmann\CarvingContest\Controllers;

use ClarkWinkelmann\CarvingContest\Filters\EntryFilterer;
use ClarkWinkelmann\CarvingContest\Serializers\EntrySerializer;
use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\UrlGenerator;
use Flarum\Query\QueryCriteria;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class EntryIndexController extends AbstractListController
{
    public $serializer = EntrySerializer::class;

    public $include = [
        'user',
        'likes',
    ];

    public $sortFields = [
        'likesCount',
        'createdAt',
    ];

    public $sort = [
        'createdAt' => 'desc',
    ];

    public $limit = 12;

    protected $filterer;
    protected $url;

    public function __construct(EntryFilterer $filterer, UrlGenerator $url)
    {
        $this->filterer = $filterer;
        $this->url = $url;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');

        $actor->assertCan('carving-contest.view');

        $filters = $this->extractFilter($request);
        $sort = $this->extractSort($request);

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);
        $include = $this->extractInclude($request);

        $criteria = new QueryCriteria($actor, $filters, $sort);
        $results = $this->filterer->filter($criteria, $limit, $offset);

        $document->addPaginationLinks(
            $this->url->to('api')->route('carving-contest.entries.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $results->areMoreResults() ? null : 0
        );

        return $results->getResults()->load($include);
    }
}
