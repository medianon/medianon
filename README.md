how to run:

https://youtu.be/ODYB--vOIhM

npm i

go to your firebase console and make a new project

click on build on the left and make a new firestore database in test mode

click on settings on the left and make a new web app

add a .env file with the variable FIREBASECONFIG='{your firebase config}'

if theres an error, add speech marks around everything in the object eg. {"apiKey": "...", "authDomian": "...", "...": "..."}

npm run dev --


this works as of 16/04/2023 on a laptop with linux mint, node 18 and sveltekit 1.0

www.patreon.com/medianon


dev repository established 19/01/2023
first version published 16/04/2023
