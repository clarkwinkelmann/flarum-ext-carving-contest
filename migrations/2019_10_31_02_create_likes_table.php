<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('carving_contest_likes', function (Blueprint $table) {
            $table->unsignedInteger('entry_id');
            $table->unsignedInteger('user_id');

            $table->primary([
                'entry_id',
                'user_id',
            ]);

            $table->foreign('entry_id')->references('id')->on('carving_contest_entries')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('carving_contest_likes');
    },
];
