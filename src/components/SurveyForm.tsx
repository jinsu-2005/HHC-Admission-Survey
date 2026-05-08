"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type FormData = {
  fullName: string;
  mobile: string;
  district: string;
  studyPlan: string;
  courseInterest: string[];
  distance: string;
  transportationIssue: string;
  interestLevel: string;
  notInterestedReasons: string[];
  otherReason: string;
  consent: boolean;
  preferredContact: string;
  bestTime: string;
};

const initialData: FormData = {
  fullName: "",
  mobile: "",
  district: "",
  studyPlan: "",
  courseInterest: [],
  distance: "",
  transportationIssue: "",
  interestLevel: "",
  notInterestedReasons: [],
  otherReason: "",
  consent: false,
  preferredContact: "",
  bestTime: "",
};

const districs = [
  "Kanyakumari", "Tirunelveli", "Thoothukudi", "Tenkasi", "Madurai", "Other"
];

const scienceCourses = [
  "B.Sc Mathematics", "B.Sc Physics", "B.Sc Chemistry", "B.Sc Botany", 
  "B.Sc Zoology", "B.Sc Computer Science", "B.Sc Artificial Intelligence & Data Science", 
  "B.Sc Costume Design & Fashion"
];

const artsCourses = [
  "B.A English", "B.A Economics", "B.A History", "B.Com Commerce", 
  "B.Com Corporate Secretaryship", "BCA", "MSW Interest", "Other"
];

const notInterestedReasonsList = [
  "Too Far", "Prefer Engineering College", "Prefer Another Arts College", 
  "Family Decision", "Financial Reasons", "Already Joined Another College", 
  "Want Hostel", "Transportation Issue", "Course Not Available", 
  "Not Interested in Current Courses", "Friends Going Elsewhere", "Other"
];

