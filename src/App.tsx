import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import EggProductionView from './pages/EggProduction';
import FeedConsumptionView from './pages/FeedConsumption';
import MortalityView from './pages/Mortality';
import VaccinationView from './pages/Vaccination';
import SalesView from './pages/Sales';
import PlaceholderModule from './pages/PlaceholderModule';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="eggs" element={<EggProductionView />} />
          <Route path="feed" element={<FeedConsumptionView />} />
          <Route path="mortality" element={<MortalityView />} />
          <Route path="vaccination" element={<VaccinationView />} />
          <Route path="sales" element={<SalesView />} />
          <Route path="incubator" element={<PlaceholderModule title="Incubator Log" />} />
          <Route path="cashflow" element={<PlaceholderModule title="Cash Flow Book" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
