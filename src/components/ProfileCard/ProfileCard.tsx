import React from 'react';
import { useTiltAnimation } from './hooks/useTiltAnimation';
import UserInfo from './components/UserInfo';
import './ProfileCard.css';

export interface ProfileCardProps {
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const ProfileCard: React.FC<ProfileCardProps> = ({
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  name = 'Javi A. Torres',
  title = 'Design Founder',
  handle = 'javicodes',
  status = 'Online',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick,
}) => {
  const { wrapRef, cardRef } = useTiltAnimation({
    enableTilt,
    enableMobileTilt,
    mobileTiltSensitivity,
  });

  const initials = getInitials(name || 'User');

  return (
    <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()}>
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-avatar-content" aria-hidden="true">
            <div className="pc-avatar-placeholder">
              <span className="pc-avatar-initials">{initials}</span>
            </div>
          </div>
          <div className="pc-info-container">
            <div className="pc-content">
              <div className="pc-details">
                <h3>{name}</h3>
                <p>{title}</p>
              </div>
            </div>
            {showUserInfo && (
              <UserInfo
                name={name}
                handle={handle}
                status={status}
                contactText={contactText}
                initials={initials}
                onContactClick={onContactClick}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileCard;
