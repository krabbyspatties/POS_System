<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('first_name', 55);
            $table->string('last_name', 55);
            $table->string('user_name', 55);
            $table->string('user_email', 255)->unique();
            $table->string('password', 255);
            $table->string('user_phone', 20)->nullable();
            $table->string('user_address', 255)->nullable();
            $table->string('user_image', 255)->nullable();
            $table->enum('role', ['cashier', 'manager', 'administrator']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_users');
    }
};
