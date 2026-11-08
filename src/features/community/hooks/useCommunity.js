import { useMemo, useState } from "react";

const currentUser = {
  name: "Maya Chen",
  username: "@mayachen",
  role: "Hair stylist",
  avatar: "MC",
  friends: 248,
  following: 31,
};

const initialPosts = [
  {
    id: "post-1",
    author: { name: "Lena Ortiz", username: "@lenaortiz", role: "Colorist", avatar: "LO" },
    salon: "Posted from Atelier No. 7",
    time: "18 min ago",
    text: "Soft dimension, strong shape. I am still thinking about this warm brunette transformation and the way it catches the afternoon light.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    likes: 42,
    comments: [
      { id: "comment-1", author: "Maya Chen", avatar: "MC", time: "12 min ago", text: "The dimension is beautiful. That tone is so wearable." },
      { id: "comment-2", author: "Jordan Kim", avatar: "JK", time: "5 min ago", text: "Saving this for my next color appointment." },
    ],
    liked: false,
    saved: false,
  },
  {
    id: "post-2",
    author: { name: "Jordan Kim", username: "@jordankim", role: "Barber", avatar: "JK" },
    time: "1 hr ago",
    text: "A good consultation changes everything. What is one question you always ask before picking up the shears?",
    likes: 28,
    comments: [],
    liked: true,
    saved: true,
  },
];

const people = [
  { id: "person-1", name: "Nia Harper", username: "@niaharper", role: "Nail artist", avatar: "NH", status: "Add friend" },
  { id: "person-2", name: "Sam Rivera", username: "@samrivera", role: "Texture specialist", avatar: "SR", status: "Request sent" },
  { id: "person-3", name: "Tess Morgan", username: "@tessmorgan", role: "Makeup artist", avatar: "TM", status: "Friends" },
];

const salons = [
  { id: "salon-1", name: "Atelier No. 7", location: "Brooklyn, NY", avatar: "A7", following: false },
  { id: "salon-2", name: "The Juniper Room", location: "Portland, OR", avatar: "JR", following: true },
];

export default function useCommunity() {
  const [posts, setPosts] = useState(initialPosts);
  const [peopleState, setPeopleState] = useState(people);
  const [salonState, setSalonState] = useState(salons);
  const [tab, setTab] = useState("for-you");
  const [query, setQuery] = useState("");
  const [commentOpen, setCommentOpen] = useState({});
  const [isPublishing, setIsPublishing] = useState(false);

  const filteredPeople = useMemo(() => peopleState.filter((person) => `${person.name} ${person.username} ${person.role}`.toLowerCase().includes(query.toLowerCase())), [peopleState, query]);

  function publishPost(text, publishAs) {
    if (!text.trim()) return false;
    setIsPublishing(true);
    setTimeout(() => {
      setPosts((current) => [{ id: `post-${Date.now()}`, author: currentUser, salon: publishAs === "salon" ? "Posted from Maya's studio" : "", time: "Just now", text: text.trim(), likes: 0, comments: [], liked: false, saved: false }, ...current]);
      setIsPublishing(false);
    }, 350);
    return true;
  }

  function toggleLike(id) { setPosts((current) => current.map((post) => post.id === id ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) } : post)); }
  function toggleSave(id) { setPosts((current) => current.map((post) => post.id === id ? { ...post, saved: !post.saved } : post)); }
  function toggleComments(id) { setCommentOpen((current) => ({ ...current, [id]: !current[id] })); }
  function addComment(id, text) {
    if (!text.trim()) return;
    setPosts((current) => current.map((post) => post.id === id ? { ...post, comments: [...post.comments, { id: `comment-${Date.now()}`, author: currentUser.name, avatar: currentUser.avatar, time: "Just now", text: text.trim() }] } : post));
  }
  function updatePerson(id) { setPeopleState((current) => current.map((person) => person.id === id ? { ...person, status: person.status === "Add friend" ? "Request sent" : person.status === "Request sent" ? "Friends" : "Add friend" } : person)); }
  function toggleSalon(id) { setSalonState((current) => current.map((salon) => salon.id === id ? { ...salon, following: !salon.following } : salon)); }

  return { currentUser, posts, people: filteredPeople, salons: salonState, tab, setTab, query, setQuery, commentOpen, isPublishing, publishPost, toggleLike, toggleSave, toggleComments, addComment, updatePerson, toggleSalon };
}
