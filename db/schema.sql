-- Table Definition ----------------------------------------------

CREATE TABLE installations (
    id SERIAL PRIMARY KEY,
    chat_id bigint NOT NULL UNIQUE,
    chat_type text NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX installations_pkey ON installations(id int4_ops);
CREATE UNIQUE INDEX installations_chat_id_key ON installations(chat_id int8_ops);

-- Table Definition ----------------------------------------------

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    installation_id integer NOT NULL REFERENCES installations(id),
    message text NOT NULL,
    interval_hours smallint NOT NULL,
    skippable boolean NOT NULL DEFAULT true,
    snooze_default_minutes smallint NOT NULL,
    keyword text NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX tasks_pkey ON tasks(id int4_ops);

-- Table Definition ----------------------------------------------

CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    task_id integer NOT NULL REFERENCES tasks(id),
    status text NOT NULL,
    start_time time with time zone NOT NULL,
    finished_time time with time zone NOT NULL DEFAULT now(),
    finished_by text NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX reminders_pkey ON reminders(id int4_ops);



