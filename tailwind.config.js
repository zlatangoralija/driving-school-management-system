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
                    DEFAULT:'#2357ad',
                    800: '#4f79bd',
                },
                secondary:{
                    DEFAULT:'#50555b'
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
            boxShadow:{
                'box':'0px 0px 1px rgba(32, 37, 43, 0.1), 0px 4px 8px rgba(51, 91, 130, 0.12);',
                'box-hover':'0px 0px 1px rgba(32, 37, 43, 0.2), 0px 4px 8px rgba(51, 91, 130, 0.22);'
            },
        },
    },

    plugins: [forms],
};
