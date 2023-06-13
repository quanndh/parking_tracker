<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod

# DOCKER
$ docker-compose up
```

## Example api

```bash
http://localhost:3000/api/carparks/nearest?limit=10&page=1&latitude=1.3025452&longitude=103.9043758
```

## Introduction

This project includes Nestjs, Postgres, Redis.

After boostraping the app, a job will be executed to collect car parkings data.

```bash
# at ./src/module/parking/services/parking.service.ts
onModuleInit() {
  return this.initData();
}
```

Another job will also be executed to first time fetching available car parking, so the api is ready to served after this 2 job are finished.

```bash
# at ./src/module/cronjobs/services/parking_lot.service.ts
 onModuleInit() {
    this.syncParkingLot();
  }
```

The second job is also scheduled to execute every minute to update newest data.

All parking lots data are stored to Redis because they only update 1 per minute but can be read a lot. Geometry search is also make use of Redis geometry apis. With these design, it makes the searching fast and scalable.
