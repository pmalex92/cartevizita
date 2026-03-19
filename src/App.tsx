import React from 'react';
import ProfileCard from './components/ProfileCard';
export function App() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4">
      <ProfileCard
        name="Popescu Mihai Alexnadru"
        title="Web Magician"
        handle="pmalex"
        status="Online"
        contactText="Contacteaza-ma"
        avatarUrl="/mihai-popescu.webp"
        showUserInfo={true}
        enableTilt={true}
        enableMobileTilt={false}
        onContactClick={() => {
          window.location.href = 'mailto:tech@viatron.ro';
        }} />

    </div>);

}