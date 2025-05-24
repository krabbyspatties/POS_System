<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'first_name' => 'Test',
            'last_name' => 'Test',
            'user_name' => 'Test',
            'user_email' => 'Test@gmail.com',
            'password' => Hash::make('123456789'),
            'user_phone' => '0946593123451',
            'user_address' => 'Test',
            'user_image' => '',
            'role' => 'Administrator',

        ]);
    }
}
