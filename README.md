how to run:
1. clone this repository
2. in the same folder as this README, add a .env file with the variables
FIREBASE=""
ADMIN=""
3. go to your firebase project settings, go to general and copy your firebase config.
4. set it up to look like this:
FIREBASE='{"apiKey": "...","authDomain": "...","projectId": "...","storageBucket": "...","messagingSenderId": "...","appId": "...","measurementId": "..."}'
5. set up a firebase service account. in your project settings, go to service accounts and click 'generate new private key'
6. copy the contents of this file and set it up to look like this:
ADMIN='{"type": "service_account","project_id": "...","private_key_id": "...","private_key": "...","client_email": "...","client_id": "...","auth_uri": "...","token_uri": "...","auth_provider_x509_cert_url": "...","client_x509_cert_url": "...","universe_domain": "..."}'
7. run the command:
FIREBASE='{...}' ADMIN='{...}' npm run dev --

send me an email: medianonlegal@proton.me
message me on twitter: @medianonlegal