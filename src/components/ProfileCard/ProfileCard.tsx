import React, { useMemo, lazy } from 'react';
import { useTiltAnimation } from './hooks/useTiltAnimation';
import UserInfo from './components/UserInfo';
import CardContent from './components/CardContent';
import './ProfileCard.css';
export interface ProfileCardProps {
  avatarUrl?: string;
  iconUrl?: string;
  grainUrl?: string;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}
const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'Javi A. Torres',
  title = 'Design Founder',
  handle = 'javicodes',
  status = 'Online',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick
}) => {
  const { wrapRef, cardRef } = useTiltAnimation({
    enableTilt,
    enableMobileTilt,
    mobileTiltSensitivity
  });
  return (
    <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()}>
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-avatar-content">
            <img
              className="avatar"
              src={avatarUrl}
              alt={`${name || 'User'} avatar`}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }} />

          </div>
          <div className="pc-info-container">
            <div className="pc-content">
              <div className="pc-details">
                <h3>{name}</h3>
                <p>{title}</p>
              </div>
            </div>
            {showUserInfo &&
            <UserInfo
              name={name}
              handle={handle}
              status={status}
              contactText={contactText}
              avatarUrl={avatarUrl}
              miniAvatarUrl={miniAvatarUrl}
              onContactClick={onContactClick} />

            }
          </div>
        </div>
      </section>
    </div>);

};
export default ProfileCard;