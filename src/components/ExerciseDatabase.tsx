import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddExerciseToDatabase } from "./AddExerciseToDatabase";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Search, 
  Dumbbell, 
  Heart, 
  Target, 
  Clock, 
  Users,
  Play,
  BookOpen,
  Star
} from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'functional';
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  description: string;
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  duration?: string;
  isCustom?: boolean;
}

const exerciseDatabase: Exercise[] = [
  // === PETTORALI ===
  {
    id: "panca-piana-bilanciere",
    name: "Panca Piana - Bilanciere",
    category: "strength",
    targetMuscles: ["Pettorali", "Tricipiti", "Deltoidi anteriori"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Panca", "Pesi"],
    description: "Esercizio fondamentale per lo sviluppo della massa pettorale con bilanciere.",
    instructions: [
      "Sdraiati sulla panca con i piedi ben piantati a terra",
      "Afferra il bilanciere con presa poco più larga delle spalle",
      "Scendi controllando il bilanciere fino al petto",
      "Spingi il bilanciere verso l'alto fino all'estensione completa",
      "Mantieni sempre il controllo del movimento"
    ],
    tips: [
      "Non far rimbalzare il bilanciere sul petto",
      "Mantieni le spalle contratte e la schiena arcuata",
      "Respira durante la discesa, trattieni durante la spinta"
    ]
  },
  {
    id: "panca-piana-manubri",
    name: "Panca Piana - Manubri",
    category: "strength",
    targetMuscles: ["Pettorali", "Tricipiti", "Deltoidi anteriori"],
    difficulty: "intermediate",
    equipment: ["Manubri", "Panca"],
    description: "Variante con manubri per maggiore range di movimento e stabilizzazione.",
    instructions: [
      "Sdraiati sulla panca tenendo un manubrio per mano",
      "Posiziona i manubri all'altezza del petto",
      "Spingi i manubri verso l'alto seguendo un arco naturale",
      "Scendi controllando fino alla massima estensione",
      "Ripeti il movimento mantenendo il controllo"
    ],
    tips: [
      "Non toccare i manubri tra di loro in alto",
      "Scendi fino a sentire lo stretch pettorale",
      "Mantieni i polsi dritti durante tutto il movimento"
    ]
  },
  {
    id: "panca-piana-smith",
    name: "Panca Piana - Smith Machine",
    category: "strength",
    targetMuscles: ["Pettorali", "Tricipiti", "Deltoidi anteriori"],
    difficulty: "beginner",
    equipment: ["Smith Machine", "Panca"],
    description: "Versione guidata per principianti o per maggiore sicurezza.",
    instructions: [
      "Posiziona la panca sotto la Smith Machine",
      "Afferra la barra con presa media",
      "Sgancia la barra e scendi al petto",
      "Spingi verso l'alto mantenendo il controllo",
      "Riancora la barra al termine della serie"
    ],
    tips: [
      "Ideale per apprendere il movimento",
      "Permette di concentrarsi sulla tecnica",
      "Utile per serie ad esaurimento in sicurezza"
    ]
  },
  {
    id: "panca-inclinata-bilanciere",
    name: "Panca Inclinata - Bilanciere",
    category: "strength",
    targetMuscles: ["Pettorali superiori", "Deltoidi anteriori", "Tricipiti"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Panca inclinata", "Pesi"],
    description: "Enfatizza la parte superiore dei pettorali con inclinazione 30-45°.",
    instructions: [
      "Regola la panca a 30-45° di inclinazione",
      "Afferra il bilanciere con presa media",
      "Scendi il bilanciere verso la parte alta del petto",
      "Spingi verso l'alto mantenendo l'angolo",
      "Controlla sempre la fase eccentrica"
    ],
    tips: [
      "Non utilizzare inclinazioni superiori a 45°",
      "Tocca la parte alta del petto, non il collo",
      "Mantieni i piedi ben saldi a terra"
    ]
  },
  {
    id: "panca-inclinata-manubri",
    name: "Panca Inclinata - Manubri",
    category: "strength",
    targetMuscles: ["Pettorali superiori", "Deltoidi anteriori", "Tricipiti"],
    difficulty: "intermediate",
    equipment: ["Manubri", "Panca inclinata"],
    description: "Variante con manubri per maggior range di movimento sui pettorali alti.",
    instructions: [
      "Siediti sulla panca inclinata con un manubrio per mano",
      "Porta i manubri all'altezza delle spalle",
      "Spingi verso l'alto e leggermente in avanti",
      "Scendi controllando fino al massimo stretch",
      "Mantieni sempre il controllo del movimento"
    ],
    tips: [
      "Concentrati sul sentire i pettorali alti",
      "Non far toccare i manubri in alto",
      "Mantieni i gomiti sotto ai polsi"
    ]
  },
  {
    id: "panca-declinata-bilanciere",
    name: "Panca Declinata - Bilanciere",
    category: "strength",
    targetMuscles: ["Pettorali inferiori", "Tricipiti"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Panca declinata", "Pesi"],
    description: "Enfatizza la parte inferiore dei pettorali con declinazione.",
    instructions: [
      "Posizionati sulla panca declinata fissando i piedi",
      "Afferra il bilanciere con presa media",
      "Scendi verso la parte bassa del petto",
      "Spingi verso l'alto mantenendo l'angolo",
      "Mantieni sempre il controllo"
    ],
    tips: [
      "Assicurati di essere ben fissato alla panca",
      "Tocca la parte bassa del petto",
      "Non utilizzare declinazioni eccessive"
    ]
  },
  {
    id: "panca-declinata-manubri",
    name: "Panca Declinata - Manubri",
    category: "strength",
    targetMuscles: ["Pettorali inferiori", "Tricipiti"],
    difficulty: "intermediate",
    equipment: ["Manubri", "Panca declinata"],
    description: "Variante con manubri per i pettorali inferiori.",
    instructions: [
      "Posizionati sulla panca declinata con i manubri",
      "Inizia con i manubri all'altezza del petto basso",
      "Spingi seguendo un arco naturale",
      "Scendi fino al massimo allungamento",
      "Ripeti mantenendo la tensione"
    ],
    tips: [
      "Concentrati sui pettorali bassi",
      "Mantieni i polsi stabili",
      "Non far toccare i manubri"
    ]
  },
  {
    id: "croci-cavi-alti",
    name: "Croci ai Cavi Alti",
    category: "strength",
    targetMuscles: ["Pettorali", "Deltoidi anteriori"],
    difficulty: "intermediate",
    equipment: ["Cavi", "Carrucole"],
    description: "Esercizio di isolamento per i pettorali con cavi dall'alto.",
    instructions: [
      "Posizionati al centro della macchina a cavi",
      "Afferra le maniglie con i cavi in alto",
      "Mantieni una leggera flessione dei gomiti",
      "Porta le mani davanti al petto in arco",
      "Torna controllando alla posizione iniziale"
    ],
    tips: [
      "Non piegare eccessivamente i gomiti",
      "Concentrati sullo squeeze pettorale",
      "Mantieni il busto stabile"
    ]
  },
  {
    id: "croci-cavi-bassi",
    name: "Croci ai Cavi Bassi",
    category: "strength",
    targetMuscles: ["Pettorali superiori", "Deltoidi anteriori"],
    difficulty: "intermediate",
    equipment: ["Cavi", "Carrucole"],
    description: "Variante dal basso per enfatizzare i pettorali superiori.",
    instructions: [
      "Posizionati al centro con i cavi in basso",
      "Afferra le maniglie con le braccia leggermente piegate",
      "Porta le mani verso l'alto e davanti",
      "Concentrati sulla contrazione in alto",
      "Scendi controllando alla posizione iniziale"
    ],
    tips: [
      "Inclina leggermente il busto in avanti",
      "Porta le mani leggermente sopra la linea delle spalle",
      "Mantieni sempre tensione sui pettorali"
    ]
  },
  {
    id: "croci-manubri-piana",
    name: "Croci con Manubri - Panca Piana",
    category: "strength",
    targetMuscles: ["Pettorali", "Deltoidi anteriori"],
    difficulty: "intermediate",
    equipment: ["Manubri", "Panca"],
    description: "Esercizio classico di isolamento per i pettorali.",
    instructions: [
      "Sdraiati sulla panca con un manubrio per mano",
      "Inizia con le braccia estese sopra il petto",
      "Scendi i manubri lateralmente mantenendo i gomiti leggermente piegati",
      "Scendi fino a sentire lo stretch pettorale",
      "Torna su seguendo lo stesso arco"
    ],
    tips: [
      "Non scendere troppo per evitare infortuni",
      "Mantieni sempre una leggera flessione dei gomiti",
      "Concentrati sulla contrazione pettorale"
    ]
  },
  {
    id: "croci-manubri-inclinata",
    name: "Croci con Manubri - Panca Inclinata",
    category: "strength",
    targetMuscles: ["Pettorali superiori", "Deltoidi anteriori"],
    difficulty: "intermediate",
    equipment: ["Manubri", "Panca inclinata"],
    description: "Variante inclinata per i pettorali superiori.",
    instructions: [
      "Posizionati sulla panca inclinata con i manubri",
      "Inizia con le braccia estese sopra il petto",
      "Scendi lateralmente mantenendo l'angolo della panca",
      "Concentrati sui pettorali superiori",
      "Torna alla posizione iniziale controllando"
    ],
    tips: [
      "L'angolo della panca influenza il target muscolare",
      "Non utilizzare pesi eccessivi",
      "Mantieni sempre il controllo del movimento"
    ]
  },
  {
    id: "dip-parallele",
    name: "Dip alle Parallele",
    category: "strength",
    targetMuscles: ["Pettorali inferiori", "Tricipiti", "Deltoidi anteriori"],
    difficulty: "intermediate",
    equipment: ["Parallele"],
    description: "Esercizio a corpo libero per pettorali e tricipiti.",
    instructions: [
      "Posizionati sulle parallele con le braccia estese",
      "Scendi piegando i gomiti mantenendo il busto inclinato",
      "Scendi fino a 90° di flessione dei gomiti",
      "Spingi per tornare alla posizione iniziale",
      "Mantieni il controllo durante tutto il movimento"
    ],
    tips: [
      "Inclina il busto in avanti per enfatizzare i pettorali",
      "Non scendere eccessivamente",
      "Se troppo difficile, usa l'assistenza"
    ]
  },
  {
    id: "dip-sovraccarico",
    name: "Dip alle Parallele con Sovraccarico",
    category: "strength",
    targetMuscles: ["Pettorali inferiori", "Tricipiti", "Deltoidi anteriori"],
    difficulty: "advanced",
    equipment: ["Parallele", "Cintura con pesi"],
    description: "Versione avanzata con peso aggiuntivo.",
    instructions: [
      "Indossa la cintura con il peso desiderato",
      "Posizionati sulle parallele come nei dip standard",
      "Esegui il movimento controllando il peso extra",
      "Mantieni la stessa tecnica dei dip normali",
      "Concentrati sulla qualità del movimento"
    ],
    tips: [
      "Inizia con pesi leggeri",
      "Aumenta gradualmente il carico",
      "La tecnica è più importante del peso"
    ]
  },
  {
    id: "pushup-standard",
    name: "Piegamenti Standard",
    category: "strength",
    targetMuscles: ["Pettorali", "Tricipiti", "Deltoidi anteriori", "Core"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Esercizio fondamentale a corpo libero per pettorali e tricipiti.",
    instructions: [
      "Posizionati in plank con le mani sotto le spalle",
      "Mantieni il corpo in linea retta",
      "Scendi fino a sfiorare il pavimento con il petto",
      "Spingi per tornare alla posizione iniziale",
      "Mantieni il core contratto"
    ],
    tips: [
      "Non alzare i fianchi",
      "Mantieni i gomiti a 45° dal corpo",
      "Se difficile, inizia dalle ginocchia"
    ]
  },
  {
    id: "pushup-gambe-rialzate",
    name: "Piegamenti a Gambe Rialzate",
    category: "strength",
    targetMuscles: ["Pettorali superiori", "Tricipiti", "Deltoidi anteriori", "Core"],
    difficulty: "intermediate",
    equipment: ["Rialzo per piedi"],
    description: "Variante con i piedi rialzati per enfatizzare i pettorali superiori.",
    instructions: [
      "Posiziona i piedi su un rialzo",
      "Mantieni la posizione di plank",
      "Scendi controllando fino al pavimento",
      "Spingi per tornare su",
      "Mantieni sempre l'allineamento corporeo"
    ],
    tips: [
      "Più alto è il rialzo, più difficile diventa",
      "Mantieni il core ben contratto",
      "Concentrati sui pettorali superiori"
    ]
  },
  {
    id: "pushup-diamante",
    name: "Piegamenti a Diamante",
    category: "strength",
    targetMuscles: ["Tricipiti", "Pettorali interni", "Deltoidi anteriori"],
    difficulty: "intermediate",
    equipment: ["Corpo libero"],
    description: "Variante con le mani a diamante per enfatizzare i tricipiti.",
    instructions: [
      "Posiziona le mani formando un diamante con pollici e indici",
      "Mantieni il corpo in linea retta",
      "Scendi fino a toccare le mani con il petto",
      "Spingi concentrandoti sui tricipiti",
      "Mantieni la stabilità del core"
    ],
    tips: [
      "Inizia con poche ripetizioni",
      "Se troppo difficile, allarga leggermente le mani",
      "Concentrati sulla contrazione dei tricipiti"
    ]
  },
  {
    id: "chest-press",
    name: "Chest Press",
    category: "strength",
    targetMuscles: ["Pettorali", "Tricipiti", "Deltoidi anteriori"],
    difficulty: "beginner",
    equipment: ["Macchina chest press"],
    description: "Esercizio guidato ideale per principianti.",
    instructions: [
      "Regola l'altezza del sedile",
      "Afferra le maniglie all'altezza del petto",
      "Spingi in avanti estendendo completamente le braccia",
      "Torna controllando alla posizione iniziale",
      "Mantieni la schiena appoggiata allo schienale"
    ],
    tips: [
      "Regola il peso in base al tuo livello",
      "Non bloccare i gomiti in estensione",
      "Concentrati sulla contrazione pettorale"
    ]
  },
  {
    id: "pec-deck",
    name: "Pec Deck",
    category: "strength",
    targetMuscles: ["Pettorali", "Deltoidi anteriori"],
    difficulty: "beginner",
    equipment: ["Macchina pec deck"],
    description: "Esercizio di isolamento guidato per i pettorali.",
    instructions: [
      "Regola l'altezza del sedile",
      "Posiziona gli avambracci sui pad",
      "Porta i gomiti davanti al petto",
      "Concentrati sulla contrazione pettorale",
      "Torna controllando alla posizione iniziale"
    ],
    tips: [
      "Non utilizzare slancio",
      "Mantieni gli avambracci paralleli",
      "Concentrati sulla qualità del movimento"
    ]
  },
  {
    id: "pullover-manubri",
    name: "Pullover con Manubri",
    category: "strength",
    targetMuscles: ["Pettorali", "Dorsali", "Serrato"],
    difficulty: "beginner",
    equipment: ["Manubri", "Panca"],
    description: "Esercizio che lavora sia pettorali che dorsali.",
    instructions: [
      "Sdraiati sulla panca tenendo un manubrio con entrambe le mani",
      "Inizia con il manubrio sopra il petto",
      "Scendi il manubrio dietro la testa mantenendo i gomiti leggermente piegati",
      "Torna alla posizione iniziale controllando",
      "Respira profondamente durante il movimento"
    ],
    tips: [
      "Non scendere eccessivamente dietro la testa",
      "Mantieni una leggera flessione dei gomiti",
      "Concentrati sull'allungamento del petto"
    ]
  },
  {
    id: "pullover-bilanciere",
    name: "Pullover con Bilanciere",
    category: "strength",
    targetMuscles: ["Pettorali", "Dorsali", "Serrato"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Panca"],
    description: "Variante con bilanciere del pullover.",
    instructions: [
      "Sdraiati sulla panca con il bilanciere sopra il petto",
      "Afferra il bilanciere con presa media",
      "Scendi dietro la testa mantenendo i gomiti stabili",
      "Torna controllando alla posizione iniziale",
      "Mantieni sempre il controllo del bilanciere"
    ],
    tips: [
      "Utilizza un peso moderato",
      "Mantieni i gomiti leggermente piegati",
      "Non scendere troppo dietro la testa"
    ]
  },
  {
    id: "pullover-cavi",
    name: "Pullover ai Cavi",
    category: "strength",
    targetMuscles: ["Pettorali", "Dorsali", "Serrato"],
    difficulty: "intermediate",
    equipment: ["Cavi", "Carrucole"],
    description: "Variante ai cavi per tensione costante.",
    instructions: [
      "Posizionati davanti ai cavi alti",
      "Afferra la barra con presa larga",
      "Porta la barra dall'alto verso il basso in arco",
      "Concentrati sulla contrazione pettorale",
      "Torna controllando alla posizione iniziale"
    ],
    tips: [
      "Mantieni una leggera flessione dei gomiti",
      "Non utilizzare troppo peso",
      "Concentrati sulla qualità del movimento"
    ]
  },

  // === SCHIENA ===
  {
    id: "trazioni-assistite",
    name: "Trazioni Assistite",
    category: "strength",
    targetMuscles: ["Dorsali", "Bicipiti", "Romboidi"],
    difficulty: "beginner",
    equipment: ["Macchina assistita", "Elastici"],
    description: "Versione assistita per apprendere le trazioni.",
    instructions: [
      "Seleziona il peso di assistenza sulla macchina",
      "Afferra la sbarra con presa larga",
      "Tira il corpo verso l'alto concentrandoti sui dorsali",
      "Scendi controllando fino all'estensione completa",
      "Mantieni il core contratto"
    ],
    tips: [
      "Riduci gradualmente l'assistenza",
      "Concentrati sulla tecnica corretta",
      "Non utilizzare slancio"
    ]
  },
  {
    id: "trazioni-corpo-libero",
    name: "Trazioni a Corpo Libero",
    category: "strength",
    targetMuscles: ["Dorsali", "Bicipiti", "Romboidi", "Core"],
    difficulty: "intermediate",
    equipment: ["Sbarra per trazioni"],
    description: "Esercizio fondamentale per la forza della parte superiore.",
    instructions: [
      "Appendi alla sbarra con presa poco più larga delle spalle",
      "Tira il corpo verso l'alto portando il mento sopra la sbarra",
      "Concentrati sui dorsali durante la tirata",
      "Scendi controllando fino all'estensione completa",
      "Mantieni il core contratto per stabilità"
    ],
    tips: [
      "Non utilizzare slancio",
      "Concentrati sulla qualità piuttosto che quantità",
      "Se difficile, usa la banda elastica per assistenza"
    ]
  },
  {
    id: "lat-machine-larga",
    name: "Lat Machine - Presa Larga",
    category: "strength",
    targetMuscles: ["Dorsali", "Romboidi", "Bicipiti"],
    difficulty: "beginner",
    equipment: ["Lat machine"],
    description: "Esercizio guidato per lo sviluppo dei dorsali.",
    instructions: [
      "Siediti alla lat machine con le cosce bloccate",
      "Afferra la barra con presa larga",
      "Tira la barra verso il petto concentrandoti sui dorsali",
      "Controlla la fase di ritorno",
      "Mantieni il busto leggermente inclinato all'indietro"
    ],
    tips: [
      "Non tirarla dietro il collo",
      "Concentrati sulla contrazione dei dorsali",
      "Mantieni le spalle basse e indietro"
    ]
  },
  {
    id: "lat-machine-stretta",
    name: "Lat Machine - Presa Stretta",
    category: "strength",
    targetMuscles: ["Dorsali", "Romboidi", "Bicipiti"],
    difficulty: "beginner",
    equipment: ["Lat machine"],
    description: "Variante con presa stretta per maggior coinvolgimento dei bicipiti.",
    instructions: [
      "Usa la barra con presa stretta o neutra",
      "Tira verso il petto mantenendo i gomiti vicini al corpo",
      "Concentrati sulla contrazione dei dorsali",
      "Controlla sempre il movimento",
      "Mantieni il busto stabile"
    ],
    tips: [
      "La presa stretta coinvolge maggiormente i bicipiti",
      "Mantieni sempre il controllo",
      "Non inclinarti eccessivamente all'indietro"
    ]
  },
  {
    id: "lat-machine-inversa",
    name: "Lat Machine - Presa Inversa",
    category: "strength",
    targetMuscles: ["Dorsali", "Bicipiti", "Avambracci"],
    difficulty: "beginner",
    equipment: ["Lat machine"],
    description: "Variante con presa supina per enfatizzare i bicipiti.",
    instructions: [
      "Afferra la barra con presa supina (palmi verso di te)",
      "Tira verso il petto mantenendo i gomiti stretti",
      "Concentrati sulla contrazione di dorsali e bicipiti",
      "Controlla il movimento in entrambe le fasi",
      "Mantieni la postura corretta"
    ],
    tips: [
      "Questa variante lavora molto sui bicipiti",
      "Mantieni i gomiti vicini al corpo",
      "Non utilizzare peso eccessivo inizialmente"
    ]
  },
  {
    id: "rematore-bilanciere-90",
    name: "Rematore con Bilanciere - Busto a 90°",
    category: "strength",
    targetMuscles: ["Dorsali", "Romboidi", "Deltoidi posteriori", "Bicipiti"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Pesi"],
    description: "Esercizio completo per la schiena con busto parallelo al pavimento.",
    instructions: [
      "Posizionati con i piedi alla larghezza delle spalle",
      "Piega il busto a 90° mantenendo la schiena dritta",
      "Afferra il bilanciere con presa prona",
      "Tira il bilanciere verso l'addome",
      "Concentrati sulla contrazione delle scapole"
    ],
    tips: [
      "Mantieni sempre la schiena neutra",
      "Non utilizzare slancio",
      "Concentrati sulla qualità del movimento"
    ]
  },
  {
    id: "rematore-bilanciere-45",
    name: "Rematore con Bilanciere - Busto a 45°",
    category: "strength",
    targetMuscles: ["Dorsali", "Romboidi", "Deltoidi posteriori", "Bicipiti"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Pesi"],
    description: "Variante con inclinazione ridotta per maggior comfort.",
    instructions: [
      "Mantieni il busto inclinato a circa 45°",
      "Afferra il bilanciere con presa prona media",
      "Tira verso la parte bassa del petto/addome alto",
      "Concentrati sulla retrazione delle scapole",
      "Mantieni il core contratto per stabilità"
    ],
    tips: [
      "Più facile da mantenere rispetto ai 90°",
      "Permette di usare carichi maggiori",
      "Mantieni sempre la tecnica corretta"
    ]
  },
  {
    id: "rematore-manubrio",
    name: "Rematore con Manubrio a Braccio Singolo",
    category: "strength",
    targetMuscles: ["Dorsali", "Romboidi", "Deltoidi posteriori", "Bicipiti"],
    difficulty: "beginner",
    equipment: ["Manubri", "Panca"],
    description: "Esercizio unilaterale per correggere squilibri muscolari.",
    instructions: [
      "Appoggia ginocchio e mano sulla panca",
      "Mantieni la schiena parallela al pavimento",
      "Afferra il manubrio con il braccio libero",
      "Tira il manubrio verso il fianco",
      "Concentrati sulla contrazione del dorsale"
    ],
    tips: [
      "Non ruotare il busto durante il movimento",
      "Tira con il dorsale, non solo con il braccio",
      "Mantieni il core contratto"
    ]
  },
  {
    id: "pulley-basso-v-bar",
    name: "Pulley Basso - Presa V-bar",
    category: "strength",
    targetMuscles: ["Dorsali", "Romboidi", "Bicipiti"],
    difficulty: "beginner",
    equipment: ["Pulley basso", "V-bar"],
    description: "Esercizio seduto per lo sviluppo della schiena.",
    instructions: [
      "Siediti al pulley con le gambe leggermente piegate",
      "Afferra la V-bar con presa neutra",
      "Tira verso l'addome mantenendo il busto eretto",
      "Concentrati sulla retrazione delle scapole",
      "Controlla la fase di ritorno"
    ],
    tips: [
      "Non inclinarti troppo all'indietro",
      "Mantieni il petto in fuori",
      "Concentrati sulla contrazione dorsale"
    ]
  },
  {
    id: "pulley-basso-larga",
    name: "Pulley Basso - Presa Larga",
    category: "strength",
    targetMuscles: ["Dorsali", "Romboidi", "Deltoidi posteriori"],
    difficulty: "beginner",
    equipment: ["Pulley basso", "Barra larga"],
    description: "Variante con presa larga per enfatizzare la larghezza dorsale.",
    instructions: [
      "Usa la barra larga con presa prona",
      "Tira verso la parte bassa del petto",
      "Mantieni i gomiti larghi",
      "Concentrati sulla larghezza dei dorsali",
      "Controlla sempre il movimento"
    ],
    tips: [
      "La presa larga enfatizza la larghezza",
      "Mantieni le spalle basse",
      "Non utilizzare troppo slancio"
    ]
  },
  {
    id: "pulley-basso-stretta",
    name: "Pulley Basso - Presa Stretta",
    category: "strength",
    targetMuscles: ["Dorsali", "Romboidi", "Bicipiti"],
    difficulty: "beginner",
    equipment: ["Pulley basso", "Barra stretta"],
    description: "Variante con presa stretta per maggiore spessore dorsale.",
    instructions: [
      "Usa una presa stretta supina o neutra",
      "Tira verso l'addome basso",
      "Mantieni i gomiti vicini al corpo",
      "Concentrati sullo spessore dorsale",
      "Controlla la fase eccentrica"
    ],
    tips: [
      "La presa stretta enfatizza lo spessore",
      "Coinvolge maggiormente i bicipiti",
      "Mantieni sempre il controllo"
    ]
  },
  {
    id: "rematore-t-bar",
    name: "Rematore a T-Bar",
    category: "strength",
    targetMuscles: ["Dorsali", "Romboidi", "Deltoidi posteriori", "Bicipiti"],
    difficulty: "intermediate",
    equipment: ["T-Bar", "Pesi"],
    description: "Esercizio specifico per lo spessore della schiena.",
    instructions: [
      "Posizionati sulla T-Bar con i piedi stabili",
      "Piega il busto in avanti mantenendo la schiena dritta",
      "Afferra le maniglie della T-Bar",
      "Tira verso l'addome concentrandoti sui dorsali",
      "Controlla il movimento in entrambe le fasi"
    ],
    tips: [
      "Mantieni sempre la schiena neutra",
      "Non utilizzare slancio eccessivo",
      "Concentrati sulla contrazione delle scapole"
    ]
  },
  {
    id: "stacco-tradizionale",
    name: "Stacco da Terra Tradizionale",
    category: "strength",
    targetMuscles: ["Glutei", "Femorali", "Dorsali", "Trapezi", "Core"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Pesi"],
    description: "Movimento fondamentale per forza e massa muscolare totale.",
    instructions: [
      "Posizionati con i piedi sotto la barra",
      "Piega le ginocchia e afferra la barra",
      "Mantieni la schiena neutra e il petto alto",
      "Solleva estendendo anche e ginocchia simultaneamente",
      "Termina in posizione eretta con spalle indietro"
    ],
    tips: [
      "La barra deve rimanere vicina al corpo",
      "Non curvare mai la schiena",
      "Inizia con peso leggero per apprendere la tecnica"
    ]
  },
  {
    id: "stacco-rumeno",
    name: "Stacco Rumeno",
    category: "strength",
    targetMuscles: ["Femorali", "Glutei", "Dorsali"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Pesi"],
    description: "Variante che enfatizza femorali e glutei.",
    instructions: [
      "Inizia in posizione eretta con il bilanciere",
      "Spingi i fianchi indietro mantenendo le ginocchia leggermente piegate",
      "Scendi fino a sentire lo stretch dei femorali",
      "Torna su spingendo i fianchi in avanti",
      "Mantieni sempre la schiena dritta"
    ],
    tips: [
      "Il movimento parte dai fianchi, non dalle ginocchia",
      "Concentrati sullo stretch dei femorali",
      "Non scendere eccessivamente"
    ]
  },
  {
    id: "hyperextensions",
    name: "Hyperextensions",
    category: "strength",
    targetMuscles: ["Lombari", "Glutei", "Femorali"],
    difficulty: "beginner",
    equipment: ["Panca per hyperextensions"],
    description: "Esercizio per rinforzare la catena posteriore.",
    instructions: [
      "Posizionati sulla panca con i fianchi sul bordo",
      "Incrocia le braccia sul petto",
      "Scendi controllando fino a 90°",
      "Risali concentrandoti sui lombari",
      "Non estendere eccessivamente la schiena"
    ],
    tips: [
      "Non andare oltre la posizione neutra in alto",
      "Controlla sempre il movimento",
      "Se troppo facile, tieni un peso al petto"
    ]
  },
  {
    id: "shrugs-bilanciere",
    name: "Shrugs con Bilanciere",
    category: "strength",
    targetMuscles: ["Trapezi superiori"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Pesi"],
    description: "Esercizio specifico per i trapezi superiori.",
    instructions: [
      "Tieni il bilanciere con presa prona, braccia estese",
      "Solleva le spalle verso le orecchie",
      "Concentrati sulla contrazione dei trapezi",
      "Scendi controllando alla posizione iniziale",
      "Non ruotare le spalle"
    ],
    tips: [
      "Movimento verticale, non rotatorio",
      "Concentrati sulla contrazione in alto",
      "Non utilizzare peso eccessivo"
    ]
  },
  {
    id: "shrugs-manubri",
    name: "Shrugs con Manubri",
    category: "strength",
    targetMuscles: ["Trapezi superiori"],
    difficulty: "intermediate",
    equipment: ["Manubri"],
    description: "Variante con manubri per maggior range di movimento.",
    instructions: [
      "Tieni un manubrio per mano ai lati del corpo",
      "Solleva le spalle verso l'alto",
      "Mantieni le braccia dritte",
      "Concentrati sulla contrazione dei trapezi",
      "Scendi controllando"
    ],
    tips: [
      "I manubri permettono un movimento più naturale",
      "Non piegare i gomiti",
      "Concentrati sulla qualità del movimento"
    ]
  },
  {
    id: "face-pulls",
    name: "Face Pulls",
    category: "strength",
    targetMuscles: ["Deltoidi posteriori", "Romboidi", "Trapezi medi"],
    difficulty: "beginner",
    equipment: ["Cavi", "Corda"],
    description: "Esercizio fondamentale per la salute delle spalle.",
    instructions: [
      "Imposta i cavi all'altezza del viso",
      "Afferra la corda con presa neutra",
      "Tira verso il viso separando le mani",
      "Concentrati sulla contrazione posteriore",
      "Controlla il movimento di ritorno"
    ],
    tips: [
      "Essenziale per l'equilibrio muscolare",
      "Mantieni i gomiti alti",
      "Non utilizzare peso eccessivo"
    ]
  },

  // === SPALLE ===
  {
    id: "lento-avanti-bilanciere",
    name: "Lento Avanti con Bilanciere",
    category: "strength",
    targetMuscles: ["Deltoidi", "Tricipiti"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Pesi"],
    description: "Esercizio fondamentale per lo sviluppo delle spalle.",
    instructions: [
      "Posizionati in piedi con i piedi alla larghezza delle spalle",
      "Afferra il bilanciere con presa poco più larga delle spalle",
      "Posiziona il bilanciere all'altezza delle clavicole",
      "Spingi verso l'alto fino all'estensione completa",
      "Scendi controllando alla posizione iniziale"
    ],
    tips: [
      "Mantieni il core contratto per stabilità",
      "Non inclinare la testa all'indietro",
      "Controlla sempre la fase eccentrica"
    ]
  },
  {
    id: "lento-avanti-manubri",
    name: "Lento Avanti con Manubri",
    category: "strength",
    targetMuscles: ["Deltoidi", "Tricipiti"],
    difficulty: "intermediate",
    equipment: ["Manubri"],
    description: "Variante con manubri per maggior stabilizzazione.",
    instructions: [
      "Siediti o stai in piedi con un manubrio per mano",
      "Posiziona i manubri all'altezza delle spalle",
      "Spingi verso l'alto seguendo un arco naturale",
      "Estendi completamente senza bloccare i gomiti",
      "Scendi controllando alla posizione iniziale"
    ],
    tips: [
      "I manubri permettono un movimento più naturale",
      "Mantieni i polsi dritti",
      "Non far toccare i manubri in alto"
    ]
  },
  {
    id: "lento-avanti-smith",
    name: "Lento Avanti - Smith Machine",
    category: "strength",
    targetMuscles: ["Deltoidi", "Tricipiti"],
    difficulty: "beginner",
    equipment: ["Smith Machine"],
    description: "Versione guidata per principianti.",
    instructions: [
      "Posizionati sotto la Smith Machine",
      "Afferra la barra con presa media",
      "Sgancia e spingi verso l'alto",
      "Mantieni il movimento guidato dalla macchina",
      "Riancora la barra al termine"
    ],
    tips: [
      "Ideale per apprendere il movimento",
      "Permette di concentrarsi sulla tecnica",
      "Utile per serie ad esaurimento"
    ]
  },
  {
    id: "arnold-press",
    name: "Arnold Press",
    category: "strength",
    targetMuscles: ["Deltoidi", "Tricipiti"],
    difficulty: "intermediate",
    equipment: ["Manubri"],
    description: "Variante che combina rotazione e spinta per coinvolgimento completo.",
    instructions: [
      "Inizia con i manubri davanti al petto, palmi verso di te",
      "Ruota i polsi mentre spingi verso l'alto",
      "Termina con i palmi rivolti in avanti",
      "Inverti il movimento scendendo",
      "Mantieni il controllo durante tutta la rotazione"
    ],
    tips: [
      "Movimento fluido e controllato",
      "Non utilizzare peso eccessivo inizialmente",
      "Concentrati sulla tecnica di rotazione"
    ]
  },
  {
    id: "alzate-laterali-manubri",
    name: "Alzate Laterali con Manubri",
    category: "strength",
    targetMuscles: ["Deltoidi laterali"],
    difficulty: "beginner",
    equipment: ["Manubri"],
    description: "Esercizio di isolamento per i deltoidi laterali.",
    instructions: [
      "Tieni un manubrio per mano ai lati del corpo",
      "Solleva le braccia lateralmente fino all'altezza delle spalle",
      "Mantieni una leggera flessione dei gomiti",
      "Concentrati sui deltoidi laterali",
      "Scendi controllando alla posizione iniziale"
    ],
    tips: [
      "Non sollevare oltre l'altezza delle spalle",
      "Mantieni i pollici leggermente verso il basso",
      "Non utilizzare slancio"
    ]
  },
  {
    id: "alzate-laterali-cavi",
    name: "Alzate Laterali ai Cavi",
    category: "strength",
    targetMuscles: ["Deltoidi laterali"],
    difficulty: "intermediate",
    equipment: ["Cavi"],
    description: "Variante ai cavi per tensione costante.",
    instructions: [
      "Posizionati di lato rispetto al cavo basso",
      "Afferra la maniglia con la mano lontana dal cavo",
      "Solleva il braccio lateralmente mantenendo il gomito leggermente flesso",
      "Concentrati sulla contrazione del deltoide laterale",
      "Controlla il movimento di ritorno"
    ],
    tips: [
      "La tensione costante dei cavi è molto efficace",
      "Mantieni il busto stabile",
      "Non utilizzare peso eccessivo"
    ]
  },
  {
    id: "alzate-frontali-manubri",
    name: "Alzate Frontali con Manubri",
    category: "strength",
    targetMuscles: ["Deltoidi anteriori"],
    difficulty: "beginner",
    equipment: ["Manubri"],
    description: "Esercizio per i deltoidi anteriori.",
    instructions: [
      "Tieni un manubrio per mano davanti alle cosce",
      "Solleva un braccio per volta davanti a te",
      "Arriva fino all'altezza delle spalle",
      "Mantieni il braccio leggermente flesso",
      "Alterna i bracci o fai simultaneamente"
    ],
    tips: [
      "Non andare oltre l'altezza delle spalle",
      "Mantieni il core contratto",
      "Controlla sempre il movimento"
    ]
  },
  {
    id: "alzate-frontali-cavi",
    name: "Alzate Frontali ai Cavi",
    category: "strength",
    targetMuscles: ["Deltoidi anteriori"],
    difficulty: "beginner",
    equipment: ["Cavi"],
    description: "Variante ai cavi per tensione costante sui deltoidi anteriori.",
    instructions: [
      "Posizionati di spalle al cavo basso",
      "Afferra la maniglia con una mano",
      "Solleva il braccio davanti a te fino all'altezza della spalla",
      "Concentrati sulla contrazione del deltoide anteriore",
      "Controlla il movimento di ritorno"
    ],
    tips: [
      "La tensione costante è molto efficace",
      "Non utilizzare slancio",
      "Mantieni la postura corretta"
    ]
  },
  {
    id: "alzate-90-manubri",
    name: "Alzate a 90° con Manubri (Reverse Fly)",
    category: "strength",
    targetMuscles: ["Deltoidi posteriori", "Romboidi"],
    difficulty: "intermediate",
    equipment: ["Manubri"],
    description: "Esercizio per i deltoidi posteriori e la postura.",
    instructions: [
      "Piega il busto in avanti a 90°",
      "Tieni un manubrio per mano sotto il petto",
      "Solleva le braccia lateralmente mantenendo i gomiti leggermente flessi",
      "Concentrati sui deltoidi posteriori",
      "Controlla il movimento di ritorno"
    ],
    tips: [
      "Mantieni la schiena dritta",
      "Non utilizzare slancio",
      "Concentrati sulla contrazione posteriore"
    ]
  },
  {
    id: "alzate-90-cavi",
    name: "Alzate a 90° ai Cavi (Reverse Fly)",
    category: "strength",
    targetMuscles: ["Deltoidi posteriori", "Romboidi"],
    difficulty: "intermediate",
    equipment: ["Cavi"],
    description: "Variante ai cavi per i deltoidi posteriori.",
    instructions: [
      "Posizionati al centro dei cavi all'altezza del petto",
      "Afferra le maniglie con le braccia incrociate",
      "Apri le braccia lateralmente mantenendo i gomiti alti",
      "Concentrati sulla contrazione posteriore",
      "Controlla il movimento di ritorno"
    ],
    tips: [
      "Mantieni i gomiti alti durante il movimento",
      "Non utilizzare peso eccessivo",
      "Concentrati sulla qualità del movimento"
    ]
  },
  {
    id: "tirate-mento-bilanciere",
    name: "Tirate al Mento con Bilanciere",
    category: "strength",
    targetMuscles: ["Deltoidi", "Trapezi"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Pesi"],
    description: "Esercizio composto per spalle e trapezi.",
    instructions: [
      "Tieni il bilanciere con presa stretta davanti alle cosce",
      "Tira il bilanciere verso il mento mantenendo i gomiti alti",
      "I gomiti devono guidare il movimento",
      "Arriva fino al petto alto",
      "Scendi controllando alla posizione iniziale"
    ],
    tips: [
      "I gomiti devono sempre essere più alti delle mani",
      "Non tirare troppo in alto per evitare impingement",
      "Mantieni il bilanciere vicino al corpo"
    ]
  },
  {
    id: "tirate-mento-cavi",
    name: "Tirate al Mento ai Cavi",
    category: "strength",
    targetMuscles: ["Deltoidi", "Trapezi"],
    difficulty: "intermediate",
    equipment: ["Cavi", "Barra"],
    description: "Variante ai cavi delle tirate al mento.",
    instructions: [
      "Usa il cavo basso con una barra dritta",
      "Afferra con presa stretta",
      "Tira verso il mento mantenendo i gomiti alti",
      "Concentrati su deltoidi e trapezi",
      "Controlla il movimento di ritorno"
    ],
    tips: [
      "La tensione costante dei cavi è efficace",
      "Mantieni sempre i gomiti alti",
      "Non andare troppo in alto"
    ]
  },

  // === GAMBE - QUADRICIPITI ===
  {
    id: "squat-corpo-libero",
    name: "Squat a Corpo Libero",
    category: "strength",
    targetMuscles: ["Quadricipiti", "Glutei", "Core"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Movimento fondamentale per le gambe senza attrezzi.",
    instructions: [
      "Posizionati con i piedi alla larghezza delle spalle",
      "Scendi come se ti stessi sedendo su una sedia",
      "Mantieni il peso sui talloni",
      "Scendi fino a quando le cosce sono parallele al pavimento",
      "Spingi attraverso i talloni per risalire"
    ],
    tips: [
      "Mantieni le ginocchia allineate con i piedi",
      "Non permettere alle ginocchia di cedere verso l'interno",
      "Mantieni il petto alto e la schiena dritta"
    ]
  },
  {
    id: "back-squat",
    name: "Back Squat",
    category: "strength",
    targetMuscles: ["Quadricipiti", "Glutei", "Core"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Rack", "Pesi"],
    description: "Squat con bilanciere sulla schiena, esercizio fondamentale.",
    instructions: [
      "Posiziona il bilanciere sul trapezio superiore",
      "Esci dal rack con i piedi stabili",
      "Scendi mantenendo la schiena dritta",
      "Arriva almeno alla parallela",
      "Spingi attraverso i talloni per risalire"
    ],
    tips: [
      "Mantieni sempre il controllo del bilanciere",
      "Non inclinare il busto eccessivamente in avanti",
      "Respira in alto, trattieni in discesa, espira in salita"
    ]
  },
  {
    id: "front-squat",
    name: "Front Squat",
    category: "strength",
    targetMuscles: ["Quadricipiti", "Core", "Deltoidi anteriori"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Rack", "Pesi"],
    description: "Squat con bilanciere davanti, enfatizza i quadricipiti.",
    instructions: [
      "Posiziona il bilanciere sulla parte anteriore delle spalle",
      "Mantieni i gomiti alti e paralleli al pavimento",
      "Scendi mantenendo il busto più eretto possibile",
      "Mantieni l'equilibrio e il controllo",
      "Risali spingendo attraverso i talloni"
    ],
    tips: [
      "Richiede maggiore mobilità della caviglia",
      "Mantieni sempre i gomiti alti",
      "Inizia con peso leggero per apprendere la tecnica"
    ]
  },
  {
    id: "leg-press",
    name: "Leg Press",
    category: "strength",
    targetMuscles: ["Quadricipiti", "Glutei"],
    difficulty: "beginner",
    equipment: ["Leg press machine"],
    description: "Esercizio guidato per le gambe, sicuro per principianti.",
    instructions: [
      "Siediti sulla leg press con la schiena ben appoggiata",
      "Posiziona i piedi sulla pedana alla larghezza delle spalle",
      "Scendi fino a 90° di flessione del ginocchio",
      "Spingi la pedana estendendo completamente le gambe",
      "Controlla sempre il movimento"
    ],
    tips: [
      "Non bloccare completamente le ginocchia in estensione",
      "Mantieni i piedi ben piantati sulla pedana",
      "Respira durante la fase di spinta"
    ]
  },
  {
    id: "affondi-corpo-libero",
    name: "Affondi a Corpo Libero",
    category: "strength",
    targetMuscles: ["Quadricipiti", "Glutei", "Core"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Esercizio unilaterale per equilibrio e forza delle gambe.",
    instructions: [
      "Fai un passo in avanti con una gamba",
      "Scendi fino a quando entrambe le ginocchia sono a 90°",
      "Il ginocchio anteriore deve essere sopra la caviglia",
      "Spingi con la gamba anteriore per tornare in posizione",
      "Alterna le gambe o completa una gamba per volta"
    ],
    tips: [
      "Mantieni il busto eretto durante tutto il movimento",
      "Non far toccare il ginocchio posteriore a terra",
      "Controlla l'equilibrio in ogni fase"
    ]
  },
  {
    id: "affondi-bilanciere",
    name: "Affondi con Bilanciere",
    category: "strength",
    targetMuscles: ["Quadricipiti", "Glutei", "Core"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Pesi"],
    description: "Versione con sovraccarico degli affondi.",
    instructions: [
      "Posiziona il bilanciere sulle spalle come nel back squat",
      "Fai un passo in avanti mantenendo l'equilibrio",
      "Scendi controllando il bilanciere",
      "Spingi con la gamba anteriore per tornare in posizione",
      "Mantieni sempre il controllo del bilanciere"
    ],
    tips: [
      "Inizia con peso leggero per apprendere l'equilibrio",
      "Mantieni il core molto contratto",
      "Non inclinare il busto in avanti"
    ]
  },
  {
    id: "affondi-manubri",
    name: "Affondi con Manubri",
    category: "strength",
    targetMuscles: ["Quadricipiti", "Glutei", "Core"],
    difficulty: "intermediate",
    equipment: ["Manubri"],
    description: "Variante con manubri, più equilibrio ma maggiore libertà.",
    instructions: [
      "Tieni un manubrio per mano ai lati del corpo",
      "Fai un passo in avanti mantenendo l'equilibrio",
      "Scendi fino alla posizione di affondo",
      "Mantieni i manubri ai lati durante tutto il movimento",
      "Torna in posizione spingendo con la gamba anteriore"
    ],
    tips: [
      "I manubri offrono maggiore libertà di movimento",
      "Mantieni i manubri ai lati, non davanti",
      "Concentrati sull'equilibrio e il controllo"
    ]
  },
  {
    id: "leg-extension",
    name: "Leg Extension",
    category: "strength",
    targetMuscles: ["Quadricipiti"],
    difficulty: "beginner",
    equipment: ["Leg extension machine"],
    description: "Esercizio di isolamento per i quadricipiti.",
    instructions: [
      "Siediti sulla macchina con la schiena ben appoggiata",
      "Posiziona le caviglie sotto i rulli",
      "Estendi le gambe fino alla completa estensione",
      "Concentrati sulla contrazione dei quadricipiti",
      "Scendi controllando alla posizione iniziale"
    ],
    tips: [
      "Non utilizzare slancio",
      "Concentrati sulla contrazione in alto",
      "Controlla sempre la fase eccentrica"
    ]
  },
  {
    id: "hack-squat",
    name: "Hack Squat",
    category: "strength",
    targetMuscles: ["Quadricipiti", "Glutei"],
    difficulty: "intermediate",
    equipment: ["Hack squat machine"],
    description: "Squat su macchina per maggiore sicurezza e target sui quadricipiti.",
    instructions: [
      "Posizionati sulla hack squat con la schiena appoggiata",
      "Posiziona i piedi sulla pedana alla larghezza delle spalle",
      "Scendi fino a 90° di flessione del ginocchio",
      "Spingi la pedana estendendo le gambe",
      "Mantieni sempre il controllo del movimento"
    ],
    tips: [
      "Mantieni la schiena sempre appoggiata",
      "Non scendere eccessivamente se hai problemi di mobilità",
      "Concentrati sui quadricipiti durante la spinta"
    ]
  },

  // === GAMBE - ISCHIOCRURALI E GLUTEI ===
  {
    id: "stacco-rumeno-gambe",
    name: "Stacco Rumeno",
    category: "strength",
    targetMuscles: ["Femorali", "Glutei", "Lombari"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Pesi"],
    description: "Movimento fondamentale per la catena posteriore.",
    instructions: [
      "Tieni il bilanciere con presa prona, braccia estese",
      "Spingi i fianchi indietro mantenendo le ginocchia leggermente flesse",
      "Scendi fino a sentire lo stretch dei femorali",
      "Torna su spingendo i fianchi in avanti",
      "Mantieni sempre la schiena dritta"
    ],
    tips: [
      "Il movimento parte dai fianchi, non dalle ginocchia",
      "Concentrati sullo stretch dei femorali",
      "La barra deve rimanere vicina alle gambe"
    ]
  },
  {
    id: "leg-curl-seduto",
    name: "Leg Curl Seduto",
    category: "strength",
    targetMuscles: ["Femorali"],
    difficulty: "beginner",
    equipment: ["Leg curl machine"],
    description: "Esercizio di isolamento per i femorali in posizione seduta.",
    instructions: [
      "Siediti sulla macchina con la schiena appoggiata",
      "Posiziona le caviglie sopra i rulli",
      "Fletti le gambe portando i talloni verso i glutei",
      "Concentrati sulla contrazione dei femorali",
      "Torna controllando alla posizione iniziale"
    ],
    tips: [
      "Non utilizzare slancio",
      "Concentrati sulla contrazione muscolare",
      "Mantieni la schiena sempre appoggiata"
    ]
  },
  {
    id: "leg-curl-sdraiato",
    name: "Leg Curl Sdraiato",
    category: "strength",
    targetMuscles: ["Femorali"],
    difficulty: "beginner",
    equipment: ["Leg curl machine"],
    description: "Variante sdraiata del leg curl per i femorali.",
    instructions: [
      "Sdraiati prono sulla macchina",
      "Posiziona le caviglie sotto i rulli",
      "Fletti le gambe portando i talloni verso i glutei",
      "Mantieni i fianchi appoggiati alla panca",
      "Scendi controllando alla posizione iniziale"
    ],
    tips: [
      "Non alzare i fianchi durante il movimento",
      "Concentrati solo sui femorali",
      "Mantieni sempre il controllo"
    ]
  },
  {
    id: "hip-thrust",
    name: "Hip Thrust",
    category: "strength",
    targetMuscles: ["Glutei", "Femorali"],
    difficulty: "beginner",
    equipment: ["Panca", "Bilanciere (opzionale)"],
    description: "Esercizio specifico per l'attivazione e lo sviluppo dei glutei.",
    instructions: [
      "Appoggia la parte superiore della schiena su una panca",
      "Posiziona i piedi a terra alla larghezza delle spalle",
      "Spingi i fianchi verso l'alto concentrandoti sui glutei",
      "Arriva fino all'allineamento completo del corpo",
      "Scendi controllando senza toccare completamente terra"
    ],
    tips: [
      "Concentrati sulla contrazione dei glutei in alto",
      "Non iperestendere la schiena",
      "Mantieni i piedi ben piantati a terra"
    ]
  },

  // === GAMBE - POLPACCI ===
  {
    id: "calf-raise-piedi",
    name: "Calf Raise in Piedi",
    category: "strength",
    targetMuscles: ["Polpacci", "Soleo"],
    difficulty: "beginner",
    equipment: ["Corpo libero", "Rialzo (opzionale)"],
    description: "Esercizio base per lo sviluppo dei polpacci.",
    instructions: [
      "Posizionati con gli avampiedi su un rialzo",
      "Mantieni l'equilibrio tenendoti a qualcosa se necessario",
      "Solleva il corpo sulle punte dei piedi",
      "Concentrati sulla contrazione dei polpacci",
      "Scendi controllando oltre il livello del rialzo"
    ],
    tips: [
      "Utilizza il massimo range di movimento",
      "Non utilizzare rimbalzi",
      "Concentrati sulla qualità del movimento"
    ]
  },
  {
    id: "calf-raise-seduto",
    name: "Calf Raise da Seduto",
    category: "strength",
    targetMuscles: ["Soleo"],
    difficulty: "beginner",
    equipment: ["Panca", "Peso (opzionale)"],
    description: "Variante seduta che enfatizza il soleo.",
    instructions: [
      "Siediti con gli avampiedi su un rialzo",
      "Posiziona un peso sulle cosce se desideri resistenza",
      "Solleva le ginocchia contraendo i polpacci",
      "Mantieni la contrazione in alto",
      "Scendi controllando alla posizione iniziale"
    ],
    tips: [
      "La posizione seduta enfatizza il soleo",
      "Mantieni sempre il controllo",
      "Non utilizzare slancio"
    ]
  },

  // === BRACCIA - BICIPITI ===
  {
    id: "curl-bilanciere",
    name: "Curl con Bilanciere",
    category: "strength",
    targetMuscles: ["Bicipiti", "Avambracci"],
    difficulty: "beginner",
    equipment: ["Bilanciere", "Pesi"],
    description: "Esercizio fondamentale per i bicipiti.",
    instructions: [
      "Tieni il bilanciere con presa supina alla larghezza delle spalle",
      "Mantieni i gomiti ai lati del corpo",
      "Fletti gli avambracci portando il bilanciere verso il petto",
      "Concentrati sulla contrazione dei bicipiti",
      "Scendi controllando alla posizione iniziale"
    ],
    tips: [
      "Non oscillare il corpo per aiutare il movimento",
      "Mantieni i gomiti fissi ai lati",
      "Controlla sempre la fase eccentrica"
    ]
  },
  {
    id: "curl-manubri-alternato",
    name: "Curl con Manubri Alternato",
    category: "strength",
    targetMuscles: ["Bicipiti", "Avambracci"],
    difficulty: "beginner",
    equipment: ["Manubri"],
    description: "Variante alternata per focus unilaterale sui bicipiti.",
    instructions: [
      "Tieni un manubrio per mano ai lati del corpo",
      "Alterna il curl di un braccio per volta",
      "Mantieni il gomito fisso al fianco",
      "Concentrati sulla contrazione del bicipite",
      "Controlla il movimento di entrambe le fasi"
    ],
    tips: [
      "Alternare permette maggiore concentrazione",
      "Non utilizzare slancio",
      "Mantieni il polso dritto"
    ]
  },
  {
    id: "curl-manubri-simultaneo",
    name: "Curl con Manubri Simultaneo",
    category: "strength",
    targetMuscles: ["Bicipiti", "Avambracci"],
    difficulty: "beginner",
    equipment: ["Manubri"],
    description: "Curl con entrambe le braccia simultaneamente.",
    instructions: [
      "Tieni un manubrio per mano ai lati del corpo",
      "Fletti entrambe le braccia contemporaneamente",
      "Mantieni i gomiti ai lati del corpo",
      "Concentrati sulla contrazione bilaterale dei bicipiti",
      "Scendi controllando con entrambe le braccia"
    ],
    tips: [
      "Mantieni la simmetria tra le braccia",
      "Non compensare con il corpo",
      "Concentrati sulla tecnica corretta"
    ]
  },
  {
    id: "curl-martello",
    name: "Curl a Martello",
    category: "strength",
    targetMuscles: ["Bicipiti", "Brachiale", "Avambracci"],
    difficulty: "beginner",
    equipment: ["Manubri"],
    description: "Variante con presa neutra per bicipiti e brachiale.",
    instructions: [
      "Tieni i manubri con presa neutra (palmi rivolti verso il corpo)",
      "Mantieni i gomiti ai lati",
      "Fletti portando i manubri verso le spalle",
      "Mantieni la presa neutra durante tutto il movimento",
      "Scendi controllando alla posizione iniziale"
    ],
    tips: [
      "La presa neutrale coinvolge anche il brachiale",
      "Permette spesso di utilizzare più peso",
      "Mantieni sempre la presa neutra"
    ]
  },
  {
    id: "curl-panca-inclinata",
    name: "Curl su Panca Inclinata",
    category: "strength",
    targetMuscles: ["Bicipiti", "Avambracci"],
    difficulty: "intermediate",
    equipment: ["Manubri", "Panca inclinata"],
    description: "Variante inclinata per maggior stretch dei bicipiti.",
    instructions: [
      "Siediti su una panca inclinata a 45°",
      "Lascia che le braccia pendano naturalmente",
      "Fletti un braccio per volta o entrambi",
      "Concentrati sullo stretch in basso e la contrazione in alto",
      "Mantieni la schiena appoggiata alla panca"
    ],
    tips: [
      "L'inclinazione fornisce maggior stretch",
      "Non oscillare le braccia",
      "Concentrati sulla qualità del movimento"
    ]
  },
  {
    id: "curl-panca-scott",
    name: "Curl su Panca Scott",
    category: "strength",
    targetMuscles: ["Bicipiti", "Avambracci"],
    difficulty: "intermediate",
    equipment: ["Panca Scott", "Bilanciere/Manubri"],
    description: "Curl su panca inclinata per isolamento completo dei bicipiti.",
    instructions: [
      "Posizionati sulla panca Scott con le ascelle appoggiate",
      "Afferra il peso con presa supina",
      "Fletti controllando il movimento",
      "Non estendere completamente i gomiti in basso",
      "Concentrati sulla contrazione dei bicipiti"
    ],
    tips: [
      "Non estendere completamente per evitare stress ai gomiti",
      "La panca Scott fornisce isolamento completo",
      "Utilizza peso moderato per la sicurezza"
    ]
  },
  {
    id: "curl-concentrazione",
    name: "Curl di Concentrazione",
    category: "strength",
    targetMuscles: ["Bicipiti"],
    difficulty: "intermediate",
    equipment: ["Manubri", "Panca"],
    description: "Esercizio di concentrazione per isolamento massimo del bicipite.",
    instructions: [
      "Siediti su una panca con le gambe divaricate",
      "Appoggia il gomito all'interno della coscia",
      "Fletti il braccio concentrandoti solo sul bicipite",
      "Mantieni il gomito fisso contro la coscia",
      "Scendi controllando senza estendere completamente"
    ],
    tips: [
      "Massima concentrazione su un bicipite per volta",
      "Non utilizzare slancio o compensi",
      "Concentrati sulla qualità della contrazione"
    ]
  },

  // === BRACCIA - TRICIPITI ===
  {
    id: "pushdown-cavi",
    name: "Pushdown ai Cavi",
    category: "strength",
    targetMuscles: ["Tricipiti"],
    difficulty: "beginner",
    equipment: ["Cavi", "Barra/Corda"],
    description: "Esercizio base per i tricipiti ai cavi.",
    instructions: [
      "Posizionati davanti ai cavi alti",
      "Afferra la barra con presa prona",
      "Mantieni i gomiti ai lati del corpo",
      "Spingi la barra verso il basso estendendo gli avambracci",
      "Controlla il movimento di ritorno"
    ],
    tips: [
      "Mantieni i gomiti fissi ai lati",
      "Non inclinare il busto in avanti",
      "Concentrati sulla contrazione dei tricipiti"
    ]
  },
  {
    id: "french-press-manubri",
    name: "French Press con Manubri",
    category: "strength",
    targetMuscles: ["Tricipiti"],
    difficulty: "intermediate",
    equipment: ["Manubri", "Panca"],
    description: "Esercizio per tricipiti con manubri sopra la testa.",
    instructions: [
      "Sdraiati sulla panca tenendo un manubrio con entrambe le mani",
      "Posiziona il manubrio sopra il petto con le braccia estese",
      "Piega solo gli avambracci portando il peso dietro la testa",
      "Mantieni i gomiti fissi e puntati verso l'alto",
      "Estendi tornando alla posizione iniziale"
    ],
    tips: [
      "Mantieni sempre i gomiti fissi",
      "Non far cadere il peso dietro la testa",
      "Controlla sempre il movimento"
    ]
  },
  {
    id: "french-press-bilanciere",
    name: "French Press con Bilanciere",
    category: "strength",
    targetMuscles: ["Tricipiti"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Panca", "Pesi"],
    description: "Variante con bilanciere del french press.",
    instructions: [
      "Sdraiati sulla panca con il bilanciere sopra il petto",
      "Afferra con presa stretta",
      "Piega solo gli avambracci mantenendo i gomiti fissi",
      "Porta il bilanciere verso la fronte",
      "Estendi tornando alla posizione iniziale"
    ],
    tips: [
      "Utilizza una presa non troppo stretta",
      "Mantieni i gomiti sempre nella stessa posizione",
      "Controlla attentamente il peso"
    ]
  },
  {
    id: "skull-crusher",
    name: "Skull Crusher",
    category: "strength",
    targetMuscles: ["Tricipiti"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Panca", "Pesi"],
    description: "Variante del french press verso la fronte.",
    instructions: [
      "Sdraiati sulla panca con il bilanciere sopra il petto",
      "Piega gli avambracci portando il bilanciere verso la fronte",
      "Mantieni i gomiti fissi e paralleli",
      "Estendi concentrandoti sui tricipiti",
      "Controlla sempre il movimento per sicurezza"
    ],
    tips: [
      "Il nome deriva dal rischio se non si controlla il peso",
      "Mantieni sempre i gomiti stabili",
      "Inizia con peso leggero"
    ]
  },
  {
    id: "kickback",
    name: "Kickback",
    category: "strength",
    targetMuscles: ["Tricipiti"],
    difficulty: "beginner",
    equipment: ["Manubri", "Panca"],
    description: "Esercizio di isolamento per tricipiti in posizione piegata.",
    instructions: [
      "Appoggia ginocchio e mano sulla panca",
      "Tieni il manubrio con il braccio libero",
      "Mantieni il braccio superiore parallelo al pavimento",
      "Estendi l'avambraccio all'indietro",
      "Concentrati sulla contrazione del tricipite"
    ],
    tips: [
      "Mantieni il braccio superiore fermo",
      "Non utilizzare slancio",
      "Concentrati sulla contrazione in estensione"
    ]
  },
  {
    id: "dip-panca",
    name: "Dip su Panca",
    category: "strength",
    targetMuscles: ["Tricipiti", "Pettorali inferiori", "Deltoidi anteriori"],
    difficulty: "beginner",
    equipment: ["Panca"],
    description: "Esercizio a corpo libero per tricipiti usando una panca.",
    instructions: [
      "Posiziona le mani sul bordo della panca",
      "Estendi le gambe davanti a te",
      "Scendi piegando i gomiti",
      "Spingi per tornare alla posizione iniziale",
      "Mantieni i gomiti vicini al corpo"
    ],
    tips: [
      "Non scendere eccessivamente per evitare stress alle spalle",
      "Piega le ginocchia per ridurre la difficoltà",
      "Concentrati sui tricipiti durante la spinta"
    ]
  },
  {
    id: "estensioni-sopra-testa",
    name: "Estensioni sopra la Testa",
    category: "strength",
    targetMuscles: ["Tricipiti"],
    difficulty: "intermediate",
    equipment: ["Manubri"],
    description: "Esercizio per tricipiti con movimento sopra la testa.",
    instructions: [
      "Stai in piedi o seduto tenendo un manubrio con entrambe le mani",
      "Posiziona il manubrio sopra la testa con le braccia estese",
      "Piega solo gli avambracci portando il peso dietro la testa",
      "Mantieni i gomiti fissi e puntati verso l'alto",
      "Estendi tornando alla posizione iniziale"
    ],
    tips: [
      "Mantieni i gomiti sempre nella stessa posizione",
      "Non lasciare che i gomiti si allarghino",
      "Utilizza un peso che permetta il controllo completo"
    ]
  },

  // === ADDOMINALI ===
  {
    id: "crunch",
    name: "Crunch",
    category: "strength",
    targetMuscles: ["Addominali superiori"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Esercizio base per gli addominali superiori.",
    instructions: [
      "Sdraiati supino con le ginocchia piegate",
      "Posiziona le mani dietro la testa senza intrecciarle",
      "Solleva le spalle da terra contraendo gli addominali",
      "Non tirare la testa con le mani",
      "Scendi controllando alla posizione iniziale"
    ],
    tips: [
      "Il movimento deve partire dall'addome, non dal collo",
      "Non è necessario sollevarsi molto",
      "Concentrati sulla contrazione addominale"
    ]
  },
  {
    id: "sit-up",
    name: "Sit-up",
    category: "strength",
    targetMuscles: ["Addominali", "Flessori dell'anca"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Movimento completo che coinvolge tutto il core.",
    instructions: [
      "Sdraiati supino con le ginocchia piegate",
      "Solleva tutto il busto fino alla posizione seduta",
      "Mantieni il controllo durante tutto il movimento",
      "Scendi lentamente alla posizione iniziale",
      "Mantieni i piedi a terra durante il movimento"
    ],
    tips: [
      "Più completo del crunch ma più impegnativo",
      "Controlla sempre la discesa",
      "Non utilizzare slancio"
    ]
  },
  {
    id: "leg-raise-terra",
    name: "Leg Raise a Terra",
    category: "strength",
    targetMuscles: ["Addominali inferiori", "Flessori dell'anca"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Esercizio per gli addominali inferiori da posizione supina.",
    instructions: [
      "Sdraiati supino con le gambe estese",
      "Mantieni le mani ai lati del corpo per stabilità",
      "Solleva le gambe fino a 90° mantenendole dritte",
      "Scendi controllando senza toccare completamente terra",
      "Mantieni sempre la tensione addominale"
    ],
    tips: [
      "Non utilizzare slancio",
      "Se troppo difficile, piega leggermente le ginocchia",
      "Concentrati sugli addominali bassi"
    ]
  },
  {
    id: "leg-raise-sbarra",
    name: "Leg Raise Appeso alla Sbarra",
    category: "strength",
    targetMuscles: ["Addominali inferiori", "Flessori dell'anca", "Presa"],
    difficulty: "intermediate",
    equipment: ["Sbarra per trazioni"],
    description: "Versione avanzata appesi alla sbarra.",
    instructions: [
      "Appenditi alla sbarra con presa prona",
      "Solleva le gambe dritte fino a 90° o più",
      "Mantieni il controllo evitando oscillazioni",
      "Scendi lentamente alla posizione iniziale",
      "Mantieni sempre la presa salda"
    ],
    tips: [
      "Versione molto impegnativa",
      "Evita di oscillare il corpo",
      "Se troppo difficile, piega le ginocchia"
    ]
  },
  {
    id: "plank-standard",
    name: "Plank Standard",
    category: "strength",
    targetMuscles: ["Core", "Addominali", "Schiena"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Esercizio isometrico fondamentale per il core.",
    instructions: [
      "Posizionati in posizione di push-up sugli avambracci",
      "Mantieni il corpo in linea retta dalla testa ai piedi",
      "Contrai gli addominali e i glutei",
      "Respira normalmente mantenendo la posizione",
      "Mantieni la posizione per il tempo prestabilito"
    ],
    tips: [
      "Non alzare i fianchi",
      "Non far cedere la schiena",
      "Inizia con tempi brevi e aumenta gradualmente"
    ]
  },
  {
    id: "plank-laterale",
    name: "Plank Laterale",
    category: "strength",
    targetMuscles: ["Obliqui", "Core laterale"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Variante laterale per gli obliqui.",
    instructions: [
      "Sdraiati sul fianco appoggiandoti sull'avambraccio",
      "Solleva il corpo mantenendo una linea retta",
      "Mantieni la posizione contraendo gli obliqui",
      "Respira normalmente",
      "Ripeti sull'altro lato"
    ],
    tips: [
      "Non far cedere i fianchi",
      "Mantieni il corpo perfettamente allineato",
      "Inizia con tempi brevi"
    ]
  },
  {
    id: "russian-twist",
    name: "Russian Twist",
    category: "strength",
    targetMuscles: ["Obliqui", "Addominali"],
    difficulty: "beginner",
    equipment: ["Corpo libero", "Peso (opzionale)"],
    description: "Esercizio rotatorio per obliqui e addominali.",
    instructions: [
      "Siediti con le ginocchia piegate e i piedi sollevati",
      "Inclina il busto all'indietro mantenendo la schiena dritta",
      "Ruota il busto da un lato all'altro",
      "Mantieni sempre la tensione addominale",
      "Aggiungi un peso per maggiore difficoltà"
    ],
    tips: [
      "Il movimento deve essere controllato, non veloce",
      "Mantieni i piedi sollevati per maggiore difficoltà",
      "Concentrati sulla rotazione del busto"
    ]
  },
  {
    id: "ab-wheel-rollout",
    name: "Ab Wheel Rollout",
    category: "strength",
    targetMuscles: ["Core", "Addominali", "Spalle"],
    difficulty: "intermediate",
    equipment: ["Ab wheel"],
    description: "Esercizio avanzato con la ruota addominale.",
    instructions: [
      "Inginocchiati tenendo l'ab wheel con entrambe le mani",
      "Rotola in avanti mantenendo il corpo dritto",
      "Vai avanti fino al limite della tua forza",
      "Torna indietro utilizzando la forza del core",
      "Mantieni sempre il controllo del movimento"
    ],
    tips: [
      "Inizia con movimenti piccoli",
      "Non far cedere la schiena",
      "Molto impegnativo, progredisci gradualmente"
    ]
  },
  {
    id: "crunch-cavi",
    name: "Crunch ai Cavi",
    category: "strength",
    targetMuscles: ["Addominali"],
    difficulty: "intermediate",
    equipment: ["Cavi", "Corda"],
    description: "Variante dei crunch con resistenza costante dei cavi.",
    instructions: [
      "Inginocchiati davanti ai cavi alti",
      "Afferra la corda con entrambe le mani",
      "Porta la corda verso il basso flettendo il busto",
      "Concentrati sulla contrazione degli addominali",
      "Torna controllando alla posizione iniziale"
    ],
    tips: [
      "Il movimento deve partire dagli addominali",
      "Non tirare con le braccia",
      "Mantieni sempre la tensione sui cavi"
    ]
  },

  // Cardio Exercises
  {
    id: "running",
    name: "Corsa",
    category: "cardio",
    targetMuscles: ["Gambe", "Core", "Sistema cardiovascolare"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Attività cardiovascolare completa per migliorare resistenza e bruciare calorie.",
    instructions: [
      "Inizia con un riscaldamento di 5-10 minuti di camminata",
      "Mantieni una postura eretta con spalle rilassate",
      "Atterra con la parte centrale del piede",
      "Mantieni un ritmo respiratorio costante",
      "Termina con defaticamento graduale"
    ],
    tips: [
      "Inizia gradualmente se sei principiante",
      "Ascolta il tuo corpo e riposa quando necessario",
      "Investi in buone scarpe da corsa"
    ],
    duration: "20-60 minuti"
  },
  {
    id: "burpees",
    name: "Burpees",
    category: "cardio",
    targetMuscles: ["Tutto il corpo", "Sistema cardiovascolare"],
    difficulty: "advanced",
    equipment: ["Corpo libero"],
    description: "Esercizio ad alta intensità che combina forza e cardio per un allenamento completo.",
    instructions: [
      "Inizia in posizione eretta",
      "Scendi in squat e appoggia le mani a terra",
      "Salta indietro in posizione di plank",
      "Fai un push-up (opzionale)",
      "Salta con i piedi verso le mani e salta in alto"
    ],
    tips: [
      "Mantieni un ritmo costante",
      "Modifica l'esercizio se necessario",
      "Concentrati sulla tecnica anche quando sei stanco"
    ]
  },

  // Flexibility Exercises
  {
    id: "yoga-flow",
    name: "Yoga Flow",
    category: "flexibility",
    targetMuscles: ["Tutto il corpo", "Flessibilità", "Equilibrio"],
    difficulty: "beginner",
    equipment: ["Tappetino"],
    description: "Sequenza fluida di posizioni yoga per migliorare flessibilità e benessere mentale.",
    instructions: [
      "Inizia in posizione del montagna",
      "Passa attraverso saluto al sole",
      "Mantieni ogni posizione per 30-60 secondi",
      "Respira profondamente e lentamente",
      "Termina in posizione di rilassamento"
    ],
    tips: [
      "Non forzare mai le posizioni",
      "Ascolta il tuo corpo",
      "La respirazione è fondamentale"
    ],
    duration: "15-45 minuti"
  }
];

// Export del database per l'utilizzo in altri componenti
export { exerciseDatabase };

export function ExerciseDatabase() {
  const [customExercises] = useLocalStorage<Exercise[]>("customExercises", []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // Combine default exercises with custom exercises
  const allExercises = [...exerciseDatabase, ...customExercises];

  const filteredExercises = allExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-warning text-warning-foreground';
      case 'advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Dumbbell className="h-4 w-4" />;
      case 'cardio': return <Heart className="h-4 w-4" />;
      case 'flexibility': return <Target className="h-4 w-4" />;
      case 'functional': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-center space-y-2 flex-1">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Database Esercizi
          </h1>
          <p className="text-muted-foreground">
            Catalogo completo con istruzioni dettagliate per ogni esercizio
          </p>
        </div>
        <AddExerciseToDatabase />
      </div>

      {/* Search and Filters */}
      <Card className="gradient-card border-0">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca esercizi o muscoli..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="bg-background/50">
                <TabsTrigger value="all">Tutti</TabsTrigger>
                <TabsTrigger value="strength">Forza</TabsTrigger>
                <TabsTrigger value="cardio">Cardio</TabsTrigger>
                <TabsTrigger value="flexibility">Flessibilità</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <TabsList className="bg-background/50">
                <TabsTrigger value="all">Livelli</TabsTrigger>
                <TabsTrigger value="beginner">Principiante</TabsTrigger>
                <TabsTrigger value="intermediate">Intermedio</TabsTrigger>
                <TabsTrigger value="advanced">Avanzato</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Exercises Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="group hover:shadow-fitness-lg transition-all duration-300 gradient-card border-0 hover:scale-[1.02]">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(exercise.category)}
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {exercise.name}
                    {exercise.isCustom && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Personalizzato
                      </Badge>
                    )}
                  </CardTitle>
                </div>
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty === 'beginner' ? 'Principiante' : 
                   exercise.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzato'}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {exercise.targetMuscles.map((muscle) => (
                  <Badge key={muscle} variant="secondary" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {exercise.description}
              </CardDescription>
              
              {exercise.equipment.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Attrezzatura: {exercise.equipment.join(", ")}</span>
                </div>
              )}
              
              {exercise.duration && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Durata: {exercise.duration}</span>
                </div>
              )}
              
              <Tabs defaultValue="instructions" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-background/50">
                  <TabsTrigger value="instructions" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Istruzioni
                  </TabsTrigger>
                  <TabsTrigger value="tips" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Consigli
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="instructions" className="mt-3">
                  <ol className="space-y-1 text-sm list-decimal list-inside text-muted-foreground">
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </TabsContent>
                
                <TabsContent value="tips" className="mt-3">
                  <ul className="space-y-1 text-sm list-disc list-inside text-muted-foreground">
                    {exercise.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
              
              {exercise.videoUrl && (
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Video dimostrativo disponibile</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card className="text-center py-12 gradient-card border-0">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nessun esercizio trovato</h3>
            <p className="text-muted-foreground">
              Prova a modificare i filtri di ricerca per trovare l'esercizio che stai cercando.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}