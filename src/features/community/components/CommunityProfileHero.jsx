import { BriefcaseBusiness, Flag, Sparkles, Store } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityAvatar from "./CommunityAvatar.jsx";
import CommunityProfileActions from "./CommunityProfileActions.jsx";

export default function CommunityProfileHero({
  profile,
  viewModel,
  postCount,
  busy,
  relationshipActions,
  onReport,
}) {
  const { displayName, isSelf, role, salonRelationship, user } = viewModel;

  return (
    <header className="community-profile-hero">
      <div className="community-profile-cover-art" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="community-profile-identity">
        <CommunityAvatar name={displayName} size="profile" />
        <div className="community-profile-title-block">
          <div className="community-profile-role-line">
            <span>{role.label}</span>
            {profile.careerProfileEnabled && (
              <span className="is-verified">
                <Sparkles size={13} /> Professional profile
              </span>
            )}
          </div>
          <h1>{displayName}</h1>
          <p>@{user.userName}</p>
          {profile.salonId && (
            <Link
              className="community-profile-salon-inline"
              to={`/salons/${profile.salonId}`}
            >
              <Store size={15} /> {salonRelationship} {profile.salonName}
            </Link>
          )}
        </div>

        <div className="community-profile-hero-actions">
          {isSelf ? (
            <Link className="community-profile-primary-action" to="/profile/career">
              <BriefcaseBusiness size={16} /> Edit professional profile
            </Link>
          ) : (
            <CommunityProfileActions
              member={profile.member}
              busy={busy}
              {...relationshipActions}
            />
          )}
          {!isSelf && (
            <button
              className="community-profile-report"
              type="button"
              onClick={onReport}
            >
              <Flag size={15} /> Report profile
            </button>
          )}
        </div>
      </div>

      <dl className="community-profile-community-stats">
        <div><dt>Posts</dt><dd>{profile.postCount ?? postCount}</dd></div>
        <div><dt>Friends</dt><dd>{profile.friendCount ?? 0}</dd></div>
        <div><dt>Salons followed</dt><dd>{profile.followedSalonCount ?? 0}</dd></div>
      </dl>
    </header>
  );
}
