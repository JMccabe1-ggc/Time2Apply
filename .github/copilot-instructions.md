# Time2Apply Project - AI Coding Assistant Instructions

## Project Overview
Full-stack job application tracking system. Currently in early development with React frontend and planned backend.

## Architecture

### Frontend (`frontend/`)
- **Stack**: React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + React Router DOM 7
- **Entry Point**: `src/main.tsx` - defines routing configuration
- **Main App**: `src/App.tsx` - root component

### Backend (`backend/`)
- Empty - planned for future development

## Critical Folder Structure Pattern ⚠️

**Non-standard component organization**: Components can live at `frontend/` root level, NOT only in `src/`.

```
frontend/
├── src/               # Main source code
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
└── loginsignup/       # Feature folders at root level!
    └── Login.tsx
```

**Import Rule**: When importing from `src/` to root-level folders:
- ❌ Wrong: `import Login from './loginsignup/Login.tsx'`  
- ✅ Correct: `import Login from '../loginsignup/Login.tsx'`

Example from [src/main.tsx](frontend/src/main.tsx#L6):
```tsx
import Login from '../loginsignup/Login.tsx'  // Go up one level with ../
```

## Routing Configuration

Routes are defined in `src/main.tsx`, NOT in App.tsx:

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/*" element={<App />} />
    <Route path="/login" element={<Login />} />
  </Routes>
</BrowserRouter>
```

## Development Workflow

### Frontend Commands
```bash
cd frontend
npm run dev      # Start dev server (Vite HMR on http://localhost:5173)
npm run build    # TypeScript compile + production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

### Tech Stack Details
- **React 19**: Latest version with updated APIs
- **TypeScript**: Strict mode enabled (see `tsconfig.app.json`)
- **Vite**: Fast HMR, ES modules, modern build tool
- **Tailwind CSS 4**: Latest version using Vite plugin
- **React Router DOM 7**: Latest routing library

## TypeScript Configuration

Uses project references for separation:
- `tsconfig.json` - References other configs
- `tsconfig.app.json` - Application code (includes `src/` only)
- `tsconfig.node.json` - Node/build tooling code

**Note**: `tsconfig.app.json` only includes `src/` directory, so root-level component folders like `loginsignup/` may show TypeScript errors in the IDE but will work at runtime.

## Code Style & Patterns

### Component Structure
- Functional components with hooks
- TypeScript React.FC not used (prefer explicit typing)
- Export default pattern for components

Example from [loginsignup/Login.tsx](frontend/loginsignup/Login.tsx):
```tsx
const Login = () => {
    return (
        <>
            <h1>Login</h1>
        </>
    );
};

export default Login;
```

### Import Style
- Include `.tsx` extension in imports (required by Vite/TypeScript config)
- Use relative imports for local files
- React Router components imported from 'react-router-dom'

## Common Pitfalls

1. **Import path errors**: Remember root-level folders need `../` from `src/`
2. **TypeScript errors**: Root-level component folders may show IDE errors since they're outside `tsconfig.app.json` include path
3. **Route placement**: Add routes in `main.tsx`, not `App.tsx`

## Next Steps (Planned)
- Backend implementation
- Authentication system (Login component exists but is placeholder)
- Database integration
