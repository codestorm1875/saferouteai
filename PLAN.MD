SafeRouteAI

Real time safety scoring and navigation for Lagos

1. Core Deliverables for Hackathon

You are building only two things:

Backend service

Mobile app (or web app)

Everything else is optional.

2. System Architecture
Backend (Python FastAPI)

Safety scoring engine

Incident reporting API

Endpoint for simulated IoT lighting data

Aggregation and storage of:
traffic
lighting
crowd
incidents
weather
police proximity

AI model or rule based scoring
Real time feed endpoints
Route safety scoring logic
App (React Native or Flutter)
Map and safety heatmap

Safe route screen

Report incident screen

Live incident feed

Emergency features

Account or no account system (your choice)

3. Backend Tasks
A. Project setup

Create FastAPI project

Connect to SQLite or MongoDB for quick setup

Create all routes

B. Safety Score Engine

Choose option 1 or option 2.

Option 1
Simple rule based scoring
Fastest
Most predictable
No ML specialist needed

Option 2
Tiny ML model
Random forest regressor
Trained on synthetic data
Stored in safety_model.pkl

C. APIs Needed

POST /predict
Input: traffic, lighting, crowd, weather, incidents, police_distance
Output: score

GET /heatmap
Returns areas with risk scores

POST /incident
Stores user reports

GET /incidents
Returns all incidents

POST /sensor
Simulated IoT data (brightness etc)

GET /safe-route
Calculates safest route between two points based on weighted parameters

D. Data Handling

Fake traffic data

Fake lighting data

Fake IoT sensor data

Fake weather condition

Real time simulation: backend updates every 10 seconds

Judges do not check the source of data. They care about the logic and the display.

4. App Tasks
A. Main Screens

Home
Map view
Real time heatmap
Search bar

Safe route
User enters destination
Shows safe route vs fastest route
Risk score display

Report incident
Type
Description
Photo
Auto location

Incident feed
List of user reported events

Emergency screen
SOS
Call police
Flashlight
Share location

5. Heatmap Logic

The app receives a list of zones with safety scores.
Colors depend on the score:

0 to 30 red
31 to 70 yellow
71 to 100 green

Frontend only needs to paint polygons or circles on the map.

6. Data Flow

App collects:

user location

destination

incident data

Backend aggregates:

traffic

lighting

crowd

incidents

sensor data

weather

Backend computes final score then sends back to app.

7. Demo Flow for Judges
Step 1

Open app
Show safety heatmap of Lagos

Step 2

Search for a route
Show safe route and unsafe route
Highlight risk score

Step 3

Submit an incident
Show incident appear in feed in seconds

Step 4

Show emergency page

Step 5

Explain backend AI logic in one sentence
“Safety score is calculated using traffic, lighting, weather, crowd density, incidents and distance to police stations”