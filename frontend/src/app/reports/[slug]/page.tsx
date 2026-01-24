"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import InternationalSupport from "@/components/InternationalSupport";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  AstrologyReport,
  printReport,
  ExtendedAstrologyReport,
} from "@/lib/astrology-reports";

interface LocationSuggestion {
  displayName: string;
  lat: number;
  lon: number;
}

// Static Data for reports
const reportsData: Record<
  string,
  {
    title: string;
    description: string;
    duration: 1 | 3 | 5;
    features: string[];
    icon: string;
    color: string;
    image: string;
  }
> = {
  "1-year-prediction": {
    title: "1 Year Prediction Report",
    description:
      "Navigate the upcoming year with confidence. Get a detailed analysis focusing on Career, Finance, Health, and Relationships.",
    duration: 1,
    icon: "calendar_today",
    color: "from-blue-500 to-cyan-500",
    image: "/images/reports/comprehensive-report.jpg",
    features: [
      "Month-by-month detailed predictions",
      "Career & Finance outlook",
      "Relationship & Health guidance",
      "Personalized remedies & mantras",
    ],
  },
  "3-year-prediction": {
    title: "3 Year Prediction Report",
    description:
      "Plan your medium-term future with comprehensive insights into major life shifts and opportunities.",
    duration: 3,
    icon: "date_range",
    color: "from-purple-500 to-indigo-500",
    image: "/images/reports/career-report.jpg",
    features: [
      "3-year comprehensive roadmap",
      "Major Dasha & Bhukti analysis",
      "Career progression insights",
      "Maximize lucky periods",
    ],
  },
  "5-year-prediction": {
    title: "5 Year Prediction Report",
    description:
      "The ultimate guide to your long-term destiny. Make life-altering decisions with confidence.",
    duration: 5,
    icon: "history",
    color: "from-orange-500 to-red-500",
    image: "/images/reports/relationship-report.jpg",
    features: [
      "Deep-dive 5-year forecast",
      "Life-changing event predictions",
      "Property & Wealth accumulation",
      "Spiritual growth path",
    ],
  },
};

