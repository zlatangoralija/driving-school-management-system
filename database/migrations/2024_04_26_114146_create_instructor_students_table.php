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
        Schema::create('instructor_students', function (Blueprint $table) {
            $table->id();
            $table->unsignedBiginteger('student_id');
            $table->unsignedBiginteger('instructor_id');

            $table->foreign('student_id')->references('id')
                ->on('users')->onDelete('cascade');
            $table->foreign('instructor_id')->references('id')
                ->on('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instructor_students');
    }
};
