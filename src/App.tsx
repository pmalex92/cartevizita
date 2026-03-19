import React from 'react';
import ProfileCard from './components/ProfileCard';
export function App() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4">
      <ProfileCard
        name="Steve Witmer"
        title="Design Founder"
        handle="switmer"
        status="Online"
        contactText="Contact Me"
        avatarUrl="/pasted-image.png"
        showUserInfo={true}
        enableTilt={true}
        enableMobileTilt={false}
        onContactClick={() => console.log('Contact clicked')} />

    </div>);

}