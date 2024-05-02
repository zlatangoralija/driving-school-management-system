@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
    <img src="{{Vite::asset('/resources/images/full-logo-white-bg.png')}}" style="width: 50%" alt="DrivePlanX">
@else
    <img src="{{Vite::asset('/resources/images/full-logo-white-bg.png')}}" style="width: 50%" alt="DrivePlanX">
@endif
</a>
</td>
</tr>
