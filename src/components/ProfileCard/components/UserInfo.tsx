import React, { useCallback } from 'react';

interface UserInfoProps {
  name: string;
  handle: string;
  status: string;
  contactText: string;
  initials: string;
  onContactClick?: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  handle,
  status,
  contactText,
  initials,
  onContactClick,
}) => {
  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  return (
    <div className="pc-user-info">
      <div className="pc-user-details">
        <div className="pc-mini-avatar" aria-hidden="true">
          <span>{initials}</span>
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
          pointerEvents: 'auto',
        }}
        type="button"
        aria-label={`Contact ${name || 'user'}`}
      >
        {contactText}
      </button>
    </div>
  );
};

export default UserInfo;
