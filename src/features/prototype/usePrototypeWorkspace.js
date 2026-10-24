import { useMemo, useState } from "react";
import {
  employees,
  initialApplications,
  initialBookings,
  initialHiringPosts,
  initialInvitations,
  initialNotifications,
  initialSchedule,
  prototypeSections,
} from "./prototypeData.js";

const clone = (value) => structuredClone(value);

export default function usePrototypeWorkspace() {
  const [role, setRoleState] = useState("customer");
  const [section, setSection] = useState("overview");
  const [bookings, setBookings] = useState(() => clone(initialBookings));
  const [applications, setApplications] = useState(() => clone(initialApplications));
  const [hiringPosts, setHiringPosts] = useState(() => clone(initialHiringPosts));
  const [invitations, setInvitations] = useState(() => clone(initialInvitations));
  const [schedule, setSchedule] = useState(() => clone(initialSchedule));
  const [notifications, setNotifications] = useState(() => clone(initialNotifications));
  const [activity, setActivity] = useState("Choose any action—the prototype updates locally and can always be reset.");

  const setRole = (nextRole) => {
    setRoleState(nextRole);
    setSection("overview");
    setActivity(`Now previewing the ${nextRole} experience.`);
  };

  const updateBooking = (id, updates, message) => {
    setBookings((items) => items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    setActivity(message);
  };

  const applyToPost = (post) => {
    if (post.applied) return;
    setHiringPosts((items) => items.map((item) => (item.id === post.id ? { ...item, applied: true } : item)));
    setApplications((items) => [
      {
        id: Date.now(),
        postId: post.id,
        candidate: "Lina Haddad",
        email: "lina@example.com",
        phone: "+962 79 225 1064",
        title: post.title,
        salonName: post.salonName,
        years: 5,
        skills: ["Hair styling", "Coloring", "Balayage", "Blow dry"],
        matchLevel: post.matchLevel,
        matchScore: post.matchScore,
        status: "Requested",
        note: "Application created from the interactive prototype.",
        resumeUploaded: true,
      },
      ...items,
    ]);
    setActivity(`Application sent to ${post.salonName}. It now appears in both candidate and owner views.`);
  };

  const decideApplication = (id, accepted) => {
    setApplications((items) => items.map((item) => (item.id === id ? { ...item, status: accepted ? "Accepted" : "Rejected" } : item)));
    setActivity(accepted ? "Candidate accepted. Their employment request is now approved." : "Application rejected and retained in the history.");
  };

  const decideInvitation = (id, accepted) => {
    setInvitations((items) => items.map((item) => (item.id === id ? { ...item, status: accepted ? "Accepted" : "Rejected" } : item)));
    setActivity(accepted ? "Invitation accepted. The candidate is now part of the salon team." : "Invitation rejected and retained for the salon owner.");
  };

  const inviteCandidate = (candidate) => {
    const exists = invitations.some((item) => item.candidate === candidate.candidate && item.status === "Requested");
    if (exists) {
      setActivity(`${candidate.candidate} already has a pending invitation.`);
      return;
    }
    setInvitations((items) => [
      {
        id: Date.now(),
        salonName: "Maison Rose Salon",
        candidate: candidate.candidate,
        specialty: candidate.title,
        source: "SALON_PROFILE",
        status: "Requested",
        createdAt: "Just now",
      },
      ...items,
    ]);
    setActivity(`Invitation sent to ${candidate.candidate}. Switch to the candidate view to answer it.`);
  };

  const updateSchedule = (day, index, field, value) => {
    setSchedule((current) => ({
      ...current,
      [day]: current[day].map((period, periodIndex) => periodIndex === index ? { ...period, [field]: value } : period),
    }));
    setActivity(`${day.toLowerCase()} schedule updated locally.`);
  };

  const toggleScheduleDay = (day) => {
    setSchedule((current) => ({
      ...current,
      [day]: current[day].length ? [] : [{ start: "09:00", end: "17:00" }],
    }));
    setActivity(`${day.toLowerCase()} is now ${schedule[day].length ? "a day off" : "a working day"}.`);
  };

  const addSchedulePeriod = (day) => {
    setSchedule((current) => ({ ...current, [day]: [...current[day], { start: "17:00", end: "20:00" }] }));
    setActivity(`A second ${day.toLowerCase()} working period was added.`);
  };

  const markNotificationRead = (id) => {
    setNotifications((items) => items.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const markAllRead = () => {
    setNotifications((items) => items.map((item) => item.roles.includes(role) ? { ...item, read: true } : item));
    setActivity("All notifications for this role are marked as read.");
  };

  const reset = () => {
    setBookings(clone(initialBookings));
    setApplications(clone(initialApplications));
    setHiringPosts(clone(initialHiringPosts));
    setInvitations(clone(initialInvitations));
    setSchedule(clone(initialSchedule));
    setNotifications(clone(initialNotifications));
    setActivity("Prototype data restored to its original state.");
  };

  const roleNotifications = useMemo(() => notifications.filter((item) => item.roles.includes(role)), [notifications, role]);

  return {
    role,
    section,
    sections: prototypeSections[role],
    bookings,
    applications,
    hiringPosts,
    invitations,
    schedule,
    notifications: roleNotifications,
    employees,
    activity,
    setActivity,
    setRole,
    setSection,
    updateBooking,
    applyToPost,
    decideApplication,
    decideInvitation,
    inviteCandidate,
    updateSchedule,
    toggleScheduleDay,
    addSchedulePeriod,
    markNotificationRead,
    markAllRead,
    reset,
  };
}
