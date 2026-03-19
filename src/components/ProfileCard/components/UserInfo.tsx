import React, { useCallback, lazy } from 'react';
interface UserInfoProps {
  name: string;
  handle: string;
  status: string;
  contactText: string;
  avatarUrl: string;
  miniAvatarUrl?: string;
  onContactClick?: () => void;
}
const UserInfo: React.FC<UserInfoProps> = ({
  name,
  handle,
  status,
  contactText,
  avatarUrl,
  miniAvatarUrl,
  onContactClick
}) => {
  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);
  return (
    <div className="pc-user-info">
      <div className="pc-user-details">
        <div className="pc-mini-avatar">
          <img
            src={miniAvatarUrl || avatarUrl}
            alt={`${name || 'User'} mini avatar`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.opacity = '0.5';
              target.src = avatarUrl;
            }} />

        </div>
        <div className="pc-user-text">
          <div className="pc-handle">@{handle}</div>
          <div className="pc-status">{status}</div>
        </div>
      </div>
      <button
        className="pc-contact-btn"
        onClick={handleContactClick}
        style={{
          pointerEvents: 'auto'
        }}
        type="button"
        aria-label={`Contact ${name || 'user'}`}>

        {contactText}
      </button>
    </div>);

};
export default UserInfo;