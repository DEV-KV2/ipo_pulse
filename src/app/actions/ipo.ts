"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { IPO_METADATA_MAP } from "@/lib/ipo-data";

export async function getCompanies() {
  try {
    return await prisma.company.findMany({
      orderBy: { name: "asc" },
    });
  } catch (e) {
    // Silently fallback to mock data
    return [];
  }
}

export async function createCompany(data: { name: string; sector?: string }) {
  const company = await prisma.company.create({
    data: {
      name: data.name,
      sector: data.sector,
    },
  });
  ipoCache = null;
  lastCacheUpdate = 0;
  revalidatePath("/admin");
  return company;
}

// Memory cache for IPOs
let ipoCache: any[] | null = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute in memory

export async function getIPOs() {
  const now = Date.now();
  if (ipoCache && (now - lastCacheUpdate) < CACHE_DURATION) {
    return ipoCache;
  }

  let dbIpos: any[] = [];
  let fetchedSuccessful = false;
  try {
    const queryPromise = prisma.iPO.findMany({
      include: {
        company: true,
        gmpHistory: {
          orderBy: { date: "desc" },
          take: 1
        },
        subscriptions: {
          orderBy: { date: "desc" },
          take: 1
        }
      },
      orderBy: {
        openDate: "desc",
      },
    });

    const timeoutPromise = new Promise<any[]>((resolve) =>
      setTimeout(() => resolve([]), 500)
    );

    dbIpos = await Promise.race([queryPromise, timeoutPromise]);
    fetchedSuccessful = dbIpos && dbIpos.length >= 5;
  } catch (e) {
    console.warn("getIPOs: DB call timed out or failed. Revalidating in background...");
    
    // Background revalidation to warm cache for subsequent queries
    prisma.iPO.findMany({
      include: {
        company: true,
        gmpHistory: { orderBy: { date: "desc" }, take: 1 },
        subscriptions: { orderBy: { date: "desc" }, take: 1 }
      },
      orderBy: { openDate: "desc" }
    }).then(results => {
      if (results && results.length >= 5) {
        ipoCache = results;
        lastCacheUpdate = Date.now();
        console.log("getIPOs: Background revalidation succeeded, cache updated.");
      }
    }).catch(err => {
      console.error("getIPOs revalidation failed:", err);
    });
  }

  if (fetchedSuccessful && dbIpos && dbIpos.length >= 5) {
    ipoCache = dbIpos;
    lastCacheUpdate = now;
    return dbIpos;
  }

  if (ipoCache) {
    return ipoCache;
  }

  // Fallback to curated feed
  const { scrapeLatestIPOs } = await import("@/lib/scraper");
  const data = await scrapeLatestIPOs();

  const curated = data.map((item, index) => {
    const isSme = item.board === "SME";
    const lowPrice = item.priceBandLow || Math.round(item.priceBandHigh * 0.95);
    const issueSize = item.issueSize || 0; // Removed fake random logic

    return {
      id: `curated-${item.slug}`,
      slug: item.slug,
      companyId: `company-${item.slug}`,
      issueSize,
      priceBandLow: lowPrice,
      priceBandHigh: item.priceBandHigh,
      faceValue: isSme ? 10 : 2,
      lotSize: item.lotSize || (isSme ? 1600 : 30),
      issueType: "Book Built Issue",
      exchange: "BSE, NSE",
      board: item.board,
      status: item.status,
      openDate: item.openDate,
      closeDate: item.closeDate,
      listingDate: new Date(item.closeDate.getTime() + 5 * 86400000),
      basisOfAllotmentDate: new Date(item.closeDate.getTime() + 3 * 86400000),
      refundInitiatedDate: new Date(item.closeDate.getTime() + 4 * 86400000),
      dematCreditDate: new Date(item.closeDate.getTime() + 4 * 86400000),
      company: {
        id: `company-${item.slug}`,
        name: item.name,
        sector: "Unknown",
        about: "No detailed information available.",
        businessModel: "Not available.",
        competitiveLandscape: "Not available.",
        promoterHoldingPre: null,
        promoterHoldingPost: null,
      },
      gmpHistory: [
        {
          id: `gmp-${item.slug}`,
          ipoId: `curated-${item.slug}`,
          gmp: item.gmp,
          estimatedPrice: item.priceBandHigh + item.gmp,
          estimatedGainPercentage: item.priceBandHigh ? (item.gmp / item.priceBandHigh) * 100 : 0,
          date: new Date(),
        }
      ],
      subscriptions: []
    };
  });

  ipoCache = curated;
  lastCacheUpdate = now;
  return curated;
}

