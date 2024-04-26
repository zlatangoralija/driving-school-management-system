<?php

namespace App\Http\Controllers\Instructors;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstructorController extends Controller
{
    public function dashboard(){
        Inertia::share('layout.active_page', ['Dashboard']);
        return Inertia::render('Users/Instructors/Dashboard');
    }
}
