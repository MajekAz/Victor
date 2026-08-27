import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import { Jobs } from './pages/Jobs.tsx';
import { JobDetails } from './pages/JobDetails.tsx';
import Services from './pages/Services.tsx';
import Blog from './pages/Blog.tsx';
import Post from './pages/Post.tsx';
import Contact from './pages/Contact.tsx';
import ContactSuccess from './pages/ContactSuccess.tsx';
import BookConsultation from './pages/BookConsultation.tsx';
import HireTalent from './pages/HireTalent.tsx';
import ForEmployer from './pages/ForEmployer.tsx';
import Terms from './pages/Terms.tsx';
import Privacy from './pages/Privacy.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import NotFound from './pages/NotFound.tsx';

// Scroll to top on route change & seamlessly redirect any legacy hash URLs (e.g. /#/jobs -> /jobs)
const NavigationHelper = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Backward compatibility: If visitor arrives via legacy /#/jobs or /#/about
  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const targetPath = window.location.hash.slice(1); // remove '#' e.g. '/jobs'
      if (targetPath) {
        navigate(targetPath, { replace: true });
      }
    }
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <NavigationHelper />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:slug" element={<JobDetails />} />
          <Route path="/find-a-job" element={<Jobs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Post />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-success" element={<ContactSuccess />} />
          <Route path="/book-consultation" element={<BookConsultation />} />
          <Route path="/start-application" element={<BookConsultation />} />
          <Route path="/consultation" element={<BookConsultation />} />
          <Route path="/apply" element={<BookConsultation />} />
          <Route path="/hire-talent" element={<HireTalent />} />
          <Route path="/for-employer" element={<ForEmployer />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          {/* Catch all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
