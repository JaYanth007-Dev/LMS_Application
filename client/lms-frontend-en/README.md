#LMS Frontend

##Setup instructions

1.Clone the Project 
---git clone https://github.com/JaYanth007-Dev/LMS_Application.git


2 . Move into the project directory
--- cd client
--- cd lms-frontend-en


3.Install dependencies
--- npm install


4.Run the Server
--- npm run dev



How to setup the tailwind css (https://tailwindcss.com/docs/guides/vite)


1.Install tailwind and other dependencies

--- npm install -D tailwindcss postcss autoprefixer


2.Create 'tailwind.config.js' file

--- npx tailwindcss init -p


3.Add the files and extensions to the tailwind config in the content property

--- content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],


4. Add the tailwind directives on the top of index.css file

--- @tailwind base;
    @tailwind components;
    @tailwind utilities;

5. Run the server tailwind will be available