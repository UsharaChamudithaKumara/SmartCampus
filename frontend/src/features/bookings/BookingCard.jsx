import { CheckCircle2, Clock, MapPin, Users, Info, XCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const STATUS_CONFIG = {
  PENDING:   { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
  APPROVED:  { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle2 },
  REJECTED:  { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
  CANCELLED: { bg: "bg-slate-100", text: "text-slate-800", icon: XCircle },
};

export default function BookingCard({ booking, isAdmin, onApprove, onReject, onCancel, resources = [] }) {
  const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = config.icon;
  const formatTime = (t) => t ? t.substring(0, 5) : "";

  const resourceMatch = resources.find(r => r.id === booking.resourceId);
  const resourceName = resourceMatch ? resourceMatch.name : booking.resourceId;
  const resourceSubtitle = resourceMatch ? `${resourceMatch.type} — ${resourceMatch.location}` : "";

  const qrData = JSON.stringify({
    id: booking.id,
    resource: resourceName,
    date: booking.date,
    time: `${formatTime(booking.startTime)}-${formatTime(booking.endTime)}`,
    user: booking.userEmail
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Resource</p>
          <p className="text-lg font-bold text-slate-900">{resourceName}</p>
          {resourceSubtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{resourceSubtitle}</p>}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {booking.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 my-2">
        <Detail label="Date" value={booking.date} icon={CalendarIcon} />
        <Detail label="Time" value={`${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}`} icon={ClockIcon} />
        <Detail label="Attendees" value={booking.expectedAttendees} icon={UsersIcon} />
        <Detail label="Booked by" value={booking.userEmail} icon={UserIcon} />
      </div>

      <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <strong className="text-slate-900 mb-1 block">Purpose:</strong>
        {booking.purpose}
      </div>

      {booking.status === "REJECTED" && booking.rejectionReason && (
        <div className="text-sm text-red-700 bg-red-50 p-3 rounded-xl border border-red-100 flex gap-2 items-start mt-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <strong className="block mb-0.5">Rejection reason:</strong> 
            {booking.rejectionReason}
          </div>
        </div>
      )}

      {booking.status === "APPROVED" && (
        <div className="mt-2 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Entry Pass</p>
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <QRCodeSVG value={qrData} size={100} level="M" />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">Scan at entrance for verification</p>
        </div>
      )}

      <div className="flex gap-3 pt-2 mt-auto">
        {isAdmin && booking.status === "PENDING" && (
          <>
            <button 
              onClick={() => onApprove(booking.id)} 
              className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              Approve
            </button>
            <button 
              onClick={() => onReject(booking.id)} 
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              Reject
            </button>
          </>
        )}
        {!isAdmin && booking.status === "APPROVED" && (
          <button 
            onClick={() => onCancel(booking.id)} 
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors border border-slate-200"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="w-4 h-4 text-slate-400 mt-0.5" />}
      <div className="overflow-hidden">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{label}</p>
        <p className="text-sm font-semibold text-slate-800 leading-tight mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

function CalendarIcon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
}
function ClockIcon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
function UsersIcon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
function UserIcon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}