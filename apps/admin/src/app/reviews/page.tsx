"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../lib/api";
import {
  MessageSquareQuote,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  Clock,
  ShieldCheck,
  Send,
  MessageSquare,
  CornerDownRight,
  ExternalLink,
  Filter,
} from "lucide-react";

interface AdminReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string | null;
  comment: string;
  photos: string[];
  helpfulCount: number;
  adminReply: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isVerifiedPurchase: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  product?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");
  const [actionSuccess, setActionSuccess] = useState<string>("");

  // Fetch reviews with status filter
  const { data: reviewsResponse, isLoading } = useQuery({
    queryKey: ["admin-reviews", selectedStatus],
    queryFn: async () => {
      const params: Record<string, any> = { limit: 50 };
      if (selectedStatus !== "ALL") {
        params.status = selectedStatus;
      }
      return adminApi.get<AdminReview[]>("/reviews/admin", params);
    },
  });

  const reviews: AdminReview[] = reviewsResponse?.data || [];

  // Status update mutation (APPROVE / REJECT)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" | "PENDING" }) => {
      return adminApi.patch(`/reviews/admin/${id}`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setActionSuccess(`Review marked as ${variables.status.toLowerCase()}`);
      setTimeout(() => setActionSuccess(""), 3000);
    },
    onError: (err: any) => {
      setActionError(err.message || "Failed to update review status");
      setTimeout(() => setActionError(""), 3500);
    },
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      return adminApi.post(`/reviews/admin/${id}/reply`, { reply });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setReplyingToId(null);
      setReplyText("");
      setActionSuccess("Artisan team reply posted successfully");
      setTimeout(() => setActionSuccess(""), 3000);
    },
    onError: (err: any) => {
      setActionError(err.message || "Failed to post reply");
      setTimeout(() => setActionError(""), 3500);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminApi.delete(`/reviews/admin/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setActionSuccess("Review permanently removed");
      setTimeout(() => setActionSuccess(""), 3000);
    },
    onError: (err: any) => {
      setActionError(err.message || "Failed to delete review");
      setTimeout(() => setActionError(""), 3500);
    },
  });

  // Statistics
  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;
  const approvedCount = reviews.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = reviews.filter((r) => r.status === "REJECTED").length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-2.5">
            <MessageSquareQuote className="w-6 h-6 text-amber-400" />
            Customer Review Moderation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review customer feedback, verify purchases, moderate spam, and post artisan brand replies.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3 bg-rose-950/60 border border-rose-700/60 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Reviews</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{reviews.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across catalog</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Pending Queue
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Awaiting moderation</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{approvedCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Live on storefront</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400" /> Avg Rating
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{avgRating} / 5.0</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Verified feedback</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" /> Status:
        </span>
        {[
          { label: "All Reviews", value: "ALL", count: reviews.length },
          { label: "Pending", value: "PENDING", count: pendingCount },
          { label: "Approved", value: "APPROVED", count: approvedCount },
          { label: "Rejected", value: "REJECTED", count: rejectedCount },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              selectedStatus === tab.value
                ? "bg-amber-500 text-slate-950 shadow"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedStatus === tab.value
                  ? "bg-slate-950 text-amber-400"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Reviews Queue List */}
      {isLoading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading reviews queue...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <CheckCircle className="w-10 h-10 text-emerald-500/50 mx-auto mb-2" />
          <h3 className="text-base font-serif font-bold text-slate-200 mb-1">Queue Clear</h3>
          <p className="text-xs max-w-sm mx-auto">
            No reviews found matching status &ldquo;{selectedStatus}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const isReplying = replyingToId === rev.id;

            return (
              <div
                key={rev.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition"
              >
                {/* Header row: Product & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-xs">
                      {rev.product?.name ? rev.product.name.charAt(0) : "P"}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>{rev.product?.name || "Product"}</span>
                        {rev.product?.slug && (
                          <a
                            href={`http://localhost:3000/product/${rev.product.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-amber-400 transition"
                            title="View product storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>By {rev.user?.name || "Customer"}</span>
                        <span>•</span>
                        <span className="text-slate-500">{rev.user?.email || ""}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Badges */}
                  <div className="flex items-center gap-2">
                    {rev.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        rev.status === "APPROVED"
                          ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
                          : rev.status === "REJECTED"
                          ? "bg-rose-950/80 border-rose-800 text-rose-300"
                          : "bg-amber-950/80 border-amber-800 text-amber-300"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                </div>

                {/* Rating & Review Body */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    {rev.title && (
                      <h4 className="text-xs font-bold text-slate-100">{rev.title}</h4>
                    )}
                    <span className="text-[10px] text-slate-500 ml-auto">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  {/* Customer Photos */}
                  {rev.photos && Array.isArray(rev.photos) && rev.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {rev.photos.map((photo, i) => (
                        <a
                          key={i}
                          href={photo}
                          target="_blank"
                          rel="noreferrer"
                          className="w-14 h-14 rounded-lg overflow-hidden border border-slate-700 hover:opacity-80 transition relative block"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo}
                            alt={`Review uploaded photo ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Helpful count */}
                  <div className="text-[11px] text-slate-500 pt-1">
                    Helpful votes: <span className="text-slate-300 font-semibold">{rev.helpfulCount || 0}</span>
                  </div>
                </div>

                {/* Admin Reply Section */}
                {rev.adminReply && (
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-900/40 text-xs space-y-1">
                    <div className="text-amber-400 font-semibold text-[11px] flex items-center gap-1.5">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>Artisan Brand Reply (Published)</span>
                    </div>
                    <p className="text-slate-300 italic pl-5">{rev.adminReply}</p>
                  </div>
                )}

                {/* Reply Form (Toggleable) */}
                {isReplying && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 space-y-3">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>Reply as &ldquo;Indigo &amp; Thread Artisan Team&rdquo;</span>
                    </div>
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Thank the customer for supporting Tamil Nadu & Bengal handloom weavers..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingToId(null);
                          setReplyText("");
                        }}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => replyMutation.mutate({ id: rev.id, reply: replyText })}
                        disabled={!replyText.trim() || replyMutation.isPending}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {replyMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3" />
                        )}
                        <span>Post Reply</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    {rev.status !== "APPROVED" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatusMutation.mutate({ id: rev.id, status: "APPROVED" })
                        }
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {rev.status !== "REJECTED" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatusMutation.mutate({ id: rev.id, status: "REJECTED" })
                        }
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold border border-rose-900/50 transition disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setReplyingToId(isReplying ? null : rev.id);
                        setReplyText(rev.adminReply || "");
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>{rev.adminReply ? "Edit Reply" : "Artisan Reply"}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to permanently delete this customer review?")) {
                        deleteMutation.mutate(rev.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Delete review permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