export default function SurveyForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("hcc_survey_data");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
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

  const toggleArrayItem = (field: "courseInterest" | "notInterestedReasons", item: string) => {
    setFormData(prev => {
      const array = prev[field];
      if (array.includes(item)) {
        return { ...prev, [field]: array.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...array, item] };
      }
    });
  };

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        localStorage.removeItem("hcc_survey_data");
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
  
  // Custom validation per step
  const canGoNext = () => {
    if (step === 1) return formData.fullName.length > 2 && formData.mobile.length >= 10 && formData.district;
    if (step === 2) return formData.studyPlan;
    if (step === 3) return formData.studyPlan !== "Arts & Science" || formData.courseInterest.length > 0;
    if (step === 4) return formData.distance && formData.transportationIssue;
    if (step === 5) {
      if (!formData.interestLevel) return false;
      if (formData.interestLevel === "Not Interested") {
        if (formData.notInterestedReasons.length === 0) return false;
        if (formData.notInterestedReasons.includes("Other") && !formData.otherReason) return false;
      }
      return true;
    }
    if (step === 6) return formData.consent && formData.preferredContact && formData.bestTime;
    return true;
  };

  return (
    <div className="w-full flex flex-col h-full min-h-[450px]">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-hcc-blue uppercase tracking-wider">Step {step} of {totalSteps}</span>
          <span className="text-xs text-gray-500">{Math.round((step / totalSteps) * 100)}% Completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-hcc-blue h-2 rounded-full progress-bar" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto overflow-x-hidden p-1 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Basic Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input id="fullName" type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-hcc-blue outline-none dark:bg-slate-800 dark:border-slate-600 dark:text-white" placeholder="Enter your name" value={formData.fullName} onChange={e => updateFields({ fullName: e.target.value })} />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
                  <input type="tel" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-hcc-blue outline-none dark:bg-slate-800 dark:border-slate-600 dark:text-white" placeholder="10-digit number" value={formData.mobile} onChange={e => updateFields({ mobile: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-hcc-blue outline-none dark:bg-slate-800 dark:border-slate-600 dark:text-white" value={formData.district} onChange={e => updateFields({ district: e.target.value })}>
                    <option value="">Select District</option>
                    {districs.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What are your future study plans?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Arts & Science", "Engineering", "Nursing", "Polytechnic", "Abroad Studies", "Not Decided Yet"].map(plan => (
                    <button
                      key={plan}
                      onClick={() => updateFields({ studyPlan: plan })}
                      className={`p-3 rounded-xl border text-left transition-all ${formData.studyPlan === plan ? 'border-hcc-blue bg-blue-50 text-hcc-blue font-medium dark:bg-blue-900/30' : 'border-gray-200 hover:border-blue-300 dark:border-slate-700 dark:text-gray-300'}`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {formData.studyPlan === "Arts & Science" ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select Course Interest</h3>
                    <p className="text-xs text-gray-500 mb-4">You can select multiple courses.</p>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Science Courses</h4>
                      <div className="flex flex-wrap gap-2">
                        {scienceCourses.map(course => (
                          <button key={course} onClick={() => toggleArrayItem("courseInterest", course)} className={`px-3 py-1.5 text-sm rounded-full border transition-all ${formData.courseInterest.includes(course) ? 'bg-hcc-blue text-white border-hcc-blue' : 'bg-white text-gray-600 border-gray-300 hover:border-hcc-blue dark:bg-slate-800 dark:text-gray-300 dark:border-slate-600'}`}>
                            {course}
                          </button>
                        ))}
                      </div>
                      
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b pb-1 mt-4">Arts & Commerce</h4>
                      <div className="flex flex-wrap gap-2">
                        {artsCourses.map(course => (
                          <button key={course} onClick={() => toggleArrayItem("courseInterest", course)} className={`px-3 py-1.5 text-sm rounded-full border transition-all ${formData.courseInterest.includes(course) ? 'bg-hcc-blue text-white border-hcc-blue' : 'bg-white text-gray-600 border-gray-300 hover:border-hcc-blue dark:bg-slate-800 dark:text-gray-300 dark:border-slate-600'}`}>
                            {course}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Noted!</h3>
                    <p className="text-gray-600 dark:text-gray-400">You selected {formData.studyPlan}. Click Next to continue.</p>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">How far is the college from your home?</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Below 5 KM", "5–15 KM", "15–30 KM", "30–60 KM", "Above 60 KM"].map(dist => (
                      <button key={dist} onClick={() => updateFields({ distance: dist })} className={`p-2 text-sm rounded-lg border transition-all ${formData.distance === dist ? 'border-hcc-blue bg-blue-50 text-hcc-blue font-medium dark:bg-blue-900/30' : 'border-gray-200 hover:border-blue-300 dark:border-slate-700 dark:text-gray-300'}`}>
                        {dist}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Will transportation distance affect your decision?</h3>
                  <div className="flex gap-3">
                    {["Yes", "No", "Maybe"].map(opt => (
                      <button key={opt} onClick={() => updateFields({ transportationIssue: opt })} className={`flex-1 p-2 rounded-lg border transition-all ${formData.transportationIssue === opt ? 'border-hcc-blue bg-blue-50 text-hcc-blue font-medium dark:bg-blue-900/30' : 'border-gray-200 hover:border-blue-300 dark:border-slate-700 dark:text-gray-300'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">How interested are you in joining Holy Cross College?</h3>
                <div className="flex flex-col gap-2 mb-4">
                  {["Very Interested", "Interested", "Need More Information", "Just Exploring", "Not Interested"].map(level => (
                    <button key={level} onClick={() => updateFields({ interestLevel: level })} className={`p-3 text-left rounded-xl border transition-all ${formData.interestLevel === level ? 'border-hcc-blue bg-blue-50 text-hcc-blue font-medium dark:bg-blue-900/30' : 'border-gray-200 hover:border-blue-300 dark:border-slate-700 dark:text-gray-300'}`}>
                      {level}
                    </button>
                  ))}
                </div>

                {formData.interestLevel === "Not Interested" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Reason for not joining (Select all that apply):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {notInterestedReasonsList.map(reason => (
                        <label key={reason} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                          <input type="checkbox" checked={formData.notInterestedReasons.includes(reason)} onChange={() => toggleArrayItem("notInterestedReasons", reason)} className="rounded text-hcc-blue focus:ring-hcc-blue" />
                          {reason}
                        </label>
                      ))}
                    </div>
                    {formData.notInterestedReasons.includes("Other") && (
                      <input type="text" placeholder="Please specify..." value={formData.otherReason} onChange={e => updateFields({ otherReason: e.target.value })} className="mt-3 w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-hcc-blue outline-none dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Final Step</h3>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred contact method:</p>
                  <div className="flex gap-2">
                    {["Phone Call", "WhatsApp", "SMS"].map(method => (
                      <button key={method} onClick={() => updateFields({ preferredContact: method })} className={`flex-1 py-2 text-sm rounded-lg border transition-all ${formData.preferredContact === method ? 'border-hcc-blue bg-blue-50 text-hcc-blue font-medium dark:bg-blue-900/30' : 'border-gray-200 hover:border-blue-300 dark:border-slate-700 dark:text-gray-300'}`}>
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Best time to contact:</p>
                  <div className="flex gap-2">
                    {["Morning", "Afternoon", "Evening"].map(time => (
                      <button key={time} onClick={() => updateFields({ bestTime: time })} className={`flex-1 py-2 text-sm rounded-lg border transition-all ${formData.bestTime === time ? 'border-hcc-blue bg-blue-50 text-hcc-blue font-medium dark:bg-blue-900/30' : 'border-gray-200 hover:border-blue-300 dark:border-slate-700 dark:text-gray-300'}`}>
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.consent} onChange={e => updateFields({ consent: e.target.checked })} className="mt-1 w-5 h-5 rounded text-hcc-blue focus:ring-hcc-blue" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I agree to be contacted regarding admission guidance by the Holy Cross College admission team.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-between">
        {step > 1 ? (
          <button onClick={handlePrev} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800 rounded-xl font-medium flex items-center gap-2 transition-colors">
            <ArrowLeft size={18} /> Back
          </button>
        ) : <div></div>}
        
        {step < totalSteps ? (
          <button 
            onClick={handleNext} 
            disabled={!canGoNext()}
            className="px-6 py-2.5 bg-hcc-blue text-white rounded-xl font-medium flex items-center gap-2 hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ArrowRight size={18} />
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={!canGoNext() || isSubmitting}
            className="px-6 py-2.5 bg-hcc-gold text-hcc-dark rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-500 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Submitting</> : "Submit Survey"}
          </button>
        )}
      </div>
    </div>
  );
}
