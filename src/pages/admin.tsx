import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle,
  ChevronDown,
  CheckSquare,
  Square,
  Upload,
  Download,
  X,
  ArrowRight,
  Table,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import EmailDashboard from '../components/Email/EmailDashboard';
import { useStaffSignupLogic } from '../hooks/useStaffSignupLogic';

export default function StaffSignupRequests() {
  const {
    requests,
    filteredRequests,
    loading,
    processingId,
    selectedBranch,
    currentPage,
    totalCount,
    isDropdownOpen,
    searchTerm,
    selectedRequests,
    bulkProcessing,
    checkingExistingUsers,
    showBulkUpload,
    bulkEmails,
    bulkBranch,
    uploadingBulk,
    uploadMethod,
    excelFile,
    parsedData,
    activeTab,
    filteredBranches,
    totalPages,

    // Setters
    setIsDropdownOpen,
    setSearchTerm,
    setShowBulkUpload,
    setBulkEmails,
    setBulkBranch,
    setUploadMethod,
    setActiveTab,

    // Handlers
    checkAllExistingUsers,
    handleProcessRequest,
    handleBulkProcess,
    downloadExcelTemplate,
    handleExcelUpload,
    handleBulkUploadFromExcel,
    handleManualBulkUpload,
    getEmailStatus,
    handleReject,
    handleBranchSelect,
    toggleRequestSelection,
    toggleSelectAll,
    handlePreviousPage,
    handleNextPage,
    getSelectedBranchLabel,
    getBranchDisplayName
  } = useStaffSignupLogic();

  if (loading && requests.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--page)] flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center">
          {/* Multi-Ring Elegant Spinner */}
          <div className="relative w-16 h-16 mb-6">
            {/* Outer Spin Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 border-r-cyan-500/40 animate-spin" style={{ animationDuration: '1.2s' }} />
            {/* Inner Pulse Ring */}
            <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/30 animate-pulse" />
            {/* Inner Spin Ring Counter */}
            <div className="absolute inset-3 rounded-full border border-transparent border-b-cyan-400 border-l-cyan-400/20 animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />
            {/* Center Glow */}
            <div className="absolute inset-5 rounded-full bg-cyan-500/20 animate-pulse" />
          </div>
          
          <p className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-1">Initializing Admin Node</p>
          <p className="text-[var(--t3)] text-[9px] font-medium tracking-[0.1em] font-mono">ESTABLISHING_OPERATIONAL_GATEWAY...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--t1)] p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--p-line)]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-[var(--p)] shadow-[0_0_8px_var(--p-glow)]" />
              <span className="text-[10px] font-bold text-[var(--p)] uppercase tracking-[0.2em]">Operational Access Control</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--t1)]">Staff <span className="text-[var(--p)]">Requests</span></h1>
            <p className="text-xs text-[var(--t3)] mt-1">Manage pending access approvals and node invitations.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[var(--sidebar)] border border-[var(--p-line)] rounded-xl p-1 flex items-center shadow-lg">
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'requests'
                    ? 'bg-[var(--p-dim)] text-[var(--p)] border border-[var(--p-line)]'
                    : 'text-[var(--t4)] hover:text-[var(--t2)]'
                  }`}
              >
                Requests
              </button>
              <button
                onClick={() => setActiveTab('emails')}
                className={`px-6 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'emails'
                    ? 'bg-[var(--p-dim)] text-[var(--p)] border border-[var(--p-line)]'
                    : 'text-[var(--t4)] hover:text-[var(--t2)]'
                  }`}
              >
                Email Logs
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'requests' && (
          <div className="space-y-6 animate-pgIn">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center gap-3 w-full lg:w-auto">
                {/* Branch Filter */}
                <div className="relative z-30">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[var(--sidebar)] border border-[var(--p-line)] rounded-xl shadow-lg hover:border-[var(--p-glow)] text-xs font-bold text-[var(--t2)] w-full lg:w-[240px] justify-between transition-all"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Filter className="w-3.5 h-3.5 text-[var(--p)]" />
                      <span className="truncate uppercase tracking-wider">{getSelectedBranchLabel()}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[var(--t4)] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute top-full left-0 mt-2 w-[280px] bg-[var(--sidebar)] border border-[var(--p-line)] rounded-xl shadow-2xl overflow-hidden z-40 backdrop-blur-xl"
                      >
                        <div className="p-3 border-b border-[var(--p-line)]">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--t4)]" />
                            <input
                              autoFocus
                              type="text"
                              placeholder="FILTER_NODES..."
                              className="w-full pl-9 pr-3 py-2 text-[11px] font-mono bg-[var(--glass)] border border-[var(--p-line)] rounded-lg text-[var(--t1)] placeholder-[var(--t4)] outline-none focus:border-[var(--p)] transition-all"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="max-h-[240px] overflow-y-auto p-1.5 custom-scrollbar">
                          <button
                            onClick={() => handleBranchSelect('all')}
                            className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${selectedBranch === 'all' ? 'bg-[var(--p-dim)] text-[var(--p)]' : 'hover:bg-[var(--glass-h)] text-[var(--t3)]'}`}
                          >
                            All Clusters
                          </button>
                          {filteredBranches.map(branch => (
                            <button
                              key={branch}
                              onClick={() => handleBranchSelect(branch)}
                              className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${selectedBranch === branch ? 'bg-[var(--p-dim)] text-[var(--p)]' : 'hover:bg-[var(--glass-h)] text-[var(--t3)]'}`}
                            >
                              {branch}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Stats Pill */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--glass)] border border-[var(--p-line)] rounded-xl shadow-inner">
                  <span className="text-[10px] font-bold text-[var(--t4)] uppercase tracking-widest">Pending Nodes</span>
                  <div className="w-px h-3 bg-[var(--p-line)]" />
                  <span className="text-xs font-bold text-[var(--p)]">{totalCount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <button
                  onClick={checkAllExistingUsers}
                  disabled={checkingExistingUsers}
                  className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[var(--t3)] bg-[var(--glass)] border border-[var(--p-line)] rounded-xl hover:text-[var(--p)] hover:border-[var(--p)] disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {checkingExistingUsers ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckSquare className="w-3.5 h-3.5" />}
                  Check Duplicates
                </button>
                <button
                  onClick={() => setShowBulkUpload(true)}
                  className="f-btn shimmer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Import Staff
                </button>
              </div>
            </div>

            {/* Bulk Actions Header */}
            {selectedRequests.size > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-[var(--p-dim)] border border-[var(--p-line)] rounded-xl text-[var(--p)] shadow-[0_0_20px_rgba(0, 229, 255,0.05)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--p)] text-[var(--sidebar)] flex items-center justify-center font-bold text-xs">
                    {selectedRequests.size}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs uppercase tracking-wider text-[var(--t1)]">Nodes Selected</span>
                    <button onClick={toggleSelectAll} className="text-[10px] text-[var(--p)] hover:underline text-left mt-0.5">
                      {selectedRequests.size === filteredRequests.length ? 'Deselect All' : 'Select All In View'}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleBulkProcess}
                  disabled={bulkProcessing}
                  className="px-6 py-2.5 bg-[var(--p)] text-[var(--sidebar)] text-xs font-bold uppercase tracking-widest rounded-lg hover:brightness-110 shadow-[0_4px_15px_var(--p-glow)] disabled:opacity-70 transition-all"
                >
                  {bulkProcessing ? 'ORCHESTRATING...' : 'AUTHORIZE_BULK'}
                </button>
              </motion.div>
            )}

            {/* Request List */}
            <div className="glass-card overflow-hidden">
              {filteredRequests.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-[var(--glass)] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--p-line)]">
                    <CheckCircle className="w-8 h-8 text-[var(--t4)] opacity-20" />
                  </div>
                  <h3 className="text-[var(--t1)] font-bold uppercase tracking-widest text-sm">Cluster Synchronized</h3>
                  <p className="text-[var(--t4)] text-[11px] mt-2 font-mono uppercase">NO_PENDING_REQUESTS_DETECTED</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--p-line)]">
                  <div className="bg-[var(--glass)] px-6 py-4 flex items-center gap-4 text-[10px] font-bold text-[var(--t4)] uppercase tracking-[0.2em]">
                    <div className="w-6">
                      <button onClick={toggleSelectAll} className="transition-colors hover:text-[var(--p)]">
                        {selectedRequests.size === filteredRequests.length && filteredRequests.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-[var(--p)]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex-1">User Identification</div>
                    <div className="w-40 hidden sm:block">Branch Cluster</div>
                    <div className="w-32 hidden sm:block">Timestamp</div>
                    <div className="w-28">Status</div>
                    <div className="w-32 text-right">Operations</div>
                  </div>

                  {filteredRequests.map((request) => {
                    const emailStatus = getEmailStatus(request.email);
                    const hasBounced = emailStatus?.status === 'bounced';
                    const isSelected = selectedRequests.has(request.id);

                    return (
                      <div
                        key={request.id}
                        className={`px-6 py-5 flex items-center gap-4 hover:bg-[var(--glass-h)] transition-all group ${isSelected ? 'bg-[var(--p-dim)]/30' : ''}`}
                      >
                        <div className="w-6 flex-shrink-0">
                          <button onClick={() => toggleRequestSelection(request.id)} className={`transition-all ${isSelected ? 'text-[var(--p)]' : 'text-[var(--t4)] group-hover:text-[var(--t2)]'}`}>
                            {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-[var(--t1)] truncate group-hover:text-[var(--p)] transition-colors">{request.email}</p>
                          {request.existingUser?.exists && (
                            <span className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[var(--amber-d)] text-[var(--amber)] border border-[rgba(255,179,0,0.1)]">
                              <Users className="w-3 h-3" /> NODE_CONFLICT
                            </span>
                          )}
                        </div>

                        <div className="w-40 hidden sm:block text-[11px] font-medium text-[var(--t3)] truncate font-mono uppercase tracking-tight">
                          {getBranchDisplayName(request.branch)}
                        </div>

                        <div className="w-32 hidden sm:block text-[11px] text-[var(--t4)] font-mono">
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>

                        <div className="w-28">
                          {hasBounced ? (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[var(--red-d)] text-[var(--red)] border border-[rgba(255,77,77,0.1)]">
                              <AlertCircle className="w-2.5 h-2.5" /> BOUNCED
                            </div>
                          ) : emailStatus?.status === 'delivered' ? (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[var(--green-d)] text-[var(--green)] border border-[rgba(0,245,155,0.1)]">
                              <CheckCircle className="w-2.5 h-2.5" /> DELIVERED
                            </div>
                          ) : (
                            <span className="text-[9px] font-bold text-[var(--t4)] uppercase tracking-widest opacity-40">STATION_WAIT</span>
                          )}
                        </div>

                        <div className="w-32 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => handleReject(request.id, request.email)}
                            disabled={processingId === request.id}
                            className="p-2 text-[var(--t4)] hover:text-[var(--red)] hover:bg-[var(--red-d)] rounded-lg transition-all"
                            title="Reject Node"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleProcessRequest(request.id, request.email, request.branch)}
                            disabled={processingId === request.id || hasBounced}
                            className="p-2 text-[var(--p)] hover:bg-[var(--p-dim)] rounded-lg transition-all"
                            title="Authorize Node"
                          >
                            {processingId === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="bg-[var(--glass)] px-6 py-4 border-t border-[var(--p-line)] flex items-center justify-between">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="text-[11px] font-bold uppercase tracking-widest text-[var(--t4)] hover:text-[var(--p)] disabled:opacity-20 transition-all"
                  >
                    PREV_SYS
                  </button>
                  <span className="text-[10px] font-mono text-[var(--t4)] uppercase tracking-widest">SEGMENT {currentPage} / {totalPages}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="text-[11px] font-bold uppercase tracking-widest text-[var(--t4)] hover:text-[var(--p)] disabled:opacity-20 transition-all"
                  >
                    NEXT_SYS
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email Dashboard Tab */}
        {activeTab === 'emails' && (
          <div className="animate-pgIn">
            <EmailDashboard />
          </div>
        )}
      </div>

      {/* Bulk Upload Modal Portal */}
      <AnimatePresence>
        {showBulkUpload && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[var(--page)]/80 backdrop-blur-md"
              onClick={() => setShowBulkUpload(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--sidebar)] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-[var(--p-line)] relative z-10"
            >
              <div className="px-6 py-5 border-b border-[var(--p-line)] flex items-center justify-between bg-[var(--glass)]">
                <div>
                  <h3 className="font-bold text-[var(--t1)] uppercase tracking-widest text-sm">Import Personnel</h3>
                  <p className="text-[9px] text-[var(--t4)] uppercase mt-0.5">BULK_NODE_PROVISIONING</p>
                </div>
                <button onClick={() => setShowBulkUpload(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--glass)] text-[var(--t4)] hover:text-[var(--t1)] transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex bg-[var(--glass)] p-1.5 rounded-xl border border-[var(--p-line)]">
                  <button
                    onClick={() => setUploadMethod('excel')}
                    className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${uploadMethod === 'excel' ? 'bg-[var(--p-dim)] text-[var(--p)] border border-[var(--p-line)] shadow-lg' : 'text-[var(--t4)] hover:text-[var(--t2)]'}`}
                  >
                    EXCEL_FILE
                  </button>
                  <button
                    onClick={() => setUploadMethod('manual')}
                    className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${uploadMethod === 'manual' ? 'bg-[var(--p-dim)] text-[var(--p)] border border-[var(--p-line)] shadow-lg' : 'text-[var(--t4)] hover:text-[var(--t2)]'}`}
                  >
                    MANUAL_INPUT
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--t4)] uppercase tracking-[0.2em] mb-2 pl-1">Default Node Cluster</label>
                    <input
                      type="text"
                      value={bulkBranch}
                      onChange={(e) => setBulkBranch(e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--glass)] border border-[var(--p-line)] rounded-xl text-sm text-[var(--t1)] focus:border-[var(--p)] outline-none transition-all placeholder-[var(--t4)]"
                      placeholder="e.g. HEADQUARTERS_OPS"
                    />
                  </div>

                  {uploadMethod === 'excel' ? (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-[var(--p-line)] rounded-2xl p-12 text-center hover:bg-[var(--glass)] transition-all relative group">
                        <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Upload className="w-10 h-10 text-[var(--p)] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-sm font-bold text-[var(--t1)]">{excelFile ? (excelFile as any).name : 'PROVISION_EXCEL_DATA'}</p>
                        <p className="text-[10px] text-[var(--t4)] mt-2 uppercase tracking-widest font-mono">SUPPORTED: .XLSX / .XLS</p>
                      </div>
                      <button onClick={downloadExcelTemplate} className="text-[10px] font-bold uppercase tracking-widest text-[var(--p)] hover:text-[var(--green)] flex items-center justify-center gap-2 w-full py-2 group transition-all">
                        <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" /> 
                        <span>Download Deployment Template</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--t4)] uppercase tracking-[0.2em] mb-2 pl-1">Node Identification List</label>
                      <textarea
                        value={bulkEmails}
                        onChange={(e) => setBulkEmails(e.target.value)}
                        placeholder="user_a@node.local&#10;user_b@node.local"
                        className="w-full px-4 py-3 bg-[var(--glass)] border border-[var(--p-line)] rounded-xl text-xs h-36 font-mono focus:border-[var(--p)] outline-none transition-all placeholder-[var(--t4)] resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="px-8 py-6 bg-[var(--glass)] border-t border-[var(--p-line)] flex justify-end gap-4">
                <button onClick={() => setShowBulkUpload(false)} className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[var(--t4)] hover:text-[var(--t1)] transition-all">
                  ABORT
                </button>
                <button
                  onClick={uploadMethod === 'excel' ? handleBulkUploadFromExcel : handleManualBulkUpload}
                  disabled={uploadingBulk || !bulkBranch || (uploadMethod === 'excel' ? !parsedData.length : !bulkEmails)}
                  className="px-8 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[var(--sidebar)] bg-[var(--p)] hover:brightness-110 rounded-lg shadow-[0_4px_15px_var(--p-glow)] disabled:opacity-30 transition-all flex items-center gap-3"
                >
                  {uploadingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  EXECUTE_IMPORT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
