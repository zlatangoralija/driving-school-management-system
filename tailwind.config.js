import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
    "./storage/framework/views/*.php",
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.jsx",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "purple-gradient":
          "linear-gradient(192deg, rgba(156,84,202,1) 0%, rgba(34,86,173,1) 100%)",
        "blue-gradient": "linear-gradient(#2256AD 0%, #2256AD 0%)",
      },
      colors: {
        primary: {
          DEFAULT: "#2357ad",
          800: "#4f79bd",
        },
        secondary: {
          DEFAULT: "#50555b",
        },
        blue: {
          DEFAULT: "#2256AD",
          light: "#DEE6F3",
        },
        purple: {
          DEFAULT: "#B754D0",
          light: "#F1DDF6",
        },
        green: {
          DEFAULT: "#8BC24A",
          light: "#EEF6E4",
        },
        gray: {
          DEFAULT: "#ccc",
          800: "#50555B",
          700: "#686D71",
          500: "#B4B7BC",
          400: "#DADBDD",
          300: "#EEEEEE",
          200: "#E9ECEF",
          100: "#F6F6F6",
        },
        red: {
          DEFAULT: "#DC2626",
          light: "#FADEDE",
        },
        orange: {
          DEFAULT: "#ea580c",
          light: "#FCE6DB",
        },
      },
      boxShadow: {
        box: "0px 0px 1px rgba(32, 37, 43, 0.1), 0px 4px 8px rgba(51, 91, 130, 0.12);",
        "box-hover":
          "0px 0px 1px rgba(32, 37, 43, 0.2), 0px 4px 8px rgba(51, 91, 130, 0.22);",
      },
    },
  },

  plugins: [forms],
};
