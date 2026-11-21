import {
  ArrowUpRight,
  BadgeCheck,
  CalendarHeart,
  Flag,
  UserPen,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import PhotoPickerButton from "../../../shared/components/PhotoPickerButton.jsx";
import usePhotoUpload from "../../media/hooks/usePhotoUpload.js";
import CommunityAvatar from "./CommunityAvatar.jsx";
import CommunityProfileActions from "./CommunityProfileActions.jsx";
import RoleSeal from "./CommunityRoleSeal.jsx";

export default function CommunityProfileHero({
  profile,
  viewModel,
  postCount,
  busy,
  relationshipActions,
  onReport,
}) {
  const { displayName, isSelf, role, salonRelationship, tenure, user } =
    viewModel;
  const [photoUrl, setPhotoUrl] = useState("");
  const { uploading, upload } = usePhotoUpload("profilePicture");

  const uploadPhoto = async (file) => {
    const url = await upload(file);
    if (url) {
      setPhotoUrl(url);
      // The auth provider reloads the signed-in profile on window focus.
      window.dispatchEvent(new Event("focus"));
    }
  };

  const stats = [
    { label: "Posts", value: profile.postCount ?? postCount ?? 0 },
    { label: "Friends", value: profile.friendCount ?? 0 },
    { label: "Salons followed", value: profile.followedSalonCount ?? 0 },
  ];

  return (
    <header className={`pf-hero pf-tone-${role.tone}`}>
      <div className="pf-cover" aria-hidden="true">
        <span className="pf-cover-word">{role.label}</span>
      </div>

      <div className="pf-identity">
        <div className="pf-portrait">
          <span className="pf-ring" aria-hidden="true" />
          <CommunityAvatar
            name={displayName}
            size="profile"
            imageUrl={photoUrl || user.profilePictureUrl}
          />
          <span className="pf-seal" title={role.label}>
            <RoleSeal role={role} />
          </span>
        </div>

        <div className="pf-title">
          <div className="pf-badges">
            <span className="pf-role-badge">
              <RoleSeal role={role} size={13} /> {role.label}
            </span>
            {profile.careerProfileEnabled && (
              <span className="pf-verified">
                <BadgeCheck size={13} aria-hidden="true" /> Professional profile
              </span>
            )}
          </div>
          <h1>{displayName}</h1>
          <p className="pf-handle">@{user.userName}</p>

          {profile.salonId && (
            <p className="pf-role-line">
              {salonRelationship}{" "}
              <Link className="pf-salon-link" to={`/salons/${profile.salonId}`}>
                {profile.salonName}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
              {tenure && (
                <span className="pf-tenure">
                  <CalendarHeart size={14} aria-hidden="true" />
                  {tenure.length === "New this month"
                    ? "Joined this month"
                    : `${tenure.length} · since ${tenure.since}`}
                </span>
              )}
            </p>
          )}
        </div>

        <div className="pf-actions">
          {isSelf ? (
            <>
              <Link
                className="community-profile-primary-action"
                to="/profile/career"
              >
                <UserPen size={16} /> Edit professional profile
              </Link>
              <PhotoPickerButton
                label="Change photo"
                busy={uploading}
                className="pf-photo-btn"
                onSelect={uploadPhoto}
              />
            </>
          ) : (
            <>
              <CommunityProfileActions
                member={profile.member}
                busy={busy}
                {...relationshipActions}
              />
              <button
                className="community-profile-report"
                type="button"
                onClick={onReport}
              >
                <Flag size={15} /> Report profile
              </button>
            </>
          )}
        </div>
      </div>

      <dl className="pf-stats">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
