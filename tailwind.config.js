module.exports = {
    content: ['./src/**/*.html', './src/**/*.{js,ts}'],
    theme: {
        extend: {
            colors: {
                white: "#F2F2F2",
                black: "#0D0D0D",
                ifcjs: {
                    100: "var(--secondary-color-100)",
                    120: "var(--secondary-color-120)",
                    200: "var(--primary-color)"
                }
            },
        },
        fontSize: {
            xs: '0.8rem',
            sm: '0.875rem',
            base: '1.1rem',
            lg: '1.125rem',
            xl: '1.3rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '4rem',
            '7xl': '5rem',
        }
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
};