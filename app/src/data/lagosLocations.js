// Comprehensive Lagos locations database with real places
// Organized by area type for realistic autocomplete experience

export const LAGOS_LOCATIONS = [
    // MAINLAND - RESIDENTIAL AREAS (Extended)
    { name: "Surulere", area: "Lagos Mainland", lat: 6.4969, lng: 3.3561, type: "neighborhood" },
    { name: "Yaba", area: "Lagos Mainland", lat: 6.5074, lng: 3.3721, type: "neighborhood" },
    { name: "Ebute Metta", area: "Lagos Mainland", lat: 6.4894, lng: 3.3781, type: "neighborhood" },
    { name: "Mushin", area: "Lagos Mainland", lat: 6.5320, lng: 3.3540, type: "neighborhood" },
    { name: "Oshodi", area: "Lagos Mainland", lat: 6.5451, lng: 3.3367, type: "neighborhood" },
    { name: "Ikeja", area: "Lagos Mainland", lat: 6.5964, lng: 3.3406, type: "neighborhood" },
    { name: "Maryland", area: "Lagos Mainland", lat: 6.5795, lng: 3.3675, type: "neighborhood" },
    { name: "Ojota", area: "Lagos Mainland", lat: 6.5892, lng: 3.3789, type: "neighborhood" },
    { name: "Ketu", area: "Lagos Mainland", lat: 6.5987, lng: 3.3896, type: "neighborhood" },
    { name: "Agege", area: "Lagos Mainland", lat: 6.6153, lng: 3.3198, type: "neighborhood" },
    { name: "Egbeda", area: "Lagos Mainland", lat: 6.5707, lng: 3.2845, type: "neighborhood" },
    { name: "Isolo", area: "Lagos Mainland", lat: 6.5373, lng: 3.3329, type: "neighborhood" },
    { name: "Ejigbo", area: "Lagos Mainland", lat: 6.5541, lng: 3.3067, type: "neighborhood" },
    { name: "Iyana Ipaja", area: "Lagos Mainland", lat: 6.6177, lng: 3.2567, type: "neighborhood" },
    { name: "Abule Egba", area: "Lagos Mainland", lat: 6.6228, lng: 3.2897, type: "neighborhood" },
    { name: "Gbagada", area: "Lagos Mainland", lat: 6.5589, lng: 3.3789, type: "neighborhood" },
    { name: "Shomolu", area: "Lagos Mainland", lat: 6.5312, lng: 3.3892, type: "neighborhood" },
    { name: "Bariga", area: "Lagos Mainland", lat: 6.5218, lng: 3.3887, type: "neighborhood" },
    { name: "Ikotun", area: "Alimosho", lat: 6.5443, lng: 3.2638, type: "neighborhood" }, // Updated coordinates
    { name: "Ipaja", area: "Alimosho", lat: 6.6341, lng: 3.2801, type: "neighborhood" },
    // **NEW MAINLAND NEIGHBORHOODS**
    { name: "Mende", area: "Maryland", lat: 6.5701, lng: 3.3739, type: "neighborhood" },
    { name: "Akoka", area: "Yaba", lat: 6.5140, lng: 3.3910, type: "neighborhood" },
    { name: "Ilupeju", area: "Kosofe", lat: 6.5491, lng: 3.3619, type: "neighborhood" },
    { name: "Oregun", area: "Ikeja", lat: 6.6111, lng: 3.3611, type: "neighborhood" },
    { name: "Ogba", area: "Ikeja", lat: 6.6305, lng: 3.3401, type: "neighborhood" },


    // ISLAND - UPSCALE AREAS (Extended)
    { name: "Victoria Island", area: "Lagos Island", lat: 6.4281, lng: 3.4219, type: "neighborhood" },
    { name: "Ikoyi", area: "Lagos Island", lat: 6.4541, lng: 3.4316, type: "neighborhood" },
    { name: "Lekki Phase 1", area: "Lekki", lat: 6.4474, lng: 3.4746, type: "neighborhood" },
    { name: "Lekki Phase 2", area: "Lekki", lat: 6.4391, lng: 3.5053, type: "neighborhood" },
    { name: "Ajah", area: "Lekki-Epe", lat: 6.4674, lng: 3.5681, type: "neighborhood" },
    { name: "Banana Island", area: "Ikoyi", lat: 6.4333, lng: 3.4267, type: "neighborhood" },
    { name: "Parkview Estate", area: "Ikoyi", lat: 6.4589, lng: 3.4234, type: "neighborhood" },
    { name: "Oniru", area: "Victoria Island", lat: 6.4392, lng: 3.4297, type: "neighborhood" },
    { name: "Eko Atlantic", area: "Victoria Island", lat: 6.4125, lng: 3.4058, type: "neighborhood" },
    { name: "Ikate", area: "Lekki", lat: 6.4479, lng: 3.4619, type: "neighborhood" },
    { name: "Osapa London", area: "Lekki", lat: 6.4485, lng: 3.4912, type: "neighborhood" },
    // **NEW ISLAND NEIGHBORHOODS**
    { name: "Igbo Efon", area: "Lekki", lat: 6.4520, lng: 3.5220, type: "neighborhood" },
    { name: "Ajao Estate", area: "Isolo", lat: 6.5501, lng: 3.3301, type: "neighborhood" },


    // MARKETS & COMMERCIAL AREAS (Extended)
    { name: "Balogun Market", area: "Lagos Island", lat: 6.4550, lng: 3.3897, type: "market" },
    { name: "Computer Village", area: "Ikeja", lat: 6.6018, lng: 3.3515, type: "market" },
    { name: "Idumota Market", area: "Lagos Island", lat: 6.4563, lng: 3.3889, type: "market" },
    { name: "Oshodi Market", area: "Oshodi", lat: 6.5451, lng: 3.3367, type: "market" },
    { name: "Tejuosho Market", area: "Yaba", lat: 6.5074, lng: 3.3721, type: "market" },
    { name: "Mile 12 Market", area: "Kosofe", lat: 6.5892, lng: 3.3789, type: "market" },
    { name: "Alaba International Market", area: "Ojo", lat: 6.4589, lng: 3.1789, type: "market" },
    { name: "Ladipo Market", area: "Mushin", lat: 6.5320, lng: 3.3540, type: "market" },
    { name: "Oke Arin Market", area: "Lagos Island", lat: 6.4558, lng: 3.3885, type: "market" },
    // **NEW MARKETS/COMMERCIAL**
    { name: "Trade Fair Complex (ASPANDA)", area: "Ojo", lat: 6.4666, lng: 3.2410, type: "market" },
    { name: "Jankara Market", area: "Lagos Island", lat: 6.4558, lng: 3.3875, type: "market" },
    { name: "Dandaru Market", area: "Epe", lat: 6.5833, lng: 3.9833, type: "market" },


    // TRANSPORT HUBS (Extended)
    { name: "Murtala Muhammed Airport (MMIA)", area: "Ikeja", lat: 6.5774, lng: 3.3212, type: "airport" },
    { name: "Ikeja Bus Terminal", area: "Ikeja", lat: 6.5964, lng: 3.3406, type: "transport" },
    { name: "Ojuelegba Bus Stop", area: "Surulere", lat: 6.5074, lng: 3.3561, type: "transport" },
    { name: "CMS Bus Stop", area: "Lagos Island", lat: 6.4550, lng: 3.3897, type: "transport" },
    { name: "Berger Bus Stop", area: "Ojodu", lat: 6.6228, lng: 3.3567, type: "transport" },
    { name: "Obalende Bus Terminal", area: "Lagos Island", lat: 6.4450, lng: 3.4050, type: "transport" },
    { name: "Oshodi Transport Interchange", area: "Oshodi", lat: 6.5451, lng: 3.3367, type: "transport" },
    { name: "Mile 2 Bus Stop", area: "Amuwo Odofin", lat: 6.4589, lng: 3.2989, type: "transport" },
    // **NEW TRANSPORT HUBS**
    { name: "Apapa Port Rail Terminus", area: "Apapa", lat: 6.4489, lng: 3.3589, type: "transport" },
    { name: "Marina Ferry Terminal", area: "Lagos Island", lat: 6.4530, lng: 3.3910, type: "transport" },


    // LANDMARKS & INSTITUTIONS (Extended)
    { name: "University of Lagos (UNILAG)", area: "Akoka", lat: 6.5158, lng: 3.3896, type: "university" },
    { name: "Lagos State University (LASU)", area: "Ojo", lat: 6.4589, lng: 3.1789, type: "university" },
    { name: "Yaba College of Technology", area: "Yaba", lat: 6.5074, lng: 3.3721, type: "college" },
    { name: "National Stadium", area: "Surulere", lat: 6.4969, lng: 3.3561, type: "stadium" },
    { name: "Tafawa Balewa Square (TBS)", area: "Lagos Island", lat: 6.4550, lng: 3.3897, type: "landmark" },
    { name: "Eko Hotel & Suites", area: "Victoria Island", lat: 6.4281, lng: 3.4219, type: "hotel" },
    { name: "The Palms Shopping Mall", area: "Lekki", lat: 6.4474, lng: 3.4746, type: "mall" },
    { name: "Ikeja City Mall", area: "Ikeja", lat: 6.5964, lng: 3.3406, type: "mall" },
    { name: "National Theatre", area: "Iganmu", lat: 6.4674, lng: 3.3642, type: "landmark" },
    { name: "Lagos Business School (LBS)", area: "Ajah", lat: 6.4674, lng: 3.5681, type: "university" },
    { name: "Federal Palace Hotel", area: "Victoria Island", lat: 6.4251, lng: 3.4189, type: "hotel" },
    { name: "Freedom Park", area: "Lagos Island", lat: 6.4539, lng: 3.3934, type: "park" },
    // **NEW LANDMARKS/INSTITUTIONS**
    { name: "Eko Convention Centre", area: "Victoria Island", lat: 6.4290, lng: 3.4240, type: "landmark" },
    { name: "Third Mainland Bridge", area: "Lagos Lagoon", lat: 6.4800, lng: 3.3900, type: "bridge" },
    { name: "Lagos Secretariat", area: "Alausa, Ikeja", lat: 6.6152, lng: 3.3654, type: "government" },
    { name: "Fela's African Shrine", area: "Ikeja", lat: 6.5851, lng: 3.3711, type: "landmark" },
    { name: "City Mall Onikan", area: "Lagos Island", lat: 6.4555, lng: 3.4005, type: "mall" },


    // HOSPITALS (Extended)
    { name: "Lagos University Teaching Hospital (LUTH)", area: "Idi-Araba", lat: 6.4969, lng: 3.3561, type: "hospital" },
    { name: "Lagos State University Teaching Hospital (LASUTH)", area: "Ikeja", lat: 6.5964, lng: 3.3406, type: "hospital" },
    { name: "Reddington Hospital", area: "Victoria Island", lat: 6.4281, lng: 3.4219, type: "hospital" },
    { name: "Eko Hospital", area: "Ikeja", lat: 6.5964, lng: 3.3406, type: "hospital" },
    { name: "General Hospital Lagos", area: "Lagos Island", lat: 6.4560, lng: 3.3951, type: "hospital" },
    // **NEW HOSPITALS**
    { name: "St. Nicholas Hospital", area: "Lagos Island", lat: 6.4540, lng: 3.3980, type: "hospital" },


    // RESIDENTIAL ESTATES (Extended)
    { name: "Magodo Estate", area: "Magodo", lat: 6.6228, lng: 3.3789, type: "estate" },
    { name: "Festac Town", area: "Amuwo Odofin", lat: 6.4697, lng: 3.2830, type: "estate" }, // Updated coordinates
    { name: "1004 Estate", area: "Victoria Island", lat: 6.4281, lng: 3.4219, type: "estate" },
    { name: "Dolphin Estate", area: "Ikoyi", lat: 6.4541, lng: 3.4316, type: "estate" },
    { name: "VGC (Victoria Garden City)", area: "Lekki", lat: 6.4474, lng: 3.4746, type: "estate" },
    { name: "Ikota Estate", area: "Lekki", lat: 6.4391, lng: 3.5053, type: "estate" },
    { name: "Gbagada Estate", area: "Gbagada", lat: 6.5589, lng: 3.3789, type: "estate" },
    { name: "Lekki Gardens", area: "Lekki-Ajah", lat: 6.4601, lng: 3.5401, type: "estate" },
    // **NEW ESTATES**
    { name: "Green Springs Estate", area: "Ajah", lat: 6.4710, lng: 3.5510, type: "estate" },
    { name: "Atlantic View Estate", area: "Oniru", lat: 6.4350, lng: 3.4380, type: "estate" },
    { name: "Mende Maryland Estate", area: "Maryland", lat: 6.5701, lng: 3.3739, type: "estate" },
    { name: "Parkview Estate", area: "Ikoyi", lat: 6.4589, lng: 3.4234, type: "estate" },


    // BEACHES & RECREATION (Extended)
    { name: "Elegushi Beach", area: "Lekki", lat: 6.4391, lng: 3.5053, type: "beach" },
    { name: "Bar Beach", area: "Victoria Island", lat: 6.4281, lng: 3.4219, type: "beach" },
    { name: "Tarkwa Bay Beach", area: "Lagos Island", lat: 6.4125, lng: 3.3789, type: "beach" },
    { name: "Lekki Conservation Centre", area: "Lekki", lat: 6.4391, lng: 3.5053, type: "park" },
    { name: "Oniru Beach", area: "Victoria Island", lat: 6.4392, lng: 3.4297, type: "beach" },
    { name: "JJT Park (Alausa)", area: "Alausa", lat: 6.6111, lng: 3.3541, type: "park" },
    // **NEW RECREATION**
    { name: "Badagry Slave Museum", area: "Badagry", lat: 6.4167, lng: 2.8833, type: "museum" },
    { name: "Lufasi Park", area: "Ajah", lat: 6.4605, lng: 3.5705, type: "park" },


    // RELIGIOUS CENTERS (Extended)
    { name: "National Mosque", area: "Lagos Island", lat: 6.4550, lng: 3.3897, type: "mosque" },
    { name: "Cathedral Church of Christ", area: "Lagos Island", lat: 6.4550, lng: 3.3897, type: "church" },
    { name: "Redeemed Christian Church (RCCG)", area: "Ebute Metta", lat: 6.4894, lng: 3.3781, type: "church" },
    { name: "Synagogue Church of All Nations (SCOAN)", area: "Ikoyi", lat: 6.4541, lng: 3.4316, type: "church" },
    // **NEW RELIGIOUS CENTERS**
    { name: "Lagos Central Mosque", area: "Lagos Island", lat: 6.4560, lng: 3.3900, type: "mosque" },
    { name: "Celestial Church of Christ (CCC)", area: "Makoko", lat: 6.5050, lng: 3.3950, type: "church" },


    // INDUSTRIAL/BUSINESS AREAS (Extended)
    { name: "Apapa Port", area: "Apapa", lat: 6.4489, lng: 3.3589, type: "industrial" },
    { name: "Tin Can Island Port", area: "Apapa", lat: 6.4389, lng: 3.3489, type: "industrial" },
    { name: "Oregun Industrial Estate", area: "Ikeja", lat: 6.5964, lng: 3.3406, type: "industrial" },
    { name: "Ilupeju Industrial Estate", area: "Ilupeju", lat: 6.5491, lng: 3.3619, type: "industrial" },
    { name: "Lagos International Trade Fair Complex", area: "Ojo", lat: 6.4891, lng: 3.1672, type: "industrial" },


    // SUBURBS & OUTSKIRTS (Extended)
    { name: "Ikorodu", area: "Ikorodu", lat: 6.6194, lng: 3.5089, type: "suburb" },
    { name: "Badagry", area: "Badagry", lat: 6.4167, lng: 2.8833, type: "suburb" },
    { name: "Epe", area: "Epe", lat: 6.5833, lng: 3.9833, type: "suburb" },
    { name: "Ibeju-Lekki", area: "Lekki", lat: 6.4391, lng: 3.8053, type: "suburb" },
    { name: "Mowe", area: "Ogun State (Outskirt)", lat: 6.7891, lng: 3.3789, type: "suburb" },
    { name: "Arepo", area: "Ogun State (Outskirt)", lat: 6.6710, lng: 3.4210, type: "suburb" },
    // **NEW SUBURBS/OUTSKIRTS**y
    { name: "Sango Ota", area: "Ogun State (Outskirt)", lat: 6.6811, lng: 3.2428, type: "suburb" },
    { name: "Iba", area: "Ojo", lat: 6.4850, lng: 3.1890, type: "suburb" },
    { name: "Igando", area: "Alimosho", lat: 6.5700, lng: 3.2350, type: "suburb" },
];

// Helper function to search locations
export const searchLocations = (query) => {
    if (!query || query.length < 2) return [];

    const searchTerm = query.toLowerCase().trim();

    return LAGOS_LOCATIONS
        .filter(location =>
            location.name.toLowerCase().includes(searchTerm) ||
            location.area.toLowerCase().includes(searchTerm) ||
            location.type.toLowerCase().includes(searchTerm)
        )
        .slice(0, 8) // Limit to 8 results
        .map(location => ({
            place_id: `${location.name.replace(/\s/g, '_')}_${location.lat}_${location.lng}`,
            description: location.name,
            structured_formatting: {
                main_text: location.name,
                secondary_text: `${location.area}, Lagos, Nigeria`
            },
            ...location
        }));
};

// Get location by name
export const getLocationByName = (name) => {
    return LAGOS_LOCATIONS.find(loc =>
        loc.name.toLowerCase() === name.toLowerCase()
    );
};
