# Patrol
Crime data mapping application

### Project Description
If you have ever been to a strange city and not known which areas of the city to avoid, or if parking your car in a certain spot greatly increases the chance of it getting broken-into, or if you're trying to find the safest walking route home, or if you're a police officer trying to figure out which areas to PATROL at certain times during the week - Patrol is for you.

San Francisco was just recently deemed the city with the highest per-capita crime rate. With the recent wave of violent crime and car break-ins, the visibility to this crime is what could empower the community to salve a problem the police can't on their own. People commit crimes because they think they can get away with it. The hope of this application is to increase the visibility to decrease the opportunity for crime to happen.


## Instructions to run locally

1) Clone repository and download npm packages

```
git clone https://github.com/alexpadraic/Patrol.git
npm install
```

2)  Import csv of analyzed data

```
mongoimport -d patrol -c crimepoints --type csv --file CrimePoints_forupload.csv --headerline
```

3) Launch mongod in one terminal then run server.js in another tab

````
mongod
node server.js
````

3) Open browser `http://localhost:3000/`

## Questions

For questions, contact Alexander Pellas (alexpadraic@gmail.com)