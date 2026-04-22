import TicketList from "../components/TicketList";

export default function AdminTicketsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Ticket Management</h1>
      <TicketList />
    </div>
  );
}