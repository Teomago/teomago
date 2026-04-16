# SEED GUIDE — Teomago CMS Content

> How to fill your Payload CMS admin with real content.
> URL: `http://localhost:3000/admin` (dev) or your production URL + `/admin`
> **Note:** All text fields with good defaults are already shown on the site. You only need to fill what you want to override or add detail to. Images are all optional — the mockup image shows when none is uploaded.

---

## 1. HERO GLOBAL
**Admin path:** Content → Hero — Character Sheet

### Fields to fill:

| Field | Value |
|-------|-------|
| **Name** | `Mateo Ibagón` |
| **Role (ES)** | `Desarrollador Full-Stack · Músico · Educador Artístico` |
| **Role (EN)** | `Full-Stack Developer · Musician · Arts Educator` |
| **Avatar** | Upload your profile photo (any size, will be cropped square) |

**Bio (ES)** — Rich text:
```
Desarrollador full-stack con el corazón partido entre el código, el jazz y la educación artística. Construyo plataformas digitales que resuelven problemas reales, compongo y dirijo música en la comunidad Vineyard Bogotá, y enseño jazz como práctica de vida. Magíster en Educación Artística de la Universidad Nacional de Colombia — investigo cómo mantener la forja encendida en tiempos de incertidumbre.
```

**Bio (EN)** — Rich text:
```
Full-stack developer with a heart split between code, jazz, and arts education. I build digital platforms that solve real problems, compose and lead music at Vineyard Bogotá, and teach jazz as a practice of life. Master's in Arts Education from Universidad Nacional de Colombia — researching how to keep the forge burning in times of uncertainty.
```

### Core Stats (max 6 — shown as mini bars in the Hero section):

| Stat Name | Value | Notes |
|-----------|-------|-------|
| TypeScript | 94 | |
| Next.js | 91 | |
| React | 90 | |
| PayloadCMS | 88 | |
| Jazz Piano | 85 | |
| Music Production | 80 | |

### Social Links:

| Label | URL | Icon |
|-------|-----|------|
| GitHub | `https://github.com/[tu-usuario]` | Github |
| LinkedIn | `https://linkedin.com/in/[tu-perfil]` | Linkedin |
| Mail | `mailto:teo.ibagon@gmail.com` | Mail |

---

## 2. STATS COLLECTION (Skills / Attributes)
**Admin path:** Content → Stats

> **Tip:** Create each stat as a separate entry. The page shows them sorted by level (highest first).

### Suggested entries:

| Name | Level | Category | Icon |
|------|-------|----------|------|
| TypeScript | 94 | Frontend | Code |
| Next.js | 91 | Frontend | Layers |
| React | 90 | Frontend | Braces |
| PayloadCMS | 88 | Backend | Database |
| Jazz Piano | 85 | Music | Piano |
| Arts Education | 88 | Music | GraduationCap |
| Music Production | 80 | Audio Engineering | AudioWaveform |
| Sound Design | 75 | Audio Engineering | Waves |
| Java / Spring Boot | 72 | Backend | Server |

---

## 3. QUESTS COLLECTION (Projects)
**Admin path:** Content → Quests

> After saving a Quest, go to the **Status** tab (top right) and click **Publish** — only published quests appear on the homepage.

---

### Quest 1 — Fundación Jazz para la Paz
| Field | Value |
|-------|-------|
| **Title (ES)** | `Fundación Jazz para la Paz` |
| **Title (EN)** | `Jazz for Peace Foundation` |
| **Sort Order** | `1` |
| **Featured** | ✅ checked |
| **Category** | Music |
| **Status** | ⟳ In Progress |
| **Cover Image** | Upload screenshot of fjpp.vercel.app |
| **Link** | `https://fjpp.vercel.app/` |

**Description (ES):**
```
Plataforma web para la Fundación Jazz para la Paz, organización que promueve el jazz como herramienta de transformación social y educación musical. Diseñada y construida con Next.js. Actualmente dirijo talleres con una estudiante activa — hija de mi amigo Germán, quien también apoya tanto la fundación como la iglesia.
```

**Description (EN):**
```
Web platform for the Jazz for Peace Foundation, an organization that promotes jazz as a tool for social transformation and music education. Designed and built with Next.js. Currently leading workshops with an active student.
```

