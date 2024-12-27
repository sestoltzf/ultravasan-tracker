// Typdefinition för aktivitet
export interface Activity {
    id: string; // Unikt ID för aktiviteten
    date: string; // Datum för aktiviteten
    runner: string; // Namn på löparen
    distance: number; // Distans i km
    duration: string; // Varaktighet (t.ex. i minuter)
    notes: string; // Anteckningar om aktiviteten
    f24s_workout: boolean; // Om aktiviteten är kopplad till F24S
    status: 'Published' | 'Draft'; // Status för aktiviteten
    checkpoint: string; // Kopplad checkpoint (t.ex. "Mora")
    media: Array<{
      url: string; // Länk till media (bild/fil)
      filename: string; // Namn på filen
      type: string; // Mediatyp (t.ex. "image/jpeg")
    }>; // Lista över mediafiler
    videoURL?: string; // Länk till eventuell video
    mediaType: 'Image' | 'Video' | 'Both' | 'None'; // Typ av media
    mediaDescription?: string; // Beskrivning av media
    location?: string; // Plats för aktiviteten
  }
  
  // Om du har fler typer, lägg till dem här
  export interface User {
    id: string; // Unikt ID för användaren
    name: string; // Namn på användaren
    email: string; // E-postadress
  }
  
  // Om du planerar att lägga till fler typer, kan du exportera dem som centraliserade typer
  export type { Activity, User };
  