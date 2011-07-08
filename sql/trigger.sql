DELIMITER |
    CREATE TRIGGER insert_task_updated_at
    BEFORE INSERT ON task FOR EACH ROW
    BEGIN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
    END
|
DELIMITER |
    CREATE TRIGGER update_task_updated_at
    BEFORE UPDATE ON task FOR EACH ROW
    BEGIN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
    END
|
DELIMITER |
    CREATE TRIGGER insert_task_comment_updated_at
    BEFORE INSERT ON task_comment FOR EACH ROW
    BEGIN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
    END
|
DELIMITER |
    CREATE TRIGGER update_task_comment_updated_at
    BEFORE UPDATE ON task_comment FOR EACH ROW
    BEGIN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
    END
|
DELIMITER |
    CREATE TRIGGER delete_task_comment_and_task_project
    BEFORE DELETE ON task FOR EACH ROW
    BEGIN
        DELETE FROM task_comment WHERE OLD.id = task_comment.task_id;
        DELETE FROM task_project WHERE OLD.id = task_project.task_id;
    END
|
