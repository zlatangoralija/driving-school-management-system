<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->unsignedBiginteger('instructor_id')->nullable()->change();
            $table->unsignedBiginteger('admin_id')->nullable()->after('instructor_id');

            $table->foreign('admin_id')->references('id')
                ->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->unsignedBiginteger('instructor_id')->change();
            $table->dropColumn('admin_id');
        });
    }
};