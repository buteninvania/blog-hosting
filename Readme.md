### Installing and launching a development project with e2e tests
To run a project in testing and development mode, you need: 
1) nvm (node lts)
2) yarn
3) docker

The startup script:
```shell
nvm use --lts
yarn install
# mongodb is used for e2e tests
docker pull mongodb/mongodb-community-server:latest
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
yarn watch
yarn jest:coverage
```