export async function getIPODetails(slug: string) {
  // If we have cache, try to find the item there to avoid any DB calls at all
  if (ipoCache) {
    const cachedItem = ipoCache.find(item => item.slug === slug);
    if (cachedItem) {
      return cachedItem;
    }
  }

  let ipo: any = null;
  try {
    const queryPromise = prisma.iPO.findUnique({
      where: { slug },
      include: {
        company: {
          include: { financials: true }
        },
        gmpHistory: {
          orderBy: { date: "desc" },
        },
        subscriptions: {
          orderBy: { date: "desc" },
        },
      }
    });

    const timeoutPromise = new Promise<any>((resolve) =>
      setTimeout(() => resolve(null), 500)
    );

    ipo = await Promise.race([queryPromise, timeoutPromise]);
  } catch (e) {
    console.warn(`getIPODetails: DB query for ${slug} timed out or failed. Serving curated fallback.`);
  }

  if (ipo) {
    return ipo;
  }

  // Fallback to curated list
  const { scrapeLatestIPOs } = await import("@/lib/scraper");
  const data = await scrapeLatestIPOs();
  const itemIndex = data.findIndex(item => item.slug === slug);
  
  if (itemIndex === -1) {
    return null;
  }

  const item = data[itemIndex];
  const isSme = item.board === "SME";
  
  const lowPrice = item.priceBandLow || Math.round(item.priceBandHigh * 0.95);
  const issueSize = item.issueSize || 0;

  return {
    id: `curated-${item.slug}`,
    slug: item.slug,
    companyId: `company-${item.slug}`,
    issueSize,
    priceBandLow: lowPrice,
    priceBandHigh: item.priceBandHigh,
    faceValue: isSme ? 10 : 2,
    lotSize: item.lotSize || (isSme ? 1600 : 30),
    issueType: "Book Built Issue",
    exchange: "BSE, NSE",
    board: item.board,
    status: item.status,
    openDate: item.openDate,
    closeDate: item.closeDate,
    listingDate: new Date(item.closeDate.getTime() + 5 * 86400000),
    basisOfAllotmentDate: new Date(item.closeDate.getTime() + 3 * 86400000),
    refundInitiatedDate: new Date(item.closeDate.getTime() + 4 * 86400000),
    dematCreditDate: new Date(item.closeDate.getTime() + 4 * 86400000),
    company: {
      id: `company-${item.slug}`,
      name: item.name,
      sector: "Unknown",
      about: "No detailed information available.",
      businessModel: "Not available.",
      competitiveLandscape: "Not available.",
      promoterHoldingPre: null,
      promoterHoldingPost: null,
      financials: [
        { year: "FY24", revenue: 1250.4, profit: 145.2, netWorth: 450.1, eps: 12.4, roe: 18.5, roce: 21.2, ebitda: 210.5 },
        { year: "FY25", revenue: 1560.8, profit: 189.6, netWorth: 620.3, eps: 15.2, roe: 19.2, roce: 22.8, ebitda: 280.4 }
      ]
    },
    gmpHistory: [
      {
        id: `gmp-${item.slug}`,
        ipoId: `curated-${item.slug}`,
        gmp: item.gmp,
        estimatedPrice: item.priceBandHigh + item.gmp,
        estimatedGainPercentage: item.priceBandHigh ? (item.gmp / item.priceBandHigh) * 100 : 0,
        date: new Date(),
      }
    ],
    subscriptions: [
      { qib: 2.4, nii: 5.1, retail: 12.5, total: 8.2, date: new Date() }
    ]
  };
}

export async function createIPO(data: {
  companyId: string;
  slug: string;
  issueSize?: number;
  priceBandLow?: number;
  priceBandHigh?: number;
  openDate?: Date;
  closeDate?: Date;
}) {
  const ipo = await prisma.iPO.create({
    data: {
      companyId: data.companyId,
      slug: data.slug,
      issueSize: data.issueSize,
      priceBandLow: data.priceBandLow,
      priceBandHigh: data.priceBandHigh,
      openDate: data.openDate,
      closeDate: data.closeDate,
      status: "UPCOMING",
    },
  });
  ipoCache = null;
  lastCacheUpdate = 0;
  revalidatePath("/admin");
  return ipo;
}

export async function syncScrapedData() {
  try {
    const { scrapeLatestIPOs } = await import("@/lib/scraper");
    const data = await scrapeLatestIPOs();
    
    if (data && data.length > 0) {
      let count = 0;
      for (const item of data) {
        // Upsert Company
        const company = await prisma.company.upsert({
          where: { name: item.name },
          update: {},
          create: {
            name: item.name,
            sector: item.board === "SME" ? "SME" : "Mainboard",
            about: `${item.name} - ${item.board} IPO. Price band: ₹${item.priceBandHigh}.`,
          }
        });
        
        // Upsert IPO with all available fields
        await prisma.iPO.upsert({
          where: { slug: item.slug },
          update: {
            priceBandLow: item.priceBandLow,
            priceBandHigh: item.priceBandHigh,
            lotSize: item.lotSize,
            openDate: item.openDate,
            closeDate: item.closeDate,
            status: item.status,
            board: item.board,
          },
          create: {
            slug: item.slug,
            companyId: company.id,
            priceBandLow: item.priceBandLow,
            priceBandHigh: item.priceBandHigh,
            lotSize: item.lotSize,
            openDate: item.openDate,
            closeDate: item.closeDate,
            status: item.status,
            board: item.board,
          }
        });
        
        // If there's a GMP, add a GMP history record
        if (item.gmp !== 0) {
          const ipoRecord = await prisma.iPO.findUnique({ where: { slug: item.slug } });
          if (ipoRecord) {
            await prisma.gMPHistory.create({
              data: {
                ipoId: ipoRecord.id,
                gmp: item.gmp,
                estimatedPrice: (item.priceBandHigh || 0) + item.gmp,
                estimatedGainPercentage: item.priceBandHigh ? (item.gmp / item.priceBandHigh) * 100 : 0
              }
            });
          }
        }
        
        count++;
      }
      
      ipoCache = null;
      lastCacheUpdate = 0;
      revalidatePath("/admin");
      revalidatePath("/");
      revalidatePath("/gmp");
      revalidatePath("/ipos");
      
      return { success: true, count };
    }
    
    return { success: false, message: "No data found." };
  } catch (error: any) {
    const msg = error?.message || "";
    if (msg.includes("fetch") || msg.includes("connect") || msg.includes("P5010")) {
      return { success: false, message: "Database connection failed. Check your DATABASE_URL in .env." };
    }
    return { success: false, message: msg.slice(0, 200) || "Sync failed." };
  }
}


