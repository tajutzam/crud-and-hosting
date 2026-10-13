<?php

use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id')->unique();
            $table->foreignIdFor(User::class)->constrained()->onDelete("cascade");
            $table->unsignedBigInteger('total_amount');
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled']);
            $table->boolean("is_reseller")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
