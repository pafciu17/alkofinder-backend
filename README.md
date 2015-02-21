# alkofinder-backend

The backend script for fetching alko stores coordinates and storing them within mongodb.

Structure
----------

- server.js: server starting script

- scripts/storeFetcher.js: fetch stores and save those to db

- scripts/geocoordinatesFetcher.js: update coordinates (lat and lng) for those stores which are missing coordinates
