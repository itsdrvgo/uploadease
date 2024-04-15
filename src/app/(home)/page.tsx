import About from "@/components/home/about";
import Challenges from "@/components/home/challenges";
import CutOut from "@/components/home/cutout";
import Hero from "@/components/home/hero";
import Reviews from "@/components/home/reviews";
import UserBranding from "@/components/home/user-branding";

function Page() {
    return (
        <>
            <Hero />
            <CutOut />
            <About />
            <CutOut isReversed />
            <UserBranding />
            <Challenges />
            <CutOut />
            <Reviews />
        </>
    );
}

export default Page;
