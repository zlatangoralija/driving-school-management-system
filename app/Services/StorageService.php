<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class StorageService
{
    protected $disk;

    public function __construct()
    {
        $this->disk = 'local';
    }

    public function getFileContents($path)
    {
        Storage::disk($this->disk)->get($path);
    }

    public function putFile($path, $file)
    {
        return Storage::disk($this->disk)->put($path, $file);
    }

    public function deleteFile($path)
    {
        return Storage::disk($this->disk)->delete($path);
    }

    public function files($directory = '')
    {
        return Storage::disk($this->disk)->allFiles($directory);
    }

    public function url($path)
    {
        return Storage::disk($this->disk)->url($path);
    }

    public function makeDirectory($path)
    {
        return Storage::disk($this->disk)->makeDirectory($path);
    }

    public function moveFile($fromPath, $toPath){
        return Storage::disk($this->disk)->move($fromPath, $toPath);
    }

    public function parseUploadedFile($input, $spacesDir){
        $file = json_decode($input, true);
        $fileName = str_replace('temp/', '', $file['path']);
        $fileTempPath = $file['path'];
        $filePath = $spacesDir.$fileName;

        $existsInTmp = Storage::exists($fileTempPath);
        if ($existsInTmp) {
            $fileContent = Storage::get($fileTempPath);
            $img = Image::make($fileContent)
                ->resize(640, null, function ($constraint) {
                    $constraint->aspectRatio();
                })->save(storage_path('app/').$fileTempPath);

            $this->putFile($filePath, $fileContent);
            return $filePath;
        }
    }

}
