
CREATE TABLE Address (
    id INTEGER,
    street VARCHAR(50) NOT NULL,
    city VARCHAR(20) NOT NULL,
    state CHAR(2) NOT NULL,
    zip_code SMALLINT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Mission (
    id INTEGER,
    `name` VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE User (
    id INTEGER,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    address_id INTEGER,
    email VARCHAR(50),
    birthday DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (address_id)
        REFERENCES Address (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE UserMission (
    mission_id INTEGER,
    user_id INTEGER,
    PRIMARY KEY (mission_id, user_id),
    FOREIGN KEY (mission_id)
        REFERENCES Mission (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES User (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE Location (
    id INTEGER,
    `name` VARCHAR(50) NOT NULL,
    address_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (address_id)
        REFERENCES Address (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE TriedItems (
    id INTEGER,
    user_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    mission_id INTEGER NOT NULL,
    date_tried DATE NOT NULL,
    item_cost FLOAT(6,2) NOT NULL,
    rating SMALLINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES User (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (location_id)
        REFERENCES Location (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (mission_id)
        REFERENCES Mission (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

