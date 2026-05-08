"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type FormData = {
  fullName: string;
  mobile: string;
  district: string;
  studyPlan: string[];
  courseInterest: string[];
  distance: string;
  transportationIssue: string;
  interestLevel: string;
  notInterestedReasons: string[];
  otherReason: string;
  preferredContact: string;
  bestTime: string;
};

const initialData: FormData = {
  fullName: "",
  mobile: "",
  district: "",
  studyPlan: [],
  courseInterest: [],
  distance: "",
  transportationIssue: "",
  interestLevel: "",
  notInterestedReasons: [],
  otherReason: "",
  preferredContact: "",
  bestTime: "",
};

const districts = [
  "Kanyakumari", "Tirunelveli", "Thoothukudi", "Tenkasi", "Madurai", "Other",
];

const scienceCourses = [
  "B.Sc Mathematics", "B.Sc Physics", "B.Sc Chemistry", "B.Sc Botany",
  "B.Sc Zoology", "B.Sc Computer Science", "B.Sc Artificial Intelligence & Data Science",
  "B.Sc Costume Design & Fashion",
];

const artsCourses = [
  "B.A English", "B.A Economics", "B.A History", "B.Com Commerce",
  "B.Com Corporate Secretaryship", "BCA", "MSW Interest", "Other",
];

const notInterestedReasonsList = [
  "Too Far", "Prefer Engineering College", "Prefer Another Arts College",
  "Family Decision", "Financial Reasons", "Already Joined Another College",
  "Want Hostel", "Transportation Issue", "Course Not Available",
  "Not Interested in Current Courses", "Friends Going Elsewhere", "Other",
];

