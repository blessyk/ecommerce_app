# ecommerce-frontend

React + Vite frontend for the ecommerce project.

Getting started

1. Install deps:

```bash
npm install
```

2. Ensure backend is running at `http://localhost:5000` (or set `VITE_API_URL` in `.env`).

3. Start frontend dev server:

```bash
npm run dev
```

What I implemented

- Routing (Home, Product, Cart, Login, Profile, Contact)
- Tailwind CSS setup
- Redux store for auth and cart
- Axios `src/services/api.js` with JWT header support
- Product listing with search, category and price filters
- Product details + recommendations (from backend `/api/recommendations`)
- Protected `Profile` route and role-aware `Navbar`
- Contact form and basic client-side validation

Next steps you may want

- Add admin UI for CRUD product management (backend supports admin routes)
- Add pagination and infinite scroll for product listing
- Improve visual polish with Tailwind components
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
