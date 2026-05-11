"use client";

import { useState, useRef, useCallback, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

const SERVICES = ["Events", "Weddings", "People", "Brands"] as const;
type Service = (typeof SERVICES)[number];

const SERVICE_KEYS = [
  "serviceEvents",
  "serviceWeddings",
  "servicePeople",
  "serviceBrands",
] as const;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  services: Service[];
  message: string;
}

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  services?: string;
  message?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

function validate(data: FormData, t: ReturnType<typeof useLanguage>["t"]): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.firstName.trim()) errors.firstName = t.errorFirstName;
  if (!data.lastName.trim()) errors.lastName = t.errorLastName;
  if (!data.email.trim()) {
    errors.email = t.errorEmail;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = t.errorEmailInvalid;
  }
  if (data.services.length === 0)
    errors.services = t.errorServices;
  if (!data.message.trim()) errors.message = t.errorMessage;
  return errors;
}

/* ─── Magnetic Submit Button ─── */
function MagneticSubmit({
  disabled,
  status,
  label,
}: {
  disabled: boolean;
  status: Status;
  label: { submit: string; sending: string };
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      ref.current.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    },
    [prefersReduced]
  );

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "translate(0, 0)";
    }
  }, []);

  return (
    <button
      ref={ref}
      type="submit"
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="magnetic-btn w-full md:w-auto px-12 py-3.5 text-xs uppercase tracking-[0.2em] font-medium border border-charcoal text-charcoal disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      style={{ transition: "transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)" }}
    >
      <span>
        {status === "submitting" ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {label.sending}
          </span>
        ) : (
          label.submit
        )}
      </span>
    </button>
  );
}

export default function EnquiryForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    services: [],
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function toggleService(s: Service) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }));
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: undefined }));
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send");

      setStatus("success");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        services: [],
        message: "",
      });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center py-16"
      >
        {/* Animated checkmark */}
        <div className="flex justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              stroke="#5A8A6A"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.path
              d="M15 24l7 7 11-14"
              stroke="#5A8A6A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            />
          </svg>
        </div>
        <p className="font-serif text-2xl md:text-3xl text-charcoal mb-3">
          {t.successTitle}
        </p>
        <p className="text-taupe text-sm tracking-wide mb-10">
          {t.successMessage}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="
            inline-flex items-center gap-2
            text-[0.7rem] uppercase tracking-[0.2em] font-light
            text-taupe hover:text-charcoal
            pb-1 cursor-pointer link-hover
          "
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t.successAnother}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      {/* Name row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
        <div className="mb-8">
          <label
            htmlFor="firstName"
            className="block text-xs uppercase tracking-[0.15em] text-taupe mb-3 font-light"
          >
            {t.formFirstName}
          </label>
          <div className="input-wrap">
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleChange}
              placeholder={t.formFirstNamePlaceholder}
              className="input-editorial"
            />
          </div>
          {errors.firstName && (
            <p className="text-error text-xs mt-2 tracking-wide">
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="mb-8">
          <label
            htmlFor="lastName"
            className="block text-xs uppercase tracking-[0.15em] text-taupe mb-3 font-light"
          >
            {t.formLastName}
          </label>
          <div className="input-wrap">
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={form.lastName}
              onChange={handleChange}
              placeholder={t.formLastNamePlaceholder}
              className="input-editorial"
            />
          </div>
          {errors.lastName && (
            <p className="text-error text-xs mt-2 tracking-wide">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="mb-8">
        <label
          htmlFor="email"
          className="block text-xs uppercase tracking-[0.15em] text-taupe mb-3 font-light"
        >
          {t.formEmail}
        </label>
        <div className="input-wrap">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t.formEmailPlaceholder}
            className="input-editorial"
          />
        </div>
        {errors.email && (
          <p className="text-error text-xs mt-2 tracking-wide">
            {errors.email}
          </p>
        )}
      </div>

      {/* Services */}
      <div className="mb-8">
        <p className="block text-xs uppercase tracking-[0.15em] text-taupe mb-4 font-light">
          {t.formServices}
        </p>
        <div className="flex flex-wrap gap-3">
          {SERVICES.map((s, idx) => (
            <motion.button
              key={s}
              type="button"
              onClick={() => toggleService(s)}
              whileTap={{ scale: 0.95 }}
              className={`pill ${form.services.includes(s) ? "pill-active" : ""}`}
            >
              {t[SERVICE_KEYS[idx]]}
            </motion.button>
          ))}
        </div>
        {errors.services && (
          <p className="text-error text-xs mt-2 tracking-wide">
            {errors.services}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="mb-10">
        <label
          htmlFor="message"
          className="block text-xs uppercase tracking-[0.15em] text-taupe mb-3 font-light"
        >
          {t.formMessage}
        </label>
        <div className="input-wrap">
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder={t.formMessagePlaceholder}
            rows={4}
            className="textarea-editorial"
          />
        </div>
        {errors.message && (
          <p className="text-error text-xs mt-2 tracking-wide">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex flex-col items-center gap-4">
        <MagneticSubmit disabled={status === "submitting"} status={status} label={{ submit: t.formSubmit, sending: t.formSending }} />

        {status === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-error text-xs tracking-wide"
          >
            {t.errorGeneric}
          </motion.p>
        )}
      </div>
    </form>
  );
}
