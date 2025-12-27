import { useNavigate } from 'react-router-dom';
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
      <MissionVision />
      <Courses />
      <Teachers />
      <Blog />
      <Pricing />
    </>
  );
};

export default LandingPage;
