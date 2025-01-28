
-- Insert data into Address table
INSERT INTO Address (id, street, city, state, zip_code) VALUES
(1, '123 Main St', 'Springfield', 'IL', 62701),
(2, '456 Elm St', 'Springfield', 'IL', 62702),
(3, '789 Oak St', 'Draper', 'UT', 84604),
(4, '101 Maple St', 'Provo', 'UT', 84605),
(5, '202 Pine St', 'Bothell', 'WA', 98011),
(6, '303 Willow St', 'Woodinville', 'WA', 98072),
(7, '404 Birch St', 'Woodinville', 'WA', 98072),
(8, '505 Sequoia St', 'Kirkland', 'WA', 98073);

-- Insert data into Mission table
INSERT INTO Mission (id, `name`) VALUES
(1, 'Onion Rings'),
(2, 'Buffalo Sauce'),
(3, 'Chicken Sandwich'),
(4, 'Apple Pie');

-- Insert data into User table
INSERT INTO User (id, first_name, last_name, address_id, email, birthday) VALUES
(1, 'Jonah', 'Austin', null, 'jonah.austin@example.com', '1980-01-01'),
(2, 'Gianna', 'Austin', null, 'jane.smith@example.com', '1985-02-02'),
(3, 'Anne', 'Blotter', 4, 'anne.blotter@example.com', null),
(4, 'Greg', 'Blotter', 5, null, null);

-- Insert data into UserMission table
INSERT INTO UserMission (user_id, mission_id) VALUES
(1, 3),
(2, 2),
(3, 1),
(4, 4),
(1, 2),
(3, 4),
(1, 1);

-- Insert data into Location table
INSERT INTO Location (id, `name`, address_id) VALUES
(1, 'Raising Canes', 1),
(2, 'Chik-fil-a', 2),
(3, 'Arbys', 3),
(4, 'Chubbys', 4),
(5, 'The Habbit Burger', 5),
(6, 'Walmart', 6),
(7, 'Zaxbys', 7),
(8, 'Homemade', 8);

-- Insert data into TriedItems table
INSERT INTO TriedItem (id, user_id, mission_id, location_id, date_tried, item_cost, rating) VALUES
(1, 1, 3, 1, '2024-01-01', 10.99, 7),
(2, 1, 3, 2, '2024-02-01', 13.99, 9),
(3, 1, 3, 6, '2024-02-25', 4.99, 4),
(4, 1, 2, 3, '2024-03-01', 0.99, 6),
(5, 1, 2, 6, '2024-04-01', 3.99, 8),
(6, 2, 2, 3, '2024-03-01', 0.99, 1),
(7, 2, 2, 6, '2024-04-01', 3.99, 6),
(8, 2, 2, 4, '2024-04-02', 1.99, 10),
(9, 3, 1, 5, '2024-04-05', 4.99, 9),
(10, 3, 1, 6, '2024-04-14', 2.99, 5),
(11, 3, 1, 7, '2024-05-01', 5.99, 6),
(12, 4, 4, 8, '2024-06-01', 7.99, 10),
(13, 4, 4, 6, '2024-07-01', 4.99, 5);
