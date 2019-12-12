<?php

namespace ClarkWinkelmann\CarvingContest\Extenders;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

class ForumAttributes implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Serializing::class, [$this, 'attributes']);
    }

    public function attributes(Serializing $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['carvingContestCanView'] = $event->actor->can('carving-contest.view');
            $event->attributes['carvingContestCanParticipate'] = $event->actor->can('carving-contest.participate');
            $event->attributes['carvingContestCanModerate'] = $event->actor->can('carving-contest.moderate');
        }
    }
}
