<?php

namespace App\Http\Controllers\Students;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function dashboard(){
        Inertia::share('layout.active_page', ['Dashboard']);
        return Inertia::render('Users/Students/Dashboard');
    }
}
