'use client';
import ProfileSection from '@/app/tree/componentsSidebar/ProfileSection';
import DiscoverySection from '@/app/tree/componentsSidebar/DiscoverySection';
import MediaSection from '@/app/tree/componentsSidebar/MediaSection';
import BiographySection from '@/app/tree/componentsSidebar/BiographySection';
import FamilySection from '@/app/tree/componentsSidebar/FamilySection';
import EventsSection from '@/app/tree/componentsSidebar/EventsSection';
import DNASection from '@/app/tree/componentsSidebar/DNASection';

export default function Sidebar() {
  return (
    <div className="w-72 bg-white border-r shadow-sm overflow-y-auto">
      <ProfileSection />
      <DiscoverySection />
      <MediaSection />
      <BiographySection />
      <FamilySection />
      <EventsSection />
      <DNASection />
    </div>
  );
}