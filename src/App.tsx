import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MapProvider } from './contexts/MapContext';
import { UserLocationProvider } from './contexts/UserLocationContext';
import { ContentProvider } from './contexts/ContentContext';
import Layout from './components/Layout';
import MapView from './views/MapView';
import CreateQuestion from './views/CreateQuestion';
import CreateStory from './views/CreateStory';
import ContentFeed from './views/ContentFeed';
import ContentDetail from './views/ContentDetail';

function App() {
  return (
    <BrowserRouter>
      <UserLocationProvider>
        <MapProvider>
          <ContentProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<MapView />} />
                <Route path="/create-question" element={<CreateQuestion />} />
                <Route path="/create-story" element={<CreateStory />} />
                <Route path="/feed" element={<ContentFeed />} />
                <Route path="/content/:id" element={<ContentDetail />} />
              </Routes>
            </Layout>
          </ContentProvider>
        </MapProvider>
      </UserLocationProvider>
    </BrowserRouter>
  );
}

export default App;