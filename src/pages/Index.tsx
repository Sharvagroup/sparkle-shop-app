import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import SaleBanner from "@/components/sections/SaleBanner";
import Categories from "@/components/sections/Categories";
import NewArrivals from "@/components/sections/NewArrivals";
import BestSellers from "@/components/sections/BestSellers";
import CelebritySpecials from "@/components/sections/CelebritySpecials";
import Testimonials from "@/components/sections/Testimonials";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PromoBanner />
      <Header />
      <main>
        <Hero />
        <SaleBanner />
        <Categories />
        <NewArrivals />
        <BestSellers />
        <CelebritySpecials />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