export default function SurveyForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileError, setShowMobileError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let sid = localStorage.getItem("hcc_session_id");
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("hcc_session_id", sid);
    }
    const saved = localStorage.getItem("hcc_survey_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.studyPlan === "string") {
          parsed.studyPlan = parsed.studyPlan ? [parsed.studyPlan] : [];
        }
        setFormData(parsed);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("hcc_survey_data", JSON.stringify(formData));
    }
  }, [formData, isMounted]);

  const updateFields = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const toggleArrayItem = (field: "courseInterest" | "notInterestedReasons" | "studyPlan", item: string) => {
    setFormData(prev => {
      const array = prev[field] as string[];
      return {
        ...prev,
        [field]: array.includes(item) ? array.filter(i => i !== item) : [...array, item],
      };
    });
  };

  const syncToSupabase = async (data: FormData) => {
    const sessionId = localStorage.getItem("hcc_session_id");
    if (!sessionId) return;
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sessionId }),
      });
    } catch (err) {
      console.error("Auto-sync failed", err);
    }
  };

  const handleNext = () => {
    if (step === 1 && formData.mobile.length !== 10) {
      setShowMobileError(true);
      return;
    }
    setShowMobileError(false);
    setStep(s => s + 1);
    syncToSupabase(formData);
  };
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const sessionId = localStorage.getItem("hcc_session_id");
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, sessionId }),
      });
      if (res.ok) {
        localStorage.removeItem("hcc_survey_data");
        localStorage.removeItem("hcc_session_id");
        router.push("/thank-you");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Submission failed. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 6;

  const canGoNext = () => {
    if (step === 1) return formData.fullName.length > 2 && formData.mobile.length > 0 && formData.district;
    if (step === 2) return formData.studyPlan.length > 0;
    if (step === 3) return !formData.studyPlan.includes("Arts & Science") || formData.courseInterest.length > 0;
    if (step === 4) return formData.distance && formData.transportationIssue;
    if (step === 5) {
      if (!formData.interestLevel) return false;
      if (formData.interestLevel === "Not Interested") {
        if (formData.notInterestedReasons.length === 0) return false;
        if (formData.notInterestedReasons.includes("Other") && !formData.otherReason) return false;
      }
      return true;
    }
    if (step === 6) {
      if (formData.preferredContact === "Don't Contact") return true;
      return formData.preferredContact && formData.bestTime;
    }
    return true;
  };

  /* ── Shared class helpers ── */
  const choiceClass = (active: boolean) =>
    `hcc-choice w-full${active ? " selected" : ""}`;

  const pillClass = (active: boolean) =>
    `hcc-pill${active ? " selected" : ""}`;

  return (
    <div className="w-full flex flex-col h-full min-h-[450px]">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-hcc-blue dark:text-blue-400 uppercase tracking-wider">
            Step {step} of {totalSteps}
          </span>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {Math.round((step / totalSteps) * 100)}% Completed
          </span>
        </div>
        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: "var(--border-color)" }}>
          <div
            className="bg-hcc-blue h-1.5 rounded-full progress-bar"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-grow overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* ── Step 1: Basic Details ── */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Basic Details</h3>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="hcc-input"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={e => updateFields({ fullName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="hcc-input"
                    placeholder="10-digit mobile number"
                    value={formData.mobile}
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                      updateFields({ mobile: value });
                      if (value.length === 10) setShowMobileError(false);
                    }}
                  />
                  {showMobileError && formData.mobile.length !== 10 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs mt-1.5 text-red-500 font-semibold flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      Please enter a valid 10-digit mobile number
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    District
                  </label>
                  <select
                    className="hcc-input"
                    value={formData.district}
                    onChange={e => updateFields({ district: e.target.value })}
                  >
                    <option value="">Select your district</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* ── Step 2: Study Plans ── */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  What are your future study plans?
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>You can select multiple options.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {["Arts & Science", "Engineering", "Nursing", "Polytechnic", "Abroad Studies", "Not Decided Yet"].map(plan => (
                    <button
                      key={plan}
                      onClick={() => toggleArrayItem("studyPlan", plan)}
                      className={choiceClass(formData.studyPlan.includes(plan))}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 3: Course Interest ── */}
            {step === 3 && (
              <div className="space-y-4">
                {formData.studyPlan.includes("Arts & Science") ? (
                  <>
                    <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                      Select Course Interest
                    </h3>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>You can select multiple courses.</p>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold pb-1 border-b" style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)" }}>
                        Science Courses
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {scienceCourses.map(course => (
                          <button key={course} onClick={() => toggleArrayItem("courseInterest", course)} className={pillClass(formData.courseInterest.includes(course))}>
                            {course}
                          </button>
                        ))}
                      </div>

                      <h4 className="text-sm font-semibold pb-1 border-b mt-4" style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)" }}>
                        Arts & Commerce
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {artsCourses.map(course => (
                          <button key={course} onClick={() => toggleArrayItem("courseInterest", course)} className={pillClass(formData.courseInterest.includes(course))}>
                            {course}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Noted!</h3>
                    <p style={{ color: "var(--text-secondary)" }}>
                      You selected {formData.studyPlan.join(", ")}. Click Next to continue.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 4: Distance ── */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    How far is the college from your home?
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Below 5 KM", "5–15 KM", "15–30 KM", "30–60 KM", "Above 60 KM"].map(dist => (
                      <button key={dist} onClick={() => updateFields({ distance: dist })} className={choiceClass(formData.distance === dist)}>
                        {dist}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    Will transportation distance affect your decision?
                  </h3>
                  <div className="flex gap-2">
                    {["Yes", "No", "Maybe"].map(opt => (
                      <button key={opt} onClick={() => updateFields({ transportationIssue: opt })} className={`${choiceClass(formData.transportationIssue === opt)} flex-1 text-center`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 5: Interest Level ── */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                  How interested are you in joining Holy Cross College?
                </h3>
                <div className="flex flex-col gap-2">
                  {["Very Interested", "Interested", "Need More Information", "Just Exploring", "Not Interested"].map(level => (
                    <button key={level} onClick={() => updateFields({ interestLevel: level })} className={choiceClass(formData.interestLevel === level)}>
                      {level}
                    </button>
                  ))}
                </div>

                {formData.interestLevel === "Not Interested" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 p-4 rounded-xl border"
                    style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)" }}
                  >
                    <p className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
                      Reason for not joining (Select all that apply):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {notInterestedReasonsList.map(reason => (
                        <label key={reason} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-primary)" }}>
                          <input
                            type="checkbox"
                            checked={formData.notInterestedReasons.includes(reason)}
                            onChange={() => toggleArrayItem("notInterestedReasons", reason)}
                            className="rounded accent-hcc-blue"
                          />
                          {reason}
                        </label>
                      ))}
                    </div>
                    {formData.notInterestedReasons.includes("Other") && (
                      <input
                        type="text"
                        placeholder="Please specify…"
                        value={formData.otherReason}
                        onChange={e => updateFields({ otherReason: e.target.value })}
                        className="hcc-input mt-3 text-sm"
                      />
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* ── Step 6: Contact ── */}
            {step === 6 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Final Step</h3>

                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    Preferred contact method:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {["Phone Call", "WhatsApp", "Don't Contact"].map(method => (
                      <button
                        key={method}
                        onClick={() => updateFields({ preferredContact: method })}
                        className={`${choiceClass(formData.preferredContact === method)} flex-1 flex items-center justify-center gap-2`}
                      >
                        {method === "WhatsApp" && (
                          <img src="/whattsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                        )}
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.preferredContact !== "Don't Contact" && (
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                      Best time to contact:
                    </p>
                    <div className="flex gap-2">
                      {["Morning", "Afternoon", "Evening"].map(time => (
                        <button
                          key={time}
                          onClick={() => updateFields({ bestTime: time })}
                          className={`${choiceClass(formData.bestTime === time)} flex-1 text-center`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div
        className="mt-6 pt-4 flex justify-between border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        {step > 1 ? (
          <button
            onClick={handlePrev}
            className="px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={18} /> Back
          </button>
        ) : <div />}

        {step < totalSteps ? (
          <button
            onClick={handleNext}
            disabled={!canGoNext()}
            className="px-6 py-2.5 bg-hcc-blue text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Next <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canGoNext() || isSubmitting}
            className="px-6 py-2.5 bg-hcc-gold text-hcc-dark rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-500 transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? <><Loader2 size={18} className="animate-spin" /> Submitting…</>
              : "Submit Survey"}
          </button>
        )}
      </div>
    </div>
  );
}
