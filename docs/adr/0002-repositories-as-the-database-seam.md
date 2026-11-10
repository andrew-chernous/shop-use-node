# Repositories as the database seam

Route handlers reach data only through repository interfaces phrased in domain terms (e.g. "get the Cart of this User"), never through Drizzle or SQL directly, so the database can be replaced later without touching the routes. The interfaces deliberately avoid SQL concepts (joins, transactions) so a non-relational store stays possible. The first implementation is in-memory and the second is Postgres; which database might follow is undecided.
