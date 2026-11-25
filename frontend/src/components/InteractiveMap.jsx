import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';
import L from 'leaflet';

// URL sanitization helpers to guard against XSS and malicious protocol injection
const getSafeImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '/assets/destinations/placeholder-monument.svg';
  }
  const trimmed = url.trim();
  // Allow safe relative paths under root (e.g. /assets/destinations/...)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }
  // Allow safe absolute http/https URLs
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // Malformed URL format
  }
  return '/assets/destinations/placeholder-monument.svg';
};

const getSafeDestinationUrl = (slug) => {
  if (!slug || typeof slug !== 'string') return '/places';
  // Restrict slug to safe URL slug characters
  const sanitized = slug.replace(/[^a-zA-Z0-9_-]/g, '');
  return `/places/${sanitized}`;
};

const getSafeDirectionsUrl = (url, lat, lng) => {
  if (url && typeof url === 'string') {
    const trimmed = url.trim();
    try {
      const parsed = new URL(trimmed);
      if (
        (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
        (parsed.hostname === 'google.com' || parsed.hostname.endsWith('.google.com') || parsed.hostname === 'maps.google.com')
      ) {
        return trimmed;
      }
    } catch {
      // Fallback to coordinates
    }
  }
  const numLat = Number(lat);
  const numLng = Number(lng);
  if (Number.isFinite(numLat) && Number.isFinite(numLng)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${numLat},${numLng}`;
  }
  return 'https://www.google.com/maps';
};

// Pure DOM-based popup builder ensuring complete immunity to stored XSS
const createPopupElement = (place, lang) => {
  const container = document.createElement('div');
  container.style.fontFamily = 'inherit';
  container.style.width = '220px';
  container.style.padding = '2px';

  // 1. Destination thumbnail image
  const img = document.createElement('img');
  img.src = getSafeImageUrl(place.hero_image);
  img.alt = (lang === 'mr' ? place.name_mr : place.name_en) || 'Destination';
  img.style.width = '100%';
  img.style.height = '110px';
  img.style.objectFit = 'cover';
  img.style.borderRadius = '6px';
  img.style.marginBottom = '8px';
  img.loading = 'lazy';
  img.onerror = () => {
    img.onerror = null;
    img.src = '/assets/destinations/placeholder-monument.svg';
  };
  container.appendChild(img);

  // 2. Category badge
  const categoryDiv = document.createElement('div');
  categoryDiv.style.fontSize = '0.75rem';
  categoryDiv.style.color = '#C6A15B';
  categoryDiv.style.fontWeight = '700';
  categoryDiv.style.textTransform = 'uppercase';
  const categoryName = place.category
    ? (lang === 'mr' ? place.category.name_mr : place.category.name_en)
    : '';
  categoryDiv.textContent = categoryName || '';
  container.appendChild(categoryDiv);

  // 3. Destination Title
  const titleH4 = document.createElement('h4');
  titleH4.style.color = '#102F29';
  titleH4.style.fontSize = '1rem';
  titleH4.style.margin = '4px 0 6px 0';
  titleH4.style.fontWeight = '700';
  titleH4.textContent = (lang === 'mr' ? place.name_mr : place.name_en) || '';
  container.appendChild(titleH4);

  // 4. Distance / Location info
  const distDiv = document.createElement('div');
  distDiv.style.fontSize = '0.8rem';
  distDiv.style.color = '#5A6963';
  distDiv.style.marginBottom = '8px';

  const distText = place.distance_from_udgir_km === 0
    ? (lang === 'mr' ? '📍 उदगीर शहर' : '📍 Udgir City')
    : `📍 ${place.distance_from_udgir_km} km`;
  distDiv.textContent = distText;

  if (place.is_coordinates_approximate) {
    const approxSpan = document.createElement('span');
    approxSpan.style.color = '#C62828';
    approxSpan.style.marginLeft = '4px';
    approxSpan.textContent = lang === 'mr' ? '(अंदाजे)' : '(Approx)';
    distDiv.appendChild(approxSpan);
  }
  container.appendChild(distDiv);

  // 5. Action Buttons container
  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.gap = '6px';
  btnRow.style.marginTop = '6px';

  // Details button
  const detailsLink = document.createElement('a');
  detailsLink.href = getSafeDestinationUrl(place.slug);
  detailsLink.style.flex = '1';
  detailsLink.style.textAlign = 'center';
  detailsLink.style.background = '#173F35';
  detailsLink.style.color = '#fff';
  detailsLink.style.fontSize = '0.75rem';
  detailsLink.style.padding = '6px';
  detailsLink.style.borderRadius = '4px';
  detailsLink.style.textDecoration = 'none';
  detailsLink.style.fontWeight = '600';
  detailsLink.textContent = lang === 'mr' ? 'माहिती पाहा' : 'Details';
  btnRow.appendChild(detailsLink);

  // Directions button
  const directionsLink = document.createElement('a');
  directionsLink.href = getSafeDirectionsUrl(place.google_maps_url, place.latitude, place.longitude);
  directionsLink.target = '_blank';
  directionsLink.rel = 'noopener noreferrer';
  directionsLink.style.flex = '1';
  directionsLink.style.textAlign = 'center';
  directionsLink.style.background = '#C6A15B';
  directionsLink.style.color = '#102F29';
  directionsLink.style.fontSize = '0.75rem';
  directionsLink.style.padding = '6px';
  directionsLink.style.borderRadius = '4px';
  directionsLink.style.textDecoration = 'none';
  directionsLink.style.fontWeight = '700';
  directionsLink.textContent = lang === 'mr' ? 'दिशानिर्देश ↗' : 'Directions ↗';
  btnRow.appendChild(directionsLink);

  container.appendChild(btnRow);
  return container;
};

export const InteractiveMap = ({ places = [], height = '550px', showControls = true }) => {
  const { lang, t } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [locationStatus, setLocationStatus] = useState(null);

  // Udgir Center Coordinates: 18.3942, 77.1172
  const UDGIR_CENTER = [18.3942, 77.1172];

  const getMarkerIcon = (categorySlug) => {
    let color = '#C6A15B';
    if (categorySlug === 'nature') color = '#2E7D32';
    else if (categorySlug === 'religious') color = '#E65100';
    else if (categorySlug === 'cultural') color = '#6A1B9A';
    else if (categorySlug === 'nearby') color = '#1565C0';

    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="32" height="44">
        <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 28 16 28s16-16 16-28c0-8.84-7.16-16-16-16z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="#ffffff"/>
      </svg>
    `;

    return L.divIcon({
      html: svgIcon,
      className: 'custom-leaflet-marker',
      iconSize: [32, 44],
      iconAnchor: [16, 44],
      popupAnchor: [0, -40]
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: UDGIR_CENTER,
        zoom: 12,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filteredPlaces = places.filter((p) => {
      if (!p.latitude || !p.longitude) return false;
      if (selectedCategory === 'All') return true;
      return p.category?.slug === selectedCategory;
    });

    filteredPlaces.forEach((place) => {
      const icon = getMarkerIcon(place.category?.slug);
      const marker = L.marker([place.latitude, place.longitude], { icon });

      // Safe DOM-based popup element
      const popupElement = createPopupElement(place, lang);
      marker.bindPopup(popupElement);
      markersLayerRef.current.addLayer(marker);
    });

    if (filteredPlaces.length > 0 && selectedCategory !== 'All') {
      const bounds = L.latLngBounds(filteredPlaces.map((p) => [p.latitude, p.longitude]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [places, selectedCategory, lang]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus(lang === 'mr' ? 'ब्राउझर जीपीएस समर्थित नाही' : 'Geolocation is not supported by your browser');
      return;
    }

    setLocationStatus(lang === 'mr' ? 'स्थान शोधत आहे...' : 'Locating...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 14);
          const userIcon = L.divIcon({
            html: '<div style="width: 18px; height: 18px; background: #2563EB; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 10px rgba(37,99,235,0.8);"></div>',
            className: 'user-location-pin',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const userPopup = document.createElement('b');
          userPopup.textContent = lang === 'mr' ? 'आपले सध्याचे स्थान' : 'Your Location';

          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(userPopup)
            .openPopup();
        }
        setLocationStatus(null);
      },
      (error) => {
        setLocationStatus(lang === 'mr' ? 'स्थान मिळवता आले नाही (परवानगी नाकारली)' : 'Permission denied or unable to acquire location');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
      {showControls && (
        <div style={{
          padding: '16px 20px',
          background: 'var(--white)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['All', 'historical', 'nature', 'religious', 'cultural', 'nearby'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--forest-green)' : 'var(--border-light)',
                  background: selectedCategory === cat ? 'var(--forest-green)' : 'transparent',
                  color: selectedCategory === cat ? 'var(--white)' : 'var(--text-dark)',
                  transition: 'var(--transition)'
                }}
              >
                {cat === 'All' ? t.filters.all : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Locate Me Button */}
          <button
            onClick={handleLocateMe}
            className="btn-secondary"
            style={{ padding: '7px 16px', fontSize: '0.85rem' }}
          >
            <Navigation size={14} />
            <span>{t.mapPage.locateMe}</span>
          </button>
        </div>
      )}

      {locationStatus && (
        <div style={{ padding: '8px 16px', background: '#FFF3E0', color: '#E65100', fontSize: '0.82rem', textAlign: 'center' }}>
          {locationStatus}
        </div>
      )}

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} style={{ height, width: '100%', zIndex: 1 }} />
    </div>
  );
};
