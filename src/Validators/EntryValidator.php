<?php

namespace ClarkWinkelmann\CarvingContest\Validators;

use Flarum\Foundation\AbstractValidator;

class EntryValidator extends AbstractValidator
{
    protected $rules = [
        'name' => 'required|string|min:3|max:255',
        'image' => [
            'required',
            'max:65535',
            'regex:~^data:image/png;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$~',
        ],
    ];
}
