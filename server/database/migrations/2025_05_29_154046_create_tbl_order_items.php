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
        Schema::create('tbl_order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('item_id');
            $table->integer('quantity')->default(1);
            $table->decimal('price', 8, 2);
            $table->decimal('total_price', 8, 2);
            $table->decimal('original_price', 8, 2)->nullable();
            $table->integer('discount_percent')->default(0);
            $table->timestamps();

            $table->foreign('order_id')->references('order_id')->on('tbl_orders')->onDelete('cascade');
            $table->foreign('item_id')->references('item_id')->on('tbl_items')->onDelete('cascade');

            $table->index(['order_id', 'item_id']);
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_order_items');
    }
};
