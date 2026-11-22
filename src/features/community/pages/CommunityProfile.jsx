import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../../shared/auth/useAuth.js";
import { CommunityProfileSkeleton } from "../components/CommunitySkeletons.jsx";
import ReportDialog from "../../moderation/components/ReportDialog.jsx";
import CommunityProfileAbout from "../components/CommunityProfileAbout.jsx";
import CommunityProfileActivity from "../components/CommunityProfileActivity.jsx";
import CommunityProfileHero from "../components/CommunityProfileHero.jsx";
import CommunityProfileSidebar from "../components/CommunityProfileSidebar.jsx";
import useCommunityComments from "../hooks/useCommunityComments.js";
import useCommunityProfile from "../hooks/useCommunityProfile.js";
import { getCommunityProfileViewModel } from "../model/communityProfile.js";
import ErrorPage from "../../../shared/components/ErrorPage.jsx";
import classifyError from "../../../shared/errors/classifyError.js";
import t from "../../../shared/i18n/t.js";

export default function CommunityProfile() {
  const [reportOpen, setReportOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const { userId } = useParams();
  const profileState = useCommunityProfile(userId);
  const commentsState = useCommunityComments({
    onCommentAdded: profileState.incrementCommentCount,
  });

  if (profileState.loading && !profileState.profile) {
    return <CommunityProfileSkeleton />;
  }
  if (profileState.error || !profileState.profile) {
    return (
      <ErrorPage
        kind={classifyError(profileState.failure, {
          notFoundKind: "profileUnavailable",
        })}
      />
    );
  }

  const profile = profileState.profile;
  const viewModel = getCommunityProfileViewModel(profile, currentUser?.id);
  const relationshipActions = {
    onConnect: profileState.connect,
    onAccept: profileState.accept,
    onDecline: profileState.decline,
    onRemove: profileState.remove,
  };

  return (
    <main className="community-profile-page">
      <div className="container community-profile-shell">
        <Link className="community-profile-back" to="/community">
          <ArrowLeft size={17} /> {t("Back to community")}
        </Link>

        <CommunityProfileHero
          profile={profile}
          viewModel={viewModel}
          postCount={profileState.postPage.totalElements}
          busy={profileState.busyAction}
          relationshipActions={relationshipActions}
          onReport={() => setReportOpen(true)}
        />

        <div className="community-profile-layout">
          <section
            className="community-profile-main-column"
            aria-labelledby="profile-posts-title"
          >
            <CommunityProfileAbout profile={profile} viewModel={viewModel} />
            <CommunityProfileActivity
              firstName={viewModel.firstName}
              isSelf={viewModel.isSelf}
              profileState={profileState}
              commentsState={commentsState}
            />
          </section>
          <CommunityProfileSidebar profile={profile} viewModel={viewModel} />
        </div>

        {reportOpen && (
          <ReportDialog
            targetType="USER"
            targetId={viewModel.user.id}
            targetLabel={viewModel.displayName}
            onClose={() => setReportOpen(false)}
          />
        )}
      </div>
    </main>
  );
}
