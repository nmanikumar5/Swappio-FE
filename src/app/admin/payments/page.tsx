"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { paymentAdminService } from "@/services/api";

interface Payment {
  _id: string;
  transactionId: string;
  userId?: { _id: string; name?: string; email?: string };
  amount: number;
  status: string;
  paymentMethod?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  orderId?: string;
  refundAmount?: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const result = await paymentAdminService.getAll({ limit: 100 });
      setPayments((result.payments as Payment[]) || []);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast.error("Failed to load payments");
      // Mock data for demo
      setPayments([
        {
          _id: "1",
          transactionId: "TXN-2024-001",
          userId: { _id: "u1", name: "John Doe", email: "john@example.com" },
          amount: 5000,
          status: "completed",
          paymentMethod: "Credit Card",
          description: "Listing promotion",
          createdAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          orderId: "ORD-001",
        },
        {
          _id: "2",
          transactionId: "TXN-2024-002",
          userId: { _id: "u2", name: "Jane Smith", email: "jane@example.com" },
          amount: 3500,
          status: "completed",
          paymentMethod: "Debit Card",
          description: "Premium subscription",
          createdAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          orderId: "ORD-002",
        },
        {
          _id: "3",
          transactionId: "TXN-2024-003",
          userId: {
            _id: "u3",
            name: "Mike Johnson",
            email: "mike@example.com",
          },
          amount: 2000,
          status: "pending",
          paymentMethod: "UPI",
          description: "Featured listing",
          createdAt: new Date().toISOString(),
          orderId: "ORD-003",
        },
        {
          _id: "4",
          transactionId: "TXN-2024-004",
          userId: {
            _id: "u4",
            name: "Sarah Wilson",
            email: "sarah@example.com",
          },
          amount: 4500,
          status: "failed",
          paymentMethod: "Credit Card",
          description: "Service charge",
          createdAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
          orderId: "ORD-004",
        },
        {
          _id: "5",
          transactionId: "TXN-2024-005",
          userId: { _id: "u5", name: "Alex Brown", email: "alex@example.com" },
          amount: 1500,
          status: "refunded",
          paymentMethod: "Debit Card",
          description: "Refund for cancelled listing",
          createdAt: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
          ).toISOString(),
          refundAmount: 1500,
          orderId: "ORD-005",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPayments = () => {
    try {
      const csv = [
        ["Transaction ID", "User", "Email", "Amount", "Status", "Date"],
        ...filteredPayments.map((p) => [
          p.transactionId,
          p.userId?.name || "N/A",
          p.userId?.email || "N/A",
          p.amount,
          p.status,
          new Date(p.createdAt || 0).toLocaleDateString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
      );
      element.setAttribute("download", "payments.csv");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Payments exported successfully");
    } catch (error) {
      console.error("Error exporting payments:", error);
      toast.error("Failed to export payments");
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      !searchQuery ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalPayments: payments.length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    completedPayments: payments.filter((p) => p.status === "success").length,
    completedAmount: payments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter((p) => p.status === "pending").length,
    failedPayments: payments.filter((p) => p.status === "failed").length,
    refundedAmount: payments
      .filter((p) => p.status === "refunded")
      .reduce((sum, p) => sum + (p.refundAmount || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Payments Management
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track and manage all payment transactions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPayments}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => (window.location.href = "/admin")}>
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="mt-2 text-3xl font-bold">
                  ₹{(stats.totalAmount / 100000).toFixed(1)}L
                </p>
                <p className="mt-1 text-xs text-success">
                  +12.5% from last month
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-primary/20">
                <DollarSign className="h-7 w-7 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="mt-2 text-3xl font-bold">
                  ₹{(stats.completedAmount / 100000).toFixed(1)}L
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stats.completedPayments} transactions
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-success/20 to-primary/20">
                <TrendingUp className="h-7 w-7 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending/Failed</p>
                <p className="mt-2 text-3xl font-bold">
                  {stats.pendingPayments + stats.failedPayments}
                </p>
                <p className="mt-1 text-xs text-warning">
                  {stats.pendingPayments} pending, {stats.failedPayments} failed
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-warning/20 to-destructive/20">
                <TrendingDown className="h-7 w-7 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8 gradient-border">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <Card className="gradient-border">
          <CardContent className="p-6">
            {filteredPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="font-semibold">No payments found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex flex-col gap-4 border-b pb-4 last:border-0 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {payment.transactionId}
                          </h3>
                          <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {payment.userId?.name} ({payment.userId?.email})
                            </p>
                            {payment.paymentMethod && (
                              <p>Method: {payment.paymentMethod}</p>
                            )}
                            {payment.description && (
                              <p>Description: {payment.description}</p>
                            )}
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(
                                payment.createdAt || 0
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 md:gap-3">
                      <p className="text-2xl font-bold text-primary">
                        ₹{payment.amount.toLocaleString()}
                      </p>
                      <Badge
                        variant={
                          payment.status === "completed"
                            ? "default"
                            : payment.status === "pending"
                            ? "secondary"
                            : payment.status === "failed"
                            ? "destructive"
                            : "outline"
                        }
                        className="flex items-center gap-1"
                      >
                        {payment.status === "completed" && (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        {payment.status === "pending" && (
                          <Clock className="h-3 w-3" />
                        )}
                        {payment.status === "failed" && (
                          <XCircle className="h-3 w-3" />
                        )}
                        {payment.status}
                      </Badge>
                      {payment.refundAmount && (
                        <p className="text-sm text-destructive">
                          Refund: ₹{payment.refundAmount.toLocaleString()}
                        </p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Details Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md gradient-border">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">
                    Transaction ID
                  </p>
                  <p className="mt-1 font-semibold">
                    {selectedPayment.transactionId}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">User</p>
                  <p className="mt-1 font-semibold">
                    {selectedPayment.userId?.name}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedPayment.userId?.email}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Amount</p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    ₹{selectedPayment.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Status</p>
                  <Badge className="mt-1">{selectedPayment.status}</Badge>
                </div>
                {selectedPayment.paymentMethod && (
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Payment Method
                    </p>
                    <p className="mt-1">{selectedPayment.paymentMethod}</p>
                  </div>
                )}
                {selectedPayment.description && (
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Description
                    </p>
                    <p className="mt-1">{selectedPayment.description}</p>
                  </div>
                )}
                {selectedPayment.createdAt && (
                  <div>
                    <p className="font-medium text-muted-foreground">Date</p>
                    <p className="mt-1">
                      {new Date(selectedPayment.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
