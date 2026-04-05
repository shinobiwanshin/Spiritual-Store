/**
 * Cashfree Payment Gateway (PG) — server-side REST helpers.
 * @see https://docs.cashfree.com/reference/pgcreateorder
 */

const CASHFREE_API_VERSION = "2023-08-01";

export function getCashfreeBaseUrl(): string {
  const mode = process.env.CASHFREE_ENV;
  if (mode === "production") {
    return "https://api.cashfree.com/pg";
  }
  return "https://sandbox.cashfree.com/pg";
}

export function isCashfreeConfigured(): boolean {
  return Boolean(
    process.env.CASHFREE_CLIENT_ID && process.env.CASHFREE_CLIENT_SECRET,
  );
}

export function getAppBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

function cashfreeHeaders(): HeadersInit {
  const id = process.env.CASHFREE_CLIENT_ID;
  const secret = process.env.CASHFREE_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("Cashfree credentials are not configured");
  }
  return {
    "Content-Type": "application/json",
    "x-api-version": CASHFREE_API_VERSION,
    "x-client-id": id,
    "x-client-secret": secret,
  };
}

export interface CreateCashfreeOrderInput {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  orderNote?: string;
  notifyUrl?: string;
}

export interface CashfreeOrderResponse {
  order_id: string;
  payment_session_id: string;
  order_amount: number;
  order_currency: string;
  order_status: string;
}

export async function createCashfreeOrder(
  input: CreateCashfreeOrderInput,
): Promise<CashfreeOrderResponse> {
  const base = getCashfreeBaseUrl();
  const body: Record<string, unknown> = {
    order_id: input.orderId,
    order_amount: input.orderAmount,
    order_currency: input.orderCurrency,
    customer_details: {
      customer_id: input.customerId.slice(0, 50),
      customer_name: sanitizeCustomerName(input.customerName),
      customer_email: input.customerEmail || "customer@example.com",
      customer_phone: input.customerPhone,
    },
    order_meta: {
      return_url: input.returnUrl,
      ...(input.notifyUrl ? { notify_url: input.notifyUrl } : {}),
    },
  };
  if (input.orderNote) {
    body.order_note = input.orderNote.slice(0, 200);
  }

  const res = await fetch(`${base}/orders`, {
    method: "POST",
    headers: cashfreeHeaders(),
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : JSON.stringify(data.type || data.error || data);
    throw new Error(`Cashfree create order failed: ${message}`);
  }

  return data as unknown as CashfreeOrderResponse;
}

function sanitizeCustomerName(name: string): string {
  return name.replace(/[^a-zA-Z0-9\s]/g, "").trim().slice(0, 50) || "Customer";
}

export async function fetchCashfreeOrder(
  orderId: string,
): Promise<Record<string, unknown>> {
  const base = getCashfreeBaseUrl();
  const res = await fetch(`${base}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: cashfreeHeaders(),
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : JSON.stringify(data);
    throw new Error(`Cashfree fetch order failed: ${message}`);
  }
  return data;
}

/** Normalize to 10-digit Indian mobile for Cashfree. */
export function normalizeCustomerPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  let last10 = "";
  if (digits.length === 10) {
    last10 = digits;
  } else if (digits.length === 12 && digits.startsWith("91")) {
    last10 = digits.slice(-10);
  }
  if (last10.length === 10 && last10[0] !== "0") {
    return last10;
  }
  return null;
}

export function amountsMatch(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.02;
}

export function isCashfreeOrderPaid(order: Record<string, unknown>): boolean {
  const status = order.order_status;
  return status === "PAID";
}

export async function fetchFirstCashfreePaymentId(
  orderId: string,
): Promise<string | null> {
  const base = getCashfreeBaseUrl();
  const res = await fetch(
    `${base}/orders/${encodeURIComponent(orderId)}/payments`,
    {
      method: "GET",
      headers: cashfreeHeaders(),
    },
  );
  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as Record<string, unknown>;
  const list = data.payments ?? data;
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }
  const first = list[0] as Record<string, unknown>;
  const pid = first.cf_payment_id ?? first.payment_id;
  return typeof pid === "number" ? String(pid) : typeof pid === "string" ? pid : null;
}

export async function verifyCashfreePayment(
  orderId: string,
  expectedAmount: number,
  userId: string,
): Promise<{ cfPaymentId: string; paidAmount: number }> {
  if (process.env.NODE_ENV !== "production" && orderId.startsWith("mock_cf_")) {
    return {
      cfPaymentId: `mock_pay_${orderId.slice(-24)}`,
      paidAmount: expectedAmount,
    };
  }

  const cfOrder = await fetchCashfreeOrder(orderId);
  const custId = cfOrder.customer_details as
    | { customer_id?: string }
    | undefined;
  if (custId?.customer_id !== userId) {
    throw new Error("Order does not belong to this account");
  }

  const amt = cfOrder.order_amount;
  if (typeof amt !== "number" || !amountsMatch(amt, expectedAmount)) {
    throw new Error("Paid amount does not match expected amount");
  }

  if (!isCashfreeOrderPaid(cfOrder)) {
    throw new Error("Payment is not completed");
  }

  const cfPaymentId =
    (await fetchFirstCashfreePaymentId(orderId)) ?? orderId;

  return {
    cfPaymentId,
    paidAmount: typeof amt === "number" ? amt : expectedAmount,
  };
}
