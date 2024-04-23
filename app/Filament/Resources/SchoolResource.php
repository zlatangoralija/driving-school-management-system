<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SchoolResource\Pages;
use App\Filament\Resources\SchoolResource\RelationManagers;
use App\Models\School;
use App\Models\Tenant;
use App\Models\User;
use Carbon\Carbon;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use Malzariey\FilamentDaterangepickerFilter\Filters\DateRangeFilter;
use Stancl\Tenancy\Database\Models\Domain;

class SchoolResource extends Resource
{
    protected static ?string $model = Tenant::class;
    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $navigationGroup = 'Administration';
    protected static ?string $label = 'School';

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                TextEntry::make('name'),
                TextEntry::make('domain_prefix')
                    ->label('School domain')
                    ->formatStateUsing(fn ($state) => 'https://' . $state . '.' . str_replace('https://', '', config('app.url')))
                    ->copyable()
                    ->copyableState(fn ($state) => 'https://' . $state . '.' . str_replace('https://', '', config('app.url')))
                    ->copyMessage('School domain copied')
                    ->copyMessageDuration(1500)
                    ->icon('heroicon-m-clipboard')
                    ->iconPosition(IconPosition::After),
                TextEntry::make('address'),
                TextEntry::make('phone_number'),
                TextEntry::make('kvk_number'),
            ]);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('domain_prefix')
                    ->label('School domain')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('address')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('phone_number')
                    ->tel()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('kvk_number')
                    ->maxLength(255),
                Forms\Components\FileUpload::make('logo')
                    ->directory('logos')
                    ->image()
                    ->downloadable()
                    ->columnSpanFull()
                    ->getUploadedFileNameForStorageUsing(
                        fn(TemporaryUploadedFile $file): string => (string) str($file->getClientOriginalName())
                            ->prepend(Carbon::now()->timestamp . '-')),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('domain_prefix')
                    ->label('School domain')
                    ->formatStateUsing(fn ($state) => 'https://' . $state . '.' . str_replace('https://', '', config('app.url')))
                    ->copyable()
                    ->copyableState(fn ($state) => 'https://' . $state . '.' . str_replace('https://', '', config('app.url')))
                    ->copyMessage('School domain copied')
                    ->copyMessageDuration(1500)
                    ->icon('heroicon-m-clipboard')
                    ->iconPosition(IconPosition::After)
                    ->searchable(),
                Tables\Columns\TextColumn::make('address')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone_number')
                    ->searchable(),
                Tables\Columns\TextColumn::make('kvk_number')
                    ->searchable(),
                Tables\Columns\ImageColumn::make('logo')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
                DateRangeFilter::make('created_at'),
                DateRangeFilter::make('deleted_at'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->modalHeading('Delete school')
                    ->using(function (array $data, $record): Model {
                        $users = User::where('tenant_id', $record->id)->get();
                        foreach ($users as $user){
                            $user->tenant_id = null;
                            $user->save();
                        }

                        $record->delete();
                        return $record;
                    }),
                Tables\Actions\ForceDeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\AdministratorsRelationManager::class,
//            RelationManagers\StudentsRelationManager::class,
//            RelationManagers\InstructorsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSchools::route('/'),
            'create' => Pages\CreateSchool::route('/create'),
            'edit' => Pages\EditSchool::route('/{record}/edit'),
            'view' => Pages\ViewSchool::route('/{record}'),
        ];
    }
}