**Stack:**
- Next.js → icon: Layers
- TypeScript → icon: Code
- Vercel → icon: Cloud

---

### Quest 2 — HeionHub
| Field | Value |
|-------|-------|
| **Title (ES/EN)** | `HeionHub` |
| **Sort Order** | `2` |
| **Featured** | ✅ checked |
| **Category** | Tech |
| **Status** | ⟳ In Progress |
| **Cover Image** | Upload screenshot of heionhub.com |
| **Link** | `https://heionhub.com/` |

**Description (ES):**
```
Plataforma de gestión de contenido y comunidad construida con Next.js + PayloadCMS. Anteriormente conocida como EtherHub — renombrada por conflictos de nombre. Exploración de un ecosistema CMS headless propio.
```

**Description (EN):**
```
Content management and community platform built with Next.js + PayloadCMS. Previously known as EtherHub — renamed due to name conflicts. An exploration of a personal headless CMS ecosystem.
```

**Stack:**
- Next.js → icon: Layers
- PayloadCMS → icon: Database
- TypeScript → icon: Code

---

### Quest 3 — Tesis de Maestría
| Field | Value |
|-------|-------|
| **Title (ES)** | `Realidad, Memoria y Creencia: Semillas Resonantes` |
| **Title (EN)** | `Reality, Memory, and Belief: Resonant Seeds` |
| **Sort Order** | `3` |
| **Featured** | ✅ checked |
| **Category** | Education |
| **Status** | ✓ Completed |
| **Cover Image** | Upload a photo de la instalación sonora o de tu graduación |
| **Link** | `https://repositorio.unal.edu.co/items/4c8fad63-28eb-4187-8654-55fae0b061cf` |

**Description (ES):**
```
Tesis de Maestría en Educación Artística — Universidad Nacional de Colombia. Una crónica de búsqueda y auto-descubrimiento que parte de la muerte de mi padre como evento disruptivo y usa la "congoja" como instrumento metodológico. A través de la metáfora del RPG, narro mi tránsito por la maestría, reconfigurando mi hoja de personaje. Culmina en una instalación sonora colectiva donde el público es co-creador. Conclusión: el artista-pedagogo no entrega certezas — mantiene la forja encendida. Graduación: 22 de abril de 2026.
```

**Description (EN):**
```
Master's thesis in Arts Education — Universidad Nacional de Colombia. A chronicle of exploration and self-discovery starting from a disruptive life event. Using the RPG metaphor, it narrates artistic formation through grief turned into methodological power. Culminates in a collective sound installation. Conclusion: the artist-educator doesn't deliver certainties — they keep the forge burning. Graduation: April 22, 2026.
```

**Stack:**
- Investigación → icon: BookOpen
- Instalación Sonora → icon: AudioWaveform

---

### Quest 4 — SPC Canadian College
| Field | Value |
|-------|-------|
| **Title (ES)** | `SPC — Sistema de Programación de Clases` |
| **Title (EN)** | `SPC — Class Scheduling Platform` |
| **Sort Order** | `4` |
| **Featured** | ☐ unchecked |
| **Category** | Tech |
| **Status** | ✓ Completed |
| **Cover Image** | Upload screenshot si tienes acceso |
| **Link** | (leave empty — internal system) |

**Description (ES):**
```
Sistema completo de agendamiento de clases para Canadian College, desarrollado como freelancer junto a mi mejor amigo. Soporte para ~1500 estudiantes semanales. Lideré la seguridad backend con Java + Spring Boot Security; luego migré al frontend completo en Next.js. Pruebas a lo largo de 2023, lanzamiento oficial 2024.
```

**Description (EN):**
```
Full class scheduling platform for Canadian College, built as a freelancer with my best friend. Supports ~1500 weekly students. Led backend security with Java + Spring Boot Security, then took over the full frontend in Next.js. Tested throughout 2023, officially launched 2024.
```

**Stack:**
- Java → icon: Server
- Spring Boot → icon: Shield
- Next.js → icon: Layers
- TypeScript → icon: Code

---

## 4. CAMPAIGNS COLLECTION (Work Experience)
**Admin path:** Content → Campaigns

> Sorted by start date (newest first) automatically.

---

