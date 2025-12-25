import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import VideoCarousel from '../components/VideoCarousel';
import MissionVision from '../components/MissionVision';
import Courses from '../components/Courses';
import Teachers from '../components/Teachers';
import Blog from '../components/Blog';
import Pricing from '../components/Pricing';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/registro');
  };

  return (
    <>
      <Hero onGetStarted={handleSignupClick} />
      <VideoCarousel />
      <MissionVision />
      <Courses />
      <Teachers />
      <Blog />
      <Pricing />
    </>
  );
};

export default LandingPage;
