### Test local dev

1. run `firebase emulators:start`
2. quick ask URL: `http://127.0.0.1:5001/translate-ebook/australia-southeast2/quickAsk`
3. ask anything URL: `http://127.0.0.1:5001/translate-ebook/australia-southeast2/askAnything`

### Deploy to prod

1. deploy functions to a production environment
   `firebase deploy --only functions`
2. quick ask URL
   `https://australia-southeast2-translate-ebook.cloudfunctions.net/quickAsk`
3. ask anything URL `https://australia-southeast2-translate-ebook.cloudfunctions.net/askAnything`

### Reference

1. get started: write, test, and deploy firebase functions: https://firebase.google.com/docs/functions/get-started?authuser=0
2. configure environment:
   a. v1: https://firebase.google.com/docs/functions/config-env
   b. v2: https://firebase.google.com/docs/functions/config-env?gen=2nd#secret_parameters
   b. this project used environment variables + Google Secret Manager
3. change default region to local region: https://firebase.google.com/docs/functions/manage-functions#modify-region
4. update function from v1 to v2: https://firebase.google.com/docs/functions/2nd-gen-upgrade
