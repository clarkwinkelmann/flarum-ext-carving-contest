<?php

namespace ClarkWinkelmann\CarvingContest\Providers;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
use Illuminate\Support\ServiceProvider;

class ForumAttributes extends ServiceProvider
{
    public function register()
    {
        $this->app['events']->listen(Serializing::class, [$this, 'attributes']);
    }

    public function attributes(Serializing $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes += [
                'carvingContestCanView' => $event->actor->hasPermission('carving-contest.view'),
                'carvingContestCanModerate' => $event->actor->hasPermission('carving-contest.moderate'),
            ];
        }
    }
}
