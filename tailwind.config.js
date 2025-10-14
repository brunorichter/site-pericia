/** @type {import('tailwindcss').config} */

// tailwind.config.js (compatível com Tailwind 1.x)
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
          extend: {
            colors: {
              'brand-dark': '#1a202c',
              'brand-dark-secondary': '#2d3748',
              'brand-cyan': {
                '400': '#22d3ee',
                '500': '#06b6d4',
                '600': '#0891b2',
              },
              'brand-light': '#e2e8f0',
              'brand-gray': '#a0aec0',
            },
            fontFamily: {
              sans: ['"Exo 2"', 'sans-serif'],
            }
          }
        },
  plugins: [],
}

//  tailwind.config = {
//         theme: {
//           extend: {
//             colors: {
//               'brand-dark': '#1a202c',
//               'brand-dark-secondary': '#2d3748',
//               'brand-cyan': {
//                 '400': '#22d3ee',
//                 '500': '#06b6d4',
//                 '600': '#0891b2',
//               },
//               'brand-light': '#e2e8f0',
//               'brand-gray': '#a0aec0',
//             },
//             fontFamily: {
//               sans: ['"Exo 2"', 'sans-serif'],
//             }
//           }
//         }
//       }


// module.exports = {
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         'brand-dark': '#1a202c',
//         'brand-dark-secondary': '#2d3748',
//         'brand-cyan': {
//           '400': '#22d3ee',
//           '500': '#06b6d4',
//           '600': '#0891b2',
//         },
//         'brand-light': '#e2e8f0',
//         'brand-gray': '#a0aec0',
//       },
//       fontFamily: {
//         sans: ['"Exo 2"', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// }