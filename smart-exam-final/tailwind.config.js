
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],

    // enable dark mode via class strategy
    darkMode: 'class',

    theme: {
        extend: {
            screens: {
                'tablet': '640px',
                // => @media (min-width: 640px) { ... }
          
                'laptop': '1024px',
                // => @media (min-width: 1024px) { ... }
          
                'desktop': '1280px',
                // => @media (min-width: 1280px) { ... }
              },
            colors: {
                black: '#09090c',
                darkGray: '#121212',
                
                brightRed: 'hsl(12, 88%, 59%)',
                brightRedLight: 'hsl(12, 88%, 69%)',
                brightRedSupLight: 'hsl(12, 88%, 95%)',

                darkBlue: 'hsl(228, 39%, 23%)',
                darkGrayishBlue: 'hsl(227, 12%, 61%)',
                veryDarkBlue: 'hsl(233, 12%, 13%)',
            },
            transitionProperty: {
                'height': 'height',
                'spacing': 'margin, padding',
              },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
              },
        },
    },
    plugins: [],
}