CREATE TABLE expressts.users (
	id int auto_increment NOT NULL,
	name varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	email text NOT NULL,
	authToken text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
	password text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL
	createdAt timestamp DEFAULT CURRENT_TIMESTAMP  NOT NULL,
	updatedAt timestamp DEFAULT CURRENT_TIMESTAMP  on update CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci
COMMENT='';