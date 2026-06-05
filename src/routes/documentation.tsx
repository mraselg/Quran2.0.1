import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/documentation")({
  component: DocumentationPage,
  head: () => ({
    meta: [
      { title: "ডকুমেন্টেশন - Studio Al-Qalam" },
      { name: "description", content: "কুরআন পাবলিশার স্টুডিওর ব্যবহার নির্দেশিকা ও ডকুমেন্টেশন।" },
    ],
  }),
});

const sections = [
  { id: "intro", title: "সাধারণ পরিচিতি" },
  { id: "master-template", title: "মাস্টার টেমপ্লেট" },
  { id: "9-line-matrix", title: "৯-লাইন লেআউট ও অ্যাডজাস্টমেন্ট" },
  { id: "advanced-scoping", title: "অ্যাডভান্সড সিলেকশন ও স্কোপিং" },
  { id: "editor", title: "এডিটর মোড" },
  { id: "history", title: "হিস্টরি এবং ডাটাবেজ" },
  { id: "theme", title: "থিম ও লেআউট" },
  { id: "effects", title: "ইফেক্ট কন্ট্রোল - PROAV" },
  { id: "adjustments", title: "অ্যাডজাস্টমেন্ট" },
  { id: "quranic", title: "কুরআনিক এলিমেন্ট" },
  { id: "export", title: "সেটিং ও এক্সপোর্ট" },
];

function DocumentationPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-200 font-sans">
      {/* Sidebar */}
      <div className="w-64 border-r border-neutral-800 bg-neutral-900 p-4 flex flex-col gap-2">
        <h1 className="text-xl font-bold text-amber-400 mb-4 px-2">ডকুমেন্টেশন</h1>
        <nav className="flex flex-col gap-1 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "text-left px-3 py-2 rounded-md transition-colors text-sm",
                activeSection === section.id
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              )}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-10 bg-[radial-gradient(ellipse_at_top,#1c1917_0%,#0a0a0a_70%)]">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          
          {activeSection === "intro" && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold text-white border-b border-neutral-800 pb-4">সাধারণ পরিচিতি (Introduction)</h2>
              <div className="space-y-6 text-neutral-300 leading-relaxed text-lg mt-6">
                <p>
                  কুরআন পাবলিশার স্টুডিও (Quran Publisher Studio) হলো একটি অত্যাধুনিক এবং প্রফেশনাল লেভেলের পাবলিশিং টুল, যা মূলত পবিত্র কুরআন ও ইসলামিক বইসমূহ নির্ভুল এবং সুন্দরভাবে প্রিন্ট-উপযোগী করে তোলার জন্য তৈরি করা হয়েছে। এর মাধ্যমে আপনি সহজেই আরবী ও বাংলা টেক্সট একসাথে বিন্যাস করতে পারবেন।
                </p>
                <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                  <h3 className="text-amber-400 font-bold mb-2">কেন এই সফটওয়্যারটি স্পেশাল?</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>সম্পূর্ণ ডাটাবেজ চালিত ক্লাউড সিঙ্ক এবং লোকাল স্টোরেজ।</li>
                    <li>মাস্টার টেমপ্লেট আর্কিটেকচার যা হাজার পৃষ্ঠার বইকে এক ক্লিকে ডিজাইন করে।</li>
                    <li>অত্যাধুনিক PROAV ইফেক্ট এবং টাইপোগ্রাফি কন্ট্রোল।</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {activeSection === "master-template" && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold text-white border-b border-neutral-800 pb-4">মাস্টার টেমপ্লেট (Master Template)</h2>
              <div className="space-y-6 text-neutral-300 leading-relaxed text-lg">
                <p>
                  এই সফটওয়্যারের মূল ভিত্তি হচ্ছে <strong>মাস্টার টেমপ্লেট আর্কিটেকচার</strong>। এর মানে হলো, আপনাকে প্রতিটি পৃষ্ঠায় গিয়ে আলাদাভাবে ফন্ট সাইজ বা কালার পরিবর্তন করতে হবে না। আপনি শুধু মাস্টার টেমপ্লেট সেটিং পরিবর্তন করবেন, আর তা সম্পূর্ণ প্রজেক্টে প্রয়োগ হয়ে যাবে।
                </p>
                <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800">
                  <h3 className="text-xl font-bold text-amber-400 mb-4">ক্যাসকেডিং ডিজাইন স্কোপ (Cascading Design Scope)</h3>
                  <p className="mb-4">আপনি কোন স্তরে (Scope) ডিজাইন পরিবর্তন করছেন তার উপর ভিত্তি করে এর প্রভাব নির্ধারিত হয়। কীবোর্ডের <strong>Alt + 1 থেকে 5</strong> চেপে এই স্কোপ পরিবর্তন করা যায়:</p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold shrink-0 mt-1">গ্লোবাল (Global)</span>
                      <p>মাস্টার টেমপ্লেটের সর্বোচ্চ স্তর। এখানে কোনো ফন্ট বা কালার পরিবর্তন করলে তা সম্পূর্ণ ৬০০ পৃষ্ঠার কুরআনেই স্বয়ংক্রিয়ভাবে পরিবর্তন হয়ে যাবে।</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm font-bold shrink-0 mt-1">পারা (Para)</span>
                      <p>শুধুমাত্র নির্দিষ্ট একটি পারার ডিজাইনে পরিবর্তন আনতে এটি ব্যবহৃত হয়।</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-bold shrink-0 mt-1">সূরা (Surah)</span>
                      <p>শুধুমাত্র বর্তমান সূরার ডিজাইনে পরিবর্তন আনতে এটি ব্যবহৃত হয়।</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-bold shrink-0 mt-1">পেজ (Page)</span>
                      <p>শুধুমাত্র বর্তমান পৃষ্ঠায় থাকা আয়াতগুলোর স্পেসিং বা লেআউট পরিবর্তন করতে এটি ব্যবহার করুন।</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-bold shrink-0 mt-1">সাধারণ (General/Word)</span>
                      <p>কোনো নির্দিষ্ট শব্দ বা আয়াতের উপর ক্লিক করে শুধুমাত্র সেই নির্দিষ্ট অংশের ডিজাইন পরিবর্তন করতে এটি ব্যবহৃত হয়। এটি মাস্টার টেমপ্লেটের গ্লোবাল সেটিংকে ওভাররাইড করে।</p>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {activeSection === "9-line-matrix" && (
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold text-white border-b border-neutral-800 pb-4">৯-লাইন লেআউট ও অ্যাডজাস্টমেন্ট (9-Line Master Template Guide)</h2>
              <p className="text-lg text-neutral-300 leading-relaxed">
                মাস্টার টেমপ্লেটের সবচেয়ে গুরুত্বপূর্ণ অংশ হলো এর <strong>৯-লাইন স্ট্রাকচার</strong>। স্টুডিওর প্রতি পৃষ্ঠায় ডিফল্টভাবে ৯টি অনুভূমিক সারি বা লাইন থাকে। প্রতিটি লাইনের ভেতরে ৪টি আলাদা স্তর (Layer) থাকে: <strong>Top Symbol, Arabic Text, Bengali Translation, এবং English Translation</strong>।
              </p>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 overflow-hidden">
                <h3 className="text-xl font-bold text-amber-400 mb-4">মাস্টার টেমপ্লেট ও ৯-লাইনের ভিজ্যুয়াল স্ট্রাকচার</h3>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-700 shadow-2xl">
                  <img 
                    src="/docs_screenshot.png" 
                    alt="Master Template Screenshot" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-8">
                <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800">
                  <h3 className="text-2xl font-bold text-emerald-400">অ্যাডজাস্টমেন্ট ম্যাট্রিক্স (The Ultimate Adjustment Matrix)</h3>
                  <p className="text-sm text-neutral-400 mt-2">যেকোনো টেক্সট বা এলিমেন্ট সিলেক্ট করে স্কোপ অনুযায়ী কীভাবে পরিবর্তন করবেন তার সম্পূর্ণ গাইডলাইন।</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-neutral-900 text-neutral-300 text-sm">
                        <th className="p-4 border-b border-neutral-800 font-bold">উপাদান (Element)</th>
                        <th className="p-4 border-b border-neutral-800 font-bold">সিলেকশন (Selection)</th>
                        <th className="p-4 border-b border-neutral-800 font-bold">স্কোপ (Scope)</th>
                        <th className="p-4 border-b border-neutral-800 font-bold">অ্যাডজাস্টমেন্ট ও ফলাফল</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {/* Top Symbol rows */}
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                        <td className="p-4 font-medium text-amber-400" rowSpan={3}>টপ সিম্বল (Top Symbol)</td>
                        <td className="p-4 text-neutral-300">একটি নির্দিষ্ট সিম্বল</td>
                        <td className="p-4 text-emerald-400">General (সাধারণ)</td>
                        <td className="p-4 text-neutral-300">শুধুমাত্র সিলেক্ট করা সিম্বলটির পজিশন (X/Y Offset) বা সাইজ পরিবর্তন হবে। (যেমন: একটি আয়াতের ওয়াকফ চিহ্ন ঠিক করা)।</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                        <td className="p-4 text-neutral-300">সম্পূর্ণ লাইন</td>
                        <td className="p-4 text-cyan-400">Page (পেজ)</td>
                        <td className="p-4 text-neutral-300">ওই পৃষ্ঠার ঐ লাইনের সকল টপ সিম্বলের উচ্চতা বা গ্যাপ একসাথে পরিবর্তিত হবে।</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                        <td className="p-4 text-neutral-300">সম্পূর্ণ লেয়ার</td>
                        <td className="p-4 text-emerald-500">Global (গ্লোবাল)</td>
                        <td className="p-4 text-neutral-300">পুরো বইয়ের সব টপ সিম্বলের ডিফল্ট ফন্ট কালার বা সাইজ পরিবর্তন হবে।</td>
                      </tr>

                      {/* Arabic rows */}
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 bg-neutral-950/30">
                        <td className="p-4 font-medium text-emerald-400" rowSpan={3}>আরবি টেক্সট (Arabic Text)</td>
                        <td className="p-4 text-neutral-300">একটি শব্দ বা হরফ</td>
                        <td className="p-4 text-emerald-400">General (সাধারণ)</td>
                        <td className="p-4 text-neutral-300">নুকতা বা হারাকাত ওভারল্যাপ করলে শুধু ঐ শব্দটিকে Y-Offset দিয়ে উপরে/নিচে নামানো যাবে।</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 bg-neutral-950/30">
                        <td className="p-4 text-neutral-300">সম্পূর্ণ লাইন (Line)</td>
                        <td className="p-4 text-purple-400">Surah (সূরা)</td>
                        <td className="p-4 text-neutral-300">নির্দিষ্ট সূরায় ওই নির্দিষ্ট লাইনের জাস্টিফিকেশন বা Word Spacing পরিবর্তন হবে।</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 bg-neutral-950/30">
                        <td className="p-4 text-neutral-300">সকল লেয়ার</td>
                        <td className="p-4 text-emerald-500">Global (গ্লোবাল)</td>
                        <td className="p-4 text-neutral-300">পুরো বইয়ের আরবি ফন্ট (যেমন- KFGQPC) এবং বেস ফন্ট সাইজ একবারে পরিবর্তন হবে।</td>
                      </tr>

                      {/* Bengali rows */}
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                        <td className="p-4 font-medium text-pink-400" rowSpan={3}>বাংলা অনুবাদ (Bengali Trans)</td>
                        <td className="p-4 text-neutral-300">সিলেক্টেড টেক্সট (Word)</td>
                        <td className="p-4 text-emerald-400">General (সাধারণ)</td>
                        <td className="p-4 text-neutral-300">আরবি আয়াতের পজিশন চেঞ্জ করলে বাংলা লিংকিং এর কারণে এটি অটোমেটিক সরে যাবে। অথবা নির্দিষ্ট শব্দের কালার চেঞ্জ করা যাবে।</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                        <td className="p-4 text-neutral-300">একটি লাইন</td>
                        <td className="p-4 text-cyan-400">Page (পেজ)</td>
                        <td className="p-4 text-neutral-300">পৃষ্ঠার লাইন স্পেসিং কমালে বাংলা অনুবাদের লাইনটিও আরবির সাথে সমন্বয় করে উপরে/নিচে নামবে।</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                        <td className="p-4 text-neutral-300">সম্পূর্ণ লেয়ার</td>
                        <td className="p-4 text-emerald-500">Global (গ্লোবাল)</td>
                        <td className="p-4 text-neutral-300">পুরো বইয়ের বাংলা অনুবাদের ফন্ট (যেমন- Kalpurush) পরিবর্তন হবে।</td>
                      </tr>

                      {/* English rows */}
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 bg-neutral-950/30">
                        <td className="p-4 font-medium text-blue-400" rowSpan={2}>ইংরেজি অনুবাদ (English Trans)</td>
                        <td className="p-4 text-neutral-300">নির্দিষ্ট লাইন</td>
                        <td className="p-4 text-purple-400">Surah (সূরা)</td>
                        <td className="p-4 text-neutral-300">নির্দিষ্ট সূরার ইংরেজি অনুবাদের মার্জিন বা স্পেসিং কমানো/বাড়ানো।</td>
                      </tr>
                      <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 bg-neutral-950/30">
                        <td className="p-4 text-neutral-300">সম্পূর্ণ লেয়ার</td>
                        <td className="p-4 text-emerald-500">Global (গ্লোবাল)</td>
                        <td className="p-4 text-neutral-300">সম্পূর্ণ প্রজেক্টে ইংরেজি ফন্ট অফ/অন করা বা গ্লোবাল স্টাইল সেট করা।</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeSection === "advanced-scoping" && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold text-white border-b border-neutral-800 pb-4">অ্যাডভান্সড সিলেকশন ও স্কোপিং (Advanced Selection & Scoping)</h2>
              <div className="space-y-6 text-neutral-300 leading-relaxed text-lg">
                <p>
                  স্টুডিও আল-কালামের সবচেয়ে শক্তিশালী দিক হলো এর সিলেকশন এবং স্কোপের সমন্বয়। আপনি কোন অংশে পরিবর্তন আনবেন (শব্দ, লাইন, বা সম্পূর্ণ লেয়ার) এবং সেই পরিবর্তন কতটুকু এলাকা জুড়ে প্রভাব ফেলবে (স্কোপ), তা এই দুটি বিষয়ের উপর নির্ভর করে।
                </p>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-6">
                  <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800">
                    <h3 className="text-xl font-bold text-amber-400">সিলেকশন এবং স্কোপ ম্যাট্রিক্স (Selection vs Scope Matrix)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-900 text-neutral-400 text-sm">
                          <th className="p-4 border-b border-neutral-800 font-bold w-1/4">সিলেকশন (Selection)</th>
                          <th className="p-4 border-b border-neutral-800 font-bold w-1/4">স্কোপ (Scope)</th>
                          <th className="p-4 border-b border-neutral-800 font-bold">প্রভাব (Impact) / উদাহরণ</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                          <td className="p-4 font-medium text-amber-400">নির্দিষ্ট শব্দ (Word)</td>
                          <td className="p-4 text-emerald-400 font-medium">সাধারণ (General)</td>
                          <td className="p-4">শুধুমাত্র সিলেক্ট করা শব্দটি পরিবর্তন হবে। উদাহরণ: একটি শব্দের উপরে হারাকাত ওভারল্যাপ হলে শুধু ঐ শব্দটির Y-Offset কমানো।</td>
                        </tr>
                        <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                          <td className="p-4 font-medium text-amber-400">নির্দিষ্ট লাইন (Row/Line)</td>
                          <td className="p-4 text-emerald-400 font-medium">সাধারণ (General)</td>
                          <td className="p-4">শুধুমাত্র সিলেক্ট করা লাইনটি পরিবর্তন হবে। উদাহরণ: নির্দিষ্ট একটি লাইনের শব্দগুলোর মাঝের স্পেস (Word Spacing) কমানো।</td>
                        </tr>
                        <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                          <td className="p-4 font-medium text-amber-400">একাধিক লাইন (Multiple Rows)</td>
                          <td className="p-4 text-cyan-400 font-medium">পেজ (Page)</td>
                          <td className="p-4">ঐ নির্দিষ্ট পৃষ্ঠার সকল লাইনের উপর প্রভাব পড়বে। উদাহরণ: একটি নির্দিষ্ট পৃষ্ঠায় জায়গা কম থাকলে সেই পৃষ্ঠার সকল লাইনের Line Spacing কমানো।</td>
                        </tr>
                        <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                          <td className="p-4 font-medium text-amber-400">সম্পূর্ণ লেয়ার (Layer)</td>
                          <td className="p-4 text-purple-400 font-medium">সূরা (Surah)</td>
                          <td className="p-4">ঐ সূরার শুরু থেকে শেষ পর্যন্ত সকল পৃষ্ঠায় পরিবর্তন হবে। উদাহরণ: নির্দিষ্ট একটি সূরার ফন্ট স্টাইল পরিবর্তন করা।</td>
                        </tr>
                        <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                          <td className="p-4 font-medium text-amber-400">সম্পূর্ণ লেয়ার (Layer)</td>
                          <td className="p-4 text-emerald-500 font-medium">গ্লোবাল (Global)</td>
                          <td className="p-4">বইয়ের প্রথম থেকে শেষ পৃষ্ঠা পর্যন্ত সব জায়গায় পরিবর্তন হবে। উদাহরণ: পুরো বইয়ের আরবী ফন্ট সাইজ একবারে পরিবর্তন করা।</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-4">প্র্যাক্টিকাল উদাহরণ (Practical Scenarios)</h3>
                  <div className="grid gap-4">
                    <div className="p-5 bg-neutral-900/50 rounded-xl border border-neutral-800 border-l-4 border-l-amber-500">
                      <h4 className="font-bold text-amber-400 mb-2">দৃশ্যপট ১: একটি শব্দের হারাকাত ঠিক করা</h4>
                      <p className="text-sm text-neutral-300"><strong>সমস্যা:</strong> ২য় পৃষ্ঠার ৩নং লাইনের একটি শব্দের উপরের যবর আগের লাইনের সাথে লেগে যাচ্ছে।<br/><strong>সমাধান:</strong> সিলেকশন টুল (V) দিয়ে শুধুমাত্র ঐ শব্দটি সিলেক্ট করুন। স্কোপ প্যানেল থেকে <code>সাধারণ (General)</code> সিলেক্ট করুন। এবার ডানদিকের প্রপার্টিজ প্যানেল থেকে Y-Offset একটু নিচে নামিয়ে দিন। এতে শুধু ওই শব্দটিই নিচে নামবে, বাকি পৃষ্ঠার কোনো পরিবর্তন হবে না।</p>
                    </div>
                    
                    <div className="p-5 bg-neutral-900/50 rounded-xl border border-neutral-800 border-l-4 border-l-cyan-500">
                      <h4 className="font-bold text-cyan-400 mb-2">দৃশ্যপট ২: একটি নির্দিষ্ট পৃষ্ঠার লাইন স্পেসিং কমানো</h4>
                      <p className="text-sm text-neutral-300"><strong>সমস্যা:</strong> ৫নং পৃষ্ঠায় একটি আয়াত লেখার জন্য জায়গা কম পড়ছে।<br/><strong>সমাধান:</strong> ঐ পৃষ্ঠার যেকোনো একটি লাইন সিলেক্ট করুন। স্কোপ হিসেবে <code>পেজ (Page)</code> নির্বাচন করুন (কীবোর্ডে Alt+2)। এবার Line Spacing কমালে ওই পৃষ্ঠার সকল লাইনের মাঝের দূরত্ব একসাথে কমে যাবে এবং নতুন আয়াতের জন্য জায়গা তৈরি হবে।</p>
                    </div>

                    <div className="p-5 bg-neutral-900/50 rounded-xl border border-neutral-800 border-l-4 border-l-purple-500">
                      <h4 className="font-bold text-purple-400 mb-2">দৃশ্যপট ৩: নির্দিষ্ট একটি সূরার ফন্ট বড় করা</h4>
                      <p className="text-sm text-neutral-300"><strong>সমস্যা:</strong> সূরা ইয়াসিনের আরবী ফন্ট সাইজ অন্যান্য সূরার চেয়ে একটু বড় দেখাতে চান।<br/><strong>সমাধান:</strong> সূরা ইয়াসিনের যেকোনো পৃষ্ঠায় গিয়ে সম্পূর্ণ আরবী লেয়ারটি সিলেক্ট করুন। স্কোপ হিসেবে <code>সূরা (Surah)</code> নির্বাচন করুন (Alt+3)। এবার ফন্ট সাইজ বাড়ালে শুধুমাত্র সূরা ইয়াসিনের শুরু থেকে শেষ পর্যন্ত ফন্ট বড় হবে।</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "editor" && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold text-white border-b border-neutral-800 pb-4">এডিটর মোড (Editor Mode)</h2>
              <div className="space-y-6 text-neutral-300 leading-relaxed text-lg">
                <p>
                  স্টুডিওতে কাজ করার সময় আপনি মূলত দুটি প্রধান টুলের উপর নির্ভর করবেন: <strong>Type Tool</strong> এবং <strong>Selection Tool</strong>। আপনার কীবোর্ডের শর্টকাট ব্যবহার করে খুব দ্রুত এই টুলগুলোর মাঝে পরিবর্তন করা সম্ভব।
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                    <h3 className="text-amber-400 font-bold mb-2">Type Tool (T)</h3>
                    <p className="text-sm text-neutral-400">কীবোর্ডে 'T' প্রেস করে টাইপ টুল সিলেক্ট করুন। এই টুলের সাহায্যে আপনি যেকোনো টেক্সট বক্সে ক্লিক করে সরাসরি টেক্সট এডিট করতে পারবেন। আরবী বা বাংলা টেক্সট সংশোধন করার জন্য এটি ব্যবহৃত হয়।</p>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                    <h3 className="text-amber-400 font-bold mb-2">Selection Tool (V)</h3>
                    <p className="text-sm text-neutral-400">কীবোর্ডে 'V' প্রেস করে সিলেকশন টুল অ্যাক্টিভ করুন। এটি ব্যবহার করে আপনি আর্টবোর্ডের যেকোনো অবজেক্ট সিলেক্ট করতে, সরাতে (move) এবং রিসাইজ করতে পারবেন।</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "history" && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold text-white border-b border-neutral-800 pb-4">হিস্টরি এবং পার্মানেন্ট ডাটাবেজ (History & Database)</h2>
              <div className="space-y-6 text-neutral-300 leading-relaxed text-lg">
                <p>
                  কাজের কোনো পরিবর্তন হারিয়ে যাওয়ার ভয় আর নেই! সফটওয়্যারটিতে দুই স্তরের হিস্টরি ট্র্যাকিং সিস্টেম রয়েছে।
                </p>
                <ul className="list-disc pl-6 space-y-4">
                  <li>
                    <strong className="text-amber-400">সেশন ইতিহাস (Session History):</strong> 
                    <br/>আপনি এডিটরে প্রবেশ করার পর থেকে যা যা পরিবর্তন করেছেন (যেমন- আয়াত সরানো, ফন্ট পরিবর্তন), তা এখানে সেভ থাকে। আপনি টপ বারের হিস্টরি আইকনে ক্লিক করে অথবা প্রপার্টিজ প্যানেল থেকে আগের অবস্থায় (Undo/Redo) ফিরে যেতে পারবেন।
                  </li>
                  <li>
                    <strong className="text-amber-400">স্থায়ী ইতিহাস (Permanent Audit Log):</strong> 
                    <br/>এটি একটি বিল্ট-ইন SQLite ডাটাবেজ দ্বারা নিয়ন্ত্রিত। সফটওয়্যার ইন্সটল, মাস্টার টেমপ্লেট রিস্টার্ট, অথবা থিম কালার পরিবর্তনের মতো বড় ইভেন্টগুলো এখানে স্থায়ীভাবে লগ করা হয়। সফটওয়্যার বন্ধ করে আবার চালু করলেও এই ইতিহাস ডাটাবেজে সংরক্ষিত থাকে।
                  </li>
                </ul>
              </div>
            </section>
          )}

          {activeSection === "theme" && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold text-white border-b border-neutral-800 pb-4">থিম ও লেআউট (Theme & Layout)</h2>
              <div className="space-y-6 text-neutral-300 leading-relaxed text-lg">
                <p>
                  দীর্ঘ সময় এডিটরে কাজ করার জন্য চোখের সুরক্ষার কথা মাথায় রেখে পুরো সফটওয়্যারটি ডার্ক মোডে ডিজাইন করা হয়েছে। তবে আপনি চাইলে নিজের রুচি অনুযায়ী থিম কাস্টমাইজ করতে পারবেন।
                </p>
                <ul className="list-disc pl-6 space-y-4">
                  <li>
                    <strong className="text-amber-400">প্রাইমারি কালার কাস্টমাইজেশন:</strong> 
                    <br/>হোমপেজের "এডিটর থিম সেটিংস" সেকশন থেকে আপনি সফটওয়্যারের মূল বা প্রাইমারি কালার (যেমন- Amber Glow, Ocean Night, Emerald Forest) পরিবর্তন করতে পারেন। আপনি চাইলে কালার পিকারের মাধ্যমে নিজের পছন্দমতো হেক্স কোডও ব্যবহার করতে পারেন।
                  </li>
                  <li>
                    <strong className="text-amber-400">লেআউট স্পেসিং:</strong> 
                    <br/>আপনার কাজের সুবিধার জন্য এডিটরের লেআউট "Compact" (কম্প্যাক্ট) অথবা "Spacious" (স্পেশিয়াস) মোডে পরিবর্তন করা যায়। স্পেশিয়াস মোডে আর্টবোর্ডের চারপাশে বাড়তি জায়গা থাকে, যা বড় মনিটরে কাজ করার জন্য আরামদায়ক।
                  </li>
                </ul>
              </div>
            </section>
          )}

          {activeSection === "effects" && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold text-white border-b border-neutral-800 pb-4">ইফেক্ট কন্ট্রোল - PROAV (Effect Controls)</h2>
              <div className="space-y-6 text-neutral-300 leading-relaxed text-lg">
                <p>
                  টেক্সট এবং অবজেক্টের ভিজ্যুয়াল কোয়ালিটি উন্নত করার জন্য আমাদের PROAV ইফেক্ট প্যানেল অত্যন্ত কার্যকর। এর সাহায্যে আপনি যেকোনো টেক্সটকে আরও দৃষ্টিনন্দন করে তুলতে পারবেন।
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <strong className="text-white block mb-2">Shadow (শ্যাডো)</strong>
                    <p className="text-sm text-neutral-400">টেক্সটের পেছনে ছায়া যুক্ত করে এর গভীরতা (depth) বাড়াতে শ্যাডো ব্যবহার করা হয়। এটি বিশেষ করে ক্যালিগ্রাফি বা শিরোনামের ক্ষেত্রে দারুণ কাজ করে।</p>
                  </div>
                  <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <strong className="text-white block mb-2">Outer Stroke (আউটার স্ট্রোক)</strong>
                    <p className="text-sm text-neutral-400">লেখার চারপাশে বর্ডার বা আউটলাইন তৈরি করতে আউটার স্ট্রোক ব্যবহৃত হয়। এর ফলে ব্যাকগ্রাউন্ডের সাথে লেখার কনট্রাস্ট বাড়ে এবং লেখাটি স্পষ্ট ফুটে ওঠে।</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "adjustments" && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold text-white border-b border-neutral-800 pb-4">অ্যাডজাস্টমেন্ট (Adjustments)</h2>
              <div className="space-y-6 text-neutral-300 leading-relaxed text-lg">
                <p>
                  কুরআনের মতো সেনসিটিভ টেক্সট বিন্যাসের ক্ষেত্রে সূক্ষ্ম অ্যাডজাস্টমেন্ট খুবই গুরুত্বপূর্ণ। এই প্যানেল থেকে আপনি সম্পূর্ণ প্যারাগ্রাফ এবং লাইনের ফ্লো নিয়ন্ত্রণ করতে পারবেন।
                </p>
                <ul className="list-disc pl-6 space-y-4">
                  <li>
                    <strong className="text-amber-400">Line Spacing:</strong> আরবী হরফের নুকতা ও হারাকাত (যবর, যের, পেশ) অনেক সময় উপরের বা নিচের লাইনের সাথে মিলে যেতে পারে। Line Spacing অ্যাডজাস্ট করে আপনি এই ওভারল্যাপিং রোধ করতে পারেন।
                  </li>
                  <li>
                    <strong className="text-amber-400">Line Breaking ও Paragraph Reflow:</strong> একটি আয়াত যদি আর্টবোর্ডের শেষ প্রান্তে পৌঁছে যায়, তবে Line Breaking ফিচারের মাধ্যমে তা স্বয়ংক্রিয়ভাবে পরের পেজে চলে যাবে।
                  </li>
                  <li>
                    <strong className="text-amber-400">Arabic-Bengali Linking:</strong> এটি একটি অত্যন্ত শক্তিশালী ফিচার, যার মাধ্যমে আরবী আয়াতের সাথে তার বাংলা অর্থকে লিংক করা যায়। আপনি যদি আরবী টেক্সটের সাইজ বা পজিশন পরিবর্তন করেন, তবে লিঙ্ক করা বাংলা অনুবাদও স্বয়ংক্রিয়ভাবে তার স্থান সমন্বয় করে নেবে।
                  </li>
                </ul>
              </div>
            </section>
          )}

          {activeSection === "quranic" && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold text-white border-b border-neutral-800 pb-4">কুরআনিক এলিমেন্ট (Quranic Elements)</h2>
              <div className="space-y-6 text-neutral-300 leading-relaxed text-lg">
                <p>
                  পবিত্র কুরআনের পৃষ্ঠায় কিছু সুনির্দিষ্ট ও ঐতিহ্যবাহী এলিমেন্ট থাকে, যা বসানোর জন্য স্টুডিওতে বিশেষ টুলস দেয়া হয়েছে।
                </p>
                <ul className="list-disc pl-6 space-y-4">
                  <li>
                    <strong className="text-amber-400">Surah Header Drag-and-Drop:</strong> আপনি খুব সহজেই সাইডবার থেকে সূরা হেডার (Surah Header) ড্র্যাগ করে আর্টবোর্ডে ড্রপ করতে পারবেন। এটি স্বয়ংক্রিয়ভাবে সঠিক এলাইনমেন্টে বসে যাবে।
                  </li>
                  <li>
                    <strong className="text-amber-400">Bismillah Box (বিসমিল্লাহ বক্স):</strong> নতুন সূরার শুরুতে একটি সুন্দর ক্যালিগ্রাফিক বিসমিল্লাহ বক্স যোগ করার জন্য ডেডিকেটেড বাটন রয়েছে।
                  </li>
                </ul>
              </div>
            </section>
          )}

          {activeSection === "export" && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-bold text-white border-b border-neutral-800 pb-4">টেমপ্লেট সেটিং ও এক্সপোর্ট (Export)</h2>
              <div className="space-y-6 text-neutral-300 leading-relaxed text-lg">
                <p>
                  ডিজাইন এবং ফরমেটিং শেষে, আপনার প্রজেক্টটি প্রিন্ট বা ডিজিটাল ব্যবহারের জন্য প্রস্তুত করার প্রক্রিয়া হলো টেমপ্লেট সেটিং ও এক্সপোর্ট।
                </p>
                <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                  <h3 className="text-amber-400 font-bold mb-2">Export PDF/PNG (Ctrl+P)</h3>
                  <p className="text-neutral-300">
                    প্রজেক্ট সম্পূর্ণ হওয়ার পর, আপনি কীবোর্ডের <strong>Ctrl+P</strong> শর্টকাট ব্যবহার করে এক্সপোর্ট ডায়ালগ ওপেন করতে পারবেন। এখান থেকে আপনি হাই-রেজুলেশন PDF (প্রিন্টিং এর জন্য) অথবা PNG (ডিজিটাল শেয়ারিং এর জন্য) ফরম্যাটে আপনার ডিজাইনটি এক্সপোর্ট করতে পারবেন।
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
