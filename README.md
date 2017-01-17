# Jyve Project

#### Arthur Yidi

## Initial Setup

Add missing `data.json` to `./src/data.json`

Run `yarn install`

## Create Build

`yarn build`

## Run local build

`yarn start`

Starts the development server.

## Frameworks

- d3
- Material Design Lite (currently Material Components for the Web is missing many components).
- EJS Templates

## Requirements

-  allow to filter by location, client, and time period
-  rough state of all the jobs in the system
-  important: position of jobs in time (start+end) and status
-  examples: last quarter of 2016, yesterday until tomorrow or upcoming month.

## Data JSON

```
data.json

start_after (datetime): A job cannot be started until after this point in time
finish_before (datetime): A job must be finished before this point in time
assignee (string): The id of user assigned to the job - can be “null”
location ([lat, lon]): Latitude and longitude coordinates of store
store_name (string): Name of the store
client (string): Name of the client
status (string): Status of the job.
	Possible values: unclaimed, claimed, in progress, completed, urgent, expired.
city (string): Name of the region/city where the store is located this job belongs to
```