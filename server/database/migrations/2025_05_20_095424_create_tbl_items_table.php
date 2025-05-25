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
        Schema::create('tbl_items', function (Blueprint $table) {
            $table->id('item_id');
            $table->string('item_name', 55);
            $table->string('item_description', 255);
            $table->decimal('item_price', 8, 2);
            $table->integer('item_quantity');
            $table->string('item_image', 255)->nullable();
            $table->enum('stock_level', ['available', 'unavailable', 'low_inventory'])->default('available');
            $table->unsignedBigInteger('category_id');
            $table->foreign('category_id')
                ->references('category_id')
                ->on('tbl_item_category')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_items');
        Schema::enableForeignKeyConstraints();
    }
};
