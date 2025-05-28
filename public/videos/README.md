# Video Files for ATP System

## Hero Background Video

Umieść tutaj pliki video dla tła sekcji hero:

### Wymagane pliki:
- `workout-hero.mp4` - główny plik video (preferowany format)
- `workout-hero.webm` - alternatywny format dla lepszej kompatybilności

### Specyfikacje video:
- **Rozdzielczość**: 1920x1080 (Full HD) lub wyższa
- **Długość**: 10-30 sekund (video jest zapętlone)
- **Format**: MP4 (H.264) i WebM (VP9)
- **Kompresja**: Zoptymalizowana dla web (bitrate ~2-5 Mbps)
- **Audio**: Brak (video jest wyciszone)

### Treść video:
- Osoba ćwicząca w siłowni/studio fitness
- Dynamiczne ruchy treningowe
- Profesjonalne oświetlenie
- Spokojne, płynne ruchy kamery
- Neutralne/ciemne tło (żeby tekst był czytelny)

### Gdzie pobrać video:
1. **Darmowe źródła**:
   - Pexels.com/videos
   - Pixabay.com/videos
   - Unsplash.com/videos

2. **Premium źródła**:
   - Shutterstock
   - Getty Images
   - Adobe Stock

### Przykładowe zapytania wyszukiwania:
- "fitness workout gym"
- "personal trainer exercising"
- "woman working out"
- "strength training"
- "cardio exercise"

### Optymalizacja:
```bash
# Konwersja do WebM przy użyciu FFmpeg
ffmpeg -i workout-hero.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus workout-hero.webm

# Kompresja MP4
ffmpeg -i original-video.mp4 -vcodec libx264 -crf 23 -preset medium -vf scale=1920:1080 -an workout-hero.mp4
```

### Fallback:
Jeśli video nie jest dostępne, strona automatycznie użyje obrazu `sports-background.webp` jako tła.
