CREATE TABLE IF NOT EXISTS user (
    name varchar(64) NOT NULL PRIMARY KEY,
    image_url varchar(255),
    thumbnail_url varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS task (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    body varchar(255) NOT NULL,
    user_name varchar(64),
    owner_name varchar(64),
    origin_task_id INTEGER,
    is_done BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE INDEX index_task_on_owner_name ON task (owner_name);

CREATE TABLE IF NOT EXISTS task_comment (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    task_id INTEGER NOT NULL,
    body varchar(255) NOT NULL,
    user_name varchar(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES task(id) ON DELETE CASCADE,
    FOREIGN KEY(user_name) REFERENCES user(name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE INDEX index_task_comment_on_task_id ON task_comment (task_id);

CREATE TABLE IF NOT EXISTS watch_project (
    user_name varchar(64) NOT NULL,
    project varchar(255),
    FOREIGN KEY(user_name) REFERENCES user(name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE INDEX index_watch_project ON watch_project (user_name);

CREATE TABLE IF NOT EXISTS task_project (
    project varchar(255),
    task_id INTEGER NOT NULL,
    FOREIGN KEY(task_id) REFERENCES task(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE INDEX index_task_project ON task_project(project);

CREATE TABLE IF NOT EXISTS sort_order (
    user_name varchar(64) NOT NULL,
    sort_order varchar(255) NOT NULL DEFAULT "",
    FOREIGN KEY(user_name) REFERENCES user(name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE INDEX index_sort_order ON sort_order(user_name);

CREATE TABLE IF NOT EXISTS task_event (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    task_id INTEGER NOT NULL,
    event varchar(64) NOT NULL,
    user_name varchar(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES task(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE INDEX index_task_event ON task_event(task_id, created_at);
