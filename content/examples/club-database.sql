-- Original fixed dataset for authored SQL examples, never learner submissions.
-- The site does not expose an SQL execution service.
PRAGMA foreign_keys = ON;

CREATE TABLE Member (
    member_id INTEGER NOT NULL PRIMARY KEY,
    member_name TEXT NOT NULL,
    year_group INTEGER NOT NULL CHECK (year_group IN (1, 2))
);
CREATE TABLE ClubSession (
    session_id INTEGER NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    fee INTEGER NOT NULL CHECK (fee >= 0)
);
CREATE TABLE Booking (
    booking_id INTEGER NOT NULL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    seats INTEGER NOT NULL CHECK (seats > 0),
    FOREIGN KEY (member_id) REFERENCES Member(member_id),
    FOREIGN KEY (session_id) REFERENCES ClubSession(session_id)
);

INSERT INTO Member (member_id, member_name, year_group) VALUES
    (1, 'Aisha', 1), (2, 'Ben', 2), (3, 'Chen', 1),
    (4, 'Devi', 2), (5, 'Ben', 1), (6, 'Farah', 2);
INSERT INTO ClubSession (session_id, title, fee) VALUES
    (10, 'Chess', 4), (20, 'Coding', 6), (30, 'Drama', 5);
INSERT INTO Booking (booking_id, member_id, session_id, seats) VALUES
    (101, 1, 10, 2), (102, 2, 20, 1), (103, 3, 10, 1),
    (104, 4, 20, 3), (105, 5, 20, 2), (106, 1, 20, 1);
