# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# guide to add tailwind with css
https://v3.tailwindcss.com/docs/guides/vite

# free Svg Illustration : 
https://undraw.co/illustrations

# For sms otp verification is done by using twillio sms

# react-hot-toast library for the notification pop up(we are using when user are not entering all the required field in the signup or login page)

# Container(what data is shown to the user(logic part)) and presentational Components(how data is shown to the user(UI part)) => single responsibility principle should be applied throughtout the application , LINK : (patterns.dev/react/presentational-container-pattern/) 

# Common flow to use thunk and to manage state
=> let say ek web page hoga, jo bhi data tumhe backend me bhejna h use tum page k local state me collect karoge then wha se dispatch karoge ek action me jo ki(action) define hoga slices me agr wo action async h to async thunk bna k define karoge wo thunk jo bhi internal api hit karega aur ek response bhejega(res me whi payload object bhejega joki tum apne action function me dete ho) aur yhi async thunk k response k basis pe agr ye fullfill ho gya to tum state ko kaise update karna chahte ho to uske liye builder.addCase then ek response hume milega page me uske basis pe aap kya karna chahte h navigate ye khuch aur....

# Now for deploying backened we have used render while for frontened we can use vershel or Netlify or Aws amplify
# npm run build => create dist folder compiling all js files and it tries to render in index.html in dist folder