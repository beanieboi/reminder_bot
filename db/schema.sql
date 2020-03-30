CREATE TABLE installations (
    id SERIAL PRIMARY KEY,
    chat_id bigint NOT NULL UNIQUE,
    chat_type text NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    installation_id integer NOT NULL REFERENCES installations(id),
    message text NOT NULL,
    interval_minutes smallint NOT NULL,
    skippable boolean NOT NULL DEFAULT true,
    snooze_default_minutes smallint NOT NULL,
    keyword text NOT NULL
);

CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    task_id integer NOT NULL REFERENCES tasks(id),
    status text NOT NULL,
    due_at timestamp with time zone NOT NULL,
    finished_at timestamp with time zone,
    finished_by text
);
