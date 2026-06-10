// Mock data for demo mode (no database required)

export const mockDossiers: Record<string, any> = {
    acc1: {
        id: "dossier1",
        overview:
            "Emirates NBD is the UAE's largest banking group with a strong presence across MENA. As a digital banking pioneer in the region, they've invested heavily in cloud infrastructure and API-first architecture. However, their legacy core banking systems create integration challenges, leading to technical debt accumulation and slower time-to-market for new digital products.",
        painPoints: [
            "Legacy core banking systems causing integration bottlenecks and slowing digital product launches by 40%",
            "Technical debt accumulation from rapid digital expansion without proper architecture governance",
            "Difficulty maintaining compliance across multiple jurisdictions while scaling digital services",
        ],
        valueProposition:
            "Afors' revenue orchestration platform can help Emirates NBD streamline their billing and monetization workflows across digital banking products, reducing technical debt by consolidating fragmented systems into a unified API layer. Our MENA-specific compliance modules ensure regulatory adherence across UAE, KSA, and Egypt markets while accelerating time-to-market for new revenue streams.",
        messageAngle:
            "How Emirates NBD can accelerate digital banking transformation while reducing technical debt by 40%",
        targetStakeholder: "Chief Digital Officer or Head of Digital Banking",
        account: {
            id: "acc1",
            name: "Emirates NBD",
            industry: "BFSI",
            country: "UAE",
            totalScore: 92,
            tier: 1,
        },
    },
    acc2: {
        id: "dossier2",
        overview:
            "Etisalat is the UAE's leading telecommunications operator with over 150M subscribers across 16 countries. They're aggressively expanding into 5G, IoT, and digital services. Recent signals indicate they're evaluating new BSS/OSS modernization to support complex pricing models for enterprise 5G and IoT bundles.",
        painPoints: [
            "Complex pricing and billing requirements for enterprise 5G and IoT services that legacy BSS cannot handle",
            "Revenue leakage from manual billing processes and lack of real-time usage tracking",
            "Slow time-to-market for new digital service bundles due to rigid billing infrastructure",
        ],
        valueProposition:
            "Afors enables Etisalat to launch innovative 5G and IoT pricing models with flexible, usage-based billing that scales in real-time. Our platform reduces revenue leakage through automated reconciliation and provides the agility needed to compete in rapidly evolving digital services markets.",
        messageAngle:
            "Modernizing network infrastructure for 5G readiness and customer experience excellence",
        targetStakeholder: "Chief Technology Officer or VP of Digital Services",
        account: {
            id: "acc2",
            name: "Etisalat",
            industry: "Telecom",
            country: "UAE",
            totalScore: 88,
            tier: 1,
        },
    },
    acc3: {
        id: "dossier3",
        overview:
            "Qatar National Bank (QNB) is the largest financial institution in the Middle East and Africa, operating in over 31 countries. They've been investing heavily in digital transformation and open banking initiatives. Recent activity suggests they're exploring ways to monetize their banking-as-a-service (BaaS) platform and embedded finance offerings.",
        painPoints: [
            "Difficulty monetizing their BaaS platform with flexible pricing models for fintech partners",
            "Manual processes for regulatory reporting across 31 countries leading to compliance risks",
            "Lack of real-time revenue visibility across embedded finance partnerships",
        ],
        valueProposition:
            "Afors provides QNB with a unified revenue orchestration layer that enables flexible monetization of their BaaS platform, automated multi-jurisdiction compliance reporting, and real-time revenue analytics across all embedded finance partnerships. This accelerates their open banking strategy while ensuring regulatory compliance.",
        messageAngle:
            "Streamlining compliance automation and reducing regulatory reporting overhead by 50%",
        targetStakeholder: "Head of Open Banking or Chief Innovation Officer",
        account: {
            id: "acc3",
            name: "Qatar National Bank",
            industry: "BFSI",
            country: "Qatar",
            totalScore: 85,
            tier: 1,
        },
    },
};

export const mockContacts: Record<string, any[]> = {
    acc1: [
        {
            id: "contact1",
            name: "Ahmed Al Qassim",
            title: "Chief Digital Officer",
            email: "ahmed.alqassim@emiratesnbd.com",
            linkedin: "https://linkedin.com/in/ahmed-alqassim",
        },
        {
            id: "contact2",
            name: "Sara Mohammed",
            title: "Head of Digital Banking",
            email: "sara.mohammed@emiratesnbd.com",
            linkedin: "https://linkedin.com/in/sara-mohammed",
        },
    ],
    acc2: [
        {
            id: "contact3",
            name: "Khalid bin Rashid",
            title: "Chief Technology Officer",
            email: "khalid.rashid@etisalat.ae",
            linkedin: "https://linkedin.com/in/khalid-rashid",
        },
        {
            id: "contact4",
            name: "Fatima Al Zarooni",
            title: "VP of Digital Services",
            email: "fatima.zarooni@etisalat.ae",
            linkedin: "https://linkedin.com/in/fatima-zarooni",
        },
    ],
    acc3: [
        {
            id: "contact5",
            name: "Mohammed Al Thani",
            title: "Head of Open Banking",
            email: "m.althani@qnb.com",
            linkedin: "https://linkedin.com/in/mohammed-althani",
        },
        {
            id: "contact6",
            name: "Layla Hassan",
            title: "Chief Innovation Officer",
            email: "l.hassan@qnb.com",
            linkedin: "https://linkedin.com/in/layla-hassan",
        },
    ],
};

export const mockDraftMessages: Record<string, any> = {
    email: {
        id: "draft1",
        subjectLine: "Accelerating Emirates NBD's Digital Banking Transformation",
        body: `Hi Ahmed,

I noticed Emirates NBD's recent initiatives around digital banking expansion and wanted to reach out.

Many leading banks in the region face challenges with legacy core systems slowing down innovation. We've helped similar institutions reduce technical debt by 40% while accelerating time-to-market for new digital products.

Would you be open to a brief conversation about how we're helping MENA banks streamline their revenue orchestration and compliance workflows?

Best regards,
[Your Name]
Afors`,
        channel: "email",
        status: "draft",
    },
    linkedin: {
        id: "draft2",
        subjectLine: "",
        body: `Hi Ahmed, I've been following Emirates NBD's digital transformation journey. We help MENA banks reduce technical debt while accelerating innovation. Would love to connect and share insights. Best, [Your Name]`,
        channel: "linkedin",
        status: "draft",
    },
};
