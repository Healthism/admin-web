import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SnackbarNotifier from './components/common/SnackbarNotifier';
import { routes } from './routes/routes';
import './App.css';
function App() {

  return (
    <Router>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <SnackbarNotifier />
    </Router>
  );
}

export default App;