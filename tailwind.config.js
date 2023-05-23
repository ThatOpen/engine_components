module.exports = {
    content: ['./src/**/*.html', './src/**/*.{js,ts}'],
    theme: {
        extend: {
            colors: {
                white: "#F2F2F2",
                black: "#0D0D0D",
                ifcjs: {
                    100: "#202932",
                    120: "#1a2128",
                    200: "#BCF124",
                    300: "#6528D7"
                }
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
};