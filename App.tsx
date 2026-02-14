import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import Blog from './pages/Blog.tsx';
import Post from './pages/Post.tsx';
import Contact from './pages/Contact.tsx';
import ContactSuccess from './pages/ContactSuccess.tsx';
import HireTalent from './pages/HireTalent.tsx';
import FindAJob from './pages/FindAJob.tsx';
import ForEmployer from './pages/ForEmployer.tsx';
import Terms from './pages/Terms.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';

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
          <Route path="/contact-success" element={<ContactSuccess />} />
          <Route path="/hire-talent" element={<HireTalent />} />
          <Route path="/find-a-job" element={<FindAJob />} />
          <Route path="/for-employer" element={<ForEmployer />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;