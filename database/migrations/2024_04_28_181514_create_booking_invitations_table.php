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
        Schema::create('booking_invitations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('instructor_id');
            $table->integer('status')->default(1);
            $table->timestamps();

            $table->foreign('student_id')->references('id')
                ->on('users')->onDelete('cascade');
            $table->foreign('instructor_id')->references('id')
                ->on('users')->onDelete('cascade');
            $table->foreign('course_id')->references('id')
                ->on('courses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_invitations');
    }
};
