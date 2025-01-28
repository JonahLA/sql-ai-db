
CREATE TABLE Address (
    id INTEGER UNSIGNED,
    street VARCHAR(50) NOT NULL,
    city VARCHAR(20) NOT NULL,
    state CHAR(2) NOT NULL,
    zip_code MEDIUMINT UNSIGNED NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Mission (
    id INTEGER UNSIGNED,
    `name` VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE User (
    id INTEGER UNSIGNED,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    address_id INTEGER UNSIGNED,
    email VARCHAR(50),
    birthday DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (address_id)
        REFERENCES Address (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE UserMission (
    user_id INTEGER UNSIGNED,
    mission_id INTEGER UNSIGNED,
    PRIMARY KEY (user_id, mission_id),
    FOREIGN KEY (user_id)
        REFERENCES User (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (mission_id)
        REFERENCES Mission (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE Location (
    id INTEGER UNSIGNED,
    `name` VARCHAR(50) NOT NULL,
    address_id INTEGER UNSIGNED,
    PRIMARY KEY (id),
    FOREIGN KEY (address_id)
        REFERENCES Address (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE TriedItem (
    id INTEGER UNSIGNED,
    user_id INTEGER UNSIGNED NOT NULL,
    location_id INTEGER UNSIGNED NOT NULL,
    mission_id INTEGER UNSIGNED NOT NULL,
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

