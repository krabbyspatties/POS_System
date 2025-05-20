<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{

    use HasFactory, Notifiable;

    protected $table = 'tbl_users';
    protected $primaryKey = 'user_id';
    protected $fillable = [
        'first_name',
        'last_name',
        'user_image',
        'user_name',
        'user_email',
        'user_password',
        'user_phone',
        'user_address',
        'role',
        'user_status',
    ];
    protected $hidden = [
        'user_password',
    ];
}
