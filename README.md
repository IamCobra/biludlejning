## HF3 Biludlejning – prototype

En simpel Next.js‑prototype til biludlejning med bestillingsformular, prisberegning og admin‑oversigt.

### Teknologier

- Next.js (App Router)
- Prisma + PostgreSQL

### Sådan kører du projektet

1. Start PostgreSQL via Docker Compose:

```bash
docker compose up -d
```

2. Kør migrationer og generér Prisma Client (hvis ikke allerede gjort):

```bash
npx prisma migrate deploy
npx prisma generate
```

3. Start udviklingsserveren:

```bash
npm run dev
```

Åbn `http://localhost:3000` i browseren.

### Funktioner

- **Forside**: kort intro og links til booking og login.
- **Bestilling** (`/booking`):
  - Vælg biltype (mindre, mellemklasse, varevogn)
  - Vælg start- og slutdato
  - Tilvælg GPS og barnesæde
  - Pris beregnes server‑side og vises efter bestilling
  - Booking gemmes i PostgreSQL via Prisma
- **Admin‑login** (`/login`):
  - Logger ind med `AdminUser` fra databasen (bcrypt‑hash)
  - Sætter en simpel `admin`‑cookie
- **Admin‑oversigt** (`/admin/bookings`):
  - Liste over alle bookinger med datoer, biltype, antal dage og total pris
- **Admin‑detaljer** (`/admin/bookings/[id]`):
  - Viser alle oplysninger om én booking
- **Log ud** (`/logout`):
  - Fjerner `admin`‑cookien og sender brugeren til forsiden

### Opret en admin‑bruger

1. Generér en bcrypt‑hash til en adgangskode, fx `test123`:

```bash
node scripts/hash-password.cjs test123
```

2. Åbn Prisma Studio:

```bash
npx prisma studio
```

3. Opret en række i tabellen **AdminUser** med:
   - `username`: fx `admin`
   - `passwordHash`: hash‑værdien fra kommandoen ovenfor

Herefter kan du logge ind på `/login` med disse oplysninger.