export default function ReportDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const report = reportsData[slug];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingCached, setLoadingCached] = useState(true);

  // Generated report state
  const [generatedReport, setGeneratedReport] =
    useState<AstrologyReport | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [birthCharts, setBirthCharts] = useState<{
    rasi: string | null;
    navamsa: string | null;
  } | null>(null);

  // Location autocomplete
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);

  if (!report) {
    return notFound();
  }

  // Check for cached report on mount
  useEffect(() => {
    if (isSignedIn) {
      checkCachedReport();
    } else {
      setLoadingCached(false);
    }
  }, [isSignedIn]);

  const checkCachedReport = async () => {
    try {
      const response = await fetch("/api/reports/user");
      if (!response.ok) {
        setLoadingCached(false);
        return;
      }
      const data = await response.json();
      // Find a report matching this duration
      const matchingReport = data.reports?.find(
        (r: { reportType: string }) =>
          r.reportType === `${report.duration}-year`,
      );
      if (matchingReport) {
        // Fetch the full report
        const fullReportRes = await fetch(`/api/reports/${matchingReport.id}`);
        if (fullReportRes.ok) {
          const fullData = await fullReportRes.json();
          setGeneratedReport(fullData.report.reportData);
          setReportId(fullData.report.id);
          setFromCache(true);
        }
      }
    } catch (error) {
      console.error("Failed to check cached report:", error);
    } finally {
      setLoadingCached(false);
    }
  };

  // Location search
  const searchLocation = useCallback(async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }
    setSearchingLocation(true);
    try {
      const response = await fetch(
        `/api/location-search?q=${encodeURIComponent(query)}`,
      );
      if (response.ok) {
        const data = await response.json();
        setLocationSuggestions(data.results || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Location search error:", error);
    } finally {
      setSearchingLocation(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.location) {
        searchLocation(formData.location);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.location, searchLocation]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setFormData({ ...formData, location: suggestion.displayName });
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (!formData.date || !formData.time || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // For now, use mock birth chart data since we're generating directly
      // In production, this would come from FreeAstrologyAPI
      const mockProfile = {
        dob: formData.date,
        name: formData.name,
        sunSign: "Aries", // This would come from API
        moonSign: "Cancer",
        ascendant: "Leo",
        planetaryHouses: {
          sun: 10,
          moon: 4,
          mars: 7,
          mercury: 10,
          jupiter: 9,
          venus: 11,
          saturn: 5,
          rahu: 3,
          ketu: 9,
        },
        planetarySigns: {
          sun: "Aries",
          moon: "Cancer",
          mars: "Scorpio",
          mercury: "Aries",
          jupiter: "Sagittarius",
          venus: "Gemini",
          saturn: "Capricorn",
          rahu: "Libra",
          ketu: "Aries",
        },
        currentDasha: "Jupiter",
        duration: report.duration,
      };

      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockProfile),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to generate report");
        return;
      }

      // Also fetch birth charts from astrology API
      try {
        const [year, month, day] = formData.date.split("-").map(Number);
        const [hours, minutes] = formData.time.split(":").map(Number);

        const chartsResponse = await fetch("/api/astrology", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: formData.location,
            year,
            month,
            date: day,
            hours,
            minutes,
            seconds: 0,
            name: formData.name,
          }),
        });

        if (chartsResponse.ok) {
          const chartsData = await chartsResponse.json();
          if (chartsData.charts) {
            setBirthCharts({
              rasi: chartsData.charts.rasi || null,
              navamsa: chartsData.charts.navamsa || null,
            });
          }
        }
      } catch (chartError) {
        console.error("Failed to fetch charts:", chartError);
        // Continue without charts
      }

      setGeneratedReport(data.report);
      setReportId(data.reportId);
      setFromCache(data.fromCache);
      toast.success(
        data.fromCache
          ? "Report loaded from cache!"
          : "Report generated successfully!",
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (generatedReport) {
      // Create extended report with all available data
      const extendedReport: ExtendedAstrologyReport = {
        ...generatedReport,
        name: formData.name || undefined,
        birthDetails: formData.date
          ? {
              date: formData.date,
              time: formData.time,
              location: formData.location,
            }
          : undefined,
        charts: birthCharts || undefined,
        // Numerology is now included in generatedReport from server
        // Zodiac relations based on moon sign from mock profile
        // Zodiac relations based on moon sign from mock profile
      };
      printReport(extendedReport);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-linear-to-br from-background via-background to-primary/10`}
        ></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {report.duration} Year Forecast
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                {report.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {report.description}
              </p>
            </div>

            {/* Visual */}
            <div className="relative flex justify-center lg:justify-end">
              <div
                className={`group relative w-72 h-80 rounded-[3rem] p-1 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden border-4 border-transparent bg-linear-to-br ${report.color}`}
              >
                <div className="absolute inset-1 rounded-[2.8rem] overflow-hidden bg-background">
                  <Image
                    src={report.image}
                    alt={report.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generated Report Display */}
      {generatedReport && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <Card className="border-primary/30 bg-linear-to-r from-primary/5 to-background shadow-2xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-primary text-3xl">
                        auto_awesome
                      </span>
                      <h2 className="text-2xl font-serif font-bold">
                        Your {generatedReport.duration} Prediction
                      </h2>
                    </div>
                    <p className="text-muted-foreground">
                      {fromCache
                        ? "Loaded from saved report"
                        : "Generated just now"}{" "}
                      • Years: {generatedReport.years.join(", ")}
                    </p>
                  </div>
                  <Button onClick={handleDownloadPDF} className="gap-2">
                    <span className="material-symbols-outlined">download</span>
                    Download PDF
                  </Button>
                </div>

                {/* Yearly Reports */}
                <div className="space-y-8">
                  {generatedReport.reports.map((yearReport) => (
                    <div
                      key={yearReport.year}
                      className="bg-background border rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`size-10 rounded-full bg-linear-to-br ${report.color} flex items-center justify-center text-white font-bold`}
                        >
                          {yearReport.year.toString().slice(-2)}
                        </span>
                        <div>
                          <h3 className="font-serif font-bold text-xl">
                            {yearReport.year}
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {yearReport.theme} Year
                          </p>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6">
                        {yearReport.overview}
                      </p>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            icon: "work",
                            title: "Career",
                            content: yearReport.career,
                          },
                          {
                            icon: "payments",
                            title: "Finance",
                            content: yearReport.finance,
                          },
                          {
                            icon: "favorite",
                            title: "Health",
                            content: yearReport.health,
                          },
                          {
                            icon: "family_restroom",
                            title: "Family",
                            content: yearReport.family,
                          },
                          {
                            icon: "heart_check",
                            title: "Love",
                            content: yearReport.love,
                          },
                        ].map((section) => (
                          <div
                            key={section.title}
                            className="bg-muted/50 rounded-xl p-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="material-symbols-outlined text-primary text-sm">
                                {section.icon}
                              </span>
                              <h4 className="font-semibold text-sm">
                                {section.title}
                              </h4>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-4">
                              {section.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">
                            lightbulb
                          </span>
                          Advice
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {yearReport.advice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    <strong>Disclaimer:</strong> {generatedReport.disclaimer}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Form Section */}
      {!generatedReport && (
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-primary/10 shadow-2xl shadow-primary/5">
              <CardContent className="p-8 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-serif font-bold mb-2">
                    Generate Your Report
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Enter your birth details for personalized predictions
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Full Name</Label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        person
                      </span>
                      <Input
                        className="pl-12 h-14 bg-background border-border/50 rounded-xl text-base"
                        placeholder="Enter your full name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">
                        Date of Birth *
                      </Label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          calendar_today
                        </span>
                        <Input
                          className="pl-12 h-14 bg-background border-border/50 rounded-xl"
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">
                        Time of Birth *
                      </Label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          schedule
                        </span>
                        <Input
                          className="pl-12 h-14 bg-background border-border/50 rounded-xl"
                          type="time"
                          required
                          value={formData.time}
                          onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-bold">
                      Place of Birth *
                    </Label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        location_on
                      </span>
                      <Input
                        className="pl-12 pr-12 h-14 bg-background border-border/50 rounded-xl"
                        placeholder="Start typing city name..."
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        onFocus={() =>
                          locationSuggestions.length > 0 &&
                          setShowSuggestions(true)
                        }
                        onBlur={() =>
                          setTimeout(() => setShowSuggestions(false), 200)
                        }
                      />
                      {searchingLocation && (
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin">
                          progress_activity
                        </span>
                      )}
                    </div>

                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-background border rounded-xl shadow-lg max-h-60 overflow-auto">
                        {locationSuggestions.map((suggestion) => (
                          <button
                            key={`${suggestion.lat}-${suggestion.lon}`}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-muted transition-colors text-sm flex items-start gap-3"
                            onClick={() => handleLocationSelect(suggestion)}
                          >
                            <span className="material-symbols-outlined text-primary mt-0.5 text-lg">
                              location_on
                            </span>
                            <span className="line-clamp-2">
                              {suggestion.displayName}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className={`w-full h-16 text-lg font-bold rounded-xl shadow-xl shadow-primary/20 gap-3 bg-linear-to-r ${report.color}`}
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">
                          progress_activity
                        </span>
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">
                          auto_awesome
                        </span>
                        Generate {report.duration}-Year Report
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            What's Inside The Report
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {report.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-background p-6 rounded-2xl shadow-sm border border-border/50 flex items-start gap-4"
              >
                <span
                  className={`shrink-0 size-10 rounded-full bg-linear-to-br ${report.color} flex items-center justify-center text-white`}
                >
                  <span className="material-symbols-outlined text-xl">
                    check
                  </span>
                </span>
                <p className="font-medium pt-1.5">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-16 px-6">
          <InternationalSupport />
        </div>
      </section>

      <Footer />
    </main>
  );
}
