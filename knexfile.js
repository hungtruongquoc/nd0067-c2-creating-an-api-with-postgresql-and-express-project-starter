// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    version: '13',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'password',
      database : 'full_stack_dev'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/full_stack_test',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
