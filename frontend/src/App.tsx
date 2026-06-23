// src/App.tsx
import { Outlet } from '@tanstack/react-router'

function App() {
  console.log("App está a renderizar..."); 
  return (
    <div style={{ border: '5px solid red' }}>
      <h1>Teste do App</h1>
      <Outlet />
    </div>
  )
}
export default App