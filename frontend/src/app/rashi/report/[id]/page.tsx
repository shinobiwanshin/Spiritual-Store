"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PlanetData {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro: string;
  sign: string;
  nakshatra: string;
  house: number;
}

interface FullReport {
  id: string;
  name: string | null;
  birthDetails: {
    date: string;
    time: string;
    location: string;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    timezone: string;
  };
  kundali: {
    moonSign: string;
    moonSignHindi: string;
    nakshatra: string | null;
    charts: {
      rasi: string | null;
      navamsa: string | null;
    };
    planets: PlanetData[] | null;
  };
  recommendations: {
    gemstone: { stone: string; wearing: string } | null;
    rudraksha: { mukhi: string; benefits: string } | null;
  };
  createdAt: string;
}

export default function ReportPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [report, setReport] = useState<FullReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/astrology/report/${reportId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load report");
        return;
      }

      setReport(data.report);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadChart = async (chartUrl: string, filename: string) => {
    try {
      const response = await fetch(chartUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`${filename} downloaded!`);
    } catch {
      window.open(chartUrl, "_blank");
    }
  };

  const printReport = () => {
    window.print();
  };

  const shareReport = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Report link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl animate-spin text-primary">
              progress_activity
            </span>
            <p className="mt-4 text-muted-foreground">
              Loading your Kundali...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-destructive mb-4">
              error
            </span>
            <h2 className="text-2xl font-serif font-bold mb-2">
              Report Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || "This report does not exist"}
            </p>
            <Link href="/rashi">
              <Button>Generate New Kundali</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block text-center py-8 border-b">
        <h1 className="text-3xl font-serif font-bold">AstraSpiritual</h1>
        <p className="text-sm text-muted-foreground">Vedic Astrology Report</p>
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-8 print:py-4 print:bg-white">
        {/* Action Bar - Hidden in print */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 print:hidden">
          <Link href="/rashi">
            <Button variant="ghost" className="gap-2">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Rashi
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={shareReport} className="gap-2">
              <span className="material-symbols-outlined text-sm">share</span>
              Share
            </Button>
            <Button onClick={printReport} className="gap-2">
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              Download PDF
            </Button>
          </div>
        </div>

        {/* Header */}
        <header className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 mb-4 print:hidden">
            जन्म कुंडली • Birth Chart
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
            {report.name
              ? `${report.name}'s Kundali Report`
              : "Vedic Kundali Report"}
          </h1>
          <p className="text-muted-foreground">
            Generated on{" "}
            {new Date(report.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </header>

        {/* Birth Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                calendar_month
              </span>
              Birth Details (जन्म विवरण)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{report.birthDetails.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time of Birth</p>
                <p className="font-medium">{report.birthDetails.time}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Place of Birth</p>
                <p className="font-medium text-sm">
                  {report.birthDetails.location
                    .split(",")
                    .slice(0, 3)
                    .join(", ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Moon Sign Summary */}
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="size-24 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-4xl">
                  nightlight
                </span>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-1">
                  Your Janma Rashi (Moon Sign)
                </p>
                <h3 className="text-3xl font-serif font-bold text-primary mb-2">
                  {report.kundali.moonSignHindi}
                </h3>
                {report.kundali.nakshatra && (
                  <p className="text-muted-foreground">
                    Birth Nakshatra: <strong>{report.kundali.nakshatra}</strong>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {report.kundali.charts.rasi && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-lg">
                    Rasi Chart (राशि चक्र)
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadChart(
                        report.kundali.charts.rasi!,
                        "rasi-chart.svg",
                      )
                    }
                    className="gap-2 print:hidden"
                  >
                    <span className="material-symbols-outlined text-sm">
                      download
                    </span>
                    Download
                  </Button>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center justify-center">
                  <img
                    src={report.kundali.charts.rasi}
                    alt="Rasi Chart"
                    className="w-full max-w-sm"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {report.kundali.charts.navamsa && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-lg">
                    Navamsa Chart (नवांश)
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadChart(
                        report.kundali.charts.navamsa!,
                        "navamsa-chart.svg",
                      )
                    }
                    className="gap-2 print:hidden"
                  >
                    <span className="material-symbols-outlined text-sm">
                      download
                    </span>
                    Download
                  </Button>
                </div>
                <div className="bg-white rounded-xl p-4 flex items-center justify-center">
                  <img
                    src={report.kundali.charts.navamsa}
                    alt="Navamsa Chart"
                    className="w-full max-w-sm"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Planetary Positions */}
        {report.kundali.planets && report.kundali.planets.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  planet
                </span>
                Planetary Positions (ग्रह स्थिति)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Planet</th>
                      <th className="text-left py-3 px-2">Sign</th>
                      <th className="text-left py-3 px-2">Nakshatra</th>
                      <th className="text-left py-3 px-2">House</th>
                      <th className="text-left py-3 px-2">Degree</th>
                      <th className="text-left py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.kundali.planets.map((planet) => (
                      <tr
                        key={planet.name}
                        className="border-b border-border/50"
                      >
                        <td className="py-3 px-2 font-medium">{planet.name}</td>
                        <td className="py-3 px-2">{planet.sign}</td>
                        <td className="py-3 px-2">{planet.nakshatra}</td>
                        <td className="py-3 px-2">{planet.house}</td>
                        <td className="py-3 px-2">
                          {planet.normDegree?.toFixed(2)}°
                        </td>
                        <td className="py-3 px-2">
                          {planet.isRetro === "true" && (
                            <Badge
                              variant="outline"
                              className="text-orange-500 border-orange-500"
                            >
                              Retrograde
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gemstone */}
          {report.recommendations.gemstone && (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-600">
                      diamond
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg">
                    Recommended Gemstone
                  </h3>
                </div>
                <p className="text-xl font-bold text-emerald-600 mb-2">
                  {report.recommendations.gemstone.stone}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>How to wear:</strong>{" "}
                  {report.recommendations.gemstone.wearing}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Rudraksha */}
          {report.recommendations.rudraksha && (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-600">
                      self_improvement
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg">
                    Recommended Rudraksha
                  </h3>
                </div>
                <p className="text-xl font-bold text-amber-600 mb-2">
                  {report.recommendations.rudraksha.mukhi}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Benefits:</strong>{" "}
                  {report.recommendations.rudraksha.benefits}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* CTA */}
        <div className="text-center print:hidden">
          <Link href="/shop">
            <Button size="lg" className="shadow-xl shadow-primary/20 gap-2">
              <span className="material-symbols-outlined">shopping_bag</span>
              Shop Recommended Products
            </Button>
          </Link>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block text-center mt-12 pt-6 border-t text-sm text-muted-foreground">
          <p>Generated by AstraSpiritual • www.astraspiritual.com</p>
          <p>Report ID: {report.id}</p>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
