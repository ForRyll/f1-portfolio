<div align="center">ZRIL — F1-Inspired Developer Portfolio
A cinematic, Formula 1-inspired personal portfolio built to showcase projects, skills, experience, and contact information through an immersive single-page experience.

Live Website: f1-portfolio-beige.vercel.app
</div>Overview
ZRIL is a personal portfolio for Nazril Irfani, an Informatics student and aspiring front-end developer. Its visual direction takes inspiration from Formula 1 broadcast graphics, racing telemetry, pit-lane interfaces, and motorsport motion design.

The project combines a dark visual identity, bold typography, interactive details, and scroll-based animation while keeping the content organized into clear sections.
Features
- Hero — introductory profile and interactive visual treatment.
- About — personal introduction and background.
- Skills — technologies and development skills.
- Projects — selected work and project details.
- Experience — experience and activity timeline.
- Contact — contact links and ways to connect.
- Custom navigation — section navigation and scroll progress cues.
- Motion design — GSAP-powered transitions and text effects.
- Smooth scrolling — Lenis integration with GSAP ScrollTrigger.
- Interactive details — custom cursor, back-to-top control, lights-out interaction, and Pit Radio widget.
- Responsive layout — designed for desktop and mobile screens.
- Metadata — page metadata, Open Graph information, and Person structured data.
Tech Stack
Technology	Purpose
Next.js 16	React framework, App Router, routing, and production build
React 19	Component-based user interface
TypeScript	Static typing
Tailwind CSS 4	Utility-first styling
GSAP 3	Motion, transitions, and scroll-triggered animation
Lenis	Smooth scrolling
ESLint 9	Code linting
Vercel	Deployment and hosting


Typography
Fonts are loaded through next/font/google:
- Inter — general interface and body typography.
- Barlow Condensed — display headings and motorsport-inspired typography.
Getting Started
Prerequisites
Install the following before running the project:
- Node.js 20.9 or newer.
- npm (included with Node.js).
- Git.
Check your installed versions:
node -v
npm -v
git --version
1. Clone the repository
git clone https://github.com/ForRyll/f1-portfolio.git
cd f1-portfolio
2. Install dependencies
This repository includes package-lock.json, so use npm:
npm install
3. Run the development server
npm run dev
Open http://localhost:3000 in your browser. The development server supports hot reload while editing source files.
4. Create a production build
npm run build
5. Run the production server locally
After a successful build:
npm run start
The production server is available at http://localhost:3000.
6. Run lint checks
npm run lint
Available Scripts
Command	Description
npm run dev	Starts the Next.js development server
npm run build	Creates a production build
npm run start	Starts the production server; run after building
npm run lint	Runs ESLint


Project Structure
The repository uses the Next.js App Router with app/ at the project root (there is no src/ directory).
f1-portfolio/
├── app/
│   ├── favicon.ico        # Browser favicon
│   ├── globals.css        # Global styles and design system
│   ├── icon.tsx           # Generated application icon
│   ├── layout.tsx         # Root layout, metadata, and global UI
│   └── page.tsx           # Main portfolio page and section composition
│
├── components/
│   ├── About.tsx          # About section
│   ├── BackToTop.tsx      # Back-to-top interaction
│   ├── Contact.tsx        # Contact section
│   ├── Cursor.tsx         # Custom cursor
│   ├── Experience.tsx     # Experience section
│   ├── Footer.tsx         # Footer and telemetry-style details
│   ├── Hero.tsx           # Hero / introduction section
│   ├── LightsOut.tsx      # Lights-out interaction
│   ├── Loader.tsx         # Intro loading screen
│   ├── Navbar.tsx         # Main navigation
│   ├── PitRadio.tsx       # Pit Radio interface
│   ├── ProjectDetail.tsx  # Project detail presentation
│   ├── Projects.tsx       # Projects section
│   ├── SectionDivider.tsx # Section transition divider
│   ├── SectionRail.tsx    # Section navigation rail
│   ├── Skills.tsx         # Skills section
│   ├── SmoothScroll.tsx   # Lenis and GSAP scroll integration
│   └── TitleFX.tsx        # Document title effect
│
├── lib/
│   ├── fonts.ts           # next/font configuration
│   ├── projects.ts        # Project content and data
│   └── session.ts         # Session-related helper
│
├── public/
│   ├── images/            # Portfolio photos and project visuals
│   └── cv-nazril-irfani.pdf
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
This is a high-level map of the current repository. Refer to the source files for implementation details.
Customization
Update portfolio content
- About, skills, experience, and contact: edit the corresponding component in components/.
- Project list and project data: edit lib/projects.ts and the project presentation components.
- Main section order: edit app/page.tsx.
- Navigation and global layout: edit app/layout.tsx and components/Navbar.tsx.
- Global styling: edit app/globals.css.
- Typography: edit lib/fonts.ts.
Update images and CV
- Store portfolio images in public/images/.
- Reference public assets from the root path, for example: /images/me.png.
- Replace public/cv-nazril-irfani.pdf when publishing an updated CV.
Keep asset filenames in sync with the paths referenced by the components.
Environment Variables
The default local setup does not require a mandatory environment file.

An optional variable is supported for the canonical website URL used by metadata:
NEXT_PUBLIC_SITE_URL=https://your-domain.example
When deploying through Vercel, the project can also derive its production URL from Vercel's provided environment configuration. Never commit private credentials or secret values to the repository.
Deployment
The portfolio is deployed on Vercel:

https://f1-portfolio-beige.vercel.app

To deploy your own copy:
1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Keep the detected Next.js framework settings.
4. Configure NEXT_PUBLIC_SITE_URL if using a custom domain.
5. Deploy. Vercel will build the project using the package scripts.
Development Notes
- Use the existing component structure when adding sections or interactions.
- Keep content data separate from presentation where practical.
- Follow the existing TypeScript and component conventions.
- Run npm run lint and npm run build before submitting changes.
- Do not commit node_modules/, .next/, local environment files, or generated output.
- Review asset references before renaming or removing files from public/.
License
No license has been specified for this repository. Unless a license is added, the source code is not explicitly granted for reuse, redistribution, or modification by others.
<div align="center">Made with passion for code, motion, and motorsport.

ZRIL / Nazril Irfani
</div>
