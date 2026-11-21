import {
  ClipboardList,
  Compass,
  Crown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/** One icon per role; it sits on the avatar like a small seal. */
const ROLE_ICONS = {
  owner: Crown,
  manager: ClipboardList,
  artist: Sparkles,
  team: ShieldCheck,
  explorer: Compass,
};

export default function CommunityRoleSeal({ role, size = 15 }) {
  const Icon = ROLE_ICONS[role.key] || Compass;
  return <Icon size={size} aria-hidden="true" />;
}
