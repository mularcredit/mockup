import { useState } from 'react';
import { Eye, Download, Edit, Briefcase, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { StatusBadge } from './StatusBadge';
import { sendEmail } from '../../../services/email';
import toast from 'react-hot-toast';

interface ApplicationsTableProps {
  applications: any[];
  setSelectedApplication: (app: any) => void;
}

export const ApplicationsTable = ({ applications, setSelectedApplication }: ApplicationsTableProps) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApplicationForSchedule, setSelectedApplicationForSchedule] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    duration: '30',
    interviewType: 'virtual',
    location: '',
    meetingLink: '',
    notes: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination values
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = applications.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getResumeFileName = (application: any) => {
    if (application.resume_file_name) {
      return application.resume_file_name;
    }
    if (application.resume_file_url) {
      const urlParts = application.resume_file_url.split('/');
      return urlParts[urlParts.length - 1];
    }
    return 'resume.pdf';
  };

  const handleOpenScheduleModal = (application: any) => {
    setSelectedApplicationForSchedule(application);
    setScheduleData({
      date: '',
      time: '',
      duration: '30',
      interviewType: 'virtual',
      location: '',
      meetingLink: '',
      notes: ''
    });
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const emailContent = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Interview Scheduled</h2>
          <p>Hello ${selectedApplicationForSchedule.first_name},</p>
          <p>Your interview for <strong>${selectedApplicationForSchedule.position}</strong> has been scheduled.</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Date:</strong> ${scheduleData.date}</p>
            <p><strong>Time:</strong> ${scheduleData.time}</p>
            ${scheduleData.interviewType === 'virtual' ?
          `<p><strong>Meeting Link:</strong> ${scheduleData.meetingLink}</p>` :
          `<p><strong>Location:</strong> ${scheduleData.location}</p>`}
            ${scheduleData.notes ? `<p><strong>Notes:</strong> ${scheduleData.notes}</p>` : ''}
            <p> follow this link to do interview https://recruit-11b6.onrender.com </p>
          </div>
        </div>
      `;

      await sendEmail({
        to: selectedApplicationForSchedule.email,
        subject: `Interview Scheduled for ${selectedApplicationForSchedule.position}`,
        html: emailContent,
      });

      toast.success('Interview scheduled and email sent!');
      setShowScheduleModal(false);
    } catch (error: any) {
      toast.error('Failed to send email: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're at the beginning
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
      {/* Main Table Container - Responsive height based on screen size */}
      <div className="flex flex-col bg-[var(--card)] rounded-xl border border-[var(--p-line)] shadow-sm">
        {/* Header - Fixed height */}
        <div className="flex-shrink-0 p-4 sm:p-5 border-b border-[var(--p-line)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <h2 className="text-base font-bold text-[var(--t1)]">Job Applications</h2>
              <p className="text-[var(--t3)] text-xs">
                Showing {startIndex + 1}-{Math.min(endIndex, applications.length)} of {applications.length} applications
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <GlowButton variant="secondary" icon={Download} size="sm">Export</GlowButton>
            </div>
          </div>
        </div>

        {/* Table Container - Scrollable */}
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-xs min-w-[800px]">
            <thead className="bg-[var(--p-dim)] border-b border-[var(--p-line)] sticky top-0 z-10">
              <tr>
                <th className="text-left py-3 px-4 text-[var(--t2)] font-semibold min-w-[120px] sm:min-w-[160px]">
                  Applicant
                </th>
                <th className="text-left py-3 px-4 text-[var(--t2)] font-semibold min-w-[100px] sm:min-w-[120px]">
                  Position
                </th>
                <th className="text-left py-3 px-4 text-[var(--t2)] font-semibold min-w-[80px] sm:min-w-[100px]">
                  Branch
                </th>
                <th className="text-left py-3 px-4 text-[var(--t2)] font-semibold min-w-[80px] sm:min-w-[100px]">
                  Department
                </th>
                <th className="text-left py-3 px-4 text-[var(--t2)] font-semibold min-w-[70px] sm:min-w-[80px]">
                  Resume
                </th>
                <th className="text-left py-3 px-4 text-[var(--t2)] font-semibold min-w-[70px] sm:min-w-[80px]">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-[var(--t2)] font-semibold min-w-[80px] sm:min-w-[100px]">
                  Date Applied
                </th>
                <th className="text-center py-3 px-4 text-[var(--t2)] font-semibold min-w-[120px] sm:min-w-[140px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentApplications.map((application) => (
                <tr key={application.id} className="border-b border-[var(--p-line)] hover:bg-[var(--p-dim)]/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <p className="text-[var(--t1)] font-semibold text-xs truncate">
                        {application.first_name} {application.last_name}
                      </p>
                      <p className="text-[var(--t3)] text-[10px] truncate">{application.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-[var(--t2)] text-xs truncate" title={application.position || 'N/A'}>
                      {application.position || 'N/A'}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-[var(--t2)] text-xs truncate" title={application.preferred_location || 'N/A'}>
                      {application.preferred_location || 'N/A'}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-[var(--t2)] text-xs truncate" title={application.department || 'N/A'}>
                      {application.department || 'N/A'}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    {application.resume_file_url && (
                      <div className="flex">
                        <button
                          onClick={() => window.open(application.resume_file_url, '_blank')}
                          className="px-2 py-1 bg-[var(--p-dim)] border border-[var(--p-line)] hover:border-[var(--p)] text-[var(--p)] rounded text-[10px] font-bold flex items-center gap-1 whitespace-nowrap transition-all"
                          title="View Resume"
                        >
                          <Eye className="w-3 h-3 flex-shrink-0" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={application.status || 'New'} />
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-[var(--t3)] text-xs">
                      {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-1.5 flex-col sm:flex-row">
                      <GlowButton
                        variant="secondary"
                        icon={Edit}
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                        className="text-xs whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Review</span>
                        <span className="sm:hidden">Rev</span>
                      </GlowButton>
                      <GlowButton
                        variant="secondary"
                        icon={Briefcase}
                        size="sm"
                        onClick={() => handleOpenScheduleModal(application)}
                        className="text-xs whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Schedule</span>
                        <span className="sm:hidden">Sch</span>
                      </GlowButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state for small tables */}
          {applications.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-[var(--t3)] text-xs">No applications found</p>
            </div>
          )}
        </div>

        {/* Pagination - Fixed at bottom */}
        {applications.length > 0 && (
          <div className="flex-shrink-0 border-t border-[var(--p-line)] bg-[var(--card)] px-6 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[var(--t3)]">
                Showing <span className="font-semibold text-[var(--t1)]">{startIndex + 1}</span> to{' '}
                <span className="font-semibold text-[var(--t1)]">{Math.min(endIndex, applications.length)}</span> of{' '}
                <span className="font-semibold text-[var(--t1)]">{applications.length}</span> results
              </div>

              <div className="flex items-center space-x-1.5">
                {/* Previous Button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center p-1.5 rounded-md border border-[var(--p-line)] transition-colors ${currentPage === 1
                    ? 'text-[var(--t3)]/40 cursor-not-allowed'
                    : 'text-[var(--t3)] hover:text-white hover:bg-[var(--p-dim)]'
                    }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`relative inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${currentPage === page
                      ? 'border-[var(--p)] bg-[var(--p-dim)] text-[var(--p)]'
                      : 'border-[var(--p-line)] text-[var(--t3)] hover:text-white hover:bg-[var(--p-dim)]'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center p-1.5 rounded-md border border-[var(--p-line)] transition-colors ${currentPage === totalPages
                    ? 'text-[var(--t3)]/40 cursor-not-allowed'
                    : 'text-[var(--t3)] hover:text-white hover:bg-[var(--p-dim)]'
                    }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal - Fully responsive */}
      {showScheduleModal && selectedApplicationForSchedule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl shadow-xl w-full max-w-md mx-auto max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex-shrink-0 p-6 border-b border-[var(--p-line)]">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white">
                  Schedule Interview
                </h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-[var(--t3)] hover:text-white p-1 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 p-3 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-lg">
                <p className="font-semibold text-white text-xs sm:text-sm">
                  {selectedApplicationForSchedule.first_name} {selectedApplicationForSchedule.last_name}
                </p>
                <p className="text-[10px] text-[var(--t3)] mt-0.5 uppercase tracking-wider font-bold">
                  {selectedApplicationForSchedule.position}
                </p>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-md text-xs text-white focus:outline-none focus:border-[var(--p)] transition-colors"
                      value={scheduleData.date}
                      onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-3.5 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-md text-xs text-white focus:outline-none focus:border-[var(--p)] transition-colors"
                      value={scheduleData.time}
                      onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">
                    Duration
                  </label>
                  <select
                    className="w-full px-3.5 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-md text-xs text-white focus:outline-none focus:border-[var(--p)] transition-colors"
                    value={scheduleData.duration}
                    onChange={(e) => setScheduleData({ ...scheduleData, duration: e.target.value })}
                  >
                    <option value="30" className="bg-[var(--card)]">30 minutes</option>
                    <option value="45" className="bg-[var(--card)]">45 minutes</option>
                    <option value="60" className="bg-[var(--card)]">60 minutes</option>
                    <option value="90" className="bg-[var(--card)]">90 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">
                    Interview Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center text-xs text-[var(--t2)] cursor-pointer">
                      <input
                        type="radio"
                        className="h-4 w-4 accent-[var(--p)] mr-2"
                        checked={scheduleData.interviewType === 'virtual'}
                        onChange={() => setScheduleData({ ...scheduleData, interviewType: 'virtual' })}
                      />
                      Virtual
                    </label>
                    <label className="flex items-center text-xs text-[var(--t2)] cursor-pointer">
                      <input
                        type="radio"
                        className="h-4 w-4 accent-[var(--p)] mr-2"
                        checked={scheduleData.interviewType === 'in-person'}
                        onChange={() => setScheduleData({ ...scheduleData, interviewType: 'in-person' })}
                      />
                      In-Person
                    </label>
                  </div>
                </div>

                {scheduleData.interviewType === 'in-person' ? (
                  <div>
                    <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-md text-xs text-white placeholder-[var(--t3)] focus:outline-none focus:border-[var(--p)] transition-colors"
                      placeholder="Office address or meeting room"
                      value={scheduleData.location}
                      onChange={(e) => setScheduleData({ ...scheduleData, location: e.target.value })}
                      required={scheduleData.interviewType === 'in-person'}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">
                      Meeting Link
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-md text-xs text-white placeholder-[var(--t3)] focus:outline-none focus:border-[var(--p)] transition-colors"
                      placeholder="Zoom, Google Meet, etc."
                      value={scheduleData.meetingLink}
                      onChange={(e) => setScheduleData({ ...scheduleData, meetingLink: e.target.value })}
                      required={scheduleData.interviewType === 'virtual'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-md text-xs text-white placeholder-[var(--t3)] focus:outline-none focus:border-[var(--p)] resize-none transition-colors"
                    placeholder="Any special instructions or agenda items"
                    value={scheduleData.notes}
                    onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                  />
                </div>

                {/* Modal Footer - Fixed */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-[var(--p-line)]">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 border border-[var(--p-line)] text-[var(--t3)] hover:text-white text-xs font-bold rounded-lg hover:bg-[var(--p-dim)] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-4 py-2 bg-gradient-to-r from-[var(--p)] to-blue-600 hover:from-[var(--p-glow)] hover:to-blue-500 text-black text-xs font-black rounded-lg transition-all shadow-[0_0_12px_rgba(0,229,255,0.15)] flex items-center justify-center disabled:opacity-50"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      'Schedule Interview'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};