<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $file = $request->file('file');

        $ext_num = 0 - (strlen($file->getClientOriginalExtension()) + 1);
        $clean_filename = mb_substr($file->getClientOriginalName(), 0, $ext_num);
        $slug_filename = Str::slug($clean_filename, '_');
        $filename = $slug_filename
            .'_'
            .Str::random(9)
            .'.'
            .strtolower($file->getClientOriginalExtension());

        if ($request->filled('location')) {
            if (strtolower($file->getClientOriginalExtension()) === 'pdf' || $file->getClientOriginalExtension() === 'text/plain') {
                $fileContent = file_get_contents($file);
                $encryptedContent = encrypt($fileContent);
                file_put_contents($file, $encryptedContent);
                $filename = preg_replace('/[^a-z0-9]+/', '-', strtolower($request->patient_last_name))
                    .'_'
                    .date('d_m_Y_H_i_s')
                    .'_'.Str::random(4)
                    .'.'
                    .strtolower($file->getClientOriginalExtension());
            }

            $uploaded_image = Storage::putFileAs($request->input('location'), $file, $filename);
        } else {
            $uploaded_image = Storage::putFileAs(config('TEMP_DIR', 'temp'), $file, $filename);
        }
        $contentType = mime_content_type(storage_path('app/'.$uploaded_image));

        if ($uploaded_image) {
            return response()->json([
                'path' => $uploaded_image,
                'originalName' => $slug_filename.'.'.strtolower($file->getClientOriginalExtension()),
                'mime' => $contentType,
            ]);
        } else {
            return response()->json('error', 400);
        }
    }
}
