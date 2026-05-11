"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

const SERVICES = ["Events", "Weddings", "People", "Brands"] as const;
type Service = (typeof SERVICES)[number];

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

function validate(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.firstName.trim()) errors.firstName = "First name is required";
  if (!data.lastName.trim()) errors.lastName = "Last name is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email";
  }
  if (data.services.length === 0)
    errors.services = "Please select at least one service";
  if (!data.message.trim()) errors.message = "Please share some details";
  return errors;
}

export default function EnquiryForm() {
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
    const validationErrors = validate(form);
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
        <p className="font-serif text-2xl md:text-3xl text-charcoal mb-3">
          Thank you
        </p>
        <p className="text-taupe text-sm tracking-wide mb-10">
          We&rsquo;ll be in touch soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="
            inline-flex items-center gap-2
            text-[0.7rem] uppercase tracking-[0.2em] font-light
            text-taupe hover:text-charcoal
            border-b border-border hover:border-charcoal
            pb-1 transition-all duration-300 cursor-pointer
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
          Send another enquiry
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
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Your first name"
            className="input-editorial"
          />
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
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Your last name"
            className="input-editorial"
          />
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
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="input-editorial"
        />
        {errors.email && (
          <p className="text-error text-xs mt-2 tracking-wide">
            {errors.email}
          </p>
        )}
      </div>

      {/* Services */}
      <div className="mb-8">
        <p className="block text-xs uppercase tracking-[0.15em] text-taupe mb-4 font-light">
          How can we help?
        </p>
        <div className="flex flex-wrap gap-3">
          {SERVICES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleService(s)}
              className={`pill ${form.services.includes(s) ? "pill-active" : ""}`}
            >
              {s}
            </button>
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
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Share the details of your enquiry..."
          rows={4}
          className="textarea-editorial"
        />
        {errors.message && (
          <p className="text-error text-xs mt-2 tracking-wide">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex flex-col items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="
            w-full md:w-auto
            px-12 py-3.5
            text-xs uppercase tracking-[0.2em] font-medium
            bg-charcoal text-linen
            border border-charcoal
            transition-all duration-300
            hover:bg-transparent hover:text-charcoal
            disabled:opacity-40 disabled:cursor-not-allowed
            cursor-pointer
          "
        >
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
              Sending
            </span>
          ) : (
            "Submit"
          )}
        </button>

        {status === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-error text-xs tracking-wide"
          >
            Something went wrong. Please try again.
          </motion.p>
        )}
      </div>
    </form>
  );
}
