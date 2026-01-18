import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rashiReports } from "@/db/schema";
import { eq } from "drizzle-orm";

// Hindi names for signs
const RASHI_NAMES: Record<string, string> = {
  Aries: "Mesha (मेष)",
  Taurus: "Vrishabha (वृषभ)",
  Gemini: "Mithuna (मिथुन)",
  Cancer: "Karka (कर्क)",
  Leo: "Simha (सिंह)",
  Virgo: "Kanya (कन्या)",
  Libra: "Tula (तुला)",
  Scorpio: "Vrishchika (वृश्चिक)",
  Sagittarius: "Dhanu (धनु)",
  Capricorn: "Makara (मकर)",
  Aquarius: "Kumbha (कुंभ)",
  Pisces: "Meena (मीन)",
};

// Gemstone recommendations by moon sign
const GEMSTONE_RECOMMENDATIONS: Record<
  string,
  { stone: string; wearing: string }
> = {
  Aries: {
    stone: "Red Coral (Moonga)",
    wearing: "Ring finger, Gold setting, Tuesday",
  },
  Taurus: {
    stone: "Diamond (Heera)",
    wearing: "Ring finger, Silver/Platinum, Friday",
  },
  Gemini: {
    stone: "Emerald (Panna)",
    wearing: "Little finger, Gold, Wednesday",
  },
  Cancer: { stone: "Pearl (Moti)", wearing: "Ring finger, Silver, Monday" },
  Leo: { stone: "Ruby (Manik)", wearing: "Ring finger, Gold, Sunday" },
  Virgo: {
    stone: "Emerald (Panna)",
    wearing: "Little finger, Gold, Wednesday",
  },
  Libra: { stone: "Diamond (Heera)", wearing: "Ring finger, Platinum, Friday" },
  Scorpio: {
    stone: "Red Coral (Moonga)",
    wearing: "Ring finger, Gold, Tuesday",
  },
  Sagittarius: {
    stone: "Yellow Sapphire (Pukhraj)",
    wearing: "Index finger, Gold, Thursday",
  },
  Capricorn: {
    stone: "Blue Sapphire (Neelam)",
    wearing: "Middle finger, Panchdhatu, Saturday",
  },
  Aquarius: {
    stone: "Blue Sapphire (Neelam)",
    wearing: "Middle finger, Silver, Saturday",
  },
  Pisces: {
    stone: "Yellow Sapphire (Pukhraj)",
    wearing: "Index finger, Gold, Thursday",
  },
};

// Rudraksha by moon sign
const RUDRAKSHA_RECOMMENDATIONS: Record<
  string,
  { mukhi: string; benefits: string }
> = {
  Aries: { mukhi: "3 Mukhi", benefits: "Removes laziness, boosts confidence" },
  Taurus: { mukhi: "6 Mukhi", benefits: "Enhances willpower and creativity" },
  Gemini: {
    mukhi: "4 Mukhi",
    benefits: "Improves communication and intellect",
  },
  Cancer: { mukhi: "2 Mukhi", benefits: "Promotes harmony and relationships" },
  Leo: {
    mukhi: "1 Mukhi / 12 Mukhi",
    benefits: "Leadership, spiritual growth",
  },
  Virgo: { mukhi: "4 Mukhi", benefits: "Knowledge, focus, and clarity" },
  Libra: { mukhi: "6 Mukhi", benefits: "Balance, creativity, charm" },
  Scorpio: { mukhi: "3 Mukhi", benefits: "Courage, removes past karma" },
  Sagittarius: { mukhi: "5 Mukhi", benefits: "Wisdom, spiritual progress" },
  Capricorn: {
    mukhi: "7 Mukhi",
    benefits: "Prosperity, removes Saturn afflictions",
  },
  Aquarius: { mukhi: "7 Mukhi", benefits: "Fortune, removes obstacles" },
  Pisces: { mukhi: "5 Mukhi", benefits: "Peace, health, and spirituality" },
};

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET report by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Validate UUID format
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { error: "Invalid report ID format" },
        { status: 400 },
      );
    }

    const reports = await db
      .select()
      .from(rashiReports)
      .where(eq(rashiReports.id, id))
      .limit(1);

    if (reports.length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const report = reports[0];
    const moonSign = report.moonSign ?? null;

    // Build comprehensive report
    const fullReport = {
      id: report.id,
      name: report.name,
      birthDetails: {
        date: report.birthDate,
        time: report.birthTime,
        location: report.birthLocation,
        coordinates: {
          latitude: report.latitude,
          longitude: report.longitude,
        },
        timezone: report.timezone,
      },
      kundali: {
        moonSign: moonSign,
        moonSignHindi: moonSign ? RASHI_NAMES[moonSign] || moonSign : null,
        nakshatra: report.nakshatra,
        charts: {
          rasi: report.rasiChartUrl,
          navamsa: report.navamsaChartUrl,
        },
        planets: report.planetsData,
      },
      recommendations: {
        gemstone: moonSign ? GEMSTONE_RECOMMENDATIONS[moonSign] || null : null,
        rudraksha: moonSign
          ? RUDRAKSHA_RECOMMENDATIONS[moonSign] || null
          : null,
      },
      incompleteData: !moonSign,
      createdAt: report.createdAt,
    };

    return NextResponse.json({ report: fullReport });
  } catch (error) {
    console.error(
      "GET report error:",
      (error as Error)?.message || "Unknown error",
    );
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 },
    );
  }
}
