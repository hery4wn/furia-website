CREATE TABLE events (
 id TEXT PRIMARY KEY NOT NULL,
 type TEXT NOT NULL CHECK(type IN ('page_view','booking_click')),
 visitor TEXT NOT NULL,
 session TEXT NOT NULL,
 day TEXT NOT NULL,
 created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX events_day_type ON events(day,type);
--> statement-breakpoint
CREATE TABLE reviews (
 id TEXT PRIMARY KEY NOT NULL,
 name TEXT NOT NULL,
 rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
 comment TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
 created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX reviews_status_created ON reviews(status,created_at);
--> statement-breakpoint
CREATE TABLE rate_limits (
 fingerprint TEXT NOT NULL,
 day TEXT NOT NULL,
 kind TEXT NOT NULL,
 count INTEGER NOT NULL DEFAULT 1,
 PRIMARY KEY(fingerprint,day,kind)
);
