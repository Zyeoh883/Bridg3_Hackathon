I use tsc typescript and yarn for this project

setup with 
yarn install

setup ipfs with
brew install ipfs (hopefully nothing goes wrong lulz)

display files in ipfs
ipfs repo ls

remove files in ipfs
ipfs repo gc

some big files may be pinned
to see the main node for that file use
ipfs pin ls --type recursive

to unpin all files use
ipfs pin ls --type recursive | cut -d' ' -f1 | xargs -n1 ipfs pin rm

to make ts into js just use
tsc

different html and its specfic js for different page is in issuer and user

to start node user.js for user page
or node issuer.js for issuer page
