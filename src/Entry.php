<?php

namespace ClarkWinkelmann\CarvingContest;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Flarum\User\User;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $image
 * @property int $likes_count
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @property User $user
 */
class Entry extends AbstractModel
{
    protected $table = 'carving_contest_entries';

    public $timestamps = true;

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'carving_contest_likes');
    }
}
