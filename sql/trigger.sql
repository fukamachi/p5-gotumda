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
