<html lang="en">
<head>
    <title>Invoice</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>

<div class="px-2 py-8 max-w-xl mx-auto">
    <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
            <img src="{{Vite::asset('resources/images/full-logo-white-bg.png')}}" class="h-10" alt="">
        </div>
        <div class="text-gray-700">
            <div class="font-bold text-xl mb-2 uppercase">Invoice</div>
            <div class="text-sm">Date: {{$invoice->created_at->format('d/m/Y')}}</div>
            <div class="text-sm">Invoice #DPX-{{ $invoice->id }}</div>
        </div>
    </div>
    <div class="border-b-2 border-gray-300 pb-8 mb-8">
        <h2 class="text-2xl font-bold mb-4">Bill To:</h2>
        <div class="text-gray-700 mb-2">{{ $invoice->student->name }}</div>
        <div class="text-gray-700">{{$invoice->student->email}}</div>
    </div>
    <table class="w-full text-left mb-8">
        <thead>
        <tr>
            <th class="text-gray-700 font-bold uppercase py-2">Description</th>
            <th class="text-gray-700 font-bold uppercase py-2">Price</th>
            <th class="text-gray-700 font-bold uppercase py-2 text-right">Total</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="py-4 text-gray-700">{{$invoice->description}}</td>
            <td class="py-4 text-gray-700">{{$invoice->amount}} EUR</td>
            <td class="py-4 text-gray-700 text-right">{{$invoice->amount}} EUR</td>
        </tr>
        </tbody>
    </table>
    <div class="flex justify-end mb-8">
        <div class="text-gray-700 mr-2">Subtotal:</div>
        <div class="text-gray-700">{{$invoice->amount}} EUR</div>
    </div>
    <div class="flex justify-end mb-8">
        <div class="text-gray-700 mr-2">Total:</div>
        <div class="text-gray-700">{{$invoice->amount}} EUR</div>
    </div>
    <div class="border-t-2 border-gray-300 pt-8 mb-8">
        <div class="text-gray-700 mb-2">Lorem ipsum text.</div>
    </div>
</div>

</body>
</html>
