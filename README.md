# alkofinder-backend

The backend script for fetching alko stores coordinates and storing them within mongodb.

Structure:
- scripts:
-- storeFetcher.js: fetch stores and save those to db
-- geocoordinatesFetcher.js: update coordinates (lat and lng) for those stores which are missing coordinates
