<?php

namespace ClarkWinkelmann\CarvingContest\Serializers;

use ClarkWinkelmann\CarvingContest\Entry;
use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;

class EntrySerializer extends AbstractSerializer
{
    protected $type = 'carving-contest-entries';

    /**
     * @param Entry $entry
     * @return array
     */
    protected function getDefaultAttributes($entry)
    {
        return [
            'name' => $entry->name,
            'image' => $entry->image,
            'createdAt' => $this->formatDate($entry->created_at),
            'canLike' => $this->actor->can('like', $entry),
        ];
    }

    public function user($entry)
    {
        return $this->hasOne($entry, BasicUserSerializer::class, 'user');
    }

    public function likes($entry)
    {
        return $this->hasMany($entry, BasicUserSerializer::class, 'likes');
    }
}
