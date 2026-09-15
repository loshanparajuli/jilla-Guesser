export const PRADESH = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
] as const;

export type Pradesh = (typeof PRADESH)[number];

export type Jilla = {
  /** Matches the polygon key in lib/naksa-data.ts. */
  id: string;
  name: string;
  pradesh: Pradesh;
  /** Other spellings we accept: "tanahu", "kavre", "bardia". */
  aliases: string[];
};

export const JILLA: Jilla[] = [
  // Koshi (14)
  { id: "bhojpur", name: "Bhojpur", pradesh: "Koshi", aliases: [] },
  { id: "dhankuta", name: "Dhankuta", pradesh: "Koshi", aliases: [] },
  { id: "ilam", name: "Ilam", pradesh: "Koshi", aliases: ["illam"] },
  { id: "jhapa", name: "Jhapa", pradesh: "Koshi", aliases: [] },
  { id: "khotang", name: "Khotang", pradesh: "Koshi", aliases: [] },
  { id: "morang", name: "Morang", pradesh: "Koshi", aliases: [] },
  { id: "okhaldhunga", name: "Okhaldhunga", pradesh: "Koshi", aliases: ["okhaldunga"] },
  { id: "panchthar", name: "Panchthar", pradesh: "Koshi", aliases: ["panchtar"] },
  { id: "sankhuwasabha", name: "Sankhuwasabha", pradesh: "Koshi", aliases: ["sankhuwasava", "shankhuwasabha"] },
  { id: "solukhumbu", name: "Solukhumbu", pradesh: "Koshi", aliases: ["solu khumbu"] },
  { id: "sunsari", name: "Sunsari", pradesh: "Koshi", aliases: [] },
  { id: "taplejung", name: "Taplejung", pradesh: "Koshi", aliases: [] },
  { id: "terhathum", name: "Terhathum", pradesh: "Koshi", aliases: ["tehrathum", "terathum"] },
  { id: "udayapur", name: "Udayapur", pradesh: "Koshi", aliases: ["udaypur"] },

  // Madhesh (8)
  { id: "bara", name: "Bara", pradesh: "Madhesh", aliases: [] },
  { id: "dhanusha", name: "Dhanusha", pradesh: "Madhesh", aliases: ["dhanusa"] },
  { id: "mahottari", name: "Mahottari", pradesh: "Madhesh", aliases: ["mahotari"] },
  { id: "parsa", name: "Parsa", pradesh: "Madhesh", aliases: [] },
  { id: "rautahat", name: "Rautahat", pradesh: "Madhesh", aliases: [] },
  { id: "saptari", name: "Saptari", pradesh: "Madhesh", aliases: [] },
  { id: "sarlahi", name: "Sarlahi", pradesh: "Madhesh", aliases: [] },
  { id: "siraha", name: "Siraha", pradesh: "Madhesh", aliases: ["sirha"] },

  // Bagmati (13)
  { id: "bhaktapur", name: "Bhaktapur", pradesh: "Bagmati", aliases: ["bhadgaon"] },
  { id: "chitwan", name: "Chitwan", pradesh: "Bagmati", aliases: ["chitawan", "chitwon"] },
  { id: "dhading", name: "Dhading", pradesh: "Bagmati", aliases: [] },
  { id: "dolakha", name: "Dolakha", pradesh: "Bagmati", aliases: ["dolkha"] },
  { id: "kathmandu", name: "Kathmandu", pradesh: "Bagmati", aliases: ["ktm", "kaathmandu"] },
  { id: "kavre", name: "Kavrepalanchok", pradesh: "Bagmati", aliases: ["kavre", "kabhre", "kavrepalanchowk", "kabhrepalanchok"] },
  { id: "lalitpur", name: "Lalitpur", pradesh: "Bagmati", aliases: ["patan"] },
  { id: "makwanpur", name: "Makwanpur", pradesh: "Bagmati", aliases: ["makawanpur"] },
  { id: "nuwakot", name: "Nuwakot", pradesh: "Bagmati", aliases: [] },
  { id: "ramechhap", name: "Ramechhap", pradesh: "Bagmati", aliases: ["ramechap"] },
  { id: "rasuwa", name: "Rasuwa", pradesh: "Bagmati", aliases: [] },
  { id: "sindhuli", name: "Sindhuli", pradesh: "Bagmati", aliases: [] },
  { id: "sindhupalchowk", name: "Sindhupalchok", pradesh: "Bagmati", aliases: ["sindhupalchowk", "sindhupalchok"] },

  // Gandaki (11)
  { id: "baglung", name: "Baglung", pradesh: "Gandaki", aliases: [] },
  { id: "gorkha", name: "Gorkha", pradesh: "Gandaki", aliases: ["gurkha"] },
  { id: "kaski", name: "Kaski", pradesh: "Gandaki", aliases: [] },
  { id: "lamjung", name: "Lamjung", pradesh: "Gandaki", aliases: [] },
  { id: "manang", name: "Manang", pradesh: "Gandaki", aliases: [] },
  { id: "mustang", name: "Mustang", pradesh: "Gandaki", aliases: [] },
  { id: "myagdi", name: "Myagdi", pradesh: "Gandaki", aliases: [] },
  { id: "nawalparasi-east", name: "Nawalpur", pradesh: "Gandaki", aliases: ["nawalparasi east", "east nawalparasi", "nawalparasi purba"] },
  { id: "parbat", name: "Parbat", pradesh: "Gandaki", aliases: [] },
  { id: "syangja", name: "Syangja", pradesh: "Gandaki", aliases: ["shyangja"] },
  { id: "tanahun", name: "Tanahun", pradesh: "Gandaki", aliases: ["tanahu"] },

  // Lumbini (12)
  { id: "arghakhanchi", name: "Arghakhanchi", pradesh: "Lumbini", aliases: ["argakhanchi", "arghakhachi"] },
  { id: "banke", name: "Banke", pradesh: "Lumbini", aliases: [] },
  { id: "bardiya", name: "Bardiya", pradesh: "Lumbini", aliases: ["bardia"] },
  { id: "dang", name: "Dang", pradesh: "Lumbini", aliases: ["dang deukhuri"] },
  { id: "gulmi", name: "Gulmi", pradesh: "Lumbini", aliases: [] },
  { id: "kapilvastu", name: "Kapilvastu", pradesh: "Lumbini", aliases: ["kapilbastu"] },
  { id: "nawalparasi-west", name: "Parasi", pradesh: "Lumbini", aliases: ["nawalparasi west", "west nawalparasi", "nawalparasi paschim"] },
  { id: "palpa", name: "Palpa", pradesh: "Lumbini", aliases: [] },
  { id: "pyuthan", name: "Pyuthan", pradesh: "Lumbini", aliases: ["piuthan"] },
  { id: "rolpa", name: "Rolpa", pradesh: "Lumbini", aliases: [] },
  { id: "rukum-east", name: "Rukum East", pradesh: "Lumbini", aliases: ["east rukum", "eastern rukum", "purbi rukum"] },
  { id: "rupandehi", name: "Rupandehi", pradesh: "Lumbini", aliases: ["rupendehi"] },

  // Karnali (10)
  { id: "dailekh", name: "Dailekh", pradesh: "Karnali", aliases: [] },
  { id: "dolpa", name: "Dolpa", pradesh: "Karnali", aliases: ["dolpo"] },
  { id: "humla", name: "Humla", pradesh: "Karnali", aliases: [] },
  { id: "jajarkot", name: "Jajarkot", pradesh: "Karnali", aliases: [] },
  { id: "jumla", name: "Jumla", pradesh: "Karnali", aliases: [] },
  { id: "kalikot", name: "Kalikot", pradesh: "Karnali", aliases: [] },
  { id: "mugu", name: "Mugu", pradesh: "Karnali", aliases: [] },
  { id: "rukum-west", name: "Rukum West", pradesh: "Karnali", aliases: ["west rukum", "western rukum", "pashchim rukum"] },
  { id: "salyan", name: "Salyan", pradesh: "Karnali", aliases: [] },
  { id: "surkhet", name: "Surkhet", pradesh: "Karnali", aliases: [] },

  // Sudurpashchim (9)
  { id: "achham", name: "Achham", pradesh: "Sudurpashchim", aliases: ["accham", "acham"] },
  { id: "baitadi", name: "Baitadi", pradesh: "Sudurpashchim", aliases: [] },
  { id: "bajhang", name: "Bajhang", pradesh: "Sudurpashchim", aliases: [] },
  { id: "bajura", name: "Bajura", pradesh: "Sudurpashchim", aliases: [] },
  { id: "dadeldhura", name: "Dadeldhura", pradesh: "Sudurpashchim", aliases: ["dadeldhoora", "dandeldhura"] },
  { id: "darchula", name: "Darchula", pradesh: "Sudurpashchim", aliases: [] },
  { id: "doti", name: "Doti", pradesh: "Sudurpashchim", aliases: [] },
  { id: "kailali", name: "Kailali", pradesh: "Sudurpashchim", aliases: [] },
  { id: "kanchanpur", name: "Kanchanpur", pradesh: "Sudurpashchim", aliases: [] },
];

/** All 77 of them. */
export const JAMMA = JILLA.length;

export const JILLA_BY_ID = new Map(JILLA.map((j) => [j.id, j]));

/** How many districts each province holds. */
export const PRADESH_JAMMA = Object.fromEntries(
  PRADESH.map((p) => [p, JILLA.filter((j) => j.pradesh === p).length]),
) as Record<Pradesh, number>;
