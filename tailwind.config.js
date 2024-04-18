module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                inter: ["Inter", "sans-serif"],
            },
            colors: {
                "pima-red": "#ed3237",
                "pima-gray": "#202020",
                "pima-light-gray": "#1f1f1f",
            },
            spacing: {
                "pima-x": "5.0625rem",
                "pima-y": "2rem",
            },
        },
    },
    plugins: [],
};
