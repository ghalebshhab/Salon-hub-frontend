import { Search, UsersRound } from "lucide-react";
import { useState } from "react";
import CommunityAvatar from "./CommunityAvatar.jsx";
import FriendshipActions from "./FriendshipActions.jsx";

export default function PeopleDiscoveryPanel({
  people,
  busy,
  onSearch,
  onConnect,
  onAccept,
  onDecline,
}) {
  const [search, setSearch] = useState("");
  const submit = (event) => {
    event.preventDefault();
    onSearch(search);
  };
  return (
    <section className="community-panel">
      <header>
        <h2>
          <UsersRound size={18} /> Discover people
        </h2>
      </header>
      <form className="community-search" onSubmit={submit}>
        <Search size={17} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search members"
          aria-label="Search community members"
        />
      </form>
      {people.map((member) => (
        <div className="community-person-row" key={member.user.id}>
          <CommunityAvatar name={member.user.displayName} size="small" />
          <div>
            <strong>{member.user.displayName}</strong>
            <small>@{member.user.userName}</small>
          </div>
          <FriendshipActions
            member={member}
            busy={busy}
            onConnect={onConnect}
            onAccept={onAccept}
            onDecline={onDecline}
          />
        </div>
      ))}
    </section>
  );
}
