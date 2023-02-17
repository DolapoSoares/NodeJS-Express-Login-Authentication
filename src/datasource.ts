import { DataSource } from "typeorm"

export const dataSource = new DataSource({
    "type": "mysql",
    "host": "127.0.0.1",
    "port": 3306,
    "username": "root",
    "password": "password",
    "database": "node_auth_demo",
    "entities": [
        "src/entity/*.ts"
    ],
    "logging": false,
    "synchronize": true
})