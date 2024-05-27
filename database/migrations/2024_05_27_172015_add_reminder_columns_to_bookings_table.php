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
            $table->boolean('reminder_1hr_student')->after('uuid')->default(0);
            $table->boolean('reminder_24hr_student')->after('reminder_1hr_student')->default(0);
            $table->boolean('reminder_1hr_instructor')->after('reminder_24hr_student')->default(0);
            $table->boolean('reminder_24hr_instructor')->after('reminder_1hr_instructor')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            //
        });
    }
};
