import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Post from './pages/Post';
import Contact from './pages/Contact';
import HireTalent from './pages/HireTalent';
import FindAJob from './pages/FindAJob';
import ForEmployer from './pages/ForEmployer';
import Terms from './pages/Terms';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Post />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hire-talent" element={<HireTalent />} />
          <Route path="/find-a-job" element={<FindAJob />} />
          <Route path="/for-employer" element={<ForEmployer />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;