### Campaign 1 — 10x Media
| Field | Value |
|-------|-------|
| **Company** | `10x Media` |
| **Role (ES)** | `Desarrollador Full-Stack` |
| **Role (EN)** | `Full-Stack Developer` |
| **Start Date** | `2025-03-01` (ajusta según la fecha real) |
| **Is Current** | ✅ checked |

**Description (ES):**
```
Desarrollo de plataformas CMS empresariales con PayloadCMS + Next.js. Profundización en arquitectura headless y flujos editoriales avanzados para clientes internacionales. Posición iniciada mientras trabajaba en Lean Solutions Group — el conocimiento de PayloadCMS adquirido en mis proyectos personales fue el puente.
```

**Quest Rewards:**
- Arquitectura headless en producción real
- PayloadCMS a nivel empresarial

---

### Campaign 2 — Lean Solutions Group
| Field | Value |
|-------|-------|
| **Company** | `Lean Solutions Group` |
| **Role (ES/EN)** | `Developer` |
| **Start Date** | `2024-01-01` |
| **Is Current** | ☐ unchecked |
| **End Date** | `2025-02-01` |

**Description (ES):**
```
Desarrollo de soluciones empresariales en equipo remoto. Trabajo con metodologías ágiles. El período donde también inicié el contacto con 10x Media a través de un correo que describía mi trabajo en Canadian College y el conocimiento de PayloadCMS.
```

**Quest Rewards:**
- Equipos remotos distribuidos

---

### Campaign 3 — Canadian College (Freelance)
| Field | Value |
|-------|-------|
| **Company** | `Canadian College (Freelance)` |
| **Role (ES)** | `Desarrollador Full-Stack Freelance` |
| **Role (EN)** | `Full-Stack Developer (Freelance)` |
| **Start Date** | `2022-01-01` |
| **Is Current** | ☐ unchecked |
| **End Date** | `2024-01-01` |

**Description (ES):**
```
Co-creador del Sistema de Programación de Clases (SPC) desde cero — mi primer trabajo pagado como programador, en colaboración con mi mejor amigo. Yo estaba en último semestre de universidad. Comencé con backend: sistema de seguridad y encriptamiento de usuarios en Java con Spring Boot Security. Luego me dediqué 100% al frontend. Sistema activo con ~1500 estudiantes semanales.
```

**Quest Rewards:**
- SPC activo para 1500+ estudiantes
- Primer cliente pagado como programador
- Arquitectura full-stack desde cero

---

### Campaign 4 — Mostaza
| Field | Value |
|-------|-------|
| **Company** | `Mostaza` |
| **Role (ES/EN)** | `Web Developer` |
| **Start Date** | `2021-01-01` (aproximado) |
| **Is Current** | ☐ unchecked |
| **End Date** | `2022-01-01` |

**Description (ES):**
```
Desarrollo web y gestión de contenido digital. Los problemas recurrentes con plugins de WordPress en este período fueron el motor para buscar alternativas — búsqueda que eventualmente llevó al descubrimiento de PayloadCMS en marzo 2025.
```

**Quest Rewards:**
- Descubrimiento de PayloadCMS como alternativa a WordPress

---

## 5. Tips generales

### Sobre las imágenes
- Sube las imágenes desde **Content → Media** primero, luego las referencias desde cada colección
- Si no subes imagen → se muestra el mockup automáticamente
- Formatos: JPG, PNG, WebP. Tamaño recomendado: mínimo 800px de ancho

### Sobre el rich text (Bio, Description)
- El editor es Lexical (como Notion). Escribe directamente, soporte para **negrita**, *cursiva*, listas
- Cada párrafo se separa con Enter doble

### Sobre los Quests publicados
- Un Quest guardado como **Draft** NO aparece en la homepage
- Ve al Quest → arriba a la derecha → botón **Publish**

### Lighthouse Coffee Place / Tercer Puerto
- Si quieres agregarlo como Quest, usa Category: Coffee, Status: Side Quest
- No hay URL pública aún — deja el campo Link vacío

### Vineyard Bogotá / FJPP (volunteer)
- Puedes agregarlos como Campaigns con `isCurrent: true` si quieres mostrarlos en el timeline
- O dejarlos en la bio del Hero

---

*Generado el 2026-04-15 — basado en Instructions.md, RFC-002 Seed Guide y conversación con Teo*
