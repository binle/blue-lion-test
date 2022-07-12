# 1. Architecture

![Architecture](blulion-infra-architect.png 'Architecture')

# 2. Backend

Director: `./backend`
Config file default:`backend/env/local/local.config.json`

```
  {
    // origin url of front end which will be allowed CORS
    "allowed_origin_urls": ["http://localhost:8080", "http://localhost:9090", "http://localhost:3000"],

    //config for logging,
    "log_config": {
      "folderPath": "./env/local/store/logs",
      "filename": "server",
      "level": "debug",
      "maxNumberFile": 10,
      "maxFileSize": 1048576
    },
    // secret key for jwt
    "jwt_secret": "jwt_secret",
    // postgres database config
    "database_config": {
      "username": "postgres", // username
      "password": "mysecretpassword", //password => mapping with password in docker compose
      "database": "db_blue_lion", // database name
      "synchronize": false, // auto sync entity to database
      "host": "postgres", // host => service in docker compose
      "port": 5432
    },
    // redis => service in docker compose
    "redis_config": "redis://redis:6379",
    "host": "0.0.0.0",
    // internal port use in container for backend
    // => mapping with port in backend/Dockerfile
    // => mapping with port "upstream backend_servers" in  balancer/nginx.conf
    "port": 9090
  }
```

# 3. Frontend

Direct: `./frontend`
Config file default `front-end/.env`

```
// Backend URL
REACT_APP_BACKEND_PREFIX_URL=http://localhost:9090
```

# 4 Setup

- Nodejs v14

- Docker & docker-compose

### - Initialization

##### step 1. run docker compose

`docker-compose up -d`

##### step 2. setup SQL

- 2.1 access DB
  `docker exec -it blue-lion-postgres psql -U postgres`
- 2.2 create DB `db_blue_lion` (define in backend config)
  `create database db_blue_lion`
- 2.3 update `synchronize` to `true` in backend config, open new terminal and run:
  `docker-compose up -d --build backend1`
  // after it run success, all table is auto created in db_blue_lion database
- 2.4 update `synchronize` to `false` and run command at 2.3 again
  // make sure database and table is auto created in first time, in next time, we should use migration script.
- 2.5 back to terminal at 2.2 and run
  `insert into account ( username, password, salt, password_status, account_type) values ('admin', '0a95f47c3b582205225395793cf0fae246ed5573d210ffcf0790827a148accd76e29a0ec4d35c6b4ce558dabab52e271ff2038509e31a80b292d545a5cc97ba5', '544987a15d0bd8354e2c899da1b1db674acf64a5f337ebef55392e0151211a91', 'Changed', 'Admin');`
  // insert account admin: admin/admin@2022
