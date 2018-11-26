module.exports = {
    messages:
        `messages(
           id SERIAL PRIMARY KEY,
           contents text,
           created_date TIMESTAMP NOT NULL
         )`,
    users:
        `users(
           id SERIAL PRIMARY KEY,
           account_name varchar(25),
           first_name varchar(50),
           last_name varchar(50),
           email varchar(320),
           password varchar(100),
           created_date TIMESTAMP NOT NULL
         )`,
};