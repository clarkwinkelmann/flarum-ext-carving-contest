<?php

use Flarum\Database\Migration;

return Migration::addColumns('users', [
    'carving_contest_entry_count' => ['integer', 'unsigned' => true, 'default' => 0],
]);
