const employees = [
  { id: "maya", name: "Maya Haddad", initials: "MH", specialty: "Colorist & stylist", status: "Available", bookings: 48, services: 67, rating: 4.9, revenue: 3120, utilization: 86, trend: 12, lastBooking: "Today, 10:30", skills: ["Balayage", "Cut & style", "Bridal"] },
  { id: "lina", name: "Lina Saad", initials: "LS", specialty: "Senior stylist", status: "With a client", bookings: 44, services: 58, rating: 4.8, revenue: 2840, utilization: 81, trend: 8, lastBooking: "Today, 11:15", skills: ["Extensions", "Blowout", "Color"] },
  { id: "noor", name: "Noor Khoury", initials: "NK", specialty: "Nail artist", status: "Available", bookings: 39, services: 52, rating: 4.8, revenue: 2180, utilization: 74, trend: 6, lastBooking: "Today, 09:45", skills: ["Gel nails", "Manicure", "Nail art"] },
  { id: "rayan", name: "Rayan Saleh", initials: "RS", specialty: "Barber & stylist", status: "Break", bookings: 35, services: 46, rating: 4.7, revenue: 1960, utilization: 69, trend: 3, lastBooking: "Yesterday, 17:20", skills: ["Fade", "Beard", "Men's cut"] },
  { id: "sara", name: "Sara Nasser", initials: "SN", specialty: "Beauty therapist", status: "Available", bookings: 31, services: 42, rating: 4.6, revenue: 1720, utilization: 62, trend: -2, lastBooking: "Yesterday, 16:05", skills: ["Facials", "Brows", "Lashes"] },
];

const bookings = [
  { id: "SH-2841", customer: "Dana Al-Khatib", contact: "+962 79 555 0142", time: "Today · 10:30", service: "Balayage & blowout", employee: "Maya Haddad", duration: "2h 15m", amount: 85, status: "Completed", payment: "Paid", rating: 5, created: "2h ago" },
  { id: "SH-2840", customer: "Leen Omar", contact: "leen.omar@email.com", time: "Today · 12:00", service: "Gel manicure", employee: "Noor Khoury", duration: "1h 15m", amount: 28, status: "Accepted", payment: "Pending", rating: null, created: "3h ago" },
  { id: "SH-2839", customer: "Yara Mansour", contact: "+962 78 400 1188", time: "Today · 13:30", service: "Signature facial", employee: "Sara Nasser", duration: "1h", amount: 42, status: "Pending", payment: "Pending", rating: null, created: "4h ago" },
  { id: "SH-2838", customer: "Mariam Taha", contact: "mariam.t@email.com", time: "Today · 15:00", service: "Cut & style", employee: "Lina Saad", duration: "1h 30m", amount: 38, status: "Reschedule awaiting", payment: "Pending", rating: null, created: "Yesterday" },
  { id: "SH-2837", customer: "Hala Qasem", contact: "+962 79 201 4490", time: "Yesterday · 16:00", service: "Bridal trial", employee: "Maya Haddad", duration: "2h", amount: 65, status: "Cancelled", payment: "Refunded", rating: null, created: "Yesterday" },
  { id: "SH-2836", customer: "Nour Ababneh", contact: "nour.a@email.com", time: "Yesterday · 17:30", service: "Men's fade", employee: "Rayan Saleh", duration: "45m", amount: 18, status: "Completed", payment: "Paid", rating: 4, created: "2d ago" },
];

const services = [
  { name: "Balayage & blowout", booked: 82, completed: 76, revenue: 3720, price: 85, duration: "2h 15m", share: 31, trend: 14 },
  { name: "Cut & style", booked: 68, completed: 61, revenue: 2318, price: 38, duration: "1h 30m", share: 19, trend: 8 },
  { name: "Gel manicure", booked: 94, completed: 87, revenue: 2436, price: 28, duration: "1h 15m", share: 20, trend: 21 },
  { name: "Signature facial", booked: 49, completed: 43, revenue: 1806, price: 42, duration: "1h", share: 15, trend: -4 },
];

const reviews = [
  { customer: "Dana Al-Khatib", initials: "DA", rating: 5, service: "Balayage & blowout", employee: "Maya Haddad", comment: "Maya understood exactly what I wanted. The finish was beautiful and the whole visit felt effortless.", date: "Today, 12:10", verified: true },
  { customer: "Nour Ababneh", initials: "NA", rating: 4, service: "Men's fade", employee: "Rayan Saleh", comment: "Great cut and friendly service. I would definitely come back.", date: "Yesterday, 18:20", verified: true },
  { customer: "Jana Khalil", initials: "JK", rating: 5, service: "Gel manicure", employee: "Noor Khoury", comment: "The details are perfect and the studio is so calm.", date: "2 days ago", verified: true },
];

const activity = [
  { icon: "calendar", title: "New booking received", detail: "Yara Mansour requested a signature facial", time: "12 min ago" },
  { icon: "star", title: "New 5-star rating", detail: "Dana rated Maya after a balayage appointment", time: "42 min ago" },
  { icon: "check", title: "Booking completed", detail: "SH-2836 was completed by Rayan Saleh", time: "1h ago" },
  { icon: "user", title: "Schedule updated", detail: "Lina added availability for Thursday", time: "3h ago" },
];

const dayData = [
  { label: "Sat", revenue: 420, bookings: 8 }, { label: "Sun", revenue: 580, bookings: 11 }, { label: "Mon", revenue: 390, bookings: 7 }, { label: "Tue", revenue: 720, bookings: 14 }, { label: "Wed", revenue: 610, bookings: 12 }, { label: "Thu", revenue: 840, bookings: 17 }, { label: "Fri", revenue: 760, bookings: 15 },
];

export function getOwnerDashboard() {
  return { summary: { revenue: 10240, revenueChange: 14.8, completed: 184, completedChange: 9.2, pending: 12, employees: 8, customers: 326, customersChange: 18, rating: 4.8, ratingCount: 238, cancellation: 4.2, averageValue: 55.65 }, dayData, employees, bookings, services, reviews, activity };
}
