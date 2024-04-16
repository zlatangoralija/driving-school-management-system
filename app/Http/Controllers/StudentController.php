<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function dashboard(){
        return Inertia::render('Users/Students/Dashboard');
    }
}
