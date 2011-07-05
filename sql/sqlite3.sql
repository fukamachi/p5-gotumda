CREATE TABLE user (
    name varchar(64) NOT NULL PRIMARY KEY,
    image_url varchar(255),
    thumbnail_url varchar (255)
);

CREATE TABLE task (
    id INTEGER NOT NULL PRIMARY KEY,
    body varchar(255) NOT NULL,
    user_name varchar(64),
    owner_name varchar(64),
    origin_task_id INTEGER,
    is_done BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_name) REFERENCES user(name),
    FOREIGN KEY(owner_name) REFERENCES user(name),
    FOREIGN KEY (origin_task_id) REFERENCES task(id)
);
CREATE INDEX index_task_on_owner_name ON task (owner_name);

CREATE TABLE watch_project (
    user_name varchar(64) NOT NULL,
    project varchar(255),
    FOREIGN KEY(user_name) REFERENCES user(name)
);
