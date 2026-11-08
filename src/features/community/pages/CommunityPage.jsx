import { CommunityAvatar, CommunityComposer, CommunityGuidelinesCard, CommunityHeader, CommunityPostCard, CommunitySidebar, MobileCommunityNav, PeopleDiscoveryPanel, SalonSuggestionsPanel } from "../components/CommunityComponents.jsx";
import useCommunity from "../hooks/useCommunity.js";
import "../../../app/styles/community.css";

export default function CommunityPage() {
  const community = useCommunity();
  return <div className="community-page" id="feed"><MobileCommunityNav /><div className="community-layout"><CommunitySidebar user={community.currentUser} /><main className="community-main"><CommunityHeader tab={community.tab} onTabChange={community.setTab} /><CommunityComposer user={community.currentUser} isPublishing={community.isPublishing} onPublish={community.publishPost} /><section className="community-feed" aria-label="Community posts">{community.posts.map((post) => <CommunityPostCard key={post.id} post={post} commentsOpen={community.commentOpen[post.id]} onLike={community.toggleLike} onSave={community.toggleSave} onComments={community.toggleComments} onComment={community.addComment} />)}<button className="load-more" type="button">Load more posts <ChevronDownIcon /></button></section></main><aside className="community-right-rail"><PeopleDiscoveryPanel people={community.people} query={community.query} onQueryChange={community.setQuery} onPersonAction={community.updatePerson} /><SalonSuggestionsPanel salons={community.salons} onToggle={community.toggleSalon} /><CommunityGuidelinesCard /></aside></div></div>;
}

function ChevronDownIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>; }
