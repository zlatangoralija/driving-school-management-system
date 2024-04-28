<?php

namespace App\Http\Controllers\Students;

use App\Http\Controllers\Controller;
use App\Models\BookingInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvitationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Inertia::share('layout.active_page', ['Invitations']);
        return Inertia::render('Users/Students/Invitations/Index');
    }

    public function getInvitations(Request $request){
        $data['invitations'] = BookingInvitation::where('student_id', Auth::id())
            ->with('course', 'student', 'instructor')
            ->when($request->input('sort_by') && $request->input('sort_directions'), function ($q) use ($request){
                return $q->orderBy($request->input('sort_by'), $request->input('sort_directions'));
            }, function ($q) {
                return $q->orderBy('created_at', 'desc');
            })
            ->when($request->input('search') && $request->input('search') != '', function ($query) use ($request){
                return $query->where('course.name', 'like', '%'.$request->input('search').'%')
                    ->orWhere('instructor.name', 'like', '%'.$request->input('search').'%');
            })
            ->paginate($request->input('per_page') ?: 10);

        return $data;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
