<?php

namespace App\Filament\Resources;

use App\Enums\UserStatus;
use App\Enums\UserType;
use App\Filament\Resources\SchoolAdminUserResource\Pages;
use App\Filament\Resources\SchoolAdminUserResource\RelationManagers;
use App\Models\School;
use App\Models\SchoolAdminUser;
use App\Models\Tenant;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Support\Enums\IconPosition;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Hash;
use Malzariey\FilamentDaterangepickerFilter\Filters\DateRangeFilter;

class SchoolAdminUserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $label = 'School administrators';
    protected static ?string $navigationGroup = 'Users';

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                TextEntry::make('name'),
                TextEntry::make('email')
                    ->copyable()
                    ->copyMessage('Email copied')
                    ->copyMessageDuration(1500)
                    ->icon('heroicon-m-clipboard')
                    ->iconPosition(IconPosition::After),
                TextEntry::make('status'),
                TextEntry::make('school.name')
            ]);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required(),
                Forms\Components\TextInput::make('email')
                    ->required(),
                Forms\Components\Select::make('status')
                    ->label('Account status')
                    ->options(UserStatus::class)
                    ->required(),
                Forms\Components\Select::make('tenant_id')
                    ->relationship('school')
                    ->label('School')
                    ->required()
                    ->options(Tenant::get()->pluck('name', 'id'))
                    ->searchable(),
                Forms\Components\TextInput::make('password')
                    ->password()
                    ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                    ->dehydrated(fn ($state) => filled($state))
                    ->required(fn (string $context): bool => $context === 'create')
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->where('type', UserType::SchoolAdmin))
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->copyable()
                    ->copyMessage('Email copied')
                    ->copyMessageDuration(1500)
                    ->icon('heroicon-m-clipboard')
                    ->iconPosition(IconPosition::After)
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Account status'),
                Tables\Columns\TextColumn::make('school.name')
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
                Tables\Filters\SelectFilter::make('status')
                    ->options(UserStatus::class),
                DateRangeFilter::make('created_at'),
                DateRangeFilter::make('deleted_at'),
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->modalHeading('Delete instructor'),
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
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSchoolAdminUsers::route('/'),
            'create' => Pages\CreateSchoolAdminUser::route('/create'),
            'view' => Pages\ViewSchoolAdmin::route('/{record}'),
            'edit' => Pages\EditSchoolAdminUser::route('/{record}/edit'),
        ];
    }
}
