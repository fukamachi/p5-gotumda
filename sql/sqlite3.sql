CREATE TABLE user (
    name varchar(64) NOT NULL PRIMARY KEY,
    image_url varchar(255),
    thumbnail_url varchar(255)
);

CREATE TABLE task (
    id INTEGER NOT NULL PRIMARY KEY,
    body varchar(255) NOT NULL,
    user_name varchar(64),
    owner_name varchar(64),
    origin_task_id INTEGER,
    is_done BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_name) REFERENCES user(name),
    FOREIGN KEY(owner_name) REFERENCES user(name),
    FOREIGN KEY(origin_task_id) REFERENCES task(id)
);
CREATE INDEX index_task_on_owner_name ON task (owner_name);
CREATE TRIGGER update_task_updated_at
BEFORE UPDATE ON task FOR EACH ROW
BEGIN
    UPDATE task SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TABLE task_comment (
    id INTEGER NOT NULL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    body varchar(255) NOT NULL,
    user_name varchar(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES task(id),
    FOREIGN KEY(user_name) REFERENCES user(name)
);
CREATE INDEX index_task_comment_on_task_id ON task_comment (task_id);
CREATE TRIGGER update_task_comment_updated_at
BEFORE UPDATE ON task_comment FOR EACH ROW
BEGIN
    UPDATE task_comment SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TABLE watch_project (
    user_name varchar(64) NOT NULL,
    project varchar(255),
    FOREIGN KEY(user_name) REFERENCES user(name)
);
CREATE INDEX index_watch_project ON watch_project (user_name);

CREATE TABLE task_project (
    project varchar(255),
    task_id INTEGER NOT NULL,
    FOREIGN KEY(task_id) REFERENCES task(id)
);
CREATE INDEX index_task_project ON task_project(project);

CREATE TABLE sort_order (
    user_name varchar(64) NOT NULL,
    sort_order varchar(255) NOT NULL DEFAULT "",
    FOREIGN KEY(user_name) REFERENCES user(name)
);
CREATE INDEX index_sort_order ON sort_order(user_name);

CREATE TRIGGER delete_task_project
AFTER DELETE ON task FOR EACH ROW
BEGIN
    DELETE FROM task_project WHERE OLD.id = task_project.task_id;
END;
