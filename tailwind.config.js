import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors:{
                primary:{
                    DEFAULT:'#199BB5',
                    light:'#a3d6e1',
                    lighter:'#F3FAFB'
                },
                secondary:{
                    DEFAULT:'#F9615A'
                },
                gray:{
                    DEFAULT:'#ccc',
                    800: '#50555B',
                    700: '#686D71',
                    500: '#B4B7BC',
                    400: '#DADBDD',
                    200: '#E9ECEF',
                    100: '#FBFBFB'
                },
                green:{
                    light:'#B6E2B3'
                },
                purple:{
                    light:'#CBE0FD'
                }
            },
        },
    },

    plugins: [forms],
};
