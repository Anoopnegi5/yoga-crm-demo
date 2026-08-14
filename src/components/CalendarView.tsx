import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTodayDateString } from '../utils/dateUtils';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserX,
  Plus,
  Trash2,
  CalendarX,
  Users
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { 
    clients, 
    attendance, 
    leaves, 
    trainerLeaves,
    markAttendance, 
    deleteAttendanceRecord,
    setIsAddLeaveOpen,
    setIsAddTrainerLeaveOpen,
    deleteTrainerLeave,
    deleteLeave,
    setSelectedClientId
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return getTodayDateString();
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(getTodayDateString());
  };

  const formatDateString = (day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const activeClients = clients.filter(c => c.status !== 'Discontinued');

  // Find attendance and leaves for selected date
  const selectedDateAttendance = attendance.filter(a => a.date === selectedDateStr);
  const selectedDateLeaves = leaves.filter(l => l.startDate ? (selectedDateStr >= l.startDate && selectedDateStr <= (l.endDate || l.startDate)) : l.date === selectedDateStr);
  
  const selectedTrainerLeave = trainerLeaves.find(l => {
    const start = l.startDate || l.date || '';
    const end = l.endDate || start;
    return selectedDateStr >= start && selectedDateStr <= end;
  });

  // Selected date day name short (e.g. "Mon")
  const selectedDateObj = new Date(selectedDateStr + 'T00:00:00');
  const selectedDayShort = daysOfWeek[selectedDateObj.getDay()];

  // Clients scheduled for selected date
  const scheduledClients = activeClients.filter(c => {
    const hasJoined = !c.joiningDate || c.joiningDate <= selectedDateStr;
    const isScheduled = Array.isArray(c.days) && c.days.includes(selectedDayShort);
    const hasAtt = attendance.some(a => a.clientId === c.id && a.date === selectedDateStr);
    return hasJoined && (isScheduled || hasAtt);
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-purple-600" />
            Attendance & Schedule Calendar
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            View daily schedule, trainer leave badges, and mark past or future attendance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddLeaveOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-rose-200 text-rose-700 font-bold text-xs shadow-sm hover:bg-rose-50 transition-all"
          >
            <CalendarX className="w-4 h-4 text-rose-500" />
            + Mark Client Leave
          </button>
          
          <button
            onClick={() => setIsAddTrainerLeaveOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 text-amber-950 font-extrabold text-xs shadow-md hover:bg-amber-300 transition-all"
          >
            <UserX className="w-4 h-4 text-amber-950" />
            + Log Instructor Leave
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar Grid & Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Monthly Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-soft border border-slate-100 space-y-5">
          
          {/* Calendar Month Controls */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-slate-900">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={handleToday}
                className="px-3 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition-colors"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:text-slate-900 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:text-slate-900 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center border-b border-slate-100 pb-2">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-20 sm:h-24 rounded-2xl bg-slate-50/50" />
            ))}

            {/* Month Day Tiles */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = formatDateString(dayNum);
              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === getTodayDateString();

              const dayAtt = attendance.filter(a => a.date === dateStr);
              const dayLeaves = leaves.filter(l => l.startDate ? (dateStr >= l.startDate && dateStr <= (l.endDate || l.startDate)) : l.date === dateStr);
              
              const dayTrainerLeave = trainerLeaves.find(l => {
                const start = l.startDate || l.date || '';
                const end = l.endDate || start;
                return dateStr >= start && dateStr <= end;
              });

              const presentCount = dayAtt.filter(a => a.status === 'Present').length;
              const absentCount = dayAtt.filter(a => a.status === 'Absent').length;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-700 shadow-lg scale-[1.03] z-10'
                      : isToday
                      ? 'bg-purple-50 text-purple-900 border-purple-300 ring-2 ring-purple-300 font-bold'
                      : 'bg-white text-slate-800 border-slate-100 hover:border-purple-200 hover:bg-purple-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {dayNum}
                    </span>

                    {/* Trainer Leave Badge */}
                    {dayTrainerLeave && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-amber-950 font-extrabold text-[9px] uppercase shadow-sm">
                        🧘 T-Leave
                      </span>
                    )}
                  </div>

                  {/* Attendance Indicators */}
                  <div className="space-y-1">
                    {presentCount > 0 && (
                      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center justify-between ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        <span>✓ Present</span>
                        <span>{presentCount}</span>
                      </div>
                    )}

                    {absentCount > 0 && (
                      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center justify-between ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
                      }`}>
                        <span>✕ Absent</span>
                        <span>{absentCount}</span>
                      </div>
                    )}

                    {dayLeaves.length > 0 && (
                      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center justify-between ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                      }`}>
                        <span>🏖️ Leave</span>
                        <span>{dayLeaves.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right 1 Col: Date Inspector & Class Marking Panel */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Date Inspector</h4>
                <p className="text-xs text-purple-700 font-bold mt-0.5">
                  📅 {selectedDateStr} ({selectedDayShort})
                </p>
              </div>

              <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-purple-100 text-purple-800">
                {scheduledClients.length} Sessions Scheduled
              </span>
            </div>

            {/* Trainer Absence Inspector Banner if Trainer Leave on Selected Date */}
            {selectedTrainerLeave && (
              <div className="p-4 rounded-2xl bg-amber-500 text-white space-y-2 border border-amber-400 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs uppercase flex items-center gap-1">
                    <UserX className="w-4 h-4" /> Instructor On Leave Range
                  </span>
                  <button
                    onClick={() => deleteTrainerLeave(selectedTrainerLeave.id)}
                    className="text-[11px] font-bold underline text-white hover:text-amber-100"
                  >
                    Delete Leave
                  </button>
                </div>
                <p className="text-xs font-semibold">
                  Dates: <strong>{selectedTrainerLeave.startDate || selectedTrainerLeave.date} {selectedTrainerLeave.endDate && selectedTrainerLeave.endDate !== (selectedTrainerLeave.startDate || selectedTrainerLeave.date) ? `to ${selectedTrainerLeave.endDate}` : ''}</strong>
                </p>
                <p className="text-xs font-semibold">
                  Reason: <strong>{selectedTrainerLeave.reason}</strong> ({selectedTrainerLeave.status})
                </p>
              </div>
            )}

            {/* Scheduled Clients Attendance Marking */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Scheduled Sessions</h5>

              {scheduledClients.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium py-4 text-center">
                  No sessions scheduled for this day ({selectedDayShort}).
                </p>
              ) : (
                <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                  {scheduledClients.map(client => {
                    const attRecord = attendance.find(a => a.clientId === client.id && a.date === selectedDateStr);
                    const clientLeave = leaves.find(l => l.clientId === client.id && (l.startDate ? (selectedDateStr >= l.startDate && selectedDateStr <= (l.endDate || l.startDate)) : l.date === selectedDateStr));

                    return (
                      <div
                        key={client.id}
                        className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2.5 hover:border-purple-200 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={client.photoUrl}
                              alt={client.name}
                              className="w-9 h-9 rounded-xl object-cover ring-2 ring-purple-100"
                            />
                            <div>
                              <h5 
                                onClick={() => setSelectedClientId(client.id)}
                                className="font-extrabold text-slate-900 text-xs hover:text-purple-600 cursor-pointer"
                              >
                                {client.name}
                              </h5>
                              <p className="text-[11px] text-slate-500 font-medium">⏰ {client.classTime}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => markAttendance(client.id, 'Present', selectedDateStr)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                attRecord?.status === 'Present'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => markAttendance(client.id, 'Absent', selectedDateStr)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                attRecord?.status === 'Absent'
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-slate-200'
                              }`}
                            >
                              Absent
                            </button>
                            {attRecord && (
                              <button
                                onClick={() => deleteAttendanceRecord(attRecord.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Remove Entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {clientLeave && (
                          <div className="text-[11px] font-bold text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-100 flex items-center justify-between">
                            <span>🏖️ Client Leave: {clientLeave.reason}</span>
                            <button
                              onClick={() => deleteLeave(clientLeave.id)}
                              className="text-rose-500 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
