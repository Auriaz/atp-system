# 🎬 Dodanie filmiku tła dla hero section - INSTRUKCJA

## ✅ **Co zostało zaimplementowane:**

### 🎥 **Video Background w Hero Section**
- Dodany element `<video>` z autoplay, loop i muted
- Responsywny design z fallback na obraz
- Optymalizacja wydajności z kontrolą playback rate
- Overlay gradients dla lepszej czytelności tekstu
- Z-index layers: video (z-0) → overlay (z-10-20) → content (z-40)

### 🎨 **Efekty wizualne:**
- **Filter effects**: contrast(1.1) brightness(0.9) dla lepszego kontrastu
- **Overlay gradients**: ciemne pokrycie dla czytelności tekstu
- **Floating geometric shapes** nadal działają ponad video
- **Glass morphism cards** wyglądają świetnie na tle video

### 📱 **Responsive i Performance:**
- Mobilne urządzenia: `object-position: center right` + `scale(1.1)`
- `prefers-reduced-motion`: wyłączenie animacji dla lepszej accessibility
- Lazy loading z poster image jako fallback
- Multiple video formats (MP4 + WebM) dla kompatybilności

## 🎯 **Jak dodać swój filmik:**

### 1. **Pobierz odpowiedni filmik**
```bash
# Przykładowe źródła:
- Pexels.com/videos (DARMOWE)
- Pixabay.com/videos (DARMOWE) 
- Unsplash.com/videos (DARMOWE)
- Shutterstock (PREMIUM)
```

### 2. **Wyszukaj odpowiednie video**
```
Kategorie do wyszukania:
- "fitness workout gym"
- "personal trainer exercising" 
- "woman/man working out"
- "strength training"
- "cardio exercise"
- "gym equipment training"
```

### 3. **Specyfikacje video**
```
✅ Rozdzielczość: 1920x1080 (Full HD) lub wyższa
✅ Długość: 10-30 sekund (jest zapętlone)
✅ Format: MP4 (H.264 codec)
✅ Kompresja: 2-5 Mbps bitrate
✅ Audio: NIE (video jest muted)
✅ Treść: Osoba ćwicząca, neutralne tło
```

### 4. **Umieść pliki**
```bash
# Skopiuj pliki do:
/public/videos/
  ├── workout-hero.mp4    # główny plik
  ├── workout-hero.webm   # opcjonalny (lepsza kompresja)
  └── README.md          # instrukcje
```

### 5. **Optymalizacja (opcjonalne)**
```bash
# Jeśli masz FFmpeg zainstalowane:
ffmpeg -i twoj-filmik.mp4 -vcodec libx264 -crf 23 -preset medium -vf scale=1920:1080 -an workout-hero.mp4

# Konwersja do WebM:
ffmpeg -i workout-hero.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -an workout-hero.webm
```

## 🚀 **Aktualne efekty:**

### ✨ **Działają już:**
- ✅ Video background z fallback na obrazek
- ✅ Animacje GSAP na floating cards
- ✅ Responsive design 
- ✅ Dark overlay dla czytelności
- ✅ Performance optimization
- ✅ Accessibility support

### 📋 **Fallback plan:**
Jeśli video nie jest dostępne, strona automatycznie pokazuje:
- `sports-background.webp` jako poster image
- Wszystkie animacje i efekty działają normalnie
- Brak błędów w konsoli

## 🎬 **Przykład idealnego video:**
- Osoba ćwicząca w nowoczesnej siłowni
- Płynne ruchy kamery  
- Profesjonalne oświetlenie
- Ciemne/neutralne tło (żeby tekst był czytelny)
- Dynamiczna akcja (podnoszenie ciężarów, cardio, stretching)
- Bez dźwięku, zapętlone

**Wynik:** Profesjonalna strona trenera personalnego z żywym, dynamicznym tłem pokazującym prawdziwy trening! 💪
