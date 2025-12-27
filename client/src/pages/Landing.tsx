import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/landing/Header';
import Hero from '../components/ui/landing/Hero';
import VideoCarousel from '../components/ui/landing/VideoCarousel';
import MissionVision from '../components/ui/landing/MissionVision';
import Courses from '../components/ui/landing/Courses';
import Teachers from '../components/ui/landing/Teachers';
import Blog from '../components/ui/landing/Blog';
import Pricing from '../components/ui/landing/Pricing';
import Footer from '../components/ui/landing/Footer';


export function Landing(){
    const navigate = useNavigate();

    const handleSignupClick = () => {
        navigate('/registro');
    };
    return (
        <main className='w-full h-screen flex flex-col items-center'>
            <Header/>
            <Hero/>
            <VideoCarousel />
            <MissionVision />
            <Courses/>
            <Teachers />
            <Blog />
            <Pricing onSignupClick={handleSignupClick} usuarioActual={''}/>
            <Footer /> 
        </main>
    )
}