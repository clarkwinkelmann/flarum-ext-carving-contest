<?php

namespace ClarkWinkelmann\CarvingContest\Providers;

use ClarkWinkelmann\CarvingContest\Entry;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Illuminate\Support\ServiceProvider;

class UserAttributes extends ServiceProvider
{
    public function register()
    {
        $this->app['events']->listen(Serializing::class, [$this, 'attributes']);
    }

    public function attributes(Serializing $event)
    {
        if ($event->isSerializer(UserSerializer::class) && $event->actor->can('carving-contest.view')) {
            $event->attributes['carvingContestEntryCount'] = $event->model->carving_contest_entry_count;
        }

        if ($event->isSerializer(BasicUserSerializer::class) && $event->actor->is($event->model)) {
            $event->attributes += [
                'carvingContestCouldParticipate' => $event->actor->can('createIfNotReachedLimit', Entry::class),
                'carvingContestCanParticipate' => $event->actor->can('create', Entry::class),
            ];
        }
    }
}
