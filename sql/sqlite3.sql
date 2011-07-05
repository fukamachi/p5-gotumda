CREATE TABLE user (
    id INTEGER NOT NULL PRIMARY KEY,
    name varchar(64) NOT NULL UNIQUE,
    image_url varchar(255),
    thumbnail_url varchar (255)
);

CREATE TABLE task (
    id INTEGER NOT NULL PRIMARY KEY,
    body varchar(255) NOT NULL,
    user_id INTEGER,
    owner_id INTEGER,
    origin_task_id INTEGER,
    is_deleted BOOLEAN,
    is_done BOOLEAN,
    FOREIGN KEY(user_id) REFERENCES user(id),
    FOREIGN KEY(owner_id) REFERENCES user(id),
    FOREIGN KEY (origin_task_id) REFERENCES task(id)
);

CREATE TABLE watch_project (
    user_id INTEGER,
    project varchar(255),
    FOREIGN KEY(user_id) REFERENCES user(id)
);
