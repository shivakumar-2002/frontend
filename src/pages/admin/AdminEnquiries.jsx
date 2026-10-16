import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  Filter,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Save,
  Gem,
} from 'lucide-react';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';
import { api } from '../../services/api';

export function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected enquiry for inspection/notes
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const loadEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAdminEnquiries({
        status: selectedStatus,
        search: searchTerm,
      });
      if (res.success && res.data) {
        setEnquiries(res.data);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
      setError('Failed to fetch customer enquiries.');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchTerm]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await api.updateEnquiryStatus(enquiryId, newStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
      if (activeEnquiry?.id === enquiryId) {
        setActiveEnquiry((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(`Failed to update enquiry status: ${err.message}`);
    }
  };

  const handleOpenDetail = (enq) => {
    setActiveEnquiry(enq);
    setNotesText(enq.internalNotes || '');
  };

  const handleSaveNotes = async () => {
    if (!activeEnquiry) return;
    try {
      setSavingNotes(true);
      await api.updateEnquiryNotes(activeEnquiry.id, notesText);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === activeEnquiry.id ? { ...e, internalNotes: notesText } : e))
      );
      setActiveEnquiry((prev) => ({ ...prev, internalNotes: notesText }));
      alert('Internal admin notes saved securely in database.');
    } catch (err) {
      alert(`Failed to save notes: ${err.message}`);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-200">
          Customer Enquiries Management
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Track, respond to, and log internal consultation notes for jewellery customer inquiries.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-stone-900 rounded-xl p-4 border border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            placeholder="Search customer name, phone, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Enquiry Statuses</option>
            <option value="NEW">New Submissions</option>
            <option value="CONTACTED">Contacted on WhatsApp / Phone</option>
            <option value="IN_PROGRESS">In Progress (Bespoke CAD / Quote)</option>
            <option value="RESOLVED">Resolved / Order Placed</option>
          </select>
        </div>
      </div>

      {/* Split Grid: Enquiries List (7 cols) + Selected Detail / Notes Drawer (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-8 text-center text-xs text-stone-400">Loading customer enquiries...</div>
          ) : error ? (
            <div className="p-8 text-center text-xs text-red-400">{error}</div>
          ) : enquiries.length > 0 ? (
            <div className="divide-y divide-stone-800">
              {enquiries.map((enq) => {
                const cleanPhone = enq.phone?.replace(/\D/g, '') || '';
                const isSelected = activeEnquiry?.id === enq.id;
                return (
                  <div
                    key={enq.id}
                    onClick={() => handleOpenDetail(enq)}
                    className={`p-4 transition-colors cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? 'bg-amber-950/30 border-l-4 border-amber-500'
                        : 'hover:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-stone-100">
                            {enq.customerName}
                          </strong>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              enq.status === 'NEW'
                                ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                                : enq.status === 'CONTACTED'
                                ? 'bg-blue-950 text-blue-300'
                                : enq.status === 'IN_PROGRESS'
                                ? 'bg-purple-950 text-purple-300'
                                : 'bg-emerald-950 text-emerald-300'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">{enq.phone}</span>
                      </div>

                      <div className="text-[10px] text-stone-500">
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </div>

                    <p className="text-stone-300 line-clamp-2 italic text-[11px]">"{enq.message}"</p>

                    {enq.product && (
                      <div className="text-[10px] text-amber-400/90 font-medium flex items-center gap-1">
                        <Gem className="w-3 h-3" />
                        <span>Product: {enq.product.name}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-stone-500">
              No customer enquiries match current criteria.
            </div>
          )}
        </div>

        {/* Selected Enquiry Detail & Notes (5 Cols) */}
        <div className="lg:col-span-5 bg-stone-900 rounded-2xl border border-stone-800 p-5 sm:p-6 space-y-5 shadow-xl">
          {activeEnquiry ? (
            <div className="space-y-5 text-xs">
              <div className="border-b border-stone-800 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Enquiry Details
                </span>
                <h3 className="text-base font-bold text-stone-100 font-serif">
                  {activeEnquiry.customerName}
                </h3>
                <div className="text-stone-400 text-[11px] mt-0.5">
                  Submitted: {new Date(activeEnquiry.createdAt).toLocaleString('en-IN')}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block font-semibold text-stone-400 mb-1">
                  Update Enquiry Status:
                </label>
                <select
                  value={activeEnquiry.status}
                  onChange={(e) => handleStatusChange(activeEnquiry.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-500 text-xs font-semibold"
                >
                  <option value="NEW">NEW - Needs Attention</option>
                  <option value="CONTACTED">CONTACTED - Reached Out on WhatsApp/Phone</option>
                  <option value="IN_PROGRESS">IN_PROGRESS - Custom CAD / Price Quoting</option>
                  <option value="RESOLVED">RESOLVED - Finished / Order Confirmed</option>
                </select>
              </div>

              {/* Direct Actions */}
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <div className="text-stone-300 font-semibold text-[11px]">Direct Customer Contacts:</div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/91${activeEnquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Namaste ${activeEnquiry.customerName} garu! This is L. Srinivasa Chary from HARI HARA Jewellery Works regarding your jewellery enquiry.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 min-h-[44px] rounded-lg text-xs transition-colors shadow-xs"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Chat on WhatsApp ({activeEnquiry.phone})
                  </a>

                  <a
                    href={`tel:${activeEnquiry.phone.replace(/\D/g, '')}`}
                    className="flex items-center justify-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 py-2.5 px-3 min-h-[44px] rounded-lg text-xs transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    Call Customer Directly
                  </a>
                </div>
              </div>

              {/* Customer's Message */}
              <div>
                <span className="font-semibold text-stone-400 block mb-1">Customer's Message:</span>
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-stone-200 leading-relaxed italic">
                  "{activeEnquiry.message}"
                </div>
              </div>

              {/* Associated Product */}
              {activeEnquiry.product && (
                <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Associated Product Design
                  </span>
                  <div className="font-bold text-stone-100">{activeEnquiry.product.name}</div>
                  <Link
                    to={`/product/${activeEnquiry.product.id}`}
                    target="_blank"
                    className="text-amber-400 hover:underline text-[11px] font-semibold inline-block"
                  >
                    View Product Page →
                  </Link>
                </div>
              )}

              {/* Internal Admin Notes */}
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-stone-300">
                    Internal Admin Notes (Private)
                  </label>
                  <span className="text-[10px] text-stone-500">🔒 Never exposed to customer</span>
                </div>
                <textarea
                  rows="3"
                  placeholder="Record customer budget, grams discussed, showroom visit time, or follow-up notes..."
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-500 text-xs resize-none"
                ></textarea>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingNotes ? 'Saving Notes...' : 'Save Internal Note'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-stone-500 space-y-2">
              <MessageSquare className="w-8 h-8 text-stone-700 mx-auto" />
              <p>Select any enquiry on the left to view full customer request details, update status, and manage private internal notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
